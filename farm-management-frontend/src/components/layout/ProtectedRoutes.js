import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

const ProtectedRoutes = () => {
    const { user } = useAuth();

    console.log("ProtectedRoutes: user =", user);

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
