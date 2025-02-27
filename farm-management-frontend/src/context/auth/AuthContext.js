import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedFarmId = localStorage.getItem("farm_id");
        console.log("Loading from storage:", { token, storedFarmId });

        if (token && storedFarmId) {
            setUser({ token, farm_id: Number(storedFarmId) });
        }
    }, []);

    const login = (token, farm_id) => {
        console.log("Logging in, storing:", { token, farm_id });
        localStorage.setItem("token", token);
        localStorage.setItem("farm_id", farm_id);
        setUser({ token, farm_id: Number(farm_id) });
    };

    const logout = () => {
        console.log("Logging out, clearing storage");
        localStorage.removeItem("token");
        localStorage.removeItem("farm_id");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
