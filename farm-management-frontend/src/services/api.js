import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1";

export const fetchFarms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/farms`);
        return response.data;
    } catch (error) {
        console.error("Error fetching farms:", error);
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
