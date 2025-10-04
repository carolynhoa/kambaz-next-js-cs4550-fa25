"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/Courses")) {
      return pathname.startsWith("/Courses");
    }
    return pathname.startsWith(href);
  };


  const links = [
    { href: "/Account", icon: FaRegCircleUser, label: "Account" },
    { href: "/Dashboard", icon: AiOutlineDashboard, label: "Dashboard" },
    { href: "/Courses/default/Home", icon: LiaBookSolid, label: "Courses" },
    { href: "/Labs", icon: IoCalendarOutline, label: "Calendar" },
    { href: "/Labs", icon: FaInbox, label: "Inbox" },
    { href: "/Labs", icon: LiaCogSolid, label: "Labs" },
  ];

  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block z-2"
      style={{ width: 110, backgroundColor: "black" }}
    >
      <ListGroupItem
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
      >
        <img src="/NEU.svg" width="75px" alt="Northeastern University" />
      </ListGroupItem>

      {links.map((link) => {
        const active = isActive(link.href);
        const Icon = link.icon;
        return (
          <ListGroupItem
            key={link.href}
            className="border-0 text-center"
            style={{
              backgroundColor: active ? "white" : "black",
            }}
          >
            <Link
              href={link.href}
              className="d-flex flex-column align-items-center justify-content-center text-decoration-none"
              style={{
                color: active ? "red" : "white",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              <Icon color={active ? "red" : "white"} size={24} />
              {link.label}
            </Link>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
