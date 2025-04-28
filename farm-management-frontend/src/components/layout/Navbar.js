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
            {user && (
                <button className="user-info" disabled>
                    <span className="user-icon">
                        👤
                    </span> {user.role_name}
                </button>
            )}
                {user ? (

                <button onClick={handleLogout}>Logout</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;