function AuthLayout({ title, children }) {
  return (
    <div
      className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light"
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "15px",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">
            Mini HCM
          </h2>

          <p className="text-muted">
            {title}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;