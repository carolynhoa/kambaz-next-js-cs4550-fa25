import { createSlice } from "@reduxjs/toolkit";
import { users } from "../Database"; 

const initialState = {
  currentUser: users[0],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;