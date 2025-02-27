import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchFarms } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const FarmList = () => {
    const { user } = useAuth();
    const [farms, setFarms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFarms = async () => {
            try {
                if (!user || !user.token) {
                    setError("Unauthorized: No token found.");
                    return;
                }

                const data = await fetchFarms(user.token);
                setFarms(data);
            } catch (err) {
                setError("Failed to load farms.");
                console.error(err);
            }
        };

        getFarms();
    }, [user]);

    if (error) return <p>{error}</p>;
    if (farms.length === 0) return <p>Loading farms...</p>;

    return (
        <div>
            <h2>Farms</h2>
            <ul>
                {farms.map((farm) => (
                    <li key={farm.farm_id}>
                        <Link to={`/farm/${farm.farm_id}`}>{farm.location}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FarmList;