/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Button, Row, Col, Card, Nav } from "react-bootstrap";
import * as client from "../../../../client";

type Quiz = {
  _id: string;
  title: string;
  description?: string;
  quizType: string;
  points: number;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit?: number;
  multipleAttempts: boolean;
  howManyAttempts?: number;
  showCorrectAnswers: string;
  accessCode?: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published: boolean;
};

const defaultQuiz: Quiz = {
  _id: "",
  title: "",
  description: "",
  quizType: "Graded Quiz",
  points: 0,
  assignmentGroup: "Quizzes",
  shuffleAnswers: true,
  timeLimit: 20,
  multipleAttempts: false,
  howManyAttempts: 1,
  showCorrectAnswers: "Immediately",
  accessCode: "",
  oneQuestionAtATime: true,
  webcamRequired: false,
  lockQuestionsAfterAnswering: false,
  dueDate: "",
  availableDate: "",
  untilDate: "",
  published: false,
};

const toDateInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export default function QuizDetailsEditorPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [hasTimeLimit, setHasTimeLimit] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const serverQuiz = await client.findQuizById(qid as string);
        const merged: Quiz = {
          ...defaultQuiz,
          ...serverQuiz,
        };
        setQuiz(merged);
        setHasTimeLimit(
          merged.timeLimit !== undefined &&
            merged.timeLimit !== null &&
            merged.timeLimit > 0
        );
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    if (qid) loadQuiz();
  }, [qid]);

  if (loading || !quiz) {
    return <div className="mt-4">Loading quiz editor...</div>;
  }

  const updateField = (field: keyof Quiz, value: any) => {
    setQuiz((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateDateField = (field: keyof Quiz, value: string) => {
    if (!value) return updateField(field, "");
  
    const dt = new Date(value + "T00:00:00");
  
    if (field === "availableDate") {
      dt.setHours(0, 0, 0, 0);
    }
  
    if (field === "untilDate") {
      dt.setHours(23, 59, 59, 999); 
    }
  
    if (field === "dueDate") {
      dt.setHours(23, 59, 59, 999); 
    }
  
    updateField(field, dt.toISOString());
  };
  

  const saveQuiz = async (publishAfterSave: boolean, goToList: boolean) => {
    if (!quiz) return;

    const payload = {
      ...quiz,
      timeLimit: hasTimeLimit ? quiz.timeLimit : undefined,
      published: publishAfterSave ? true : quiz.published,
    };

    try {
      await client.updateQuiz(payload);
      if (goToList) {
        router.push(`/Courses/${cid}/Quizzes`);
      } else {
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch (err) {
      console.error("Failed to save quiz:", err);
      alert("Failed to save quiz changes");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-1">{quiz.title || "Unnamed Quiz"}</h3>
        </div>
        <div className="text-end">
          <div>Points {quiz.points ?? 0}</div>
          <div className="small text-muted">
            {quiz.published ? "Published" : "Not Published"}
          </div>
        </div>
      </div>

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active>Details</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            href={`/Courses/${cid}/Quizzes/${qid}/questions`}
            className="nav-link"
          >
            Questions
          </Link>
        </Nav.Item>
      </Nav>

      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Quiz Title"
            value={quiz.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Quiz Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={quiz.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </Form.Group>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group as={Row} className="align-items-center mb-3">
              <Form.Label column sm={4} className="text-end">
                Quiz Type
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  value={quiz.quizType}
                  onChange={(e) => updateField("quizType", e.target.value)}
                >
                  <option>Graded Quiz</option>
                  <option>Practice Quiz</option>
                  <option>Graded Survey</option>
                  <option>Ungraded Survey</option>
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-3">
              <Form.Label column sm={4} className="text-end">
                Assignment Group
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  value={quiz.assignmentGroup}
                  onChange={(e) =>
                    updateField("assignmentGroup", e.target.value)
                  }
                >
                  <option>Quizzes</option>
                  <option>Exams</option>
                  <option>Assignments</option>
                  <option>Project</option>
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-3">
              <Form.Label column sm={4} className="text-end">
                Points
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="number"
                  value={quiz.points}
                  onChange={(e) =>
                    updateField("points", parseInt(e.target.value) || 0)
                  }
                />
              </Col>
            </Form.Group>

            <hr />

            <h6 className="mb-3">Options</h6>

            <Form.Check
              className="mb-2"
              type="checkbox"
              label="Shuffle Answers"
              checked={quiz.shuffleAnswers}
              onChange={(e) => updateField("shuffleAnswers", e.target.checked)}
            />

            <Form.Group className="mb-2 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                className="me-2"
                label="Time Limit"
                checked={hasTimeLimit}
                onChange={(e) => setHasTimeLimit(e.target.checked)}
              />
              <Form.Control
                type="number"
                style={{ maxWidth: "120px" }}
                disabled={!hasTimeLimit}
                value={hasTimeLimit ? quiz.timeLimit ?? 20 : ""}
                onChange={(e) =>
                  updateField("timeLimit", parseInt(e.target.value) || 0)
                }
              />
              <span className="ms-2">Minutes</span>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                label="Allow Multiple Attempts"
                checked={quiz.multipleAttempts}
                onChange={(e) =>
                  updateField("multipleAttempts", e.target.checked)
                }
              />
              {quiz.multipleAttempts && (
                <div className="d-flex align-items-center mt-2">
                  <span className="me-2 small">How many:</span>
                  <Form.Control
                    type="number"
                    style={{ maxWidth: "120px" }}
                    value={quiz.howManyAttempts ?? 1}
                    onChange={(e) =>
                      updateField(
                        "howManyAttempts",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Show Correct Answers</Form.Label>
              <Form.Select
                value={quiz.showCorrectAnswers}
                onChange={(e) =>
                  updateField("showCorrectAnswers", e.target.value)
                }
              >
                <option>Immediately</option>
                <option>After due date</option>
                <option>After last attempt</option>
                <option>Never</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Access Code</Form.Label>
              <Form.Control
                type="text"
                value={quiz.accessCode || ""}
                onChange={(e) => updateField("accessCode", e.target.value)}
              />
            </Form.Group>

            <Form.Check
              className="mb-2"
              type="checkbox"
              label="One Question at a Time"
              checked={quiz.oneQuestionAtATime}
              onChange={(e) =>
                updateField("oneQuestionAtATime", e.target.checked)
              }
            />

            <Form.Check
              className="mb-2"
              type="checkbox"
              label="Webcam Required"
              checked={quiz.webcamRequired}
              onChange={(e) =>
                updateField("webcamRequired", e.target.checked)
              }
            />

            <Form.Check
              className="mb-2"
              type="checkbox"
              label="Lock Questions After Answering"
              checked={quiz.lockQuestionsAfterAnswering}
              onChange={(e) =>
                updateField("lockQuestionsAfterAnswering", e.target.checked)
              }
            />
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Assign</Form.Label>
              <Card className="p-3">
                <Form.Group className="mb-3">
                  <Form.Label>Assign to</Form.Label>
                  <Form.Control type="text" value="Everyone" disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due</Form.Label>
                  <Form.Control
                    type="date"
                    value={toDateInputValue(quiz.dueDate)}
                    onChange={(e) =>
                      updateDateField("dueDate", e.target.value)
                    }
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Available from</Form.Label>
                      <Form.Control
                        type="date"
                        value={toDateInputValue(quiz.availableDate)}
                        onChange={(e) =>
                          updateDateField("availableDate", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Until</Form.Label>
                      <Form.Control
                        type="date"
                        value={toDateInputValue(quiz.untilDate)}
                        onChange={(e) =>
                          updateDateField("untilDate", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end gap-2 mb-4">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => saveQuiz(false, false)}
          >
            Save
          </Button>
          <Button
            variant="danger"
            onClick={() => saveQuiz(true, true)}
          >
            Save &amp; Publish
          </Button>
        </div>
      </Form>
    </div>
  );
}
