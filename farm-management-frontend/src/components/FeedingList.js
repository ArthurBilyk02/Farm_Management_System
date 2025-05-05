import { useEffect, useState } from "react";
import { createFeeding, updateFeeding, fetchFeedings, deleteFeeding } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import FeedingForm from "./FeedingForm";
import ConfirmModal from "./layout/ConfirmModal";
import "../App.css";
import { downloadCSV } from "../utils/utils";

const FeedingList = () => {
    const { user } = useAuth();
    const [feedings, setFeedings] = useState([]);
    const [selectedFeeding, setSelectedFeeding] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [feedingToDelete, setFeedingToDelete] = useState(null);
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [pendingEditData, setPendingEditData] = useState(null);
  
    useEffect(() => {
      const loadFeedings = async () => {
        try {
          const data = await fetchFeedings(user.token);
          setFeedings(data);
        } catch (err) {
          console.error("Failed to fetch feedings:", err);
          setError("Failed to load feedings.");
        }
      };
      if (user?.token) loadFeedings();
    }, [user]);
  
    const handleCreate = () => {
      setSelectedFeeding(null);
      setShowForm(true);
    };
  
    const handleEdit = (feeding) => {
      setSelectedFeeding(feeding);
      setShowForm(true);
    };
  
    const handleDelete = (feedingId) => {
      setFeedingToDelete(feedingId);
      setShowConfirm(true);
    };
  
    const confirmDelete = async () => {
      try {
        await deleteFeeding(feedingToDelete, user.token);
        setFeedings(feedings.filter((f) => f.feeding_type_id !== feedingToDelete));
      } catch (err) {
        setError("Failed to delete feeding.");
      } finally {
        setShowConfirm(false);
        setFeedingToDelete(null);
      }
    };
  
    const handleFormSubmit = (formData) => {
      if (selectedFeeding) {
        setPendingEditData({ id: selectedFeeding.feeding_type_id, data: formData });
        setConfirmEdit(true);
      } else {
        createFeeding(formData, user.token)
          .then(async () => {
            const refreshed = await fetchFeedings(user.token);
            setFeedings(refreshed);
            setShowForm(false);
            setSelectedFeeding(null);
          })
          .catch((err) => {
            console.error("Failed to create feeding:", err);
            setError("Failed to create feeding.");
          });
      }
    };
  
    const handleConfirmEdit = async () => {
      try {
        await updateFeeding(pendingEditData.id, pendingEditData.data, user.token);
        const refreshed = await fetchFeedings(user.token);
        setFeedings(refreshed);
        setShowForm(false);
        setSelectedFeeding(null);
      } catch (err) {
        console.error("Failed to update feeding:", err);
        setError("Failed to update feeding.");
      } finally {
        setConfirmEdit(false);
        setPendingEditData(null);
      }
    };
  
    if (error) return <p className="error">{error}</p>;
  
    return (
      <div className="table">
        <div>	
            <h2>Feeding</h2>
            {(user.role_name === "admin" || user.role_name === "employee") && (
              <div className="add-button-container">  
                <button onClick={handleCreate} className="add-btn">
                    ➕ Add New Feeding Type
                </button>
              </div>
            )}
        </div>	

        {showForm && (
          <FeedingForm
            feeding={selectedFeeding}
            onSubmit={handleFormSubmit}
            isEditing={!!selectedFeeding}
            token={user.token}
            isAdmin={user.role_name === "admin"}
            onCancel={() => setShowForm(false)}
          />
        )}

        <button onClick={() => downloadCSV(feedings, "feeding.csv")}>Download CSV</button>
        <table className="table-spreadsheet">
            <thead>
                <tr>
                <th>Food Type</th>
                <th>Schedule</th>
                <th>Species</th>
                <th>Description</th>
                {user.role_name === "admin" && <th>Farm Location</th>}
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {feedings.map((f) => (
                <tr key={f.feeding_type_id}>
                    <td>{f.food_type}</td>
                    <td>{f.schedule_food_type} - {f.schedule_feeding_interval}</td>
                    <td>{f.species_name}</td>
                    <td>{f.description}</td>
                    {user.role_name === "admin" && <td>{f.farm_location}</td>}
                    <td>
                      {(user.role_name === "admin" || user.role_name === "employee") && (
                        <>
                          <span onClick={() => handleEdit(f)}
                            className="edit-emoji"
                            title="Edit Herd"
                            >
                            ✏️
                          </span>
                          <span 
                            onClick={() => handleDelete(f.feeding_type_id)}
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
            message="Are you sure you want to delete this feeding type?"
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowConfirm(false);
              setFeedingToDelete(null);
            }}
          />
        )}
  
        {confirmEdit && (
          <ConfirmModal
            message="Are you sure you want to update this feeding type?"
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
  
  export default FeedingList;