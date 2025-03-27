const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all veterinary visits
router.get('/', (req, res) => {
    db.query('SELECT * FROM Veterinary_Visits', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific veterinary visit by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Veterinary_Visits WHERE visit_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Veterinary visit not found" });
        res.json(results[0]);
    });
});

// Create a new veterinary visit
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_id, vet_name, visit_date, purpose, treatment } = req.body;

    if (!herd_id || !vet_name || !purpose) {
        return res.status(400).json({ error: "herd_id, vet_name, and purpose are required" });
    }

    const formattedDate = visit_date ? new Date(visit_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

    db.query(
        'INSERT INTO Veterinary_Visits (herd_id, vet_name, visit_date, purpose, treatment) VALUES (?, ?, ?, ?, ?)',
        [herd_id, vet_name, formattedDate, purpose, treatment || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Veterinary visit added successfully", visit_id: result.insertId });
        }
    );
});

// Update an existing veterinary visit
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { herd_id, vet_name, visit_date, purpose, treatment } = req.body;

    db.query(
        'UPDATE Veterinary_Visits SET herd_id = ?, vet_name = ?, visit_date = ?, purpose = ?, treatment = ? WHERE visit_id = ?',
        [herd_id, vet_name, visit_date, purpose, treatment, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Veterinary visit not found" });
            res.json({ message: "Veterinary visit updated successfully" });
        }
    );
});

// Delete a veterinary visit
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Veterinary_Visits WHERE visit_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Veterinary visit not found" });
        res.json({ message: "Veterinary visit deleted successfully" });
    });
});

module.exports = router;
