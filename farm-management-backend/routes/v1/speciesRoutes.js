const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get all species
router.get('/', (req, res) => {
    db.query('SELECT * FROM Species', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new species
router.post('/', (req, res) => {
    const { type_id, species_name, description } = req.body;
    if (!type_id || !species_name) {
        return res.status(400).json({ error: "Type ID and Species Name are required" });
    }

    db.query('INSERT INTO Species (type_id, species_name, description) VALUES (?, ?, ?)',
        [type_id, species_name, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Species added successfully", id: result.insertId });
        }
    );
});

module.exports = router;
