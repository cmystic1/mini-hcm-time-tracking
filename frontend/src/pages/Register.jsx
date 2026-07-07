import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      toast.success("Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create account."
      );
    }
  };

  return (
    <AuthLayout title="Create Employee Account">

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">
            First Name
          </label>

          <input
            className="form-control"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Last Name
          </label>

          <input
            className="form-control"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Email
          </label>

          <input
            className="form-control"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">
            Password
          </label>

          <input
            className="form-control"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-success w-100"
        >
          Register
        </button>

      </form>

      <div className="text-center mt-4">
        <small>
          Already have an account?
        </small>

        <br />

        <Link to="/">
          Login here
        </Link>
      </div>

    </AuthLayout>
  );
}

export default Register;