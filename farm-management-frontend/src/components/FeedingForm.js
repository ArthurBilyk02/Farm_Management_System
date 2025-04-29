import { useState, useEffect, useCallback } from "react";
import { fetchSpecies, fetchSchedules, createSchedule, deleteSchedule } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import ScheduleForm from "./ScheduleForm";
import Modal from "./layout/Modal";
import ConfirmModal from "./layout/ConfirmModal";
import "./Form.css";

const FeedingForm = ({ onSubmit, onCancel, feeding = {}, isEditing }) => { // Added onCancel prop
  const { user } = useAuth();
  const [foodType, setFoodType] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [description, setDescription] = useState("");

  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const [showConfirmDeleteSchedule, setShowConfirmDeleteSchedule] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    if (feeding) {
      setFoodType(feeding.food_type || "");
      setScheduleId(feeding.schedule_id || "");
      setSpeciesId(feeding.species_id || "");
      setDescription(feeding.description || "");
    }
  }, [feeding]);

  const loadOptions = useCallback(async () => {
    try {
      const species = await fetchSpecies();
      const schedules = await fetchSchedules(user.token);
      setSpeciesOptions(species);
      setScheduleOptions(schedules);
    } catch (err) {
      console.error("Error loading dropdown options:", err);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) loadOptions();
  }, [user, loadOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      food_type: foodType,
      schedule_id: scheduleId,
      species_id: speciesId,
      description,
    });
  };

  const handleNewScheduleCreated = async (scheduleData) => {
    try {
      const newSchedule = await createSchedule(scheduleData, user.token);
      await loadOptions();
      setScheduleId(newSchedule.schedule_id);
      setShowScheduleForm(false);
    } catch (err) {
      console.error("Error creating new schedule:", err);
    }
  };

  const handleDeleteSchedule = () => {
    setScheduleToDelete(scheduleId);
    setShowConfirmDeleteSchedule(true);
  };

  const confirmDeleteSchedule = async () => {
    try {
      await deleteSchedule(scheduleToDelete, user.token);
      await loadOptions();
      setScheduleId("");
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    } finally {
      setShowConfirmDeleteSchedule(false);
      setScheduleToDelete(null);
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{isEditing ? "Edit Feeding Type" : "Add New Feeding Type"}</h3>

        <div>
          <label>Food Type:</label>
          <input
            type="text"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Schedule:</label>
          <select
            value={scheduleId}
            onChange={(e) => setScheduleId(e.target.value)}
            required
            disabled={scheduleOptions.length === 0}
          >
            <option value="">
              {scheduleOptions.length === 0 ? "No schedules available" : "-- Select Schedule --"}
            </option>
            {scheduleOptions.map((s) => (
              <option key={s.schedule_id} value={s.schedule_id}>
                {s.food_type} - {s.feeding_interval}
              </option>
            ))}
          </select>

          <div style={{ marginTop: "8px" }}>
            <button type="button" onClick={() => setShowScheduleForm(true)}>
              + Create New Schedule
            </button>
            {scheduleId && (
              <button
                type="button"
                style={{ marginLeft: "10px", color: "red" }}
                onClick={handleDeleteSchedule}
              >
                Delete Selected Schedule
              </button>
            )}
          </div>
        </div>

        <div>
          <label>Species:</label>
          <select
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value)}
            required
            disabled={speciesOptions.length === 0}
          >
            <option value="">
              {speciesOptions.length === 0 ? "No species available" : "-- Select Species --"}
            </option>
            {speciesOptions.map((s) => (
              <option key={s.species_id} value={s.species_id}>
                {s.species_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit">{isEditing ? "Update" : "Create"}</button>
          <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </form>

      {showScheduleForm && (
        <Modal isOpen={showScheduleForm} onClose={() => setShowScheduleForm(false)}>
          <ScheduleForm
            onSubmit={handleNewScheduleCreated}
            onCancel={() => setShowScheduleForm(false)}
          />
        </Modal>
      )}

      {showConfirmDeleteSchedule && (
        <ConfirmModal
          message="Are you sure you want to delete this schedule?"
          onConfirm={confirmDeleteSchedule}
          onCancel={() => {
            setShowConfirmDeleteSchedule(false);
            setScheduleToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default FeedingForm;