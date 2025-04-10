import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role_name = localStorage.getItem("role_name");
        const farm_id = localStorage.getItem("farm_id");

        console.log("AuthContext Loaded - Token:", token, "Role:", role_name, "Farm ID:", farm_id);

        if (token && role_name) {
            setUser({ token, role_name, farm_id });
        }

        setLoading(false);
    }, []);

    const login = (token, role_name, farm_id) => {
        console.log("Logging in - Storing:", token, role_name, farm_id);
        localStorage.setItem("token", token);
        localStorage.setItem("role_name", role_name);
        localStorage.setItem("farm_id", farm_id);
        setUser({ token, role_name, farm_id });
    };

    const logout = () => {
        console.log("Logging out - Removing user data");
        localStorage.removeItem("token");
        localStorage.removeItem("role_name");
        localStorage.removeItem("farm_id");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
