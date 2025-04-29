import { useState, useEffect } from "react";
import { fetchFarms } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";

const RegisterModal = ({ onRegister, onCancel }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("employee");
  const [farmId, setFarmId] = useState("");
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const loadFarms = async () => {
      try {
        if (user?.token) {
          const data = await fetchFarms(user.token);
          console.log("Fetch farms:", data)
          setFarms(data);
        }
      } catch (error) {
        console.error("Failed to load farms", error);
      }
    };

    loadFarms();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { 
      email, 
      password, 
      role_name: roleName, 
      farm_id: parseInt(farmId, 10)
    };
    console.log("Registering user with data:", { ...formData, password: "********" });
    onRegister(formData);
};

  return (
    <form onSubmit={handleSubmit}>
      <h3>Register New User</h3>

      <div>
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div>
        <label>Role:</label>
        <select value={roleName} onChange={(e) => setRoleName(e.target.value)} required>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
          <option value="public">Public</option>
        </select>
      </div>

      <div>
        <label>Farm:</label>
        <select value={farmId} onChange={(e) => setFarmId(e.target.value)} required>
          <option value="">-- Select Farm --</option>
          {farms.map((farm) => (
            <option key={farm.farm_id} value={farm.farm_id}>
              {farm.location}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Register</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </form>
  );
};

export default RegisterModal;
