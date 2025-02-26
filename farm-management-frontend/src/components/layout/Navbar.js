import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Animal Management</h1>
            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/farms">Farms</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
