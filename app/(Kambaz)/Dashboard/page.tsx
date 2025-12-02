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
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const fetchAllCourses = async () => {
    if (!currentUser) return;
    try {
      const allCourses = await client.fetchAllCourses();
      const myCourses = await client.findMyCourses();
      
      console.log("All Courses:", allCourses);  // ← ADD THIS
      console.log("My Courses:", myCourses);    // ← ADD THIS
      
      const coursesWithEnrollment = allCourses.map((c: Course) => ({
        ...c,
        enrolled: myCourses.some((mc: Course) => mc._id === c._id)
      }));
      
      console.log("Courses with enrollment status:", coursesWithEnrollment);  // ← ADD THIS
      
      dispatch(setCourses(coursesWithEnrollment));
    } catch (error) {
      console.error("Error fetching all courses:", error);
    }
  };

  const updateEnrollment = async (courseId: string, shouldEnroll: boolean) => {
    if (!currentUser) return;
    
    try {
      if (shouldEnroll) {
        await client.enrollInCourse(courseId);
      } else {
        await client.unenrollFromCourse(courseId);
      }

      if (enrolling) {
        dispatch(setCourses(
          courses.map(c => 
            c._id === courseId ? { ...c, enrolled: shouldEnroll } : c
          )
        ));
      } else {
        dispatch(setCourses(courses.filter(c => c._id !== courseId)));
      }
    } catch (error) {
      console.error("Error updating enrollment:", error);
      alert("Failed to update enrollment. Please try again.");
    }
  };

  const onAddNewCourse = async () => {
    if (!currentUser) return;
    try {
      const newCourse = await client.createCourse(course);
      dispatch(setCourses([...courses, newCourse]));
      setCourse({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description"
      });
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    try {
      await client.deleteCourse(courseId);
      dispatch(setCourses(courses.filter((c) => c._id !== courseId)));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const onUpdateCourse = async () => {
    try {
      await client.updateCourse(course);
      dispatch(setCourses(courses.map((c) => (c._id === course._id ? course : c))));
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };


  useEffect(() => {
    if (enrolling) {
      fetchAllCourses();
    } else {
      fetchMyCourses();
    }
  }, [currentUser, enrolling]);

  if (!currentUser) {
    return <div className="p-4">Please sign in to view the Dashboard.</div>;
  }

  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">
        Dashboard
        {currentUser.role === "STUDENT" && (
          <Button
            onClick={() => setEnrolling(!enrolling)}
            variant="primary"
            className="float-end"
            id="wd-enrolling-toggle"
          >
            {enrolling ? "My Courses" : "All Courses"}
          </Button>
        )}
      </h1>
      
      <hr />

      {currentUser.role === "FACULTY" && (
        <>
          <h5>
            New Course
            <Button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </Button>
            <Button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </Button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
            placeholder="Course Name"
          />
          <FormControl
            value={course.number}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, number: e.target.value })}
            placeholder="Course Number"
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
            placeholder="Course Description"
          />
          <hr />
        </>
      )}
      
      <h2 id="wd-dashboard-published">
        {enrolling ? "All Courses" : "Published Courses"} ({courses.length})
      </h2>
      
      <hr />
      
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course: Course) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    src={course.image || "/images/reactjs.jpg"}
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
                  </CardBody>
                </Link>

                {enrolling && (
                  <CardBody className="pt-0">
                    <Button
                      onClick={(event) => {
                        event.preventDefault();
                        updateEnrollment(course._id, !course.enrolled);
                      }}
                      variant={course.enrolled ? "danger" : "success"}
                      className="w-100 mt-2"
                      id={course.enrolled ? "wd-unenroll-course-click" : "wd-enroll-course-click"}
                    >
                      {course.enrolled ? "Unenroll" : "Enroll"}
                    </Button>
                  </CardBody>
                )}

                {currentUser.role === "FACULTY" && !enrolling && (
                  <CardBody className="pt-0">
                    <Button
                      onClick={(event) => {
                        event.preventDefault();
                        setCourse(course);
                      }}
                      variant="warning"
                      className="w-100 mt-2"
                      id="wd-edit-course-click"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={(event) => {
                        event.preventDefault();
                        onDeleteCourse(course._id);
                      }}
                      variant="danger"
                      className="w-100 mt-2"
                      id="wd-delete-course-click"
                    >
                      Delete
                    </Button>
                  </CardBody>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}