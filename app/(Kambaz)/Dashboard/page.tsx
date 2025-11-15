"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import * as client from "../Courses/client";
import {
  Col,
  Row,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  FormControl
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";

interface User {
  _id: string;
  role: string;
}

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: string;
  enrolled?: boolean;
}

export default function Dashboard() {
  const { currentUser } = useSelector(
    (state: { accountReducer: { currentUser: User | null } }) =>
      state.accountReducer
  );
  const { courses } = useSelector(
    (state: { coursesReducer: { courses: Course[] } }) =>
      state.coursesReducer
  );
  const dispatch = useDispatch();

  const [enrolling, setEnrolling] = useState(false);
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description"
  });

  const fetchMyCourses = async () => {
    if (!currentUser) return;
    try {
      const myCourses = await client.findMyCourses();
      dispatch(setCourses(myCourses));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllCourses = async () => {
    if (!currentUser) return;
    try {
      const allCourses = await client.fetchAllCourses();
      const myCourses = await client.findMyCourses();
      const coursesWithEnrollment = allCourses.map((c: Course) => ({
        ...c,
        enrolled: myCourses.some((mc: Course) => mc._id === c._id)
      }));
      dispatch(setCourses(coursesWithEnrollment));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (enrolling) fetchAllCourses();
    else fetchMyCourses();
  }, [currentUser, enrolling]);

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (!currentUser) return;
    try {
      if (enrolled) await client.enrollInCourse(currentUser._id, courseId);
      else await client.unenrollFromCourse(currentUser._id, courseId);

      if (enrolling) fetchAllCourses();
      else fetchMyCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((c) => c._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c) => (c._id === course._id ? course : c))));
  };

  if (!currentUser) return <div className="p-4">Please sign in to view the Dashboard.</div>;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <button
        className="btn btn-secondary mb-3"
        onClick={() => setEnrolling(!enrolling)}
      >
        {enrolling ? "My Courses" : "All Courses"}
      </button>

      {currentUser.role === "FACULTY" && (
        <>
          <h5>
            New Course
            <button className="btn btn-primary float-end" onClick={onAddNewCourse}>Add</button>
            <button className="btn btn-secondary float-end me-2" onClick={onUpdateCourse}>Update</button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
        </>
      )}

      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course: Course) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={`/Courses/${course._id}/Home`} className="wd-dashboard-course-link text-decoration-none text-dark">
                  <CardImg src={course.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description}
                    </CardText>
                    <Button variant="primary">Go</Button>

                    {enrolling && (
                      <button
                        className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} float-end mt-2`}
                        onClick={(event) => {
                          event.preventDefault();
                          updateEnrollment(course._id, !course.enrolled);
                        }}
                      >
                        {course.enrolled ? "Unenroll" : "Enroll"}
                      </button>
                    )}

                    {currentUser.role === "FACULTY" && !enrolling && (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            onDeleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning float-end me-2"
                        >
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
