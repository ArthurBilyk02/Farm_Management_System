import { useState, useEffect, useCallback } from "react";
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction, fetchProducts } from "../services/api";
import { useAuth } from "../context/auth/AuthContext";
import ConfirmModal from "./layout/ConfirmModal";
import TransactionForm from "./TransactionForm";

function formatWeight(quantity) {
    if (quantity >= 1) {
      return `${parseFloat(quantity.toFixed(2))} kg`;
    } else {
      return `${Math.round(quantity * 1000)} g`;
    }
}

function fixDate(dateStr) {
    return dateStr.split("T")[0];
}

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

const TransactionList = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [pendingEditData, setPendingEditData] = useState(null);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    try {
      const data = await fetchTransactions(user.token);
      setTransactions(data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError("Failed to load transactions.");
    }
  }, [user?.token]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts(user.token);
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products.");
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      loadTransactions();
      loadProducts();
    }
  }, [user, loadTransactions, loadProducts]);

  const handleCreate = () => {
    setSelectedTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (transactionId) => {
    setTransactionToDelete(transactionId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTransaction(transactionToDelete, user.token);
      await loadTransactions();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError("Failed to delete transaction.");
    } finally {
      setShowConfirmDelete(false);
      setTransactionToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (selectedTransaction && selectedTransaction.transaction_id) {
      setPendingEditData(formData);
      setShowConfirmUpdate(true);
    } else {
      try {
        await createTransaction(formData, user.token);
        await loadTransactions();
        setShowForm(false);
        setSelectedTransaction(null);
      } catch (err) {
        console.error("Failed to save transaction:", err);
        setError("Failed to save transaction.");
      }
    }
  };

  const confirmUpdate = async () => {
    try {
      await updateTransaction(selectedTransaction.transaction_id, pendingEditData, user.token);
      await loadTransactions();
      setShowForm(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error("Failed to update transaction:", err);
      setError("Failed to update transaction.");
    } finally {
      setShowConfirmUpdate(false);
      setPendingEditData(null);
    }
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.product_id === productId);
    return product ? product.food_type : "Unknown Product";
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Transactions</h2>

      <button onClick={() => downloadCSV(transactions, "transactions.csv")}>Download CSV</button>
      <button onClick={handleCreate}>Add Transaction</button>

      {showForm && (
        <TransactionForm
          transaction={selectedTransaction}
          products={products}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          reloadProducts={loadProducts}
        />
      )}

      <table className="table-spreadsheet">
        <thead>
          <tr>
            <th>Product</th>
            <th>Transaction Type</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Total Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.transaction_id}>
              <td>{getProductName(t.product_id)}</td>
              <td>{t.transaction_type}</td>
              <td>{formatWeight(t.quantity)}</td>
              <td>{fixDate(t.transaction_date)}</td>
              <td>{new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(t.total_cost)}</td>
              <td>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.transaction_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this transaction?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}

      {showConfirmUpdate && (
        <ConfirmModal
          message="Are you sure you want to update this transaction?"
          onConfirm={confirmUpdate}
          onCancel={() => {
            setShowConfirmUpdate(false);
            setPendingEditData(null);
          }}
        />
      )}
    </div>
  );
};

export default TransactionList;
