import { useState, useEffect } from "react";

const FarmForm = ({ onSubmit, farm, isEditing }) => {
    const [location, setLocation] = useState("");
    const [owner, setOwner] = useState("");
    const [animalTypes, setAnimalTypes] = useState("");

    useEffect(() => {
        if (farm) {
            setLocation(farm.location || "");
            setOwner(farm.owner || "");
            setAnimalTypes(farm.animal_types || "");
        }
    }, [farm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            location,
            owner,
            animal_types: animalTypes
        });
    };

    return (
        <form className="farm-form" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit Farm" : "Add New Farm"}</h3>

            <div>
                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Owner:</label>
                <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Animal Types:</label>
                <input
                    type="text"
                    value={animalTypes}
                    onChange={(e) => setAnimalTypes(e.target.value)}
                />
            </div>

            <button type="submit">{isEditing ? "Update" : "Create"}</button>
        </form>
    );
};

export default FarmForm;
