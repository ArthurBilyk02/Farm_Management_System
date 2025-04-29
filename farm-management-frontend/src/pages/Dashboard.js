import { useEffect, useState } from "react";
import { fetchUsers, fetchPerformanceMetrics, updateUserRole, deleteUser, registerUser, fetchFarms, fetchHerds } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import Modal from "../components/layout/Modal"; 
import RegisterForm from "../components/RegisterForm";
import "./Dashboard.css";
import { downloadCSV } from "../utils/utils";
import ConfirmModal from "../components/layout/ConfirmModal";
import "../App.css";

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedFarmId, setSelectedFarmId] = useState("");
    const [farms, setFarms] = useState([]);
    const [herds, setHerds] = useState([]);
    const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

    useEffect(() => {
        const fetchHerdsData = async () => {
            try {
                const herdsData = await fetchHerds(user.token);
                setHerds(herdsData);
            } catch (err) {
                console.error("Error fetching herds:", err);
            }
        };

        if (user && user.role_name === "admin") {
            fetchHerdsData();
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || user.role_name !== "admin") {
                setError("Access denied. Admins only.");
                setLoading(false);
                return;
            }

            try {
                const userData = await fetchUsers(user.token);
                const metricsData = await fetchPerformanceMetrics(user.token);
                const farmsData = await fetchFarms(user.token);

                setUsers(userData);
                setMetrics(metricsData);
                setFarms(farmsData);
                setLoading(false);
            } catch (err) {
                console.error("Error loading dashboard:", err);
                setError("Failed to load dashboard data.");
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleRoleUpdate = async (id, newRole) => {
        try {
            await updateUserRole(id, newRole, user.token);
            setUsers(users.map(u => u.employee_id === id ? { ...u, role_name: newRole } : u));
        } catch (err) {
            setError("Error updating role.");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id, user.token);
            setUsers(users.filter(u => u.employee_id !== id));
        } catch (err) {
            setError("Error deleting user.");
        }
    };

    const loadUsers = async () => {
        try {
            const userData = await fetchUsers(user.token);
            setUsers(userData);
        } catch (err) {
            setError("Failed to load users.");
        }
    };

    const handleRegisterUser = async (formData) => {
        try {
            await registerUser(formData, user.token);
            await loadUsers();
            setShowRegisterModal(false);
        } catch (err) {
            console.error("Failed to register user:", err);
            if (err.response && err.response.status === 409) {
                alert("A user with this email already exists.");
            } else {
                alert("Failed to register user. Please try again.");
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>

            {showRegisterModal && (
                <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
                    <RegisterForm
                        onRegister={handleRegisterUser}
                        onCancel={() => setShowRegisterModal(false)}
                    />
                </Modal>
            )}

            {confirmDeleteUserId && (
            <ConfirmModal
                message="Are you sure you want to delete this user?"
                onConfirm={async () => {
                await handleDeleteUser(confirmDeleteUserId);
                setConfirmDeleteUserId(null);
                }}
                onCancel={() => setConfirmDeleteUserId(null)}
            />
            )}

            <section>
                <h2>Farm Performance Metrics</h2>

                <div style={{ marginBottom: "10px" }}>
                    <label>Filter by Farm:</label>
                    <select
                        value={selectedFarmId}
                        onChange={(e) => setSelectedFarmId(e.target.value)}
                    >
                        <option value="">All Farms</option>
                        {farms.map((farm) => (
                            <option key={farm.farm_id} value={farm.farm_id}>
                                {farm.location}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => downloadCSV(metrics, "performance_metrics.csv")}>Download CSV</button>
                </div>

                <table className="table-spreadsheet">
                    <thead>
                        <tr>
                            <th>Herd Name</th>
                            <th>Metric Type</th>
                            <th>Value</th>
                            <th>Recorded At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics
                            .filter(metric => {
                                if (!selectedFarmId) return true;
                                const herd = herds.find(h => h.herd_id === metric.herd_id);
                                return herd && herd.farm_id === parseInt(selectedFarmId, 10);
                            })
                            .map((metric) => {
                                const herd = herds.find(h => h.herd_id === metric.herd_id);
                                return (
                                    <tr key={metric.metric_id}>
                                        <td>{herd ? herd.herd_name : "Unknown Herd"}</td>
                                        <td>{metric.metric_type}</td>
                                        <td>{metric.value}</td>
                                        <td>{new Date(metric.recorded_at).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </section>

            <section>
                <h2>Manage Users</h2>
                    <button onClick={() => setShowRegisterModal(true)} style={{ marginBottom: "10px" }}>
                    Register New User
                    </button>
                <table className="table-spreadsheet">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Farm</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.employee_id}>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role_name}
                                        onChange={(e) => handleRoleUpdate(user.employee_id, e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="employee">Employee</option>
                                        <option value="public">Public</option>
                                    </select>
                                </td>
                                <td>
                                    {farms.find(farm => farm.farm_id === user.farm_id)?.location || "Unknown Farm"}
                                </td>
                                <td>
                                    <span 
                                        onClick={() => setConfirmDeleteUserId(user.employee_id)}
                                        className="delete-emoji"
                                        title="Delete User"
                                        >
                                        ❌
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Dashboard;