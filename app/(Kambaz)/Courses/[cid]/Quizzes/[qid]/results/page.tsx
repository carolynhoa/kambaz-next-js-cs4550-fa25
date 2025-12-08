/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, Card } from "react-bootstrap";
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
};

type QuizAttempt = {
  _id: string;
  quiz: string;
  student: string;
  answers: Record<string, any>;
  score: number;
  createdAt: string;
};

type User = {
  _id: string;
  role: "STUDENT" | "FACULTY" | "TA" | "ADMIN";
  firstName: string;
  lastName: string;
};

function normalizeType(
  t: RawType
): "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" {
  switch (t) {
    case "multiple-choice":
      return "MULTIPLE_CHOICE";
    case "true-false":
      return "TRUE_FALSE";
    case "fill-in-blank":
      return "FILL_BLANK";
    default:
      return t as any;
  }
}

function choiceText(c: RawChoice): string {
  return typeof c === "string" ? c : (c.text ?? "");
}

function isChoiceCorrect(c: RawChoice): boolean {
  return typeof c === "string" ? false : !!c.isCorrect;
}

export default function QuizResultsPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [qz, qs] = await Promise.all([
          client.findQuizById(qid as string),
          client.findQuestionsForQuiz(qid as string),
        ]);
        setQuiz(qz);
        setQuestions(qs ?? []);

        try {
          const currentUser = await accountClient.profile();
          setUser(currentUser);

          if (currentUser.role === "STUDENT") {
            const atts = await client.findMyQuizAttempts(qid as string);
            setAttempts(atts ?? []);
          }
        } catch {
          setUser(null);
        }
      } catch (err) {
        console.error("Error loading results:", err);
        setError("Failed to load quiz results.");
      }
    })();
  }, [qid]);

  const normQuestions = useMemo(
    () => questions.map((q) => ({ ...q, type: normalizeType(q.type) })),
    [questions]
  );

  const lastAttempt =
    attempts.length > 0 ? attempts[attempts.length - 1] : null;

  const totalPoints = useMemo(
    () => normQuestions.reduce((sum, q) => sum + (q.points || 0), 0),
    [normQuestions]
  );

  if (!quiz || !user) {
    return (
      <div className="container mt-4" style={{ maxWidth: 900 }}>
        Loading results...
      </div>
    );
  }

  if (user.role !== "STUDENT") {
    return (
      <div className="container mt-4" style={{ maxWidth: 900 }}>
        <Alert variant="warning">
          Only students have quiz attempts. Use Preview instead to see the quiz.
        </Alert>
        <Button
          variant="secondary"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)
          }
        >
          Go to Preview
        </Button>
      </div>
    );
  }

  if (!lastAttempt) {
    return (
      <div className="container mt-4" style={{ maxWidth: 900 }}>
        <h3>{quiz.title}</h3>
        <Alert variant="info">
          You haven&apos;t submitted this quiz yet.
        </Alert>
        <Button
          variant="danger"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
        >
          Take Quiz
        </Button>
      </div>
    );
  }

  const answers = lastAttempt.answers || {};
  const takenAt = new Date(lastAttempt.createdAt);

  const computeCorrect = (q: Question, userAns: any): boolean => {
    const t = normalizeType(q.type);
    if (t === "MULTIPLE_CHOICE") {
      const correctFromObj =
        q.choices?.find((c) => isChoiceCorrect(c)) &&
        choiceText(q.choices!.find((c) => isChoiceCorrect(c))!);
      const expected = correctFromObj ?? q.correct ?? null;
      return expected != null && userAns === expected;
    } else if (t === "TRUE_FALSE") {
      return userAns === q.correctAnswer;
    } else if (t === "FILL_BLANK") {
      return (
        q.possibleAnswers?.some(
          (pa) =>
            pa.toLowerCase().trim() ===
            String(userAns ?? "").toLowerCase().trim()
        ) ?? false
      );
    }
    return false;
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-2">{quiz.title} – Last Attempt</h3>
      <div className="mb-3 text-muted">
        Taken on {takenAt.toLocaleString()} | Score: {lastAttempt.score} /{" "}
        {totalPoints}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {normQuestions.map((q) => {
        const userAns = answers[q._id];
        const correct = computeCorrect(q, userAns);
        const t = normalizeType(q.type);

        return (
          <Card
            key={q._id}
            className="mb-3 p-3"
            border={correct ? "success" : "danger"}
          >
            <div className="d-flex justify-content-between">
              <div>
                <b>{q.title}</b>{" "}
                <span className={correct ? "text-success" : "text-danger"}>
                  {correct ? "✔ Correct" : "✘ Incorrect"}
                </span>
              </div>
              <div>{q.points} pts</div>
            </div>

            <div className="mt-2 mb-2">{q.question}</div>

            <div className="mb-1">
              <b>Your answer:</b>{" "}
              <span>{String(userAns ?? "(no answer)")}</span>
            </div>
          </Card>
        );
      })}

      <div className="mt-3 d-flex gap-2">
        <Button
          variant="secondary"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/take`)
          }
        >
          Retake Quiz
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
}
