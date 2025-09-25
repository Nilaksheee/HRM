
import api from "./api";

// Get today's attendance
// export const getTodayAttendance = async () => {
//   const res = await api.get("/attendance/today/");
//   return res.data;
// };

export const getTodayAttendance = async () => {
  try {
    const res = await api.get("/attendance/today/");
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all attendance
export const getAllAttendance = async () => {
  const res = await api.get("/attendance/today/");
  return res.data;
};

// mark attendence
export const markAttendance = async (payload) => {
  try {
    const res = await api.post("/attendance/mark", payload);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Mark Attendance Error:", error.response?.data || error.message);
    return {
      success: false, error: error.response?.data?.message || error.message || "Failed to mark attendance",
    };
  }
};


export const getMonthlyAttendance = async () => {
  try {
    const res = await api.get("/attendance/monthly");
    return { success: true, data: res.data };
  } catch (error) {
    console.error("fetch monthly attendance error:", error.response?.data || error.message);
    return {
      success: false, error: error.response?.data?.message || error.message || "Failed to fetch monthly attendance",
    };
  }
};

// Get user Details
export const getuserProfile = async () => {
  try {
    const res = await api.get("/user/me");
    console.log(res)
    return { success: true, data: res.data };
  } catch (error) {
    console.error("ftech user data error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || error.message || "failed to fetch user " }
  };
};


// ADD error checking here in all the api






