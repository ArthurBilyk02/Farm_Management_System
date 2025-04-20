import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { fetchHerds, createHerd, updateHerd, deleteHerd } from "../services/api";
import HerdForm from "../components/HerdForm";
import ConfirmModal from "../components/layout/ConfirmModal";

const Herds = () => {
    const { user } = useAuth();
    const [herds, setHerds] = useState([]);
    const [editingHerd, setEditingHerd] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [herdToDelete, setHerdToDelete] = useState(null);
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [pendingEditData, setPendingEditData] = useState(null);

    const confirmDelete = (herdId) => {
        setHerdToDelete(herdId);
        setShowConfirm(true);
    };
    
    const handleConfirmDelete = () => {
        handleDelete(herdToDelete);
        setShowConfirm(false);
    };

    const loadHerds = useCallback(async () => {
        try {
            const data = await fetchHerds(user.token);
            setHerds(data);
        } catch (err) {
            console.error("Failed to load herds:", err);
        }
    }, [user.token]);

    const handleCreate = async (herdData) => {
        try {
            await createHerd(herdData, user.token);
            await loadHerds();
            setShowForm(false);
        } catch (err) {
            console.error("Error creating herd:", err);
        }
    };

    const handleEdit = (herd) => {
        setEditingHerd(herd);
        setShowForm(true);
    };

    const handleUpdate = async (herdId, updatedData) => {
        try {
            await updateHerd(herdId, updatedData, user.token);
            await loadHerds();
            setShowForm(false);
            setEditingHerd(null);
        } catch (err) {
            setError("Failed to update herd.");
            console.error(err);
        }
    };

    const handleDelete = async (herdId) => {
        try {
            await deleteHerd(herdId, user.token);
            await loadHerds();
        } catch (err) {
            setError("Failed to delete herd.");
            console.error("Failed to delete herd.");
        }
    };
    

    useEffect(() => {
        if (user?.token) loadHerds();
    }, [user, loadHerds]);

    return (
        <div>
            <h2>Herds</h2>
    
            <button onClick={() => { setEditingHerd(null); setShowForm(true); }}>
                Add New Herd
            </button>
    
            {showForm && (
                <HerdForm
                    onSubmit={(data) => {
                        if (editingHerd) {
                            setPendingEditData({ herdId: editingHerd.herd_id, data });
                            setConfirmEdit(true);
                        } else {
                            handleCreate(data);
                        }
                    }}
                    herd={editingHerd}
                    isEditing={!!editingHerd}
                    isAdmin={user.role_name === "admin"}
                    farmIdFromUser={user.farm_id}
                />
            )}

    	    {error && <p style={{ color: "red" }}>{error}</p>}
    
            <ul>
                {herds.map(h => (
                    <li key={h.herd_id}>
                        <strong>{h.herd_name}</strong> — {h.health_status}
                        <button onClick={() => confirmDelete(h.herd_id)}>Delete</button>
                        <button onClick={() => handleEdit(h)}>Edit</button>
                    </li>
                ))}
            </ul>
    
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this herd?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {confirmEdit && (
                <ConfirmModal
                    message="Are you sure you want to update this herd?"
                    onConfirm={() => {
                        handleUpdate(pendingEditData.herdId, pendingEditData.data);
                        setConfirmEdit(false);
                        setPendingEditData(null);
                    }}
                    onCancel={() => {
                        setConfirmEdit(false);
                        setPendingEditData(null);
                    }}
                />
            )}
        </div>
    );
};

export default Herds;