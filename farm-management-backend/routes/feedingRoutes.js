const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all feeding schedules
router.get('/schedule', (req, res) => {
    db.query('SELECT * FROM Feeding_Schedule', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a feeding schedule
router.post('/schedule', (req, res) => {
    const { species_id, feeding_interval, recommended_food } = req.body;
    if (!species_id || !feeding_interval || !recommended_food) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query('INSERT INTO Feeding_Schedule (species_id, feeding_interval, recommended_food) VALUES (?, ?, ?)',
        [species_id, feeding_interval, recommended_food],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Feeding schedule added", id: result.insertId });
        }
    );
});

// Get all feeding records
router.get('/', (req, res) => {
    db.query('SELECT * FROM Feeding', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a feeding record
router.post('/', (req, res) => {
    const { animal_id, feeding_time, food_type } = req.body;
    if (!animal_id || !food_type) {
        return res.status(400).json({ error: "Animal ID and Food Type are required" });
    }

    db.query('INSERT INTO Feeding (animal_id, feeding_time, food_type) VALUES (?, NOW(), ?)',
        [animal_id, food_type],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Feeding record added", id: result.insertId });
        }
    );
});

module.exports = router;
