import { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("AuthContext Loaded - Token:", token);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded Token:", decoded); 
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
                setUser(null);
            }
        }
    }, []);

    const login = (token, role_name, farm_id) => {
        console.log("Logging in, storing token:", token); 
        localStorage.setItem("token", token);
        localStorage.setItem("role_name", role_name);
        localStorage.setItem("farm_id", farm_id);
    
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);  
            setUser({ token, role_name, farm_id });
        } catch (error) {
            console.error("Error decoding token:", error);
            setUser(null);
        }
    };

    const logout = () => {
        console.log("Logging out, removing token");
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
