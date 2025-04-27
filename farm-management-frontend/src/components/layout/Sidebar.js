import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/farm">Farm</Link></li>
                <li><Link to="/farms">Farm List</Link></li>
                <li><Link to="/herds">Herds</Link></li>
                <li><Link to="/animals">Animals</Link></li>
                <li><Link to="/feeding">Feeding</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
