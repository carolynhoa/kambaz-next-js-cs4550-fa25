"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, Button, InputGroup, Modal } from "react-bootstrap";
import { BsGripVertical, BsPencilSquare, BsTrash } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { HiMagnifyingGlass } from "react-icons/hi2";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";
import { useState } from "react";

type Assignment = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
};

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: { assignmentsReducer: { assignments: Assignment[] } }) => state.assignmentsReducer);
  const dispatch = useDispatch();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const courseAssignments = assignments.filter(
    (a: Assignment) => a.course === cid
  );

  const handleDeleteClick = (e: React.MouseEvent, assignmentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAssignmentToDelete(assignmentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-25">
          <InputGroup.Text className="bg-white border-end-0">
            <HiMagnifyingGlass />
          </InputGroup.Text>
          <input
            type="text"
            placeholder="Search..."
            className="form-control border-start-0"
          />
        </InputGroup>

        <div className="d-flex">
          <Button variant="secondary" id="wd-add-assignment-group" className="me-2">
            <FaPlus className="me-1" /> Group
          </Button>
          <Link href={`/Courses/${cid}/Assignments/new`}>
            <Button variant="danger" id="wd-add-assignment">
              <FaPlus className="me-1" /> Assignment
            </Button>
          </Link>
        </div>
      </div>

      <ListGroup className="rounded-0" id="wd-assignments-list">
        <ListGroupItem
          className="p-3 fs-5 d-flex justify-content-between align-items-center bg-light"
        >
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <TbTriangleInvertedFilled className="me-2 text-dark" size={10} />
            <b>ASSIGNMENTS</b>
          </div>
          <div>
            <span className="me-3">40% of Total</span>
            <Link href={`/Courses/${cid}/Assignments/new`}>
              <Button size="sm" variant="light" className="border">
                <FaPlus />
              </Button>
            </Link>
          </div>
        </ListGroupItem>

        <ListGroup className="wd-lessons rounded-0">
          {courseAssignments.map((a: Assignment) => (
            <ListGroupItem
              key={a._id}
              className="p-3 d-flex justify-content-between align-items-center"
              style={{ borderLeft: "5px solid green" }}
            >
              <div className="d-flex align-items-start flex-grow-1">
                <BsGripVertical className="me-2 fs-3" />
                <BsPencilSquare className="me-2 text-success fs-5" />
                <div className="flex-grow-1">
                  <Link
                    href={`/Courses/${cid}/Assignments/${a._id}`}
                    className="text-dark text-decoration-none"
                  >
                    <div className="fw-bold">{a.title}</div>
                    <div className="small text-secondary">
                      <span className="text-danger">Multiple Modules</span> |{" "}
                      <b>Not available until</b> {a.availableFrom || "May 6 at 12:00am"}
                    </div>
                    <div className="small">
                      <b>Due</b> {a.dueDate || "May 13 at 11:59pm"} | {a.points || 100} pts
                    </div>
                  </Link>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <GreenCheckmark />
                <Button
                  variant="link"
                  className="text-danger p-0 ms-2"
                  onClick={(e) => handleDeleteClick(e, a._id)}
                >
                  <BsTrash className="fs-5" />
                </Button>
                <IoEllipsisVertical className="fs-4 ms-2" />
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </ListGroup>

      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}