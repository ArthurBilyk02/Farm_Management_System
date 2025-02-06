const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

router.get('/', (req, res) => {
    db.query('SELECT * FROM Transactions', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const {transaction_date, transaction_type, amount, description } = req.body;

    if (!transaction_date || !transaction_type || !amount || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query('INSERT INTO Transactions (transaction_date, transaction_type, amount, description) VALUES (?, ?, ?, ?)',
        [transaction_date, transaction_type, amount, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Transaction added successfully", id: result.insertId });
        }
    );
});

module.exports = router;
