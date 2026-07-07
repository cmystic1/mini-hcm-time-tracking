import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

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
      toast.error(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br />
        <br />

        <button type="submit">Register</button>
      </form>

      <br />

      <Link to="/">Already have an account?</Link>
    </div>
  );
}

export default Register;