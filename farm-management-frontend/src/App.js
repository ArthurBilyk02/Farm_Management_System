import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Herds from "./pages/Herds";
import Animals from "./pages/Animals";
import Feeding from "./pages/Feeding";
import Transactions from "./pages/Transactions";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div className="main-layout">
                    <Sidebar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/farms" element={<Farms />} />
                        <Route path="/herds" element={<Herds />} />
                        <Route path="/animals" element={<Animals />} />
                        <Route path="/feeding" element={<Feeding />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
