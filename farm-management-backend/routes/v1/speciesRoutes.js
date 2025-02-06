const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

router.get('/', (req, res) => {
    db.query('SELECT * FROM Species', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { type_id, species_name, description } = req.body;

    if (!type_id || !species_name || !description) {
        return res.status(400).json({ error: "All fields are required" });
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
