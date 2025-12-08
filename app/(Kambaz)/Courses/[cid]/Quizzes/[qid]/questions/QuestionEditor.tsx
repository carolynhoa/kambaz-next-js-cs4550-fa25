import { Question } from "./types";
import MultipleChoiceEditor from "./components/MultipleChoiceEditor";
import TrueFalseEditor from "./components/TrueFalseEditor";
import FillBlankEditor from "./components/FillBlankEditor";

export interface QuestionEditorProps {
  question: Question;
  onChange: (updated: Question) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function QuestionEditor(props: QuestionEditorProps) {
  const { question } = props;

  if (question.type === "multiple-choice") {
    return <MultipleChoiceEditor {...props} />;
  }

  if (question.type === "true-false") {
    return <TrueFalseEditor {...props} />;
  }

  if (question.type === "fill-in-blank") {
    return <FillBlankEditor {...props} />;
  }
  

  return <div className="text-danger">Unknown question type</div>;
}
