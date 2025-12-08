/* eslint-disable @typescript-eslint/no-explicit-any */

import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { Question, Choice } from "../types";
import { QuestionEditorProps } from "../QuestionEditor";

export default function MultipleChoiceEditor({
  question,
  onChange,
  onCancel,
  onSave,
}: QuestionEditorProps) {
  const update = (patch: Partial<Question>) => {
    onChange({ ...question, ...patch });
  };

  const updateChoiceText = (idx: number, text: string) => {
    const choices: Choice[] = question.choices ? [...question.choices] : [];
    if (!choices[idx]) {
      choices[idx] = { text, isCorrect: false };
    } else {
      choices[idx] = { ...choices[idx], text };
    }
    update({ choices });
  };

  const setCorrectChoice = (idx: number) => {
    const choices: Choice[] = (question.choices || []).map((c, i) => ({
      ...c,
      isCorrect: i === idx,
    }));
    update({ choices });
  };

  const addChoice = () => {
    const choices: Choice[] = question.choices ? [...question.choices] : [];
    choices.push({ text: "New option", isCorrect: false });
    update({ choices });
  };

  const removeChoice = (idx: number) => {
    const choices: Choice[] =
      question.choices?.filter((_, i: number) => i !== idx) || [];
    update({ choices });
  };

  const correctIndex = (question.choices || []).findIndex(
    (c) => c.isCorrect
  );

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
                update({ points: parseInt(e.target.value || "0", 10) })
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
          placeholder="Type the question text here..."
        />
        <div className="form-text">
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Answers</Form.Label>
        {(question.choices || []).map((choice, idx) => (
          <div
            key={idx}
            className="d-flex align-items-start mb-2"
          >
            <Form.Check
              type="radio"
              name={`mc-correct-${question._id || "new"}`}
              className="me-2 mt-2"
              checked={idx === correctIndex}
              onChange={() => setCorrectChoice(idx)}
            />
            <Form.Control
              as="textarea"
              rows={2}
              value={choice.text}
              onChange={(e) => updateChoiceText(idx, e.target.value)}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2 mt-2"
              onClick={() => removeChoice(idx)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          variant="outline-secondary"
          size="sm"
          onClick={addChoice}
        >
          + Add Choice
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
