import express from "express";
import {
  punchIn,
  punchOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAdminAttendance,
  updateAttendance,
  getAdminReports,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/punch-in", punchIn);
router.post("/punch-out", punchOut);
router.get("/today", getTodayAttendance);
router.get("/history", getAttendanceHistory);
router.get("/admin", getAdminAttendance);
router.patch("/admin/:attendanceId", updateAttendance);
router.get("/reports", getAdminReports);

export default router;