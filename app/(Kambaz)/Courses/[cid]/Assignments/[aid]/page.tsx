"use client";

import React from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <Form.Group className="mb-4">
          <Form.Label>
            <b>Assignment Name</b>
          </Form.Label>
          <Form.Control type="text" defaultValue="A1 - ENV + HTML" />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={8} 
          defaultValue={`The assignment is available online

            Submit a link to the landing page of your Web application running on Netlify.
            
            The landing page should include the following:
            - Your full name and section
            - Links to each of the lab assignments
            - Link to the Kanbas application
            - Links to all relevant source code repositories
            
            The Kanbas application should include a link to navigate back to the landing page.`}/>
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
                <Form.Control type="date" defaultValue="2024-05-13" />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Available from</Form.Label>
                    <Form.Control type="date" defaultValue="2024-05-06" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Until</Form.Label>
                    <Form.Control type="date" defaultValue="2024-05-20" />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          </Col>
        </Form.Group>

        <hr />

        <div className="text-end">
          <Button variant="secondary" type="reset" className="me-2">
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
