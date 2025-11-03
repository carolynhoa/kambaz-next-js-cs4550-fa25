"use client";
import { ReactNode, useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "./navigation";
import Breadcrumb from "./Breadcrumb";
import { courses } from "../../Database";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

interface Course {
  _id: string;
  name: string;
}

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams<{ cid: string }>();
  const { courses } = useSelector((state: { coursesReducer: { courses: Course[] } }) => state.coursesReducer);
  const [showSidebar, setShowSidebar] = useState(true);

 const course = courses.find((course: Course) => course._id === cid);
 return (
  <div id="wd-courses">
<h2 className="text-danger d-flex align-items-center">
  <FaAlignJustify className="me-2 fs-4 mb-1"           
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowSidebar(!showSidebar)}/>
  {course?.name}
  </h2>
<hr /><hr />
      <div className="d-flex">
      {showSidebar && (
    <div className="d-none d-md-block">
    <CourseNavigation cid={cid} />
  </div>
    )}
  <div className={`flex-grow-1 ms-3 ${showSidebar ? "" : "w-100"}`}>
  {children}
  </div>
</div>
</div>

);}