import { useEffect, useState } from "react";
import { fetchHerds, deleteHerd } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import HerdForm from "./HerdForm";

const HerdList = () => {
    const { user } = useAuth();
    const [herds, setHerds] = useState([]);
    const [selectedHerd, setSelectedHerd] = useState(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const loadHerds = async () => {
            try {
                const allHerds = await fetchHerds(user.token);
                const farmHerds = allHerds.filter((herd) => herd.farm_id === user.farm_id);
                setHerds(farmHerds);
            } catch (err) {
                setError("Failed to load herds");
                console.error(err);
            }
        };

        loadHerds();
    }, [user]);

    const handleEdit = (herd) => {
        setSelectedHerd(herd);
        setShowForm(true);
    };

    const handleDelete = async (herdId) => {
        if (window.confirm("Are you sure you want to delete this herd?")) {
            try {
                await deleteHerd(herdId, user.token);
                setHerds(herds.filter((h) => h.herd_id !== herdId));
            } catch (err) {
                setError("Failed to delete herd");
            }
        }
    };

    const handleCreate = () => {
        setSelectedHerd(null);
        setShowForm(true);
    };

    const handleFormSubmit = (newOrUpdatedHerd) => {
        setShowForm(false);
        setSelectedHerd(null);
        window.location.reload();
    };

    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <h2>Herds</h2>

            <button onClick={handleCreate}>Add New Herd</button>

            {showForm && (
                <HerdForm
                    herd={selectedHerd}
                    onSubmit={handleFormSubmit}
                    token={user.token}
                    userFarmId={user.farm_id}
                />
            )}

            <table>
                <thead>
                    <tr>
                        <th>Herd Name</th>
                        <th>Species ID</th>
                        <th>Size</th>
                        <th>Health Status</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {herds.map((herd) => (
                        <tr key={herd.herd_id}>
                            <td>{herd.herd_name}</td>
                            <td>{herd.species_id}</td>
                            <td>{herd.size}</td>
                            <td>{herd.health_status}</td>
                            <td>{herd.description}</td>
                            <td>
                                <button onClick={() => handleEdit(herd)}>Edit</button>
                                <button onClick={() => handleDelete(herd.herd_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HerdList;