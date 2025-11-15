/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import * as client from "../client";  // ← Import your client file

interface Assignment {
  _id?: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  course?: string;
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const router = useRouter();

  const isNewAssignment = aid === "new";

  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!isNewAssignment) {
        const assignments = await client.findAssignmentsForCourse(cid);
        const existingAssignment = assignments.find((a: any) => a._id === aid);
        if (existingAssignment) {
          setAssignment({
            title: existingAssignment.title || "",
            description: existingAssignment.description || "",
            points: existingAssignment.points || 100,
            dueDate: existingAssignment.dueDate || "",
            availableFrom: existingAssignment.availableFrom || "",
            availableUntil: existingAssignment.availableUntil || "",
          });
        }
      }
    };
    fetchAssignment();
  }, [aid, cid, isNewAssignment]);

  const handleSave = async () => {
    if (isNewAssignment) {
      await client.createAssignment(cid, assignment);
    } else {
      await client.updateAssignment({ ...assignment, _id: aid });
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <Form.Group className="mb-4">
          <Form.Label>
            <b>Assignment Name</b>
          </Form.Label>
          <Form.Control
            type="text"
            value={assignment.title}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={assignment.description}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group as={Row} className="align-items-center mb-4">
          <Form.Label column sm={3} className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="number"
              value={assignment.points}
              onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="align-items-center mb-4">
          <Form.Label column sm={3} className="text-end">
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select defaultValue="ASSIGNMENTS">
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="align-items-center mb-4">
          <Form.Label column sm={3} className="text-end">
            Display Grade as
          </Form.Label>
          <Col sm={9}>
            <Form.Select defaultValue="Percentage">
              <option>Percentage</option>
              <option>Letter Grade</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="align-items-start mb-4">
          <Form.Label column sm={3} className="text-end">
            Submission Type
          </Form.Label>
          <Col sm={9}>
            <Card className="p-3">
              <Form.Group className="mb-3">
                <Form.Select defaultValue="Online">
                  <option>Online</option>
                  <option>In Person</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Online Entry Options</Form.Label>
                <div>
                  <Form.Check type="checkbox" label="Text Entry" />
                  <Form.Check type="checkbox" label="Website URL" defaultChecked />
                  <Form.Check type="checkbox" label="Media Recordings" />
                  <Form.Check type="checkbox" label="Student Annotation" />
                  <Form.Check type="checkbox" label="File Uploads" />
                </div>
              </Form.Group>
            </Card>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="align-items-start mb-4">
          <Form.Label column sm={3} className="text-end">
            Assign
          </Form.Label>
          <Col sm={9}>
            <Card className="p-3">
              <Form.Group className="mb-3">
                <Form.Label>Assign to</Form.Label>
                <Form.Control type="text" defaultValue="Everyone" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Due</Form.Label>
                <Form.Control
                  type="date"
                  value={assignment.dueDate}
                  onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Available from</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignment.availableFrom}
                      onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Until</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignment.availableUntil}
                      onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          </Col>
        </Form.Group>

        <hr />

        <div className="text-end">
          <Link href={`/Courses/${cid}/Assignments`}>
            <Button variant="secondary" className="me-2">
              Cancel
            </Button>
          </Link>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}