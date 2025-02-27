import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/farm">Farm</Link></li>
                <li><Link to="/herds">Herds</Link></li>
                <li><Link to="/animals">Animals</Link></li>
                <li><Link to="/feeding">Feeding</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
