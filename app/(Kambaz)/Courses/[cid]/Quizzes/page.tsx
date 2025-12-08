/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as client from "../../client";
import * as accountClient from "../../../Account/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ListGroup,
  ListGroupItem,
  Button,
  InputGroup,
  Modal,
  Dropdown,
} from "react-bootstrap";

import { BsGripVertical, BsPencilSquare } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus, FaBan } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";
import GreenCheckmark from "../Modules/GreenCheckmark";

import { useSelector, useDispatch } from "react-redux";
import {
  setQuizzes,
  addQuiz as addQuizAction,
  deleteQuiz as deleteQuizAction,
  updateQuiz as updateQuizAction,
} from "./reducer";

import { useEffect, useState } from "react";
import { RootState } from "../../../store";

type Quiz = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  availableDate?: string;
  dueDate?: string;
  untilDate?: string;
  published?: boolean;
};

type QuizMeta = {
  questionCount: number;
  lastScore: number | null;
};

type User = {
  _id: string;
  role: "STUDENT" | "FACULTY" | "TA" | "ADMIN";
  firstName: string;
  lastName: string;
};

export default function QuizzesPage() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);

  const [searchText, setSearchText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const [quizMeta, setQuizMeta] = useState<Record<string, QuizMeta>>({});
  const [user, setUser] = useState<User | null>(null);

  const [sortBy, setSortBy] = useState<"available" | "name" | "due">(
    "available"
  );

  const isStudent = user?.role === "STUDENT";
  const isFaculty =
    user?.role === "FACULTY" || user?.role === "TA" || user?.role === "ADMIN";

  const loadUser = async () => {
    try {
      const current = await accountClient.profile();
      setUser(current);
    } catch (e) {
      console.log("No active session");
      setUser(null);
    }
  };

  const loadQuizMeta = async (quizId: string) => {
    try {
      const questions = await client.findQuestionsForQuiz(quizId);

      let lastScore: number | null = null;
      try {
        const attempts = await client.findMyQuizAttempts(quizId);
        if (attempts && attempts.length > 0) {
          lastScore = attempts[attempts.length - 1].score;
        }
      } catch {
        lastScore = null;
      }

      setQuizMeta((prev) => ({
        ...prev,
        [quizId]: {
          questionCount: questions.length,
          lastScore,
        },
      }));
    } catch (err) {
      console.error("Error loading metadata for quiz:", quizId, err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const courseQuizzes = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(courseQuizzes));

      courseQuizzes.forEach((q: Quiz) => {
        loadQuizMeta(q._id);
      });
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    loadUser();
    fetchQuizzes();
  }, [cid]);

  const onAddQuiz = async () => {
    try {
      const newQuiz = await client.createQuizForCourse(cid as string);
      dispatch(addQuizAction(newQuiz));
      loadQuizMeta(newQuiz._id);

      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}`);
    } catch (err) {
      console.error("Failed to create quiz:", err);
    }
  };

  const openDeleteModal = (e: React.MouseEvent, quizId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    try {
      await client.deleteQuiz(quizToDelete);
      dispatch(deleteQuizAction(quizToDelete));
      setShowDeleteModal(false);
      setQuizToDelete(null);
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    }
  };

  const togglePublish = async (
    e: React.MouseEvent,
    quiz: Quiz,
    forceValue?: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFaculty) return;

    const newPublished =
      typeof forceValue === "boolean" ? forceValue : !quiz.published;

    const updated = { ...quiz, published: newPublished };
    try {
      await client.updateQuiz(updated);
      dispatch(updateQuizAction(updated));
    } catch (err) {
      console.error("Failed to publish/unpublish:", err);
    }
  };

  const copyQuiz = async (e: React.MouseEvent, quiz: Quiz) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFaculty) return;

    try {
      const newQuiz = await client.createQuizForCourse(cid as string);
      const cloned = {
        ...quiz,
        _id: newQuiz._id,
        title: `${quiz.title} (Copy)`,
        published: false,
      };
      await client.updateQuiz(cloned);
      dispatch(addQuizAction(cloned));
      loadQuizMeta(cloned._id);
    } catch (err) {
      console.error("Failed to copy quiz:", err);
    }
  };

  const getAvailability = (quiz: Quiz) => {
    const now = new Date();
    const start = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const end = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (start && now < start) {
      return `Not available until ${start.toLocaleString()}`;
    }
    if (end && now > end) {
      return "Closed";
    }
    return "Available";
  };

  const visibleQuizzes: Quiz[] = isStudent
    ? quizzes.filter((q) => q.published)
    : quizzes;

  const sortedQuizzes = [...visibleQuizzes].sort((a, b) => {
    if (sortBy === "name") {
      return (a.title || "").localeCompare(b.title || "");
    }
    if (sortBy === "due") {
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aDate - bDate;
    }
    const aDate = a.availableDate
      ? new Date(a.availableDate).getTime()
      : Infinity;
    const bDate = b.availableDate
      ? new Date(b.availableDate).getTime()
      : Infinity;
    return aDate - bDate;
  });

  return (
    <div id="wd-quizzes">
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-25">
          <InputGroup.Text className="bg-white border-end-0">
            <HiMagnifyingGlass />
          </InputGroup.Text>
          <input
            type="text"
            placeholder="Search for Quiz"
            className="form-control border-start-0"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </InputGroup>

        <div className="d-flex align-items-center gap-2">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              id="wd-sort-quizzes"
            >
              Sort
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortBy("name")}>
                Name
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("due")}>
                Due date
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("available")}>
                Available date
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {isFaculty && (
            <Button variant="danger" onClick={onAddQuiz}>
              <FaPlus className="me-1" /> Quiz
            </Button>
          )}
        </div>
      </div>

      <ListGroup className="rounded-0" id="wd-quizzes-list">
        <ListGroupItem className="p-3 fs-5 d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <b>QUIZZES</b>
          </div>
          {isFaculty && (
            <Button
              size="sm"
              variant="light"
              className="border"
              onClick={onAddQuiz}
            >
              <FaPlus />
            </Button>
          )}
        </ListGroupItem>

        {sortedQuizzes.length === 0 ? (
          <ListGroupItem className="text-center text-muted py-4">
            No quizzes found. Click + Quiz to create one.
          </ListGroupItem>
        ) : (
          sortedQuizzes
            .filter((q: Quiz) =>
              q.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((q: Quiz) => {
              const meta = quizMeta[q._id];
              const availability = getAvailability(q);

              return (
                <ListGroupItem
                  key={q._id}
                  className="p-3 d-flex justify-content-between align-items-center"
                  style={{ borderLeft: "5px solid green" }}
                >
                  <div className="d-flex align-items-start flex-grow-1">
                    <BsGripVertical className="me-2 fs-3" />
                    <BsPencilSquare className="me-2 text-success fs-5" />

                    <div className="flex-grow-1">
                      <Link
                        href={`/Courses/${cid}/Quizzes/${q._id}`}
                        className="text-dark text-decoration-none"
                      >
                        <div className="fw-bold">
                          {q.title || "Untitled Quiz"}
                        </div>

                          <div className="small text-secondary">
                            <b>{availability}</b>
                            {" | "}
                            <b>Due</b>{" "}
                            {q.dueDate
                              ? new Date(q.dueDate).toLocaleString()
                              : "N/A"}
                            {" | "}
                            {q.points ?? 0} pts
                            {" | "}
                            {meta ? meta.questionCount : "…"} Questions
                            {isStudent &&
                              meta &&
                              meta.lastScore != null && (
                                <> | Score: {meta.lastScore}</>
                              )}
                          </div>
                      </Link>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    {isFaculty && (
                      <>
                        {q.published ? (
                          <span
                            role="button"
                            onClick={(e) => togglePublish(e, q, false)}
                            title="Unpublish"
                          >
                            <GreenCheckmark />
                          </span>
                        ) : (
                          <span
                            role="button"
                            className="text-danger me-2"
                            onClick={(e) => togglePublish(e, q, true)}
                            title="Publish"
                          >
                            <FaBan />
                          </span>
                        )}
                      </>
                    )}

                    {isFaculty && (
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          as="button"
                          className="btn btn-link p-0 ms-2 text-secondary border-0"
                          style={{ boxShadow: "none" }}
                        >
                          <IoEllipsisVertical className="fs-4" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(
                                `/Courses/${cid}/Quizzes/${q._id}`
                              );
                            }}
                          >
                            Edit
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={(e: React.MouseEvent) =>
                              openDeleteModal(e, q._id)
                            }
                          >
                            Delete
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={(e: React.MouseEvent) =>
                              togglePublish(e, q)
                            }
                          >
                            {q.published ? "Unpublish" : "Publish"}
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={(e: React.MouseEvent) =>
                              copyQuiz(e, q)
                            }
                          >
                            Copy to this course
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </ListGroupItem>
              );
            })
        )}
      </ListGroup>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this quiz? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
