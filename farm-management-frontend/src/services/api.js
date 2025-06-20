import axios from "axios";

const API_BASE_URL = "/api/v1";

console.log("API Base URL:", API_BASE_URL);

// Fetch all farms
export const fetchFarms = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/farm`, {
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

// Create a new farm
export const createFarm = async (farmData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/farm`, farmData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating farm:", error);
        throw error;
    }
};

// Update an existing farm
export const updateFarm = async (farmId, farmData, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/farm/${farmId}`, farmData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating farm:", error);
        throw error;
    }
};

// Delete a farm
export const deleteFarm = async (farmId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/farm/${farmId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting farm:", error);
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

// Register User
export async function registerUser(userData, token) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

//Herd Functions

// Fetch all herds
export const fetchHerds = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/herd`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching herds:", error);
        throw error;
    }
};

// Fetch a single herd by ID
export const fetchHerdById = async (id, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/herd/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching herd ${id}:`, error);
        throw error;
    }
};

export const fetchHerdsByFarm = async (token, farmId) => {
    const response = await fetch(`${API_BASE_URL}/herd/by-farm/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch herds by farm");
    return await response.json();
};

// Create a new herd
export const createHerd = async (herdData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/herd`, herdData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating herd:", error);
        throw error;
    }
};

// Update an existing herd
export const updateHerd = async (id, herdData, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/herd/${id}`, herdData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating herd ${id}:`, error);
        throw error;
    }
};

// Delete a herd
export const deleteHerd = async (id, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/herd/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting herd ${id}:`, error);
        throw error;
    }
};

// Fetch all animals
export const fetchAnimals = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/animals`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching animals:", error);
        throw error;
    }
};

// Create a new animal
export const createAnimal = async (animalData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/animals`, animalData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating animal:", error);
        throw error;
    }
};

// Update an existing animal
export const updateAnimal = async (id, animalData, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/animals/${id}`, animalData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating animal:", error);
        throw error;
    }
};

// Delete an animal
export const deleteAnimal = async (id, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/animals/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting animal:", error);
        throw error;
    }
};

export const fetchSpecies = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/species`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching species:", error);
        throw error;
    }
};

// Feeding Types

export const fetchFeedings = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/feeding-type`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const createFeeding = async (data, token) => {
    const res = await axios.post(`${API_BASE_URL}/feeding-type`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const updateFeeding = async (id, data, token) => {
    const res = await axios.put(`${API_BASE_URL}/feeding-type/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const deleteFeeding = async (id, token) => {
    const res = await axios.delete(`${API_BASE_URL}/feeding-type/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Feeding Schedules

export const fetchSchedules = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/feeding-schedule`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const fetchSchedulesByFarm = async (token, farmId) => {
    const response = await fetch(`${API_BASE_URL}/feeding-schedule/by-farm/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch filtered schedules");
    return await response.json();
};

export const createSchedule = async (scheduleData, token) => {
    const res = await axios.post(`${API_BASE_URL}/feeding-schedule`, scheduleData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  export async function deleteSchedule(scheduleId, token) {
    const response = await axios.delete(`${API_BASE_URL}/feeding-schedule/${scheduleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  // Transactions
export const fetchTransactions = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const createTransaction = async (transactionData, token) => {
    const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const updateTransaction = async (transactionId, transactionData, token) => {
    const response = await axios.put(`${API_BASE_URL}/transactions/${transactionId}`, transactionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const deleteTransaction = async (transactionId, token) => {
    const response = await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  // Products
  export const fetchProducts = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/product-stock`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  export const createProduct = async (productData, token) => {
    const res = await axios.post(`${API_BASE_URL}/product-stock`, productData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  export const deleteProduct = async (productId, token) => {
    const res = await axios.delete(`${API_BASE_URL}/product-stock/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };