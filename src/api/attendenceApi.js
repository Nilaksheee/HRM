// src/api/attendanceApi.js
import api from "./api";

// Get today's attendance
export const getTodayAttendance = async () => {
  const res = await api.get("/attendance/today/");
  return res.data;
};

// Get all attendance
export const getAllAttendance = async () => {
  const res = await api.get("https://3gxqzdsp-2000.inc1.devtunnels.ms/api/v1/attendance/today/");
  return res.data;
};

// Punch In
export const punchIn = async (payload) => {
  const res = await api.post("https://3gxqzdsp-2000.inc1.devtunnels.ms/api/v1/attendance/mark/", payload);
  return res.data;
};

// Punch Out
export const punchOut = async (payload) => {
  const res = await api.post("https://3gxqzdsp-2000.inc1.devtunnels.ms/api/v1/attendance/mark/", payload);
  return res.data;
};
