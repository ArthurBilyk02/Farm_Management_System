const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get all medical history records
router.get('/', (req, res) => {
    db.query('SELECT * FROM Medical_History', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a medical record
router.post('/', (req, res) => {
    const { animal_id, date, treatment, vet_notes } = req.body;
    if (!animal_id || !date || !treatment) {
        return res.status(400).json({ error: "Animal ID, Date, and Treatment are required" });
    }

    db.query('INSERT INTO Medical_History (animal_id, date, treatment, vet_notes) VALUES (?, ?, ?, ?)',
        [animal_id, date, treatment, vet_notes],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Medical record added", id: result.insertId });
        }
    );
});

module.exports = router;
