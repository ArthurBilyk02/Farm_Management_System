import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
    const { user } = useAuth();

    return (
        <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
            <ul>
                {/*Dashboard and Farm List if admin */}
                {user?.role_name === "admin" && (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/farms">Farm List</Link></li>
                    </>
                )}

                {/* Shared access */}
                <li><Link to="/farm">Farm</Link></li>
                <li><Link to="/herds">Herds</Link></li>
                <li><Link to="/animals">Animals</Link></li>
                <li><Link to="/feeding">Feeding</Link></li>

                {/* Only show Transactions if admin */}
                {user?.role_name === "admin" && (
                    <li><Link to="/transactions">Transactions</Link></li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
