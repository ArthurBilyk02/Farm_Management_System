const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Admin Dashboard - View All Users and Their Roles
router.get('/dashboard', verifyToken, requireRole(['admin']), (req, res) => {
    const query = `SELECT id, username, role, created_at FROM Users`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            total_users: results.length,
            users: results
        });
    });
});

module.exports = router;
