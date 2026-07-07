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
  getAdminAttendance,
  getAdminReports,
  updateAttendance,
} from "../services/attendanceService";
import api from "../services/api";

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
  const [adminRecords, setAdminRecords] = useState([]);
  const [adminReports, setAdminReports] = useState([]);
  const [reportRange, setReportRange] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [editValues, setEditValues] = useState({ timeIn: "", timeOut: "" });

  const hasPunchedIn = !!today?.timeIn;
  const hasPunchedOut = !!today?.timeOut;
  const [isAdmin, setIsAdmin] = useState(false);

  const filteredAdminRecords = adminRecords.filter((item) => {
    const query = searchTerm.toLowerCase();
    return !query || [item.userName, item.userId, item.email].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
  });

  const filteredAdminReports = adminReports.filter((item) => {
    const query = searchTerm.toLowerCase();
    return !query || [item.userName, item.userId, item.email].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
  });

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    // fetch profile from backend to reliably determine admin status
    (async () => {
      try {
        const profileRes = await api.get(`/auth/profile`, { params: { userId } });
        const role = profileRes.data?.data?.role;
        setIsAdmin(role === "admin");
        if (role) localStorage.setItem("userRole", role);
      } catch (err) {
        setIsAdmin(false);
      }

      // load dashboard data after role is determined
      await loadData(role === "admin");
    })();
  }, []);

  const loadData = async (includeAdmin = isAdmin) => {
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

    if (includeAdmin) {
      try {
        const adminRes = await getAdminAttendance(userId);
        setAdminRecords(adminRes.data.data || []);
      } catch (error) {
        setAdminRecords([]);
      }

      try {
        const reportsRes = await getAdminReports(userId, reportRange, reportDate);
        setAdminReports(reportsRes.data.data || []);
      } catch (error) {
        setAdminReports([]);
      }
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

  const handleReportChange = async (range, date) => {
    setReportRange(range);
    setReportDate(date);

    if (!isAdmin) return;

    try {
      const reportsRes = await getAdminReports(userId, range, date);
      setAdminReports(reportsRes.data.data || []);
    } catch (error) {
      setAdminReports([]);
    }
  };

  const startEdit = (item) => {
    setEditingAttendanceId(item.id || item.date);
    setEditValues({
      timeIn: item.timeIn ? new Date(item.timeIn._seconds ? item.timeIn._seconds * 1000 : item.timeIn).toISOString().slice(0, 16) : "",
      timeOut: item.timeOut ? new Date(item.timeOut._seconds ? item.timeOut._seconds * 1000 : item.timeOut).toISOString().slice(0, 16) : "",
    });
  };

  const cancelEdit = () => {
    setEditingAttendanceId(null);
    setEditValues({ timeIn: "", timeOut: "" });
  };

  const saveEdit = async (attendanceId) => {
    try {
      await updateAttendance(userId, attendanceId, {
        timeIn: editValues.timeIn ? new Date(editValues.timeIn).toISOString() : null,
        timeOut: editValues.timeOut ? new Date(editValues.timeOut).toISOString() : null,
      });

      toast.success("Attendance updated successfully.");
      cancelEdit();
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

      {isAdmin && (
        <div className="mt-5">
          <h4 className="mb-3">Admin Attendance Overview</h4>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or user ID"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{ maxWidth: "320px" }}
            />
            <button className={`btn ${reportRange === "daily" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleReportChange("daily", reportDate)}>
              Daily Report
            </button>
            <button className={`btn ${reportRange === "weekly" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleReportChange("weekly", reportDate)}>
              Weekly Report
            </button>
            <input
              type="date"
              className="form-control"
              style={{ maxWidth: "220px" }}
              value={reportDate}
              onChange={(event) => handleReportChange(reportRange, event.target.value)}
            />
          </div>

          <div className="table-responsive mb-4">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Regular</th>
                  <th>OT</th>
                  <th>ND</th>
                  <th>Late</th>
                  <th>Undertime</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminReports.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No admin reports available.</td></tr>
                ) : (
                  filteredAdminReports.map((item) => (
                    <tr key={item.id || item.date}>
                      <td>{item.userName || item.userId}</td>
                      <td>{item.date}</td>
                      <td>{item.regularHours?.toFixed(2) ?? "0.00"} hrs</td>
                      <td>{item.overtimeHours?.toFixed(2) ?? "0.00"} hrs</td>
                      <td>{item.nightDifferentialHours?.toFixed(2) ?? "0.00"} hrs</td>
                      <td>{item.lateMinutes?.toFixed(0) ?? "0"} mins</td>
                      <td>{item.undertimeMinutes?.toFixed(0) ?? "0"} mins</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h5 className="mb-3">All Punch Records</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-secondary">
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminRecords.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No attendance records available.</td></tr>
                ) : (
                  filteredAdminRecords.map((item) => (
                    <tr key={item.id || item.date}>
                      <td>{item.userName || item.userId}</td>
                      <td>{item.date}</td>
                      <td>{editingAttendanceId === (item.id || item.date) ? <input type="datetime-local" className="form-control form-control-sm" value={editValues.timeIn} onChange={(event) => setEditValues({ ...editValues, timeIn: event.target.value })} /> : formatTimestamp(item.timeIn)}</td>
                      <td>{editingAttendanceId === (item.id || item.date) ? <input type="datetime-local" className="form-control form-control-sm" value={editValues.timeOut} onChange={(event) => setEditValues({ ...editValues, timeOut: event.target.value })} /> : formatTimestamp(item.timeOut)}</td>
                      <td>
                        {editingAttendanceId === (item.id || item.date) ? (
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-success" onClick={() => saveEdit(item.id)}>Save</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
                          </div>
                        ) : (
                          <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(item)}>Edit</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AttendanceHistory history={history} />
      <hr />

      <div className="text-center text-muted mt-4 mb-2">
        Mini HCM Time Tracking System © 2026
      </div>
    </div>
  );
}

export default Dashboard;