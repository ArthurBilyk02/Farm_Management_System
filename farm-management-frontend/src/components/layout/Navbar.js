import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1>Animal Management</h1>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    ☰
                </button>
            </div>

            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/farm">Farm</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;