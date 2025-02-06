const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

router.get('/', (req, res) => {
    db.query('SELECT * FROM Feeding_Schedule', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { species_id, feeding_interval, recommended_food } = req.body;

    if (!species_id || !feeding_interval || !recommended_food) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query('SELECT * FROM Species WHERE species_id = ?', [species_id], (err, speciesResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (speciesResults.length === 0) {
            return res.status(400).json({ error: "Invalid species_id: No such species exists." });
        }

        // Insert feeding schedule
        db.query('INSERT INTO Feeding_Schedule (species_id, feeding_interval, recommended_food) VALUES (?, ?, ?)',
            [species_id, feeding_interval, recommended_food],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Feeding schedule added successfully", id: result.insertId });
            }
        );
    });
});

module.exports = router;
