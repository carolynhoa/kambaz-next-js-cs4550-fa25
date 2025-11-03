import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
}

interface Module {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
}

const initialState = {
  modules: modules,
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    addModule: (state, { payload: module }) => {
      const newModule = {
        _id: uuidv4(),
        name: module.name,
        description: module.description || "",
        course: module.course,
        lessons: [] as Lesson[],
      };
      state.modules = [...state.modules, newModule] as typeof state.modules;
    },
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter(
        (m: Module) => m._id !== moduleId) as typeof state.modules;
    },
    updateModule: (state, { payload: module }) => {
      state.modules = state.modules.map((m: Module) =>
        m._id === module._id ? module : m
      ) as typeof state.modules;
    },
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m: Module) =>
        m._id === moduleId ? { ...m, editing: true } : m
      ) as typeof state.modules;
    },
  },
});

export const { addModule, deleteModule, updateModule, editModule } =
  modulesSlice.actions;
export default modulesSlice.reducer;