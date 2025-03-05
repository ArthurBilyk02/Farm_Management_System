import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1";

// Fetch all farms
export const fetchFarms = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/farms`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch farms");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching farms:", error);
        throw error;
    }
};

// Fetch farm by ID
export const fetchFarm = async (farmId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/farm/${farmId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch farm with ID ${farmId}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching farm:", error);
        throw error;
    }
};

// Fetch farm performance metrics
export const fetchPerformanceMetrics = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/performance-metrics`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Returns performance metrics
    } catch (error) {
        console.error("Error fetching performance metrics:", error);
        throw error;
    }
};

// Fetch all users
export const fetchUsers = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Update user role
export const updateUserRole = async (employee_id, role_name, token) => {
    try {
        await axios.put(
            `${API_BASE_URL}/admin/edit-role/${employee_id}`,
            { role_name },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
};

// Delete user
export const deleteUser = async (employee_id, token) => {
    try {
        await axios.delete(`${API_BASE_URL}/admin/delete-user/${employee_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

