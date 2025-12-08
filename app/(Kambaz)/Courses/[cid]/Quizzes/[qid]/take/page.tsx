/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Form, Alert } from "react-bootstrap";
import * as client from "../../../../client";
import * as accountClient from "../../../../../Account/client";

type RawChoice = string | { text: string; isCorrect?: boolean };
type RawType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "multiple-choice"
  | "true-false"
  | "fill-in-blank";

type Question = {
  _id: string;
  title: string;
  points: number;
  type: RawType;
  question: string;
  choices?: RawChoice[];
  correct?: string;
  correctAnswer?: boolean;
  possibleAnswers?: string[];
};

type Quiz = {
  _id: string;
  title: string;
  oneQuestionAtATime?: boolean;
  multipleAttempts?: boolean;
  howManyAttempts?: number;
};

type QuizAttempt = {
  _id: string;
  quiz: string;
  student: string;
  answers: Record<string, unknown>;
  score: number;
  createdAt?: string;
};

type User = {
  _id: string;
  role: "STUDENT" | "FACULTY" | "TA" | "ADMIN";
  firstName: string;
  lastName: string;
};

function normalizeType(t: RawType): "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" {
  switch (t) {
    case "multiple-choice":
      return "MULTIPLE_CHOICE";
    case "true-false":
      return "TRUE_FALSE";
    case "fill-in-blank":
      return "FILL_BLANK";
    default:
      return t as "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  }
}

function choiceText(c: RawChoice): string {
  return typeof c === "string" ? c : c.text ?? "";
}

function isChoiceCorrect(c: RawChoice): boolean {
  return typeof c === "string" ? false : !!c.isCorrect;
}

interface ResultsViewProps {
  quiz: Quiz;
  questions: Question[];
  answers: Record<string, unknown>;
  score: number;
  totalPoints: number;
  cid: string;
  qid: string;
}

interface LockedResultsViewProps {
  lastAttempt: QuizAttempt | null;
  questions: Question[];
  cid: string;
  qid: string;
  quiz: Quiz;
}

export default function TakeQuizPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const normQuestions = useMemo(
    () => questions.map((q) => ({ ...q, type: normalizeType(q.type) })),
    [questions]
  );

  const totalPoints = useMemo(
    () => normQuestions.reduce((t, q) => t + (q.points || 0), 0),
    [normQuestions]
  );

  const currentScore = useMemo(() => {
    let sum = 0;

    for (const q of normQuestions) {
      const a = answers[q._id];
      const t = normalizeType(q.type);

      if (t === "MULTIPLE_CHOICE") {
        const expected =
          (q.choices?.find(isChoiceCorrect) &&
            choiceText(q.choices!.find(isChoiceCorrect)!)) ?? q.correct;

        if (expected !== undefined && a === expected) {
          sum += q.points || 0;
        }
      }

      if (t === "TRUE_FALSE") {
        if (a === q.correctAnswer) sum += q.points || 0;
      }

      if (t === "FILL_BLANK") {
        const ok =
          q.possibleAnswers?.some(
            (p) =>
              p.toLowerCase().trim() ===
              String(a ?? "").toLowerCase().trim()
          ) ?? false;
        if (ok) sum += q.points || 0;
      }
    }

    return sum;
  }, [answers, normQuestions]);

  useEffect(() => {
    (async () => {
      if (!qid) return;

      const qz = await client.findQuizById(qid as string);
      setQuiz(qz);

      const qs = await client.findQuestionsForQuiz(qid as string);
      setQuestions(qs ?? []);

      try {
        const me = await accountClient.profile();
        setUser(me);
      } catch {
        setUser(null);
      }

      try {
        const myAttempts = await client.findMyQuizAttempts(qid as string);
        setAttempts(myAttempts ?? []);
      } catch {
        setAttempts([]);
      }
    })();
  }, [qid]);

  const maxAttempts = quiz?.multipleAttempts
    ? quiz.howManyAttempts ?? 1
    : 1;

  const attemptsUsed = attempts.length;
  const attemptsRemaining = maxAttempts - attemptsUsed;
  const lastAttempt: QuizAttempt | null =
    attempts.length > 0 ? attempts[attempts.length - 1] : null;

  if (!quiz || !user || normQuestions.length === 0) {
    return <div className="container mt-4">Loading quiz…</div>;
  }

  if (user.role !== "STUDENT") {
    return (
      <div className="container mt-4">
        Only students can take quizzes.
      </div>
    );
  }


  if (submitted) {
    return (
      <ResultsView
        quiz={quiz}
        questions={normQuestions}
        answers={answers}
        score={currentScore}
        totalPoints={totalPoints}
        cid={cid}
        qid={qid}
      />
    );
  }

  if (attemptsRemaining <= 0) {
    return (
      <LockedResultsView
        lastAttempt={lastAttempt}
        questions={normQuestions}
        cid={cid}
        qid={qid}
        quiz={quiz}
      />
    );
  }

  const oneAtATime = !!quiz.oneQuestionAtATime;

  const setAnswer = (id: string, val: unknown) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));

  const submitAttempt = async () => {
    const attemptPayload = {
      quiz: quiz._id,
      answers,
      score: currentScore,
    };

    await client.createQuizAttempt(qid as string, attemptPayload);
    setSubmitted(true);
  };

  const renderQuestion = (q: Question) => {
    const t = normalizeType(q.type);

    return (
      <Card key={q._id} className="p-4 mb-3">
        <div className="d-flex justify-content-between">
          <h5>{q.title}</h5>
          <div>{q.points} pts</div>
        </div>

        <div className="mt-2 mb-3">{q.question}</div>

        {t === "MULTIPLE_CHOICE" &&
          q.choices?.map((c, i) => {
            const text = choiceText(c);
            return (
              <Form.Check
                key={i}
                type="radio"
                label={text}
                className="mb-2"
                checked={answers[q._id] === text}
                onChange={() => setAnswer(q._id, text)}
              />
            );
          })}

        {t === "TRUE_FALSE" && (
          <>
            <Form.Check
              type="radio"
              label="True"
              className="mb-2"
              checked={answers[q._id] === true}
              onChange={() => setAnswer(q._id, true)}
            />
            <Form.Check
              type="radio"
              label="False"
              className="mb-2"
              checked={answers[q._id] === false}
              onChange={() => setAnswer(q._id, false)}
            />
          </>
        )}

        {t === "FILL_BLANK" && (
          <Form.Control
            type="text"
            placeholder="Type your answer…"
            value={String(answers[q._id] ?? "")}
            onChange={(e) => setAnswer(q._id, e.target.value)}
          />
        )}
      </Card>
    );
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <Alert variant="info" className="mb-3">
        You are taking this quiz as a student.
        {" "}
        Attempts used: <b>{attemptsUsed}</b> / <b>{maxAttempts}</b>
      </Alert>

      <h2 className="mb-3">{quiz.title}</h2>

      <div className="mb-4">
        <b className="text-secondary">Questions</b>
        <ul className="mt-2" style={{ listStyle: "none", paddingLeft: 0 }}>
          {normQuestions.map((q, i) => (
            <li
              key={q._id}
              style={{
                color: i === idx ? "red" : "#555",
                cursor: "pointer",
              }}
              onClick={() => setIdx(i)}
            >
              Question {i + 1}
            </li>
          ))}
        </ul>
      </div>

      {oneAtATime ? (
        <>
          {renderQuestion(normQuestions[idx])}

          <div className="d-flex justify-content-between mt-3">
            <Button
              variant="secondary"
              disabled={idx === 0}
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
            >
              ← Back
            </Button>

            {idx < normQuestions.length - 1 ? (
              <Button onClick={() => setIdx((i) => Math.min(normQuestions.length - 1, i + 1))}>
                Next →
              </Button>
            ) : (
              <Button variant="success" onClick={submitAttempt}>
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {normQuestions.map(renderQuestion)}
          <div className="text-end">
            <Button variant="success" onClick={submitAttempt}>
              Submit Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ResultsView({
  quiz,
  questions,
  answers,
  score,
  totalPoints,
  cid,
  qid,
}: ResultsViewProps) {
  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <Alert variant="success">
        You have submitted <b>{quiz.title}</b>.
      </Alert>

      <h3>Quiz Results</h3>
      <h5 className="mb-4">
        Score: {score} / {totalPoints}
      </h5>

      {questions.map((q) => {
        const a = answers[q._id];

        const type = normalizeType(q.type);
        let correct = false;

        if (type === "MULTIPLE_CHOICE") {
          const expected =
            (q.choices?.find(isChoiceCorrect) &&
              choiceText(q.choices!.find(isChoiceCorrect)!)) ??
            q.correct;
          correct = expected !== undefined && a === expected;
        } else if (type === "TRUE_FALSE") {
          correct = a === q.correctAnswer;
        } else if (type === "FILL_BLANK") {
          correct =
            q.possibleAnswers?.some(
              (p) =>
                p.toLowerCase().trim() ===
                String(a ?? "").toLowerCase().trim()
            ) ?? false;
        }

        return (
          <Card key={q._id} className="p-3 mb-3">
            <div className="d-flex justify-content-between">
              <b>{q.title}</b>
              <span className={correct ? "text-success" : "text-danger"}>
                {correct ? "✔ Correct" : "✘ Incorrect"}
              </span>
            </div>

            <div className="mt-2">
              <b>Your answer: </b> {String(a ?? "")}
            </div>
          </Card>
        );
      })}

      <Button
        className="mt-3"
        href={`/Courses/${cid}/Quizzes/${qid}`}
        variant="secondary"
      >
        Return to Quiz Details
      </Button>
    </div>
  );
}

function LockedResultsView({
  lastAttempt,
  questions,
  cid,
  qid,
  quiz,
}: LockedResultsViewProps) {
  if (!lastAttempt) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          You cannot take this quiz again.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <Alert variant="warning">
        You have exhausted all attempts for <b>{quiz.title}</b>.  
        You can review your last answers, but you cannot change them.
      </Alert>

      <h3>{quiz.title}</h3>
      <h5 className="mb-4">Last Score: {lastAttempt.score}</h5>

      {questions.map((q) => {
        const a = lastAttempt.answers[q._id];

        const type = normalizeType(q.type);
        let correct = false;

        if (type === "MULTIPLE_CHOICE") {
          const expected =
            (q.choices?.find(isChoiceCorrect) &&
              choiceText(q.choices!.find(isChoiceCorrect)!)) ??
            q.correct;
          correct = expected !== undefined && a === expected;
        } else if (type === "TRUE_FALSE") {
          correct = a === q.correctAnswer;
        } else if (type === "FILL_BLANK") {
          correct =
            q.possibleAnswers?.some(
              (p) =>
                p.toLowerCase().trim() ===
                String(a ?? "").toLowerCase().trim()
            ) ?? false;
        }

        return (
          <Card key={q._id} className="p-3 mb-3">
            <div className="d-flex justify-content-between">
              <b>{q.title}</b>
              <span className={correct ? "text-success" : "text-danger"}>
                {correct ? "✔ Correct" : "✘ Incorrect"}
              </span>
            </div>

            <div className="mt-2">
              <b>Your answer: </b> {String(a ?? "")}
            </div>
          </Card>
        );
      })}

      <Button
        className="mt-3"
        href={`/Courses/${cid}/Quizzes/${qid}`}
        variant="secondary"
      >
        Return to Quiz Details
      </Button>
    </div>
  );
}
