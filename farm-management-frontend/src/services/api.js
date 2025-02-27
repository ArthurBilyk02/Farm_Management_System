import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1";

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

export const fetchHerds = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/herds`);
        return response.data;
    } catch (error) {
        console.error("Error fetching herds:", error);
        throw error;
    }
};
