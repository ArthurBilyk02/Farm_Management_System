import { useEffect, useState } from "react";
import { fetchHerds, fetchFarms, createHerd, updateHerd, deleteHerd, fetchSpecies } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import HerdForm from "./HerdForm";
import ConfirmModal from "./layout/ConfirmModal";
import { downloadCSV } from "../utils/utils";
import "../App.css";

const HerdList = () => {
  const { user } = useAuth();
  const [herds, setHerds] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedHerd, setSelectedHerd] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [herdToDelete, setHerdToDelete] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [pendingEditData, setPendingEditData] = useState(null);
  const [error, setError] = useState("");
  const [speciesOptions, setSpeciesOptions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const herdData = await fetchHerds(user.token);
        const farmData = await fetchFarms(user.token);
        const speciesData = await fetchSpecies(user.token);
        setFarms(farmData);
        setSpeciesOptions(speciesData);

        const filtered = user.role_name === "admin"
          ? herdData
          : herdData.filter((h) => h.farm_id === parseInt(user.farm_id));

        setHerds(filtered);
      } catch (err) {
        setError("Failed to load herds or farms");
        console.error(err);
      }
    };

    if (user?.token) loadData();
  }, [user]);

  const handleCreate = () => {
    setSelectedHerd(null);
    setShowForm(true);
  };

  const handleEdit = (herd) => {
    setSelectedHerd(herd);
    setShowForm(true);
  };

  const handleDelete = (herdId) => {
    setHerdToDelete(herdId);
    setShowConfirm(true);
  };

  const handleFormSubmit = async (herdData) => {
    if (selectedHerd) {
      setPendingEditData({ herdId: selectedHerd.herd_id, data: herdData });
      setConfirmEdit(true);
    } else {
      try {
        await createHerd(herdData, user.token);
        const refreshed = await fetchHerds(user.token);
        setHerds(user.role_name === "admin" ? refreshed : refreshed.filter(h => h.farm_id === parseInt(user.farm_id)));
        setShowForm(false);
      } catch (err) {
        console.error("Failed to create herd:", err);
        setError("Failed to create herd.");
      }
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await updateHerd(pendingEditData.herdId, pendingEditData.data, user.token);
      const refreshed = await fetchHerds(user.token);
      setHerds(user.role_name === "admin" ? refreshed : refreshed.filter(h => h.farm_id === parseInt(user.farm_id)));
      setShowForm(false);
      setSelectedHerd(null);
    } catch (err) {
      console.error("Failed to update herd:", err);
      setError("Failed to update herd.");
    } finally {
      setConfirmEdit(false);
      setPendingEditData(null);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteHerd(herdToDelete, user.token);
      setHerds((prev) => prev.filter((h) => h.herd_id !== herdToDelete));
    } catch (err) {
      setError("Failed to delete herd");
      console.error(err);
    } finally {
      setShowConfirm(false);
      setHerdToDelete(null);
    }
  };

  const getSpeciesName = (id) => {
    const match = speciesOptions.find((s) => s.species_id === id);
    return match ? match.species_name : "Unknown";
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="table">	
      <h2>Herds</h2>
      {(user.role_name === "admin" || user.role_name === "employee") && (
        <div className="add-button-container">  
          <button onClick={handleCreate} className="add-btn">
              ➕ Add New Herd
          </button>
        </div>
      )}

      {showForm && (
        <HerdForm
          herd={selectedHerd}
          onSubmit={handleFormSubmit}
          isEditing={!!selectedHerd}
          isAdmin={user.role_name === "admin"}
          farmIdFromUser={user.farm_id}
          onCancel={() => setShowForm(false)}
        />
      )}
      <button onClick={() => downloadCSV(herds, "herds.csv")}>Download CSV</button>
      <table className="table-spreadsheet">
        <thead>
          <tr>
            <th>Herd Name</th>
            <th>Species</th>
            <th>Size</th>
            <th>Feeding Schedule</th>
            <th>Health Status</th>
            <th>Description</th>
            {user.role_name === "admin" && <th>Farm Location</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {herds.map((herd) => (
            <tr key={herd.herd_id}>
              <td>{herd.herd_name}</td>
              <td>{getSpeciesName(herd.species_id)}</td>
              <td>{herd.size}</td>
              <td>
                {herd.food_type 
                  ? `${herd.food_type} - ${herd.feeding_interval}` 
                  : "No Schedule"}
              </td>
              <td>{herd.health_status}</td>
              <td>{herd.description}</td>
              {user.role_name === "admin" && (
                <td>
                  {farms.find((f) => f.farm_id === herd.farm_id)?.location || "Unknown"}
                </td>
              )}
              <td>
                {(user.role_name === "admin" || user.role_name === "employee") && (
                  <>
                    <span onClick={() => handleEdit(herd)}
                      className="edit-emoji"
                      title="Edit Herd"
                      >
                      ✏️
                    </span>
                    <span 
                      onClick={() => handleDelete(herd.herd_id)}
                      className="delete-emoji"
                      title="Delete Herd"
                      >
                      ❌
                    </span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this herd?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setHerdToDelete(null);
          }}
        />
      )}

      {confirmEdit && (
        <ConfirmModal
          message="Are you sure you want to update this herd?"
          onConfirm={handleConfirmEdit}
          onCancel={() => {
            setConfirmEdit(false);
            setPendingEditData(null);
          }}
        />
      )}
    </div>
  );
};

export default HerdList;