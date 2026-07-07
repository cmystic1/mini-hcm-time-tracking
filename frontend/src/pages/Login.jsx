import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

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

            localStorage.setItem("userId", userCredential.user.uid);

            toast.success("Logged in Successfully");

            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <div className="container mt-5">

            <h2>Login</h2>

            <form onSubmit={login}>

                <input
                    className="form-control mb-3"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-primary">
                    Login
                </button>

            </form>

            <br />

            <Link to="/register">
                Create Account
            </Link>

        </div>
    );
}

export default Login;