import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Farm from "./pages/Farm";
import Herds from "./pages/Herds";
import Animals from "./pages/Animals";
import Feeding from "./pages/Feeding";
import Transactions from "./pages/Transactions";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";
import FarmList from "./components/FarmList";
import "./App.css";
import { useState } from "react";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <div className="main-layout">
                        <Sidebar isOpen={sidebarOpen} />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoutes />}>
                                <Route path="/farm" element={<Farm />} />
                                <Route path="/herds" element={<Herds />} />
                                <Route path="/animals" element={<Animals />} />
                                <Route path="/feeding" element={<Feeding />} />
                                <Route path="/transactions" element={<Transactions />} />
                                <Route path="/farm/:farmId" element={<Farm />} />
                            </Route>

                            {/* Admin-Only Routes */}
                            <Route element={<ProtectedRoutes requiredRole="admin" />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/farms" element={<FarmList />} />
                            </Route>
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
