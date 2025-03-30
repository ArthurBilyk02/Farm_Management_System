import { useEffect, useState } from "react";
import { fetchUsers, fetchPerformanceMetrics, updateUserRole, deleteUser } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || user.role_name !== "admin") {
            setError("Access denied. Admins only.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const userData = await fetchUsers(user.token);
                const metricsData = await fetchPerformanceMetrics(user.token);
                setUsers(userData);
                setMetrics(metricsData);
                setLoading(false);
            } catch (err) {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>

            <section>
                <h2>Farm Performance Metrics</h2>
                <ul>
                    {metrics.map((metric) => (
                        <li key={metric.metric_id}>
                            {metric.metric_type}: {metric.value}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Manage Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Farm ID</th>
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
                                <td>{user.farm_id}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.employee_id)}>Delete</button>
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