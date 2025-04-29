import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFarm, fetchHerds } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import "./Farm.css";

const Farm = () => {
  const { user } = useAuth();
  const { farmId } = useParams();
  const [farm, setFarm] = useState(null);
  const [herds, setHerds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const idToFetch = farmId || user?.farm_id;

    if (!user || !user.token || !idToFetch) {
      setError("No farm ID or token found.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const farmData = await fetchFarm(idToFetch, user.token);
        const herdsData = await fetchHerds(user.token);

        const filteredHerds = herdsData.filter(h => h.farm_id === parseInt(idToFetch, 10));

        setFarm(farmData);
        setHerds(filteredHerds);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, farmId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const herdCount = herds.length;

  const animalCount = herds.reduce((total, herd) => total + (herd.size || 0), 0);

  return (
    <div className="farm-page">
      <h1>Farm Details</h1>
      <p><strong>Location:</strong> {farm.location}</p>
      <p><strong>Owner:</strong> {farm.owner}</p>
      <p><strong>Animal Types:</strong> {farm.animal_types}</p>

      <div className="farm-overview">
        <h2>Overview</h2>
        <p><strong>Total Herds:</strong> {herdCount}</p>
        <p><strong>Total Animals:</strong> {animalCount}</p>
      </div>

      <div className="farm-herds">
        <h2>Herds on this Farm</h2>
        {herds.length > 0 ? (
          <ul>
            {herds.map((herd) => (
              <li key={herd.herd_id}>
                {herd.herd_name} (Size: {herd.size})
              </li>
            ))}
          </ul>
        ) : (
          <p>No herds available for this farm.</p>
        )}
      </div>
    </div>
  );
};

export default Farm;
