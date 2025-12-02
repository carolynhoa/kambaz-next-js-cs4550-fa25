"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./Table/page";
import * as client from "../../client";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
};

export default function CoursePeople() {
  const { cid } = useParams();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async (): Promise<User[]> => {
    if (!cid) return [];
    try {
      const courseUsers = await client.findUsersForCourse(cid as string);
      setUsers(courseUsers);
      return courseUsers;
    } catch (error) {
      console.error("Error fetching users for course:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  return (
    <div id="wd-people" className="p-4">
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
