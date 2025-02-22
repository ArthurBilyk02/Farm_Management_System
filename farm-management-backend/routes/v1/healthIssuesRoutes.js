const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// GET All Health Issues
router.get('/', (req, res) => {
    db.query('SELECT * FROM Health_Issues', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET a Single Health Issue by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Health_Issues WHERE health_issue_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Health issue not found" });
        res.json(results[0]);
    });
});

// Create a New Health Issue
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_id, issue_description, severity, resolution_status } = req.body;

    if (!herd_id || !issue_description || !severity) {
        return res.status(400).json({ error: "herd_id, issue_description, and severity are required" });
    }

    db.query(
        'INSERT INTO Health_Issues (herd_id, issue_description, severity, resolution_status) VALUES (?, ?, ?, ?)',
        [herd_id, issue_description, severity, resolution_status || 'Ongoing'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Health issue recorded successfully", health_issue_id: result.insertId });
        }
    );
});

// Update an Existing Health Issue
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { issue_description, severity, resolution_status } = req.body;

    db.query(
        'UPDATE Health_Issues SET issue_description = ?, severity = ?, resolution_status = ? WHERE health_issue_id = ?',
        [issue_description, severity, resolution_status, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Health issue not found" });
            res.json({ message: "Health issue updated successfully" });
        }
    );
});

// Delete a Health Issue
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Health_Issues WHERE health_issue_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Health issue not found" });
        res.json({ message: "Health issue deleted successfully" });
    });
});

module.exports = router;
