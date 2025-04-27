import { useState } from "react";

const ProductForm = ({ onSubmit, onCancel }) => {
  const [foodType, setFoodType] = useState("");
  const [stockLevel, setStockLevel] = useState("");
  const [reorderThreshold, setReorderThreshold] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      food_type: foodType,
      stock_level: parseFloat(stockLevel),
      reorder_threshold: parseFloat(reorderThreshold),
      supplier_id: parseInt(supplierId),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Product</h3>

      <div>
        <label>Food Type:</label>
        <input value={foodType} onChange={(e) => setFoodType(e.target.value)} required />
      </div>

      <div>
        <label>Stock Level:</label>
        <input
            type="number"
            min="0.001"
            step="0.001"
            value={stockLevel}
            onChange={(e) => setStockLevel(e.target.value)}
            required
        />
      </div>

      <div>
        <label>Reorder Threshold:</label>
        <input
            type="number"
            min="0.001"
            step="0.001"
            value={reorderThreshold}
            onChange={(e) => setReorderThreshold(e.target.value)}
            required
        />
      </div>

      <div>
        <label>Supplier ID:</label>
        <input type="number" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required />
      </div>

      <button type="submit">Create</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>Cancel</button>
    </form>
  );
};

export default ProductForm;
