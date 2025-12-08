/* eslint-disable @typescript-eslint/no-explicit-any */

import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { QuestionEditorProps } from "../QuestionEditor";

export default function TrueFalseEditor({
  question,
  onChange,
  onCancel,
  onSave,
}: QuestionEditorProps) {
  const update = (patch: Partial<typeof question>) => {
    onChange({ ...question, ...patch });
  };

  return (
    <Card className="p-3">
<Form.Group className="mb-3">
  <Form.Label>Question Type</Form.Label>
  <Form.Select
    value={question.type}
    onChange={(e) =>
      update({ type: e.target.value as any })
    }
  >
    <option value="multiple-choice">Multiple Choice</option>
    <option value="true-false">True / False</option>
    <option value="fill-in-blank">Fill in the Blank</option>
  </Form.Select>
</Form.Group>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Question Title</Form.Label>
            <Form.Control
              type="text"
              value={question.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={question.points}
              onChange={(e) =>
                update({
                  points: parseInt(e.target.value || "0", 10),
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Question</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={question.question}
          onChange={(e) => update({ question: e.target.value })}
          placeholder="Type the statement students must mark as True or False..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Correct Answer</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id={`tf-true-${question._id || "new"}`}
            label="True"
            checked={question.correctAnswer === true}
            onChange={() => update({ correctAnswer: true })}
          />
          <Form.Check
            inline
            type="radio"
            id={`tf-false-${question._id || "new"}`}
            label="False"
            checked={question.correctAnswer === false}
            onChange={() => update({ correctAnswer: false })}
          />
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onSave}
        >
          {question._id ? "Update Question" : "Save Question"}
        </Button>
      </div>
    </Card>
  );
}
