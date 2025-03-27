const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// GET All Performance Metrics
router.get('/', (req, res) => {
    db.query('SELECT * FROM Performance_Metrics', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET a Single Performance Metric by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Performance_Metrics WHERE metric_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Performance metric not found" });
        res.json(results[0]);
    });
});

// Create a New Performance Metric (Admin/Employee)
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_id, metric_type, value } = req.body;

    if (!herd_id || !metric_type || value === undefined) {
        return res.status(400).json({ error: "herd_id, metric_type, and value are required" });
    }

    db.query(
        'INSERT INTO Performance_Metrics (herd_id, metric_type, value) VALUES (?, ?, ?)',
        [herd_id, metric_type, value],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Performance metric recorded successfully", metric_id: result.insertId });
        }
    );
});

// Update an Existing Performance Metric (Admin/Employee)
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { metric_type, value } = req.body;

    db.query(
        'UPDATE Performance_Metrics SET metric_type = ?, value = ? WHERE metric_id = ?',
        [metric_type, value, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Performance metric not found" });
            res.json({ message: "Performance metric updated successfully" });
        }
    );
});

// Delete a Performance Metric (Admin)
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Performance_Metrics WHERE metric_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Performance metric not found" });
        res.json({ message: "Performance metric deleted successfully" });
    });
});

module.exports = router;
