import { useState, useEffect, useCallback } from "react";
import { fetchFarms, fetchSpecies, fetchSchedules } from "../services/api"; 
import { useAuth } from "../context/auth/AuthContext";
import "./Form.css"

const HerdForm = ({ onSubmit, herd = {}, isEditing, isAdmin, farmIdFromUser }) => {
    const { user } = useAuth();

    const [herdName, setHerdName] = useState("");
    const [farmId, setFarmId] = useState("");
    const [speciesId, setSpeciesId] = useState("");
    const [size, setSize] = useState("");
    const [dateCreated, setDateCreated] = useState("");
    const [scheduleId, setScheduleId] = useState("");
    const [healthStatus, setHealthStatus] = useState("");
    const [description, setDescription] = useState("");

    const [farmOptions, setFarmOptions] = useState([]);
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [scheduleOptions, setScheduleOptions] = useState([]);

    useEffect(() => {
        if (herd) {
            setHerdName(herd.herd_name || "");
            setFarmId(isAdmin ? (herd.farm_id || "") : farmIdFromUser || "");
            setSpeciesId(herd.species_id || "");
            setSize(herd.size || "");
            setDateCreated(herd.date_created ? herd.date_created.split("T")[0] : "");
            setScheduleId(herd.schedule_id || "");
            setHealthStatus(herd.health_status || "");
            setDescription(herd.description || "");
        }
    }, [herd, isAdmin, farmIdFromUser]);

    const loadOptions = useCallback(async () => {
        try {
            if (!user?.token) return;

            const farms = await fetchFarms(user.token);
            const species = await fetchSpecies(user.token);
            const schedules = await fetchSchedules(user.token);

            setFarmOptions(farms);
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

        const herdData = {
            herd_name: herdName,
            farm_id: parseInt(farmId),
            species_id: parseInt(speciesId),
            size: parseInt(size) || 0,
            date_created: dateCreated || null,
            schedule_id: scheduleId || null,
            health_status: healthStatus || "",
            description: description || "",
        };

        onSubmit(herdData);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit Herd" : "Add New Herd"}</h3>

            <div>
                <label>Herd Name:</label>
                <input
                    type="text"
                    value={herdName}
                    onChange={(e) => setHerdName(e.target.value)}
                    required
                />
            </div>

            {isAdmin && (
                <div>
                    <label>Farm Location:</label>
                    <select
                        value={farmId}
                        onChange={(e) => setFarmId(e.target.value)}
                        required
                        disabled={farmOptions.length === 0}
                    >
                        <option value="">
                            {farmOptions.length === 0 ? "No farms available" : "-- Select Farm --"}
                        </option>
                        {farmOptions.map((f) => (
                            <option key={f.farm_id} value={f.farm_id}>
                                {f.location}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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
                <label>Size:</label>
                <input
                    type="number"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                />
            </div>

            <div>
                <label>Date Created:</label>
                <input
                    type="date"
                    value={dateCreated}
                    onChange={(e) => setDateCreated(e.target.value)}
                />
            </div>

            <div>
                <label>Feeding Schedule:</label>
                <select
                    value={scheduleId}
                    onChange={(e) => setScheduleId(e.target.value)}
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
            </div>

            <div>
                <label>Health Status:</label>
                <input
                    type="text"
                    value={healthStatus}
                    onChange={(e) => setHealthStatus(e.target.value)}
                />
            </div>

            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button type="submit">{isEditing ? "Update" : "Create"}</button>
        </form>
    );
};

export default HerdForm;
