import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../firebase";
import { formatTimestamp } from "../utils/dateFormatter";

import {
  punchIn,
  punchOut,
  getToday,
  getHistory,
} from "../services/attendanceService";

import DashboardHeader from "../components/DashboardHeader";
import StatusCard from "../components/StatusCard";
import SummaryCards from "../components/SummaryCards";
import AttendanceHistory from "../components/AttendanceHistory";

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);

  const hasPunchedIn = !!today?.timeIn;
  const hasPunchedOut = !!today?.timeOut;

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const todayRes = await getToday(userId);
      setToday(todayRes.data.data);
    } catch (error) {
      setToday(null);
    }

    try {
      const historyRes = await getHistory(userId);
      setHistory(historyRes.data.data);
    } catch (error) {
      setHistory([]);
    }

    setLoading(false);
  };

  const handlePunchIn = async () => {
    try {
      await punchIn(userId);

      toast.success("Punch In Successful");

      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handlePunchOut = async () => {
    try {
      await punchOut(userId);

      toast.success("Punch Out Successful");

      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("userId");

      toast.success("Logged out successfully!");

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <DashboardHeader logout={logout} />

      <div className="d-flex flex-wrap gap-2 mb-4">

        <button
          className="btn btn-success"
          onClick={handlePunchIn}
          disabled={hasPunchedIn}
        >
          Punch In
        </button>

        <button
          className="btn btn-danger"
          onClick={handlePunchOut}
          disabled={!hasPunchedIn || hasPunchedOut}
        >
          Punch Out
        </button>

      </div>

      <StatusCard today={today} />

      <h4 className="mt-4 mb-3">
        Today's Attendance
      </h4>

      <SummaryCards
        today={today}
        formatTimestamp={formatTimestamp}
      />

      <AttendanceHistory history={history} />
      <hr />

      <div className="text-center text-muted mt-4 mb-2">
        Mini HCM Time Tracking System © 2026
      </div>
    </div>
  );
}

export default Dashboard;