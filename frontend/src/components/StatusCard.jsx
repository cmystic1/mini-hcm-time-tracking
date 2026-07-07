function StatusCard({ today }) {

  let status = "Not yet punched in today.";
  let color = "secondary";

  if (today && !today.timeOut) {
    status = "Currently Working";
    color = "success";
  }

  if (today && today.timeOut) {
    status = "Shift Completed";
    color = "primary";
  }

  return (
    <div className={`alert alert-${color}`}>
      <strong>Status:</strong> {status}
    </div>
  );
}

export default StatusCard;