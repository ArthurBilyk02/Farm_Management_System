import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { fetchFarms, createFarm, updateFarm, deleteFarm } from "../services/api";
import FarmForm from "../components/FarmForm";
import ConfirmModal from "../components/layout/ConfirmModal";

const FarmList = () => {
    const { user } = useAuth();
    const [farms, setFarms] = useState([]);
    const [editingFarm, setEditingFarm] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [farmToDelete, setFarmToDelete] = useState(null);

    const [showConfirmEdit, setShowConfirmEdit] = useState(false);
    const [pendingEditData, setPendingEditData] = useState(null);

    const loadFarms = useCallback(async () => {
        try {
            const data = await fetchFarms(user.token);
            setFarms(data);
        } catch (err) {
            console.error("Failed to load farms:", err);
        }
    }, [user.token]);

    useEffect(() => {
        if (user?.token) loadFarms();
    }, [user, loadFarms]);

    const handleCreate = async (farmData) => {
        try {
            await createFarm(farmData, user.token);
            await loadFarms();
            setShowForm(false);
        } catch (err) {
            console.error("Error creating farm:", err);
        }
    };

    const handleEdit = (farm) => {
        setEditingFarm(farm);
        setShowForm(true);
    };

    const confirmDelete = (farmId) => {
        setFarmToDelete(farmId);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteFarm(farmToDelete, user.token);
            await loadFarms();
            setShowConfirmDelete(false);
            setFarmToDelete(null);
        } catch (err) {
            console.error("Error deleting farm:", err);
        }
    };

    const handleEditSubmit = (data) => {
        if (editingFarm) {
            setPendingEditData({ farmId: editingFarm.farm_id, data });
            setShowConfirmEdit(true);
        } else {
            handleCreate(data);
        }
    };

    const handleConfirmEdit = async () => {
        try {
            const { farmId, data } = pendingEditData;
            await updateFarm(farmId, data, user.token);
            await loadFarms();
            setShowForm(false);
            setEditingFarm(null);
            setShowConfirmEdit(false);
            setPendingEditData(null);
        } catch (err) {
            console.error("Failed to update farm:", err);
        }
    };

    return (
        <div>
            <h2>Farm List</h2>
            <button onClick={() => { setEditingFarm(null); setShowForm(true); }}>
                Add New Farm
            </button>

            {showForm && (
                <FarmForm
                    onSubmit={handleEditSubmit}
                    farm={editingFarm}
                    isEditing={!!editingFarm}
                />
            )}

            <ul>
                {farms.map(farm => (
                    <li key={farm.farm_id}>
                        <strong>{farm.location}</strong> — Owner: {farm.owner}
                        <button onClick={() => confirmDelete(farm.farm_id)}>Delete</button>
                        <button onClick={() => handleEdit(farm)}>Edit</button>
                    </li>
                ))}
            </ul>

            {showConfirmDelete && (
                <ConfirmModal
                    message="Are you sure you want to delete this farm?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                />
            )}

            {showConfirmEdit && (
                <ConfirmModal
                    message="Are you sure you want to update this farm?"
                    onConfirm={handleConfirmEdit}
                    onCancel={() => {
                        setShowConfirmEdit(false);
                        setPendingEditData(null);
                    }}
                />
            )}
        </div>
    );
};

export default FarmList;