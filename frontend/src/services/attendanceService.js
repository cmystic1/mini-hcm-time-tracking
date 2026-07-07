import api from "./api";

export const punchIn = (userId) =>
  api.post("/attendance/punch-in", { userId });

export const punchOut = (userId) =>
  api.post("/attendance/punch-out", { userId });

export const getToday = (userId) =>
  api.get(`/attendance/today?userId=${userId}`);

export const getHistory = (userId) =>
  api.get(`/attendance/history?userId=${userId}`);

export const getAdminAttendance = (userId) =>
  api.get(`/attendance/admin`, { params: { userId } });

export const updateAttendance = (userId, attendanceId, updates) =>
  api.patch(`/attendance/admin/${attendanceId}`, { userId, updates });

export const getAdminReports = (userId, range = "daily", date) =>
  api.get(`/attendance/reports`, { params: { userId, range, date } });