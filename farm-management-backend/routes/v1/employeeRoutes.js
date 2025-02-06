const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Employees-only dashboard
router.get('/dashboard', verifyToken, requireRole(['employee']), (req, res) => {
    res.json({ message: "Welcome, Employee!" });
});

router.get('/tasks', verifyToken, requireRole(['employee']), (req, res) => {
    res.json({ message: "Employees can see their assigned tasks" });
});

module.exports = router;
