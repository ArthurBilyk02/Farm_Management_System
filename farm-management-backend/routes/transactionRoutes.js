const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all transactions
router.get('/', (req, res) => {
    db.query('SELECT * FROM Transactions', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new transaction
router.post('/', (req, res) => {
    const { farm_id, transaction_date, transaction_type, amount, description } = req.body;
    if (!farm_id || !transaction_date || !transaction_type || !amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query('INSERT INTO Transactions (farm_id, transaction_date, transaction_type, amount, description) VALUES (?, ?, ?, ?, ?)',
        [farm_id, transaction_date, transaction_type, amount, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Transaction added", id: result.insertId });
        }
    );
});

module.exports = router;
