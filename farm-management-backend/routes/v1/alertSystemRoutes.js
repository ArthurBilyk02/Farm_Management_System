const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// GET All Alerts
router.get('/', (req, res) => {
    db.query('SELECT * FROM Alert_System', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET a Single Alert by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Alert_System WHERE alert_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Alert not found" });
        res.json(results[0]);
    });
});

// Create a New Alert
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { product_id, alert_type, status } = req.body;

    if (!product_id || !alert_type) {
        return res.status(400).json({ error: "product_id and alert_type are required" });
    }

    db.query(
        'INSERT INTO Alert_System (product_id, alert_type, status) VALUES (?, ?, ?)',
        [product_id, alert_type, status || 'Pending'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Alert created successfully", alert_id: result.insertId });
        }
    );
});

// Update an Existing Alert
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Resolved'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'Pending' or 'Resolved'." });
    }

    db.query(
        'UPDATE Alert_System SET status = ? WHERE alert_id = ?',
        [status, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Alert not found" });
            res.json({ message: "Alert updated successfully" });
        }
    );
});

// Delete an Alert
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Alert_System WHERE alert_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Alert not found" });
        res.json({ message: "Alert deleted successfully" });
    });
});

module.exports = router;
