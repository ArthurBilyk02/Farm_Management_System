const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// GET All Herds
router.get('/', (req, res) => {
    db.query('SELECT * FROM Herd', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST Create a New Herd
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description } = req.body;

    if (!herd_name || !farm_id || !species_id) {
        return res.status(400).json({ error: "herd_name, farm_id, and species_id are required" });
    }

    const formattedDate = date_created ? new Date(date_created).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

    db.query(
        'INSERT INTO Herd (herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [herd_name, farm_id, species_id, size || 0, formattedDate, schedule_id || null, health_status || null, description || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Herd added successfully", id: result.insertId });
        }
    );
});

module.exports = router;
