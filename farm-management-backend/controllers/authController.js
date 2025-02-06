const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User registration (Admin/Employee)
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: "Username, password, and role are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)', 
        [username, hashedPassword, role], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User registered successfully", id: result.insertId });
        }
    );
};

// User login (JWT token generation)
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRY }
        );

        res.json({ message: "Login successful", token });
    });
};
