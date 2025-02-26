import { useEffect, useState } from "react";
import { fetchFarms } from "../services/api";

const Farms = () => {
    const [farms, setFarms] = useState([]);

    useEffect(() => {
        fetchFarms()
            .then((data) => setFarms(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Farms</h2>
            <ul>
                {farms.map((farm) => (
                    <li key={farm.farm_id}>{farm.location} - Owned by {farm.owner}</li>
                ))}
            </ul>
        </div>
    );
};

export default Farms;
