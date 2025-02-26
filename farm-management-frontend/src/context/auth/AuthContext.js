import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/auth/login", { email, password });
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, login }}>
            {children}
        </AuthContext.Provider>
    );
};
