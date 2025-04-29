const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User registration
exports.register = async (req, res) => {
    const { email, password, role_name, farm_id } = req.body;

    if (!email || !password || !role_name) {
        return res.status(400).json({ error: "Email, password, and role name are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO Users (email, password, role_name, farm_id) VALUES (?, ?, ?, ?)', 
            [email, hashedPassword, role_name, farm_id || null], 
            (err, result) => {
                if (err) {
                    console.error("Registration Error:", err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: "A user with this email already exists." });
                    }
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: "User registered successfully", employee_id: result.insertId });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!user.role_name || !user.farm_id) {
            return res.status(500).json({ error: "User role or farm ID is missing from database." });
        }

        const token = jwt.sign(
            {   
                employee_id: user.employee_id, 
                role_name: user.role_name, 
                farm_id: user.farm_id 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRY }
        );

        res.json({ 
            message: "Login successful", 
            token, 
            role_name: user.role_name, 
            farm_id: user.farm_id 
        });
    });
};