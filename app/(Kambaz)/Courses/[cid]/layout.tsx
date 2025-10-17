import { ReactNode } from "react";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "./navigation";
import Breadcrumb from "./Breadcrumb";
import { courses } from "../../Database";
export default async function CoursesLayout(
  { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>) {
 const { cid } = await params;
 const course = courses.find((course) => course._id === cid);
 return (
  <div id="wd-courses">
<h2 className="text-danger d-flex align-items-center">
  <FaAlignJustify className="me-2 fs-4 mb-1" />
  {course?.name} <Breadcrumb course={course} />
</h2>
<hr /><hr />
      <div className="d-flex">
  <div className="d-none d-md-block">
    <CourseNavigation cid={cid} />
  </div>
  <div className="flex-grow-1 ms-3">
    {children}
  </div>
</div>
</div>

);}
