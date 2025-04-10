import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

const ProtectedRoutes = ({ requiredRole }) => {
    const { user, loading } = useAuth();

    console.log("ProtectedRoutes - Full User Object:", user);
    console.log("ProtectedRoutes - requiredRole:", requiredRole);

    if (loading) return <p>Loading authentication...</p>;

    if (!user) {
        console.warn("No user found. Redirecting to login...");
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role_name !== requiredRole) {
        console.warn("Access denied. Redirecting...");
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;