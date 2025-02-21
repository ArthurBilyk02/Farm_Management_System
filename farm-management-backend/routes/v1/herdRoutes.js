const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all herds
router.get('/', (req, res) => {
    db.query('SELECT * FROM Herd', (err, results) => {
        if (err) {
            console.error("Error fetching herds:", err);
            return res.status(500).json({ error: "Database error occurred" });
        }
        res.json(results);
    });
});

// Get a single herd by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Herd WHERE herd_id = ?', [id], (err, results) => {
        if (err) {
            console.error("Error fetching herd:", err);
            return res.status(500).json({ error: "Database error occurred" });
        }
        if (results.length === 0) return res.status(404).json({ message: "Herd not found" });
        res.json(results[0]);
    });
});

// Create a new herd
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description } = req.body;

    if (!herd_name || !farm_id || !species_id) {
        return res.status(400).json({ error: "herd_name, farm_id, and species_id are required" });
    }

    db.query('SELECT * FROM Farm WHERE farm_id = ?', [farm_id], (err, farmResults) => {
        if (err) return res.status(500).json({ error: "Database error occurred" });
        if (farmResults.length === 0) {
            return res.status(400).json({ error: "Invalid farm_id. It does not exist." });
        }

        db.query('SELECT * FROM Species WHERE species_id = ?', [species_id], (err, speciesResults) => {
            if (err) return res.status(500).json({ error: "Database error occurred" });
            if (speciesResults.length === 0) {
                return res.status(400).json({ error: "Invalid species_id. It does not exist." });
            }

            db.query(
                'INSERT INTO Herd (herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [herd_name, farm_id, species_id, size || 0, date_created || new Date(), schedule_id || null, health_status || null, description || null],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting herd:", err);
                        return res.status(500).json({ error: "Database error occurred" });
                    }
                    res.json({ message: "Herd added successfully", herd_id: result.insertId });
                }
            );
        });
    });
});

// Update an existing herd 
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description } = req.body;

    db.query(
        'UPDATE Herd SET herd_name = ?, farm_id = ?, species_id = ?, size = ?, date_created = ?, schedule_id = ?, health_status = ?, description = ? WHERE herd_id = ?',
        [herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description, id],
        (err, result) => {
            if (err) {
                console.error("Error updating herd:", err);
                return res.status(500).json({ error: "Database error occurred" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Herd not found" });
            }
            res.json({ message: "Herd updated successfully" });
        }
    );
});

// Delete a herd 
router.delete('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Herd WHERE herd_id = ?', [id], (err, result) => {
        if (err) {
            console.error("Error deleting herd:", err);
            return res.status(500).json({ error: "Database error occurred" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Herd not found" });
        }
        res.json({ message: "Herd deleted successfully" });
    });
});

module.exports = router;
