/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

type Quiz = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  availableDate?: string;
  dueDate?: string;
  published?: boolean;
};

const initialState: { quizzes: Quiz[] } = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload as Quiz[];
    },
    addQuiz: (state, action) => {
      state.quizzes.push(action.payload as Quiz);
    },
    updateQuiz: (state, action) => {
      const updated = action.payload as Quiz;
      state.quizzes = state.quizzes.map((q) =>
        q._id === updated._id ? updated : q
      );
    },
    deleteQuiz: (state, action) => {
      const quizId = action.payload as string;
      state.quizzes = state.quizzes.filter((q) => q._id !== quizId);
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;
