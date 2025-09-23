// redux/permissionsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  punchInTime: null,
  punchOutTime: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPunchInTime: (state, action) => {
      state.punchInTime = action.payload;
    },
    setPunchOutTime: (state, action) => {
      state.punchOutTime = action.payload;
    },
    resetPunch: (state) => {
      state.punchInTime = null;
      state.punchOutTime = null;
    },
  },
});

export const { setPunchInTime, setPunchOutTime, resetPunch } = permissionsSlice.actions;

export default permissionsSlice.reducer;
