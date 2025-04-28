import { useEffect, useState } from "react";
import { fetchHerds, fetchFarms, createHerd, updateHerd, deleteHerd } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import HerdForm from "./HerdForm";
import ConfirmModal from "./layout/ConfirmModal";

function downloadCSV(data, filename = "data.csv") {
  const csvRows = [];

  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const HerdList = () => {
  const { user } = useAuth();
  const [herds, setHerds] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedHerd, setSelectedHerd] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [herdToDelete, setHerdToDelete] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [pendingEditData, setPendingEditData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const herdData = await fetchHerds(user.token);
        const farmData = await fetchFarms(user.token);
        setFarms(farmData);

        const filtered = user.role_name === "admin"
          ? herdData
          : herdData.filter((h) => h.farm_id === parseInt(user.farm_id));

        setHerds(filtered);
      } catch (err) {
        setError("Failed to load herds or farms");
        console.error(err);
      }
    };

    if (user?.token) loadData();
  }, [user]);

  const handleCreate = () => {
    setSelectedHerd(null);
    setShowForm(true);
  };

  const handleEdit = (herd) => {
    setSelectedHerd(herd);
    setShowForm(true);
  };

  const handleDelete = (herdId) => {
    setHerdToDelete(herdId);
    setShowConfirm(true);
  };

  const handleFormSubmit = async (herdData) => {
    if (selectedHerd) {
      setPendingEditData({ herdId: selectedHerd.herd_id, data: herdData });
      setConfirmEdit(true);
    } else {
      try {
        await createHerd(herdData, user.token);
        const refreshed = await fetchHerds(user.token);
        setHerds(user.role_name === "admin" ? refreshed : refreshed.filter(h => h.farm_id === parseInt(user.farm_id)));
        setShowForm(false);
      } catch (err) {
        console.error("Failed to create herd:", err);
        setError("Failed to create herd.");
      }
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await updateHerd(pendingEditData.herdId, pendingEditData.data, user.token);
      const refreshed = await fetchHerds(user.token);
      setHerds(user.role_name === "admin" ? refreshed : refreshed.filter(h => h.farm_id === parseInt(user.farm_id)));
      setShowForm(false);
      setSelectedHerd(null);
    } catch (err) {
      console.error("Failed to update herd:", err);
      setError("Failed to update herd.");
    } finally {
      setConfirmEdit(false);
      setPendingEditData(null);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteHerd(herdToDelete, user.token);
      setHerds((prev) => prev.filter((h) => h.herd_id !== herdToDelete));
    } catch (err) {
      setError("Failed to delete herd");
      console.error(err);
    } finally {
      setShowConfirm(false);
      setHerdToDelete(null);
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Herds</h2>
      <button onClick={() => downloadCSV(herds, "herds.csv")}>Download CSV</button>
      {(user.role_name === "admin" || user.role_name === "employee") && (
        <button onClick={handleCreate}>Add New Herd</button>
      )}

      {showForm && (
        <HerdForm
          herd={selectedHerd}
          onSubmit={handleFormSubmit}
          isEditing={!!selectedHerd}
          isAdmin={user.role_name === "admin"}
          farmIdFromUser={user.farm_id}
        />
      )}

      <table className="table-spreadsheet">
        <thead>
          <tr>
            <th>Herd Name</th>
            <th>Species ID</th>
            <th>Size</th>
            <th>Health Status</th>
            <th>Description</th>
            {user.role_name === "admin" && <th>Farm Location</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {herds.map((herd) => (
            <tr key={herd.herd_id}>
              <td>{herd.herd_name}</td>
              <td>{herd.species_id}</td>
              <td>{herd.size}</td>
              <td>{herd.health_status}</td>
              <td>{herd.description}</td>
              {user.role_name === "admin" && (
                <td>
                  {farms.find((f) => f.farm_id === herd.farm_id)?.location || "Unknown"}
                </td>
              )}
              <td>
                {(user.role_name === "admin" || user.role_name === "employee") && (
                  <>
                    <button onClick={() => handleEdit(herd)}>Edit</button>
                    <button onClick={() => handleDelete(herd.herd_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this herd?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setHerdToDelete(null);
          }}
        />
      )}

      {confirmEdit && (
        <ConfirmModal
          message="Are you sure you want to update this herd?"
          onConfirm={handleConfirmEdit}
          onCancel={() => {
            setConfirmEdit(false);
            setPendingEditData(null);
          }}
        />
      )}
    </div>
  );
};

export default HerdList;