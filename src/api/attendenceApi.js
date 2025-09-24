// src/api/attendanceApi.js
import api from "./api";

// Get today's attendance
export const getTodayAttendance = async () => {
  const res = await api.get("/attendance/today/");
  return res.data;
};

// Get all attendance
export const getAllAttendance = async () => {
  const res = await api.get("/attendance/today/");
  return res.data;
};

// Punch In
// export const punchIn = async (payload) => {
//   const res = await api.post("/attendance/mark/", payload);
//   return res.data;
// };

// Punch Out
export const markAttendance = async (payload) => {
  const res = await api.post("/attendance/mark/", payload);
  return res.data;
};
 
// Fetch monthly attendance
export const getMonthlyAttendance = async () => {
  const res = await api.get("/attendance/monthly/"); 
    return res.data; 
 };


