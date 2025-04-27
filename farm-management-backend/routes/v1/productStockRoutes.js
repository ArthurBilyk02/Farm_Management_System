const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all product stock
router.get('/', (req, res) => {
    db.query('SELECT * FROM Product_Stock', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific product stock item by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Product_Stock WHERE product_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Product stock not found" });
        res.json(results[0]);
    });
});

// Add a new product stock item
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { food_type, stock_level, reorder_threshold, supplier_id } = req.body;

    if (!food_type || !stock_level || !reorder_threshold || !supplier_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query(
        'INSERT INTO Product_Stock (food_type, stock_level, reorder_threshold, supplier_id) VALUES (?, ?, ?, ?)',
        [food_type, stock_level, reorder_threshold, supplier_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Product stock added successfully", product_id: result.insertId });
        }
    );
});

// Update an existing product stock item
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { food_type, stock_level, reorder_threshold, supplier_id } = req.body;

    db.query(
        'UPDATE Product_Stock SET food_type = ?, stock_level = ?, reorder_threshold = ?, supplier_id = ? WHERE product_id = ?',
        [food_type, stock_level, reorder_threshold, supplier_id, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Product stock not found" });
            res.json({ message: "Product stock updated successfully" });
        }
    );
});

// Delete a product stock item
router.delete('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM Transactions WHERE product_id = ?', [id], (err, transactions) => {
        if (err) return res.status(500).json({ error: err.message });

        if (transactions.length > 0) {
            return res.status(400).json({ error: "Cannot delete product. It is referenced in transactions." });
        }

        db.query('DELETE FROM Product_Stock WHERE product_id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });

            res.json({ message: "Product deleted successfully" });
        });
    });
});

module.exports = router;