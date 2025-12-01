/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./PeopleTable";
import * as client from "../client";
import { FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };


  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };


  const { uid } = useParams();

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
    return users;
  };

  const filterUsersByRole = async (selectedRole: string) => {
    setRole(selectedRole);

    if (selectedRole) {
      const filtered = await client.findUsersByRole(selectedRole);
      setUsers(filtered);
    } else {
        await fetchUsers(); 
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [uid]);

  return (
    <div>
        <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
        <FaPlus className="me-2" />
        Users
      </button>
      <h3>Users</h3>
      
      <FormControl onChange={(e) => filterUsersByName(e.target.value)} placeholder="Search people"
             className="float-start w-25 me-2 wd-filter-by-name" />

      <select
        value={role}
        onChange={(e) => filterUsersByRole(e.target.value)}
        className="form-select float-start w-25 wd-select-role mb-3"
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
      </select>

      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
