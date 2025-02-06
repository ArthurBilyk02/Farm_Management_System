const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Admin - View All Users and Their Roles
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

// Admin - Edit User Role
router.put('/edit-role/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'employee', 'public'].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'admin', 'employee', or 'public'." });
    }

    db.query('UPDATE Users SET role = ? WHERE id = ?', [role, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json({ message: "User role updated successfully" });
    });
});

// Admin - Delete User
router.delete('/delete-user/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;
