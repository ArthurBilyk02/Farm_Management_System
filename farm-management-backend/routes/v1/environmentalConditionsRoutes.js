const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// GET All Environmental Conditions
router.get('/', (req, res) => {
    db.query('SELECT * FROM Environmental_Conditions', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET a Single Environmental Condition by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Environmental_Conditions WHERE env_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Environmental condition not found" });
        res.json(results[0]);
    });
});

// Create a New Environmental Condition
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { farm_id, temperature, humidity, water_quality } = req.body;

    if (!farm_id || !temperature || !humidity || !water_quality) {
        return res.status(400).json({ error: "farm_id, temperature, humidity, and water_quality are required" });
    }

    db.query(
        'INSERT INTO Environmental_Conditions (farm_id, temperature, humidity, water_quality) VALUES (?, ?, ?, ?)',
        [farm_id, temperature, humidity, water_quality],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Environmental condition recorded successfully", env_id: result.insertId });
        }
    );
});

// Update an Existing Environmental Condition
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { temperature, humidity, water_quality } = req.body;

    db.query(
        'UPDATE Environmental_Conditions SET temperature = ?, humidity = ?, water_quality = ? WHERE env_id = ?',
        [temperature, humidity, water_quality, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Environmental condition not found" });
            res.json({ message: "Environmental condition updated successfully" });
        }
    );
});

// Delete an Environmental Condition
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Environmental_Conditions WHERE env_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Environmental condition not found" });
        res.json({ message: "Environmental condition deleted successfully" });
    });
});

module.exports = router;
