const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

router.get('/dashboard', verifyToken, requireRole(['admin']), (req, res) => {
    const query = `SELECT employee_id, email, role_name, farm_id FROM Users`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            total_users: results.length,
            users: results
        });
    });
});

router.put('/edit-role/:employee_id', verifyToken, requireRole(['admin']), (req, res) => {
    const { employee_id } = req.params;
    const { role_name } = req.body;

    if (!role_name || !['admin', 'employee', 'public'].includes(role_name)) {
        return res.status(400).json({ error: "Invalid role. Must be 'admin', 'employee', or 'public'." });
    }

    db.query('SELECT * FROM Users WHERE employee_id = ?', [employee_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "User not found." });

        db.query('UPDATE Users SET role_name = ? WHERE employee_id = ?', [role_name, employee_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `User role updated to '${role_name}' successfully` });
        });
    });
});

router.delete('/delete-user/:employee_id', verifyToken, requireRole(['admin']), (req, res) => {
    const { employee_id } = req.params;

    db.query('SELECT * FROM Users WHERE employee_id = ?', [employee_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "User not found." });

        db.query('DELETE FROM Users WHERE employee_id = ?', [employee_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User deleted successfully" });
        });
    });
});

module.exports = router;
