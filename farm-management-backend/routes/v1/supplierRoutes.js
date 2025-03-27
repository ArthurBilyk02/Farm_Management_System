const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all suppliers
router.get('/', (req, res) => {
    db.query('SELECT * FROM Supplier', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific supplier by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Supplier WHERE supplier_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Supplier not found" });
        res.json(results[0]);
    });
});

// Add a new supplier
router.post('/', verifyToken, requireRole(['admin']), (req, res) => {
    const { supplier_name, contact_info, product_type } = req.body;

    if (!supplier_name || !contact_info || !product_type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query(
        'INSERT INTO Supplier (supplier_name, contact_info, product_type) VALUES (?, ?, ?)',
        [supplier_name, contact_info, product_type],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Supplier added successfully", supplier_id: result.insertId });
        }
    );
});

// Update an existing supplier
router.put('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { supplier_name, contact_info, product_type } = req.body;

    db.query(
        'UPDATE Supplier SET supplier_name = ?, contact_info = ?, product_type = ? WHERE supplier_id = ?',
        [supplier_name, contact_info, product_type, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Supplier not found" });
            res.json({ message: "Supplier updated successfully" });
        }
    );
});

// Delete a supplier
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Supplier WHERE supplier_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Supplier not found" });
        res.json({ message: "Supplier deleted successfully" });
    });
});

module.exports = router;
