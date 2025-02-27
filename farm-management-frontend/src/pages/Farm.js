import { useEffect, useState } from "react";
import { fetchFarm } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";

const Farm = () => {
    const { user } = useAuth(); 
    const [farm, setFarm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("User in Farm.js:", user);
        if (!user || !user.farm_id) {
            setError("No farm ID found");
            setLoading(false);
            return;
        }

        fetchFarm(user.farm_id, user.token)
            .then((data) => {
                setFarm(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Farm Details</h1>
            <p><strong>Location:</strong> {farm.location}</p>
            <p><strong>Owner:</strong> {farm.owner}</p>
            <p><strong>Animal Types:</strong> {farm.animal_types}</p>
        </div>
    );
};

export default Farm;
