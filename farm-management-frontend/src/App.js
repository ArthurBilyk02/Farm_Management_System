import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext"; // Ensure this is wrapped around Router
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Herds from "./pages/Herds";
import Animals from "./pages/Animals";
import Feeding from "./pages/Feeding";
import Transactions from "./pages/Transactions";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <div className="main-layout">
                        <Sidebar />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes for Logged-in Users */}
                            <Route element={<ProtectedRoutes />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/farms" element={<Farms />} />
                                <Route path="/herds" element={<Herds />} />
                                <Route path="/animals" element={<Animals />} />
                                <Route path="/feeding" element={<Feeding />} />
                                <Route path="/transactions" element={<Transactions />} />
                            </Route>
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
