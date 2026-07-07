import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            let profile = {};
            try {
                const profileRes = await api.get(`/auth/profile?userId=${userCredential.user.uid}`);
                profile = profileRes.data?.data || {};
            } catch (profileError) {
                console.warn("Profile lookup failed, continuing with defaults.", profileError);
            }

            localStorage.setItem("userId", userCredential.user.uid);
            localStorage.setItem("userRole", profile.role || "employee");
            localStorage.setItem("userName", profile.name || userCredential.user.email || "User");

            toast.success("Logged in Successfully");

            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <AuthLayout title="Employee Login">

            <form onSubmit={login}>

                <div className="mb-3">

                    <label className="form-label">
                        Email
                    </label>

                    <input
                        className="form-control"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </div>

                <button
                    className="btn btn-primary w-100"
                >
                    Login
                </button>

            </form>

            <div className="text-center mt-4">

                <small>
                    Don't have an account?
                </small>

                <br />

                <Link to="/register">
                    Create Account
                </Link>

            </div>

        </AuthLayout>
    );
}

export default Login;