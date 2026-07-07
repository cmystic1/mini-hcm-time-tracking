import { formatTimestamp } from "../utils/dateFormatter";

function AttendanceHistory({ history }) {
    return (
        <>
            <h4 className="mt-5 mb-3">
                Attendance History
            </h4>

            <div className="table-responsive">

                <table className="table table-striped table-bordered table-hover align-middle">
                    <thead className="table-primary">

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
                                <td
                                    colSpan="6"
                                    className="text-center"
                                >
                                    No attendance history found.
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.date}>
                                    <td>{item.date}</td>

                                    <td>{formatTimestamp(item.timeIn)}</td>

                                    <td>{formatTimestamp(item.timeOut)}</td>

                                    <td>
                                        {item.lateMinutes?.toFixed(0) ?? "0"} mins
                                    </td>

                                    <td>
                                        {item.regularHours?.toFixed(2) ?? "0.00"} hrs
                                    </td>

                                    <td>
                                        {item.overtimeHours?.toFixed(2) ?? "0.00"} hrs
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>
        </>
    );
}

export default AttendanceHistory;