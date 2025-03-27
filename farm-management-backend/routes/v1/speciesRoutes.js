const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all species
router.get('/', (req, res) => {
    db.query('SELECT * FROM Species', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific species by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Species WHERE species_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Species not found" });
        res.json(results[0]);
    });
});

// Create a new species
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { species_name, description } = req.body;

    if (!species_name) {
        return res.status(400).json({ error: "Species name is required" });
    }

    db.query(
        'INSERT INTO Species (species_name, description) VALUES (?, ?)',
        [species_name, description || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Species added successfully", species_id: result.insertId });
        }
    );
});

// Update an existing species
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { species_name, description } = req.body;

    db.query(
        'UPDATE Species SET species_name = ?, description = ? WHERE species_id = ?',
        [species_name, description, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Species not found" });
            res.json({ message: "Species updated successfully" });
        }
    );
});

// Delete a species
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Species WHERE species_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Species not found" });
        res.json({ message: "Species deleted successfully" });
    });
});

module.exports = router;
