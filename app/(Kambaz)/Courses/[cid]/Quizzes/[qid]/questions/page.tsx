/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  ListGroup,
  ListGroupItem,
  Dropdown,
} from "react-bootstrap";
import * as client from "../../../../client";
import QuestionEditor from "./QuestionEditor";
import { Question, QuestionType } from "./types";

type Params = {
  cid: string;
  qid: string;
};

const DEFAULT_TYPE: QuestionType = "multiple-choice";

const makeEmptyQuestion = (quizId: string): Question => ({
  quiz: quizId,
  type: DEFAULT_TYPE,
  title: "New Question",
  points: 1,
  question: "",
  choices: [
    { text: "Option 1", isCorrect: true },
    { text: "Option 2", isCorrect: false },
  ],
  correctAnswer: true,
  possibleAnswers: [""],
});

export default function QuizQuestionsEditorPage() {
  const { cid, qid } = useParams<Params>();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const qs = await client.findQuestionsForQuiz(qid as string);
      setQuestions(qs);
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qid) {
      loadQuestions();
    }
  }, [qid]);

  const totalPoints = questions.reduce(
    (sum: number, q: Question) => sum + (q.points || 0),
    0
  );

  const beginEditExisting = (question: Question) => {
    setEditingId(question._id || null);

    setDraft({
      ...question,
      choices: question.choices
        ? question.choices.map((c) => ({ ...c }))
        : [],
      possibleAnswers: question.possibleAnswers
        ? [...question.possibleAnswers]
        : [],
    });
  };

  const beginCreateNew = () => {
    const newDraft = makeEmptyQuestion(qid as string);
    setEditingId("NEW");
    setDraft(newDraft);
  };

  const handleCancel = () => {
    setEditingId(null);
    setDraft(null);
  };

  const buildCreatePayload = (q: Question) => {
    if (q.type === "multiple-choice") {
      return {
        type: "multiple-choice",
        title: q.title,
        points: q.points,
        question: q.question,
        choices: q.choices || [],
      };
    }

    if (q.type === "true-false") {
      return {
        type: "true-false",
        title: q.title,
        points: q.points,
        question: q.question,
        correctAnswer: q.correctAnswer ?? true,
      };
    }

    return {
      type: "fill-in-blank",
      title: q.title,
      points: q.points,
      question: q.question,
      possibleAnswers: q.possibleAnswers || [],
    };
  };

  const buildUpdatePayload = (q: Question) => {
    if (q.type === "multiple-choice") {
      return {
        type: "multiple-choice",
        title: q.title,
        points: q.points,
        question: q.question,
        choices: q.choices || [],
      };
    }

    if (q.type === "true-false") {
      return {
        type: "true-false",
        title: q.title,
        points: q.points,
        question: q.question,
        correctAnswer: q.correctAnswer ?? true,
      };
    }

    return {
      type: "fill-in-blank",
      title: q.title,
      points: q.points,
      question: q.question,
      possibleAnswers: q.possibleAnswers || [],
    };
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      if (editingId === "NEW") {
        const payload = buildCreatePayload(draft);
        await client.createQuestion(qid as string, payload);
      } else if (editingId && draft._id) {
        const payload = buildUpdatePayload(draft);
        await client.updateQuestion(draft._id, payload);
      }
      await loadQuestions();
      setEditingId(null);
      setDraft(null);
    } catch (err) {
      console.error("Failed to save question:", err);
      alert("Failed to save question");
    }
  };

  const handleDelete = async (questionId: string | undefined) => {
    if (!questionId) return;
    if (!window.confirm("Delete this question?")) return;

    try {
      await client.deleteQuestion(questionId);
      await loadQuestions();
    } catch (err) {
      console.error("Failed to delete question:", err);
      alert("Failed to delete question");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Questions</h3>
        <h5>Points {totalPoints}</h5>
      </div>

      <div className="mb-3">
        <Link
          href={`/Courses/${cid}/Quizzes/${qid}/edit`}
          className="btn btn-light me-2"
        >
          Details
        </Link>
        <Button variant="danger">Questions</Button>
      </div>

      <div className="text-end mb-3">
        <Button
          variant="outline-secondary"
          onClick={beginCreateNew}
        >
          + New Question
        </Button>
      </div>

      {loading && <div>Loading questions...</div>}

      {!loading && (
        <ListGroup>
          {questions.map((q) => {
            const isEditing = editingId === q._id;
            return (
              <ListGroupItem key={q._id} className="mb-3">
                {!isEditing && (
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">
                        {q.title} <span className="text-muted">({q.points} pts)</span>
                      </div>
                      <div className="small text-muted mb-1">
                        {q.type === "multiple-choice" && "Multiple Choice"}
                        {q.type === "true-false" && "True / False"}
                        {q.type === "fill-in-blank" && "Fill in the Blank"}
                      </div>
                    </div>

                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="button"
                        className="btn btn-link border-0 p-0 text-secondary"
                      >
                        ⋮
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => beginEditExisting(q)}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDelete(q._id)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}

                {isEditing && draft && draft._id === q._id && (
                  <QuestionEditor
                    question={draft}
                    onChange={setDraft}
                    onCancel={handleCancel}
                    onSave={handleSave}
                  />
                )}
              </ListGroupItem>
            );
          })}

          {editingId === "NEW" && draft && (
            <ListGroupItem className="mb-3">
              <QuestionEditor
                question={draft}
                onChange={setDraft}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            </ListGroupItem>
          )}

          {!loading && questions.length === 0 && editingId !== "NEW" && (
            <ListGroupItem className="text-center text-muted">
              No questions yet. Click &quot;New Question&quot; to add one.
            </ListGroupItem>
          )}
        </ListGroup>
      )}
    </div>
  );
}
