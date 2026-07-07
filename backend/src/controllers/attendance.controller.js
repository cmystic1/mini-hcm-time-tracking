import {
  punchInService,
  punchOutService,
  getTodayAttendanceService,
  getAttendanceHistoryService,
} from "../services/attendance.service.js";

export const punchIn = async (req, res) => {
  try {
    const { userId } = req.body;

    await punchInService(userId);

    res.status(201).json({
      success: true,
      message: "Punch In Successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const punchOut = async (req, res) => {
  try {
    const { userId } = req.body;

    const summary = await punchOutService(userId);

    res.json({
      success: true,
      message: "Punch Out Successful",
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const { userId } = req.query;

    const attendance = await getTodayAttendanceService(userId);

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const history = await getAttendanceHistoryService(userId);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};