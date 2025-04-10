import { useEffect, useState } from "react";
import { fetchFarms, createFarm, updateFarm, deleteFarm } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import FarmForm from "../components/FarmForm";

const FarmList = () => {
    const { user } = useAuth();
    const [farms, setFarms] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingFarm, setEditingFarm] = useState(null);

    useEffect(() => {
        const getFarms = async () => {
            try {
                const data = await fetchFarms(user.token);
                setFarms(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load farms.");
            }
        };

        if (user?.token) getFarms();
    }, [user]);

    const handleCreate = async (farmData) => {
        try {
            const newFarm = await createFarm(farmData, user.token);
            setFarms((prev) => [...prev, { ...farmData, farm_id: newFarm.farm_id }]);
            setShowForm(false);
        } catch (err) {
            console.error("Create failed:", err);
            setError("Failed to create farm.");
        }
    };

    const handleUpdate = async (farmData) => {
        try {
            await updateFarm(editingFarm.farm_id, farmData, user.token);
            setFarms((prev) =>
                prev.map((f) =>
                    f.farm_id === editingFarm.farm_id ? { ...f, ...farmData } : f
                )
            );
            setEditingFarm(null);
            setShowForm(false);
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update farm.");
        }
    };

    const handleDelete = async (farmId) => {
        try {
            await deleteFarm(farmId, user.token);
            setFarms((prev) => prev.filter((f) => f.farm_id !== farmId));
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete farm.");
        }
    };

    const handleEditClick = (farm) => {
        setEditingFarm(farm);
        setShowForm(true);
    };

    const handleFormSubmit = (formData) => {
        if (editingFarm) {
            handleUpdate(formData);
        } else {
            handleCreate(formData);
        }
    };

    return (
        <div>
            <h2>Farms</h2>
            {error && <p className="error">{error}</p>}

            <button onClick={() => {
                setEditingFarm(null);
                setShowForm((prev) => !prev);
            }}>
                {showForm ? "Cancel" : "Add Farm"}
            </button>

            {showForm && (
                <FarmForm
                    farm={editingFarm}
                    onSubmit={handleFormSubmit}
                    isEditing={!!editingFarm}
                />
            )}

            <ul>
                {farms.map((farm) => (
                    <li key={farm.farm_id}>
                        <strong>{farm.location}</strong> - Owner: {farm.owner}
                        <br />
                        <button onClick={() => handleEditClick(farm)}>Edit</button>
                        <button onClick={() => handleDelete(farm.farm_id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FarmList;
