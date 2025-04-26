const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all feeding schedules
router.get('/', verifyToken, (req, res) => {
    const roleName = req.user.role_name;
    const farmId = req.user.farm_id;

    let query;
    let params = [];

    if (roleName === 'admin') {
        query = 'SELECT * FROM Feeding_Schedule';
    } else {
        query = 'SELECT * FROM Feeding_Schedule WHERE farm_id = ?';
        params = [farmId];
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a single feeding schedule by ID
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM Feeding_Schedule WHERE schedule_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Feeding schedule not found" });
        res.json(results[0]);
    });
});

// Create a new feeding schedule
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_id, food_type, feeding_interval, recommended_food, health } = req.body;
    let farm_id;

    if (req.user.role_name === 'admin') {
        farm_id = req.body.farm_id;
    } else {
        farm_id = req.user.farm_id;
    }

    if (!herd_id || !farm_id || !food_type || !feeding_interval) {
        return res.status(400).json({ error: "herd_id, farm_id, food_type, and feeding_interval are required" });
    }

    db.query('SELECT * FROM Herd WHERE herd_id = ? AND farm_id = ?', [herd_id, farm_id], (err, herdResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (herdResults.length === 0) {
            return res.status(400).json({ error: "Invalid herd_id for the selected farm. It does not exist." });
        }

        db.query(
            'INSERT INTO Feeding_Schedule (herd_id, farm_id, food_type, feeding_interval, recommended_food, health) VALUES (?, ?, ?, ?, ?, ?)',
            [herd_id, farm_id, food_type, feeding_interval, recommended_food || null, health || null],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Feeding schedule added successfully", schedule_id: result.insertId });
            }
        );
    });
});

// Update an existing feeding schedule
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { herd_id, food_type, feeding_interval, recommended_food, health } = req.body;

    db.query(
        'UPDATE Feeding_Schedule SET herd_id = ?, food_type = ?, feeding_interval = ?, recommended_food = ?, health = ? WHERE schedule_id = ?',
        [herd_id, food_type, feeding_interval, recommended_food, health, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Feeding schedule not found" });
            res.json({ message: "Feeding schedule updated successfully" });
        }
    );
});

// Delete a feeding schedule
router.delete('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Feeding_Schedule WHERE schedule_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Feeding schedule not found" });
        res.json({ message: "Feeding schedule deleted successfully" });
    });
});

module.exports = router;
