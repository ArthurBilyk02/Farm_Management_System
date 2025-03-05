import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

const ProtectedRoutes = ({ requiredRole }) => {
    const { user } = useAuth();

    console.log("ProtectedRoutes - Full User Object:", user);
    console.log("ProtectedRoutes - requiredRole:", requiredRole); 

    if (!user) {
        console.log("No user found. Redirecting to login...");
        return <Navigate to="/login" />;
    }

    if (requiredRole && (!user.role_name || user.role_name !== requiredRole)) {
        console.log(`User role mismatch: Required ${requiredRole}, Found ${user.role_name || "undefined"}. Redirecting to home...`);
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
