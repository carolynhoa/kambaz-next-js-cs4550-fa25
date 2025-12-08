/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRouter, useParams } from "next/navigation";
import * as client from "../../../client";
import * as accountClient from "../../../../Account/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BsEye, BsPencil } from "react-icons/bs";

type User = {
  _id: string;
  role: "STUDENT" | "FACULTY" | "TA" | "ADMIN";
  firstName: string;
  lastName: string;
};

type Quiz = {
  _id: string;
  title: string;
  description?: string;
  quizType?: string;
  points?: number;
  assignmentGroup?: string;
  shuffleAnswers?: boolean;
  timeLimit?: number;
  multipleAttempts?: boolean;
  howManyAttempts?: number;
  showCorrectAnswers?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  availableDate?: string;
  dueDate?: string;
  untilDate?: string;
  published?: boolean;
};

type QuizAttempt = {
  _id: string;
  quiz: string;
  student: string;
  answers: Record<string, any>;
  score: number;
};


function getAvailability(quiz: Quiz) {
  if (!quiz.published) return "UNPUBLISHED";

  const now = new Date();
  const start = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const end = quiz.untilDate ? new Date(quiz.untilDate) : null;

  if (start && now < start) return "NOT_YET";
  if (end && now > end) return "CLOSED";
  return "AVAILABLE";
}

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const loadData = async () => {
    try {
      const q = await client.findQuizById(qid as string);
      setQuiz(q);

      try {
        const currentUser = await accountClient.profile();
        setUser(currentUser);
      } catch {
        setUser(null);
      }

      try {
        const myAttempts = await client.findMyQuizAttempts(qid as string);
        setAttempts(myAttempts || []);
      } catch {
        setAttempts([]);
      }
    } catch (err) {
      console.error("Error loading quiz:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [qid]);

  if (!quiz || !user) return <div>Loading...</div>;

  const isFaculty =
    user.role === "FACULTY" || user.role === "TA" || user.role === "ADMIN";

  const isStudent = user.role === "STUDENT";

  const availability = getAvailability(quiz);

  const start = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const end = quiz.untilDate ? new Date(quiz.untilDate) : null;

  const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts ?? 1 : 1;
  const attemptsUsed = attempts.length;
  const attemptsRemaining = maxAttempts - attemptsUsed;
  const lastAttempt = attempts[attempts.length - 1];

  const handleTogglePublish = async () => {
    if (!quiz) return;
    try {
      await client.publishQuiz(quiz._id, !quiz.published);
      await loadData();
    } catch (err) {
      console.error("Error toggling publish state:", err);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz.title}</h2>

        {isFaculty && (
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)
              }
            >
              <BsEye className="me-1" /> Preview
            </Button>

            <Button
              variant="light"
              onClick={() =>
                router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)
              }
            >
              <BsPencil className="me-1" /> Edit
            </Button>

            <Button
              variant={quiz.published ? "success" : "warning"}
              onClick={handleTogglePublish}
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        )}
      </div>

      {isStudent && (
        <div>
          <p>{quiz.description}</p>

          <div className="mt-3">
            {availability === "UNPUBLISHED" && (
              <div className="text-danger">
                This quiz is not available to students.
              </div>
            )}

            {availability === "NOT_YET" && (
              <div className="text-danger">
                Quiz not available until {start?.toLocaleString()}
              </div>
            )}

            {availability === "CLOSED" && (
              <div className="text-danger">This quiz is closed.</div>
            )}

            {availability === "AVAILABLE" && (
              <>
                {attemptsRemaining > 0 ? (
                  <Link href={`/Courses/${cid}/Quizzes/${qid}/take`}>
                    <Button variant="danger">Start Quiz</Button>
                  </Link>
                ) : (
                  <div className="text-danger fw-bold mt-2">
                    You have no remaining attempts for this quiz.
                  </div>
                )}

                {lastAttempt && (
                  <div className="mt-3">
                    <b>Your last score:</b> {lastAttempt.score}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {isFaculty && (
        <div className="p-4 border mt-4" style={{ borderStyle: "dotted" }}>
          <h4 className="mb-4">{quiz.title}</h4>

          {[
            ["Quiz Type", quiz.quizType],
            ["Points", quiz.points],
            ["Assignment Group", quiz.assignmentGroup],
            ["Shuffle Answers", quiz.shuffleAnswers ? "Yes" : "No"],
            [
              "Time Limit",
              quiz.timeLimit ? `${quiz.timeLimit} Minutes` : "None",
            ],
            [
              "Multiple Attempts",
              quiz.multipleAttempts ? `Yes (${quiz.howManyAttempts})` : "No",
            ],
            ["Show Correct Answers", quiz.showCorrectAnswers],
            ["One Question at a Time", quiz.oneQuestionAtATime ? "Yes" : "No"],
            ["Webcam Required", quiz.webcamRequired ? "Yes" : "No"],
            [
              "Lock Questions After Answering",
              quiz.lockQuestionsAfterAnswering ? "Yes" : "No",
            ],
            [
              "Available From",
              quiz.availableDate
                ? new Date(quiz.availableDate).toLocaleString()
                : "N/A",
            ],
            [
              "Until",
              quiz.untilDate ? new Date(quiz.untilDate).toLocaleString() : "N/A",
            ],
            [
              "Due",
              quiz.dueDate ? new Date(quiz.dueDate).toLocaleString() : "N/A",
            ],
          ].map(([label, value], idx) => (
            <div className="row mb-2" key={idx}>
              <div className="col-4 text-end fw-bold">{label}</div>
              <div className="col-8">{value as string}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
