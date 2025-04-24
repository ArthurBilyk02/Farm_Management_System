import { useState, useEffect } from "react";
import { fetchSpecies } from "../services/api";

const AnimalForm = ({ onSubmit, animal = {}, isEditing, isAdmin, farmIdFromUser }) => {
    const [name, setName] = useState("");
    const [farmId, setFarmId] = useState("");
    const [speciesId, setSpeciesId] = useState("");
    const [herdId, setHerdId] = useState("");
    const [dob, setDob] = useState("");
    const [speciesOptions, setSpeciesOptions] = useState([]);

    useEffect(() => {
        if (animal) {
            setName(animal.name || "");
            setFarmId(isAdmin ? (animal.farm_id || "") : farmIdFromUser || "");
            setSpeciesId(animal.species_id || "");
            setHerdId(animal.herd_id || "");
            setDob(animal.dob ? animal.dob.split("T")[0] : "");
        }
    }, [animal, isAdmin, farmIdFromUser]);

    useEffect(() => {
        const loadSpecies = async () => {
            const data = await fetchSpecies();
            setSpeciesOptions(data);
        };
        loadSpecies();
    }, []);

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
        <form onSubmit={handleSubmit}>
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
                <label>Herd ID:</label>
                <input
                    type="text"
                    value={herdId}
                    onChange={(e) => setHerdId(e.target.value)}
                />
            </div>

            <div>
                <label>Date of Birth:</label>
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
            </div>

            <button type="submit">{isEditing ? "Update" : "Create"}</button>
        </form>
    );
};

export default AnimalForm;