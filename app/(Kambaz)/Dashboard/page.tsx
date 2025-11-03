"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Link from "next/link";
import * as db from "../Database";
import Image from "next/image";
import {Col, Row, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { enrollCourse, unenrollCourse } from "../Enrollments/reducer";

interface User {
  _id: string;
  role: string;
}

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: string;
}

export default function Dashboard() {
  const { currentUser } = useSelector((state: { accountReducer: { currentUser: User | null } }) => state.accountReducer);
  const { enrollments } = useSelector((state: { enrollmentsReducer: { enrollments: Enrollment[] } }) => state.enrollmentsReducer);
  const { courses } = useSelector((state: { coursesReducer: { courses: Course[] } }) => state.coursesReducer);
  const dispatch = useDispatch();
  
  const [course, setCourse] = useState<Course>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });

  const [showAllCourses, setShowAllCourses] = useState(false);

  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (enrollment: Enrollment) =>
        enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };

  const handleEnroll = (courseId: string) => {
    if (currentUser) {
      dispatch(enrollCourse({ userId: currentUser._id, courseId }));
    }
  };

  const handleUnenroll = (courseId: string) => {
    if (currentUser) {
      dispatch(unenrollCourse({ userId: currentUser._id, courseId }));
    }
  };

  const displayedCourses = showAllCourses
    ? courses
    : courses.filter((course: Course) => isEnrolled(course._id));

  if (!currentUser) {
    return <div className="p-4">Please sign in to view the Dashboard.</div>;
  }

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      
      {currentUser.role === "FACULTY" && (
        <>
          <h5>New Course
            <button className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={() => dispatch(addNewCourse(course))} > Add </button>
            <button className="btn btn-warning float-end me-2"
                    onClick={() => dispatch(updateCourse(course))} >Update </button>
          </h5><br />
          <FormControl value={course.name} className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
          <FormControl as="textarea" value={course.description} rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "Published Courses"} ({displayedCourses.length})
        <Button 
          variant="primary" 
          className="float-end"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
        </Button>
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course: Course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  onClick={(e) => {
                    if (!isEnrolled(course._id) && currentUser.role !== "FACULTY") {
                      e.preventDefault();
                      alert("You must be enrolled in this course to access it.");
                    }
                  }}
                >
                  <CardImg
                    src="/images/reactjs.jpg"
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                    
                    <Button variant="primary">Go</Button>

                    {isEnrolled(course._id) ? (
                      <Button
                        variant="danger"
                        className="float-end"
                        onClick={(e) => {
                          e.preventDefault();
                          handleUnenroll(course._id);
                        }}
                      >
                        Unenroll
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        className="float-end"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEnroll(course._id);
                        }}
                      >
                        Enroll
                      </Button>
                    )}

                    {currentUser.role === "FACULTY" && (
                      <>
                        <button onClick={(event) => {
                          event.preventDefault();
                          dispatch(deleteCourse(course._id));
                        }} className="btn btn-danger float-end me-2"
                        id="wd-delete-course-click">
                          Delete
                        </button>
                        <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end" >
                          Edit
                        </button>
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}