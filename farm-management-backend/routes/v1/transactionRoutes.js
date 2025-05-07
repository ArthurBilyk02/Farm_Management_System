const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get All Transactions
router.get('/', verifyToken, (req, res) => {
    const query = `
      SELECT t.*, f.location AS farm_name
      FROM Transactions t
      LEFT JOIN Farm f ON t.farm_id = f.farm_id
    `;
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

// Get a Specific Transaction by ID
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Transactions WHERE transaction_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Transaction not found" });
        res.json(results[0]);
    });
});

// Create a New Transaction
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { product_id, transaction_type, quantity, transaction_date, total_cost, farm_id } = req.body;

    if (!product_id || !transaction_type || !quantity || !total_cost) {
        return res.status(400).json({ error: "All fields (product_id, transaction_type, quantity, total_cost) are required" });
    }

    db.query('SELECT * FROM Product_Stock WHERE product_id = ?', [product_id], (err, productResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (productResults.length === 0) {
            return res.status(400).json({ error: "Invalid product_id. Product does not exist." });
        }

        db.query(
            'INSERT INTO Transactions (product_id, transaction_type, quantity, transaction_date, total_cost, farm_id) VALUES (?, ?, ?, ?, ?, ?)',
            [product_id, transaction_type, quantity, transaction_date || new Date(), total_cost, farm_id],

            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Transaction created successfully", transaction_id: result.insertId });
            }
        );
    });
});

// Update a Transaction
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { product_id, transaction_type, quantity, transaction_date, total_cost } = req.body;

    db.query(
        'UPDATE Transactions SET product_id = ?, transaction_type = ?, quantity = ?, transaction_date = ?, total_cost = ? WHERE transaction_id = ?',
        [product_id, transaction_type, quantity, transaction_date, total_cost, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Transaction not found" });
            res.json({ message: "Transaction updated successfully" });
        }
    );
});

// Delete a Transaction
router.delete('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Transactions WHERE transaction_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Transaction not found" });
        res.json({ message: "Transaction deleted successfully" });
    });
});

module.exports = router;
