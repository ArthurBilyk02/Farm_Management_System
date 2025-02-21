const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all farms
router.get('/', (req, res) => {
    db.query('SELECT * FROM Farm', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific farm by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Farm WHERE farm_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Farm not found" });
        res.json(results[0]);
    });
});

// Create a new farm
router.post('/', verifyToken, requireRole(['admin']), (req, res) => {
    const { location, owner, animal_types } = req.body;

    if (!location || !owner) {
        return res.status(400).json({ error: "Location and owner are required" });
    }

    db.query(
        'INSERT INTO Farm (location, owner, animal_types) VALUES (?, ?, ?)',
        [location, owner, animal_types || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Farm added successfully", farm_id: result.insertId });
        }
    );
});

// Update an existing farm
router.put('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { location, owner, animal_types } = req.body;

    db.query(
        'UPDATE Farm SET location = ?, owner = ?, animal_types = ? WHERE farm_id = ?',
        [location, owner, animal_types, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Farm not found" });
            res.json({ message: "Farm updated successfully" });
        }
    );
});

// Delete a farm
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Farm WHERE farm_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Farm not found" });
        res.json({ message: "Farm deleted successfully" });
    });
});

module.exports = router;
