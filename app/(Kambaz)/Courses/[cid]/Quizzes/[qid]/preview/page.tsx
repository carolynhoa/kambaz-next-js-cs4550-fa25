/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Form, Alert } from "react-bootstrap";
import * as client from "../../../../client";

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
};

function normalizeType(t: RawType) {
  switch (t) {
    case "multiple-choice": return "MULTIPLE_CHOICE";
    case "true-false": return "TRUE_FALSE";
    case "fill-in-blank": return "FILL_BLANK";
    default: return t as any;
  }
}

const choiceText = (c: RawChoice) =>
  typeof c === "string" ? c : c.text ?? "";

const isChoiceCorrect = (c: RawChoice) =>
  typeof c === "string" ? false : !!c.isCorrect;


export default function QuizPreviewPage() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      const qz = await client.findQuizById(qid as string);
      const qs = await client.findQuestionsForQuiz(qid as string);
      setQuiz(qz);
      setQuestions(qs ?? []);
    })();
  }, [qid]);

  const normQuestions = useMemo(
    () => questions.map((q) => ({ ...q, type: normalizeType(q.type) })),
    [questions]
  );

  const totalPoints = useMemo(
    () => normQuestions.reduce((t, q) => t + (q.points || 0), 0),
    [normQuestions]
  );

  const oneAtATime = !!quiz?.oneQuestionAtATime;

  const setAnswer = (id: string, val: any) =>
    setAnswers((a) => ({ ...a, [id]: val }));

  const score = useMemo(() => {
    if (!submitted) return 0;
    let s = 0;

    for (const q of normQuestions) {
      const ans = answers[q._id];
      const t = normalizeType(q.type);

      if (t === "MULTIPLE_CHOICE") {
        const expected =
          (q.choices?.find(isChoiceCorrect) &&
            choiceText(q.choices!.find(isChoiceCorrect)!)) ??
          q.correct;

        if (ans === expected) s += q.points || 0;
      }

      if (t === "TRUE_FALSE" && ans === q.correctAnswer) {
        s += q.points || 0;
      }

      if (t === "FILL_BLANK") {
        const ok =
          q.possibleAnswers?.some(
            (p) => p.toLowerCase().trim() === String(ans).toLowerCase().trim()
          ) ?? false;

        if (ok) s += q.points || 0;
      }
    }

    return s;
  }, [submitted, answers, normQuestions]);

  if (!quiz || normQuestions.length === 0)
    return <div className="container mt-4">Loading…</div>;

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
            placeholder="Type your answer..."
            value={answers[q._id] ?? ""}
            onChange={(e) => setAnswer(q._id, e.target.value)}
          />
        )}
      </Card>
    );
  };

  if (submitted) {
    return (
      <div className="container mt-4" style={{ maxWidth: 900 }}>
        <Alert variant="info">
          This is a preview. Your answers are not stored.
        </Alert>

        <h3>Quiz Results</h3>
        <h5 className="mb-4">
          Score: {score} / {totalPoints}
        </h5>

        {normQuestions.map((q) => {
          const ans = answers[q._id];
          const t = normalizeType(q.type);

          let correct = false;
          if (t === "MULTIPLE_CHOICE") {
            const expected =
              (q.choices?.find(isChoiceCorrect) &&
                choiceText(q.choices!.find(isChoiceCorrect)!)) ??
              q.correct;
            correct = ans === expected;
          } else if (t === "TRUE_FALSE") {
            correct = ans === q.correctAnswer;
          } else if (t === "FILL_BLANK") {
            correct =
              q.possibleAnswers?.some(
                (p) =>
                  p.toLowerCase().trim() === String(ans).toLowerCase().trim()
              ) ?? false;
          }

          return (
            <Card key={q._id} className="p-3 mb-3">
              <b>{q.title}</b>{" "}
              <span className={correct ? "text-success" : "text-danger"}>
                {correct ? "✔ Correct" : "✘ Incorrect"}
              </span>
              <div className="mt-2">
                <b>Your answer: </b> {String(ans ?? "")}
              </div>
            </Card>
          );
        })}

        <Button
          variant="secondary"
          className="mt-3"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)
          }
        >
          Keep Editing This Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <Alert variant="warning" className="fw-bold">
        This is a preview of the published version of the quiz
      </Alert>

      <h2>{quiz.title}</h2>

      <h4 className="mt-3 mb-4">Quiz Instructions</h4>

      <div className="mb-4">
        <b className="text-secondary">Questions</b>
        <ul className="mt-2">
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
              onClick={() => setIdx((i) => i - 1)}
            >
              ← Back
            </Button>

            {idx < normQuestions.length - 1 ? (
              <Button onClick={() => setIdx((i) => i + 1)}>
                Next →
              </Button>
            ) : (
              <Button variant="success" onClick={() => setSubmitted(true)}>
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {normQuestions.map(renderQuestion)}
          <div className="text-end">
            <Button variant="success" onClick={() => setSubmitted(true)}>
              Submit Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
