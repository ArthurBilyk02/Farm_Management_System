import { useEffect, useState } from "react";
import { fetchAnimals, deleteAnimal, updateAnimal, createAnimal, fetchFarms } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import AnimalForm from "./AnimalForm";
import ConfirmModal from "./layout/ConfirmModal";

const AnimalList = () => {
    const { user } = useAuth();
    const [animals, setAnimals] = useState([]);
    const [farms, setFarms] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [animalToDelete, setAnimalToDelete] = useState(null);
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [pendingEditData, setPendingEditData] = useState(null);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          const allAnimals = await fetchAnimals(user.token);
          const allFarms = await fetchFarms(user.token);
  
          setFarms(allFarms);
  
          if (user.role_name === "admin") {
            setAnimals(allAnimals);
          } else {
            const farmAnimals = allAnimals.filter(
              (a) => a.farm_id === parseInt(user.farm_id)
            );
            setAnimals(farmAnimals);
          }
        } catch (err) {
          setError("Failed to load animals or farms");
          console.error(err);
        }
      };
  
      if (user?.token) loadData();
    }, [user]);
  
    const handleEdit = (animal) => {
      setSelectedAnimal(animal);
      setShowForm(true);
    };
  
    const handleCreate = () => {
      setSelectedAnimal(null);
      setShowForm(true);
    };
  
    const handleFormSubmit = async (animalData) => {
      if (selectedAnimal) {
        setPendingEditData({ id: selectedAnimal.animal_id, data: animalData });
        setConfirmEdit(true);
      } else {
        try {
          await createAnimal(animalData, user.token);
          reloadAnimals();
          setShowForm(false);
        } catch (err) {
          console.error("Failed to create animal:", err);
          setError("Failed to create animal.");
        }
      }
    };
  
    const handleConfirmEdit = async () => {
      try {
        await updateAnimal(
          pendingEditData.id,
          pendingEditData.data,
          user.token
        );
        reloadAnimals();
        setShowForm(false);
        setSelectedAnimal(null);
      } catch (err) {
        console.error("Failed to update animal:", err);
        setError("Failed to update animal.");
      } finally {
        setConfirmEdit(false);
        setPendingEditData(null);
      }
    };
  
    const handleConfirmDelete = async () => {
      try {
        await deleteAnimal(animalToDelete, user.token);
        setAnimals((prev) =>
          prev.filter((a) => a.animal_id !== animalToDelete)
        );
      } catch (err) {
        console.error("Failed to delete animal:", err);
        setError("Failed to delete animal.");
      } finally {
        setShowConfirm(false);
        setAnimalToDelete(null);
      }
    };
  
    const reloadAnimals = async () => {
      try {
        const updatedAnimals = await fetchAnimals(user.token);
        const filtered = user.role_name === "admin"
          ? updatedAnimals
          : updatedAnimals.filter((a) => a.farm_id === parseInt(user.farm_id));
        setAnimals(filtered);
      } catch (err) {
        console.error("Failed to refresh animal list:", err);
      }
    };
  
    if (error) return <p className="error">{error}</p>;
  
    return (
      <div>
        <h2>Animals</h2>
  
        {(user.role_name === "admin" || user.role_name === "employee") && (
          <button onClick={handleCreate}>Add New Animal</button>
        )}
  
        {showForm && (
          <AnimalForm
            animal={selectedAnimal}
            onSubmit={handleFormSubmit}
            token={user.token}
            userFarmId={user.farm_id}
            isEditing={!!selectedAnimal}
            isAdmin={user.role_name === "admin"}
            farmIdFromUser={user.farm_id}
          />
        )}
  
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Herd ID</th>
              <th>Date of Birth</th>
              {user.role_name === "admin" && <th>Farm Location</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal.animal_id}>
                <td>{animal.name}</td>
                <td>{animal.species_name}</td>
                <td>{animal.herd_id}</td>
                <td>{animal.dob ? animal.dob.split("T")[0] : "—"}</td>
                {user.role_name === "admin" && (
                  <td>
                    {
                      farms.find((f) => f.farm_id === animal.farm_id)?.location ||
                      "Unknown"
                    }
                  </td>
                )}
                <td>
                  {(user.role_name === "admin" || user.role_name === "employee") && (
                    <>
                      <button onClick={() => handleEdit(animal)}>Edit</button>
                      <button
                        onClick={() => {
                          setAnimalToDelete(animal.animal_id);
                          setShowConfirm(true);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {showConfirm && (
          <ConfirmModal
            message="Are you sure you want to delete this animal?"
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setShowConfirm(false);
              setAnimalToDelete(null);
            }}
          />
        )}
  
        {confirmEdit && (
          <ConfirmModal
            message="Are you sure you want to update this animal?"
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
  
  export default AnimalList;