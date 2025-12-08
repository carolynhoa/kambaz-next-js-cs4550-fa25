export type QuestionType = "multiple-choice" | "true-false" | "fill-in-blank";

export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;           
  quiz: string;           
  type: QuestionType;    
  title: string;
  points: number;
  question: string;       
  choices?: Choice[];     
  correctAnswer?: boolean;        
  possibleAnswers?: string[];     
}
