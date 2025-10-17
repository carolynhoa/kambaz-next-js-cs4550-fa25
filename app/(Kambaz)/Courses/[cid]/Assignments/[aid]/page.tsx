"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { assignments } from "../../../../Database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();

  const assignment = assignments.find((a) => a._id === aid);

  if (!assignment) {
    return <div className="p-4 text-danger">Assignment not found.</div>;
  }

  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <Form.Group className="mb-4">
          <Form.Label>
            <b>Assignment Name</b>
          </Form.Label>
          <Form.Control type="text" defaultValue={assignment.title} />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            defaultValue={`Description for "${assignment.title}".`}
          />
        </Form.Group>

        <Form.Group as={Row} className="align-items-center mb-4">
          <Form.Label column sm={3} className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control type="number" defaultValue={100} />
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
                <Form.Control type="date" defaultValue="2024-12-01" />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Available from</Form.Label>
                    <Form.Control type="date" defaultValue="2024-11-20" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Until</Form.Label>
                    <Form.Control type="date" defaultValue="2024-12-15" />
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
          <Link href={`/Courses/${cid}/Assignments`}>
            <Button variant="danger">Save</Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}
