import express from "express";
import {
  punchIn,
  punchOut,
  getTodayAttendance,
  getAttendanceHistory,
} from "../controllers/attendance.controller.js";
const router = express.Router();

router.post("/punch-in", punchIn);
router.post("/punch-out", punchOut);
router.get("/today", getTodayAttendance);
router.get("/history", getAttendanceHistory);

export default router;