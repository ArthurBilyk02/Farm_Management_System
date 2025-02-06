const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

router.get('/', (req, res) => {
    db.query('SELECT * FROM Animal', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { species_id, age, health_status } = req.body;

    if (!species_id || !age || !health_status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query('INSERT INTO Animal (species_id, age, health_status) VALUES (?, ?, ?)',
        [species_id, age, health_status],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Animal added successfully", id: result.insertId });
        }
    );
});

module.exports = router;
