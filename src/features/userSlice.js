import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isStudent: true,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    toggleStudentMode: (state) => {
      state.isStudent = !state.isStudent;
    },
  },
});

export const { login, logout, toggleStudentMode } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
