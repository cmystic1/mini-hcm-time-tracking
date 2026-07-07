import api from "./api";

export const punchIn = (userId) =>
  api.post("/attendance/punch-in", { userId });

export const punchOut = (userId) =>
  api.post("/attendance/punch-out", { userId });

export const getToday = (userId) =>
  api.get(`/attendance/today?userId=${userId}`);

export const getHistory = (userId) =>
  api.get(`/attendance/history?userId=${userId}`);