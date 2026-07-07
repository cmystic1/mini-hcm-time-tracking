import { useEffect, useState } from "react";
import {
  punchIn,
  punchOut,
  getToday,
  getHistory,
} from "../services/attendanceService";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { formatTimestamp } from "../utils/dateFormatter";
import { toast } from "react-toastify";

function Dashboard() {
  const userId = localStorage.getItem("userId");

  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
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
  };

  const handlePunchIn = async () => {
    try {
      await punchIn(userId);

      toast.success("Punch In Successful");

      loadData();

    } catch (error) {

      toast.error(
        error.response?.data?.message || error.message
      );

    }
  };

  const handlePunchOut = async () => {
    try {

      await punchOut(userId);

      toast.success("Punch Out Successful");

      loadData();

    } catch (error) {

      toast.error(
        error.response?.data?.message || error.message
      );

    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("userId");
    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className="container mt-5">

      <button
        className="btn btn-secondary float-end"
        onClick={logout}
      >
        Logout
      </button>

      <h2>Mini HCM Dashboard</h2>

      <div className="mb-3">
        <button
          className="btn btn-success me-2"
          onClick={handlePunchIn}
        >
          Punch In
        </button>

        <button
          className="btn btn-danger"
          onClick={handlePunchOut}
        >
          Punch Out
        </button>
      </div>

      <hr />

      <h4>Today's Attendance</h4>

      {today ? (
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Time In</th>
              <td>{formatTimestamp(today.timeIn)}</td>
            </tr>

            <tr>
              <th>Time Out</th>
              <td>{formatTimestamp(today.timeOut)}</td>
            </tr>

            <tr>
              <th>Regular Hours</th>
              <td>{today.regularHours?.toFixed(2) ?? "0.00"} hrs</td>
            </tr>

            <tr>
              <th>Overtime</th>
              <td>{today.overtimeHours?.toFixed(2) ?? "0.00"} hrs</td>
            </tr>

            <tr>
              <th>Late</th>
              <td>{today.lateMinutes?.toFixed(0) ?? "0"} mins</td>
            </tr>

            <tr>
              <th>Undertime</th>
              <td>{today.undertimeMinutes?.toFixed(0) ?? "0"} mins</td>
            </tr>

            <tr>
              <th>Night Differential</th>
              <td>{today.nightDifferentialHours?.toFixed(2) ?? "0.00"} hrs</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No attendance record for today.</p>
      )}

      <hr />

      <h4>Attendance History</h4>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Late</th>
            <th>Regular</th>
            <th>OT</th>
          </tr>
        </thead>

        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No attendance records found.
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{formatTimestamp(item.timeIn)}</td>
                <td>{formatTimestamp(item.timeOut)}</td>
                <td>{item.lateMinutes?.toFixed(0) ?? "0"} mins</td>
                <td>{item.regularHours?.toFixed(2) ?? "0.00"} hrs</td>
                <td>{item.overtimeHours?.toFixed(2) ?? "0.00"} hrs</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default Dashboard;