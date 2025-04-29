import { useState, useEffect, useCallback } from "react";
import { fetchSpecies, fetchFarms, fetchHerds } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import "./Form.css";

const AnimalForm = ({ onSubmit, onCancel, animal = {}, isEditing, isAdmin, farmIdFromUser }) => {
    const { user } = useAuth();
    
    const [name, setName] = useState("");
    const [farmId, setFarmId] = useState("");
    const [speciesId, setSpeciesId] = useState("");
    const [herdId, setHerdId] = useState("");
    const [dob, setDob] = useState("");
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [farmOptions, setFarmOptions] = useState([]);
    const [herdOptions, setHerdOptions] = useState([]);


    useEffect(() => {
        if (animal) {
            setName(animal.name || "");
            setFarmId(isAdmin ? (animal.farm_id || "") : farmIdFromUser || "");
            setSpeciesId(animal.species_id || "");
            setHerdId(animal.herd_id || "");
            setDob(animal.dob ? animal.dob.split("T")[0] : "");
        }
    }, [animal, isAdmin, farmIdFromUser]);

    const loadOptions = useCallback(async () => {
        try {
            if (!user?.token) return;

            const farms = await fetchFarms(user.token);
            const herds = await fetchHerds(user.token);
            const species = await fetchSpecies(user.token);

            setFarmOptions(farms);
            setHerdOptions(herds);
            setSpeciesOptions(species);
        } catch (err) {
            console.error("Error loading dropdown options:", err);
        }
    }, [user?.token]);

    useEffect(() => {
        if (user?.token) loadOptions();
    }, [user, loadOptions]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const animalData = {
            name: name.trim(),
            herd_id: herdId,
            species_id: speciesId,
            farm_id: isAdmin ? farmId : farmIdFromUser,
            dob: dob || null,
        };

        onSubmit(animalData);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit Animal" : "Add New Animal"}</h3>

            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                >
                    <option value="">-- Select Species --</option>
                    {speciesOptions.map((s) => (
                        <option key={s.species_id} value={s.species_id}>
                            {s.species_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Herd Name:</label>
                <select
                    value={herdId}
                    onChange={(e) => setHerdId(e.target.value)}
                    required
                    disabled={herdOptions.length === 0}
                >
                    <option value="">
                        {herdOptions.length === 0 ? "No herds available" : "-- Select Herd --"}
                    </option>
                    {herdOptions.map((h) => (
                        <option key={h.herd_id} value={h.herd_id}>
                            {h.herd_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Date of Birth:</label>
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>  
                <button type="submit">{isEditing ? "Update" : "Create"}</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AnimalForm;