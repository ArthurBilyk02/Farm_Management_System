import { useState, useEffect } from "react";

const HerdForm = ({ onSubmit, herd = {}, isEditing, isAdmin, farmIdFromUser }) => {
    const [herdName, setHerdName] = useState("");
    const [farmId, setFarmId] = useState("");
    const [speciesId, setSpeciesId] = useState("");
    const [size, setSize] = useState("");
    const [dateCreated, setDateCreated] = useState("");
    const [scheduleId, setScheduleId] = useState("");
    const [healthStatus, setHealthStatus] = useState("");
    const [description, setDescription] = useState("");

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
            description: description || ""
        };

        onSubmit(herdData);
    };

    return (
        <form onSubmit={handleSubmit}>
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

            <div>
                <label>Farm ID:</label>
                <input
                    type="text"
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    required
                    disabled={!isAdmin}
                />
            </div>

            <div>
                <label>Species ID:</label>
                <input
                    type="text"
                    value={speciesId}
                    onChange={(e) => setSpeciesId(e.target.value)}
                    required
                />
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
                <label>Schedule ID:</label>
                <input
                    type="text"
                    value={scheduleId}
                    onChange={(e) => setScheduleId(e.target.value)}
                />
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
