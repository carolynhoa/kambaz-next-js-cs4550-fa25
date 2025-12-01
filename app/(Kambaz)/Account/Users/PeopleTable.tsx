"use client";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../../Courses/[cid]/People/Details";

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

type PeopleTableProps = {
  users?: User[];
  fetchUsers: () => Promise<User[]>;
};

export default function PeopleTable({ users = [], fetchUsers }: PeopleTableProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleCloseDetails = () => {
    setShowDetails(false);
    fetchUsers(); 
  };

  return (
    <div id="wd-people-table">
      {showDetails && selectedUserId && (
        <PeopleDetails uid={selectedUserId} onClose={handleCloseDetails} />
      )}

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <span
                  className="text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setShowDetails(true);
                  }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
