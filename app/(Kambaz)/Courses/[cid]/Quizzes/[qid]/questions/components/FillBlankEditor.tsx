/* eslint-disable @typescript-eslint/no-explicit-any */

import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { Question } from "../types";
import { QuestionEditorProps } from "../QuestionEditor";

export default function FillBlankEditor({
  question,
  onChange,
  onCancel,
  onSave,
}: QuestionEditorProps) {
  const update = (patch: Partial<Question>) => {
    onChange({ ...question, ...patch });
  };

  const updateAnswer = (idx: number, value: string) => {
    const answers = question.possibleAnswers
      ? [...question.possibleAnswers]
      : [];
    answers[idx] = value;
    update({ possibleAnswers: answers });
  };

  const addAnswer = () => {
    const answers = question.possibleAnswers
      ? [...question.possibleAnswers]
      : [];
    answers.push("");
    update({ possibleAnswers: answers });
  };

  const removeAnswer = (idx: number) => {
    const answers =
      question.possibleAnswers?.filter((_, i) => i !== idx) || [];
    update({ possibleAnswers: answers });
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
          placeholder="Type the question text..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Possible Correct Answers (case-insensitive)</Form.Label>
        {(question.possibleAnswers || []).map((ans, idx) => (
          <div
            key={idx}
            className="d-flex mb-2"
          >
            <Form.Control
              type="text"
              value={ans}
              onChange={(e) => updateAnswer(idx, e.target.value)}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              onClick={() => removeAnswer(idx)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={addAnswer}
        >
          + Add Possible Answer
        </Button>
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
