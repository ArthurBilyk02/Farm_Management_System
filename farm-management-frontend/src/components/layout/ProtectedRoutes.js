import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";  

const ProtectedRoutes = () => {
    const { user } = useAuth();

    console.log("ProtectedRoutes: user = ", user);

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
