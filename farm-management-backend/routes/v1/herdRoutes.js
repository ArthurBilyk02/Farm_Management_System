const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all herds
router.get('/', verifyToken, (req, res) => {
    const { role_name, farm_id } = req.user;

    let query = `
    SELECT 
        Herd.*, 
        Feeding_Schedule.food_type, 
        Feeding_Schedule.feeding_interval 
    FROM Herd 
    LEFT JOIN Feeding_Schedule 
        ON Herd.schedule_id = Feeding_Schedule.schedule_id
    `;
    let params = [];

    if (role_name !== 'admin') {
    query += ' WHERE Herd.farm_id = ?';
    params.push(farm_id);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error fetching herds:", err);
            return res.status(500).json({ error: "Database error occurred" });
        }
        res.json(results);
    });
});

// Get herds by farm_id
router.get('/by-farm/:farmId', verifyToken, (req, res) => {
    const { farmId } = req.params;

    db.query('SELECT * FROM Herd WHERE farm_id = ?', [farmId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
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
    let { herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description } = req.body;

    if (req.user.role_name === 'employee') {
        farm_id = req.user.farm_id;
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
    let { herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description } = req.body;

    // Employees can only update herds from their own farm and cannot change the farm_id
    if (req.user.role_name === 'employee') {
        db.query('SELECT farm_id FROM Herd WHERE herd_id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error while verifying herd" });
            if (results.length === 0) return res.status(404).json({ error: "Herd not found" });

            const currentFarmId = results[0].farm_id;

            // Block update if it's not the user's farm
            if (currentFarmId !== req.user.farm_id) {
                return res.status(403).json({ error: "Unauthorized to update this herd." });
            }

            farm_id = currentFarmId;

            const normalizedScheduleId = schedule_id === '' ? null : schedule_id;

            db.query(
                'UPDATE Herd SET herd_name = ?, farm_id = ?, species_id = ?, size = ?, date_created = ?, schedule_id = ?, health_status = ?, description = ? WHERE herd_id = ?',
                [herd_name, farm_id, species_id, size, date_created, normalizedScheduleId, health_status, description, id],
                (err, result) => {
                    if (err) return res.status(500).json({ error: "Error updating herd" });
                    if (result.affectedRows === 0) return res.status(404).json({ message: "Herd not found" });
                    res.json({ message: "Herd updated successfully" });
                }
            );
        });

    } else {
        // Admins can update freely
        const normalizedScheduleId = schedule_id === '' ? null : schedule_id;

        db.query(
            'UPDATE Herd SET herd_name = ?, farm_id = ?, species_id = ?, size = ?, date_created = ?, schedule_id = ?, health_status = ?, description = ? WHERE herd_id = ?',
            [herd_name, farm_id, species_id, size, date_created, normalizedScheduleId, health_status, description, id],
            (err, result) => {
                if (err) return res.status(500).json({ error: "Error updating herd" });
                if (result.affectedRows === 0) return res.status(404).json({ message: "Herd not found" });
                res.json({ message: "Herd updated successfully" });
            }
        );
    }
});

// Delete a herd 
router.delete('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;

    // If employee
    if (req.user.role_name === 'employee') {
        db.query('SELECT farm_id FROM Herd WHERE herd_id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error occurred while checking herd farm_id" });
            if (results.length === 0) return res.status(404).json({ message: "Herd not found" });

            const herdFarmId = results[0].farm_id;

            if (herdFarmId !== req.user.farm_id) {
                return res.status(403).json({ error: "You are not authorized to delete this herd." });
            }

            db.query('DELETE FROM Herd WHERE herd_id = ?', [id], (err, result) => {
                if (err) return res.status(500).json({ error: "Error deleting herd" });
                res.json({ message: "Herd deleted successfully" });
            });
        });

    } else {
        db.query('DELETE FROM Herd WHERE herd_id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error deleting herd" });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Herd not found" });
            res.json({ message: "Herd deleted successfully" });
        });
    }
});

module.exports = router;