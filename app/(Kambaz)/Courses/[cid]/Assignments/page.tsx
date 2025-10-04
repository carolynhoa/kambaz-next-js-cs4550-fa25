"use client";
import Link from "next/link";
import { ListGroup, ListGroupItem, Button, InputGroup } from "react-bootstrap";
import { BsGripVertical, BsPencilSquare } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { HiMagnifyingGlass } from "react-icons/hi2";


export default function Assignments() {
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
    <Button variant="danger" id="wd-add-assignment">
      <FaPlus className="me-1" /> Assignment
    </Button>
  </div>
</div>

      <ListGroup className="rounded-0" id="wd-assignments-list">
        <ListGroupItem
          className="p-3 fs-5 d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <TbTriangleInvertedFilled className="me-2 text-dark" size={10} />
            <b>ASSIGNMENTS</b>
          </div>
          <div>
            <span className="me-3">40% of Total</span>
            <Button size="sm" variant="light" className="border">
              <FaPlus />
            </Button>
          </div>
        </ListGroupItem>

        <ListGroup className="wd-lessons rounded-0">
          <ListGroupItem
            className="p-3 d-flex justify-content-between align-items-center"
            style={{ borderLeft: "5px solid green" }}
          >
            <div className="d-flex align-items-start">
              <BsGripVertical className="me-2 fs-3" />
              <BsPencilSquare className="me-2 text-success fs-5" />
              <div>
                <Link
                  href="/Courses/1234/Assignments/123"
                  className="text-dark fw-bold text-decoration-none"
                >
                  <b>A1 - ENV + HTML</b>
                </Link>
                <div className="small text-secondary">
                <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available until</b> May 6 at 12:00am
                </div>
                <div className="small">
                  <b>Due</b> May 13 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <div>
              <GreenCheckmark /> <IoEllipsisVertical className="fs-4 ms-2" />
            </div>
          </ListGroupItem>

          <ListGroupItem
            className="p-3 d-flex justify-content-between align-items-center"
            style={{ borderLeft: "5px solid green" }}
          >
            <div className="d-flex align-items-start">
              <BsGripVertical className="me-2 fs-3" />
              <BsPencilSquare className="me-2 text-success fs-5" />
              <div>
                <Link
                  href="/Courses/1234/Assignments/234"
                  className="text-dark fw-bold text-decoration-none"
                >
                  <b>A2 - CSS + BOOTSTRAP</b>
                </Link>
                <div className="small text-secondary">
                <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available until</b> May 13 at 12:00am
                </div>
                <div className="small">
                  <b>Due</b> May 20 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <div>
              <GreenCheckmark /> <IoEllipsisVertical className="fs-4 ms-2" />
            </div>
          </ListGroupItem>

          <ListGroupItem
            className="p-3 d-flex justify-content-between align-items-center"
            style={{ borderLeft: "5px solid green" }}
          >
            <div className="d-flex align-items-start">
              <BsGripVertical className="me-2 fs-3" />
              <BsPencilSquare className="me-2 text-success fs-5" />
              <div>
                <Link
                  href="/Courses/1234/Assignments/456"
                  className="text-dark fw-bold text-decoration-none"
                >
                  <b>A3 - JAVASCRIPT + REACT</b>
                </Link>
                <div className="small text-secondary">
                <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available until</b> May 20 at 12:00am
                </div>
                <div className="small">
                  <b>Due</b> May 27 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <div>
              <GreenCheckmark /> <IoEllipsisVertical className="fs-4 ms-2" />
            </div>
          </ListGroupItem>
        </ListGroup>
      </ListGroup>
    </div>
  );
}
