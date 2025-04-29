import { useMemo, useState, useEffect } from "react";
import Modal from "./layout/Modal";
import ProductForm from "./ProductForm";
import { createProduct, deleteProduct } from "../services/api";
import ConfirmModal from "./layout/ConfirmModal";
import { useAuth } from "../context/auth/AuthContext";
import { formatWeight } from "../utils/utils";
import "./Form.css";

const TransactionForm = ({ transaction = {}, products = [], onSubmit, onCancel, reloadProducts }) => {
  const safeTransaction = useMemo(() => transaction || {}, [transaction]);

  const [productId, setProductId] = useState(safeTransaction.product_id || "");
  const [transactionType, setTransactionType] = useState(safeTransaction.transaction_type || "");
  const [quantity, setQuantity] = useState(safeTransaction.quantity || "");
  const [transactionDate, setTransactionDate] = useState(
    safeTransaction.transaction_date ? safeTransaction.transaction_date.substring(0, 16) : ""
  );
  const [totalCost, setTotalCost] = useState(safeTransaction.total_cost || "");
  const [showProductModal, setShowProductModal] = useState(false);
  const { user } = useAuth();
  const [productToDelete, setProductToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (!safeTransaction.transaction_date) {
        const today = new Date().toISOString().slice(0, 10);
        setTransactionDate(today);
    }
  }, [safeTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      product_id: parseInt(productId),
      transaction_type: transactionType,
      quantity: parseFloat(quantity),
      transaction_date: transactionDate,
      total_cost: parseFloat(totalCost)
    });
  };

  const handleNewProductCreated = async (productData) => {
    try {
      const newProduct = await createProduct(productData, user.token);
      await reloadProducts();
      setProductId(newProduct.product_id);
      setShowProductModal(false);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setShowConfirmDelete(true);
  };
  
  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete, user.token);
      await reloadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      if (err.response && err.response.status === 400) {
        alert(err.response.data.error);
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } finally {
      setShowConfirmDelete(false);
      setProductToDelete(null);
    }
};

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{safeTransaction.transaction_id ? "Edit Transaction" : "Add Transaction"}</h3>

        <div>
          <label>Product:</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.food_type}
              </option>
            ))}
          </select>

          <button type="button" onClick={() => setShowProductModal(true)} style={{ marginLeft: "10px" }}>
            + Create New Product
          </button>
        </div>

        <div>
          <label>Transaction Type:</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Stock_Purchase">Stock Purchase</option>
            <option value="Stock_Sale">Stock Sale</option>
            <option value="Animal_Purchase">Animal Purchase</option>
            <option value="Animal_Sale">Animal Sale</option>
          </select>
        </div>

        <div>
            <label>Quantity: </label>
            <input
                type="number"
                min="0.001"
                step="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                />
        </div>

        <div>
          <label>Transaction Date:</label>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Total Cost:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            required
            />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit">{safeTransaction.transaction_id ? "Update" : "Create"}</button>
          <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </form>

      {showProductModal && (
        <Modal isOpen={showProductModal} onClose={() => setShowProductModal(false)}>
            <h3>Manage Products</h3>

            <ProductForm
            onSubmit={handleNewProductCreated}
            onCancel={() => setShowProductModal(false)}
            />

            <h4>Existing Products:</h4>
            <ul>
            {products.map((p) => (
                <li key={p.product_id}>
                {p.food_type} (Stock: {formatWeight(p.stock_level)})
                <button onClick={() => handleDeleteProduct(p.product_id)} style={{ marginLeft: "10px" }}>
                    Delete
                </button>
                </li>
            ))}
            </ul>

            {showConfirmDelete && (
            <ConfirmModal
                message="Are you sure you want to delete this product?"
                onConfirm={confirmDeleteProduct}
                onCancel={() => setShowConfirmDelete(false)}
            />
            )}
        </Modal>
        )}
    </>
  );
};

export default TransactionForm;
