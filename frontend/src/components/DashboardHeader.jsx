function DashboardHeader({ logout }) {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

      <div>
        <h2 className="fw-bold text-primary mb-1">
          Mini HCM Time Tracking
        </h2>

        <p className="text-muted mb-0">
          Employee Dashboard
        </p>
      </div>

      <button
        className="btn btn-outline-danger mt-3 mt-md-0"
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
}

export default DashboardHeader;