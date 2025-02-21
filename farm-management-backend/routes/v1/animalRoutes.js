const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all animals
router.get('/', (req, res) => {
    db.query('SELECT * FROM Animal', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a single animal by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Animal WHERE animal_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Animal not found" });
        res.json(results[0]);
    });
});

// Create a new animal
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_id, species_id, farm_id, name, dob } = req.body;

    if (!herd_id || !species_id || !farm_id || !name) {
        return res.status(400).json({ error: "herd_id, species_id, farm_id, and name are required" });
    }

    db.query(
        'INSERT INTO Animal (herd_id, species_id, farm_id, name, dob) VALUES (?, ?, ?, ?, ?)',
        [herd_id, species_id, farm_id, name, dob || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Animal added successfully", id: result.insertId });
        }
    );
});

// Update an existing animal
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { herd_id, species_id, farm_id, name, dob } = req.body;

    db.query(
        'UPDATE Animal SET herd_id = ?, species_id = ?, farm_id = ?, name = ?, dob = ? WHERE animal_id = ?',
        [herd_id, species_id, farm_id, name, dob, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Animal not found" });
            res.json({ message: "Animal updated successfully" });
        }
    );
});

// Delete an animal
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Animal WHERE animal_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Animal not found" });
        res.json({ message: "Animal deleted successfully" });
    });
});

module.exports = router;
