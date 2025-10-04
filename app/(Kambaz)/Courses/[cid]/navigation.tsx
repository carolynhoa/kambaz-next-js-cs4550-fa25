"use client"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/Courses/1234/Home", label: "Home" },
    { href: "/Courses/1234/Modules", label: "Modules" },
    { href: "https://piazza.com/class/mf1li76n4is6m", label: "Piazza" },
    { href: "https://www.zoom.com/", label: "Zoom" },
    { href: "/Courses/1234/Assignments", label: "Assignments" },
    { href: "https://northeastern.instructure.com/courses/225902/quizzes", label: "Quizzes" },
    { href: "/Courses/1234/People/Table", label: "People" },
  ];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`list-group-item border-0 ${
              isActive ? "active bg-white text-danger" : "text-danger bg-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
