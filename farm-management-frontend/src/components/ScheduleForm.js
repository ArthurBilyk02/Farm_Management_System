import { useState, useEffect } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { fetchHerds, fetchFarms } from "../services/api";

const ScheduleForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [herds, setHerds] = useState([]);
  const [farms, setFarms] = useState([]);
  
  const [herdId, setHerdId] = useState("");
  const [farmId, setFarmId] = useState(user.farm_id || "");
  const [foodType, setFoodType] = useState("");
  const [feedingInterval, setFeedingInterval] = useState("");
  const [recommendedFood, setRecommendedFood] = useState("");
  const [health, setHealth] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const herdsData = await fetchHerds(user.token);
        setHerds(herdsData);

        if (user.role_name === "admin") {
          const farmsData = await fetchFarms(user.token);
          setFarms(farmsData);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    if (user?.token) {
      loadData();
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      herd_id: parseInt(herdId),
      farm_id: parseInt(farmId),
      food_type: foodType,
      feeding_interval: feedingInterval,
      recommended_food: recommendedFood,
      health: health
    });
  };

  const filteredHerds = farmId
    ? herds.filter((h) => h.farm_id === parseInt(farmId))
    : [];

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Feeding Schedule</h3>

      {/* Farm dropdown (only for admin) */}
      {user.role_name === "admin" && (
        <div>
          <label>Farm:</label>
          <select
            value={farmId}
            onChange={(e) => {
              setFarmId(e.target.value);
              setHerdId("");
            }}
            required
          >
            <option value="">-- Select Farm --</option>
            {farms.map((f) => (
              <option key={f.farm_id} value={f.farm_id}>
                {f.location}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Herd dropdown */}
      <div>
        <label>Herd:</label>
        <select
          value={herdId}
          onChange={(e) => setHerdId(e.target.value)}
          required
          disabled={!farmId}
        >
          <option value="">
            {!farmId ? "Select a farm first" : "-- Select Herd --"}
          </option>
          {filteredHerds.map((h) => (
            <option key={h.herd_id} value={h.herd_id}>
              {h.herd_name}
            </option>
          ))}
        </select>
      </div>

      {/* Other fields */}
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
        <label>Feeding Interval:</label>
        <input
          type="text"
          value={feedingInterval}
          onChange={(e) => setFeedingInterval(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Recommended Food:</label>
        <input
          type="text"
          value={recommendedFood}
          onChange={(e) => setRecommendedFood(e.target.value)}
        />
      </div>

      <div>
        <label>Health Status:</label>
        <input
          type="text"
          value={health}
          onChange={(e) => setHealth(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button type="submit">Create Schedule</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ScheduleForm;
