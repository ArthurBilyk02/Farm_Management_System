import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Checking localStorage for token:", token); // ✅ Debugging
        if (token) {
            setUser({ token });
        }
    }, []);

    const login = (token) => {
        console.log("Logging in, storing token:", token); // ✅ Debugging
        localStorage.setItem("token", token);
        setUser({ token });
    };

    const logout = () => {
        console.log("Logging out, removing token"); // ✅ Debugging
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
