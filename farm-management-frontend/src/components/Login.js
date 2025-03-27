import { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://34.252.162.231/api/v1";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
	    console.log("🔄 Sending request to:", `${API_BASE_URL}/auth/login`);
    	    console.log("📧 Email:", email);
    	    console.log("🔑 Password:", password);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

	    const text = await response.text();
	    console.log("📥 Raw Response:", text);

            const data = JSON.parse(text);
    	    console.log("✅ Parsed Response:", data);

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            console.log("Login Successful - Storing:", data);

            login(data.token, data.role_name, data.farm_id);

            // Redirect based on role
            if (data.role_name === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/farm");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
