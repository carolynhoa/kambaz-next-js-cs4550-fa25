"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();

  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((label) => {
        let href = `/Courses/${cid}/${label}`;
        if (label === "People") href = `/Courses/${cid}/People/Table`;
        let isExternal = false;

        if (["Piazza", "Zoom", "Quizzes"].includes(label)) {
          isExternal = true;
          if (label === "Piazza") href = "https://piazza.com/class/mf1li76n4is6m";
          if (label === "Zoom") href = "https://www.zoom.com/";
          if (label === "Quizzes") href = "https://northeastern.instructure.com/courses/225902/quizzes";
        }

        const isActive = !isExternal && pathname.startsWith(href);

        if (isExternal) {
          return (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="list-group-item border-0 text-danger bg-white"
            >
              {label}
            </a>
          );
        }

        return (
          <Link
            key={label}
            href={href}
            className={`list-group-item border-0 ${
              isActive ? "active bg-white text-danger" : "text-danger bg-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
