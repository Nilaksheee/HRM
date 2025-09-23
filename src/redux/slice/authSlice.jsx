import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
      
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;   // 👈 Save user info
      state.token = action.payload.token;
       // 👈 Save token
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
