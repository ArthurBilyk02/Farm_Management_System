const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get All Feeding Types
router.get('/', verifyToken, (req, res) => {
    const farmId = req.user.farm_id;
    const roleName = req.user.role_name;
  
    let query;
    let params = [];
  
    if (roleName === 'admin') {
      query = `
        SELECT ft.*, 
               f.location AS farm_location,
               s.species_name,
               sch.food_type AS schedule_food_type,
               sch.feeding_interval AS schedule_feeding_interval
        FROM Feeding_Type ft
        JOIN Feeding_Schedule sch ON ft.schedule_id = sch.schedule_id
        JOIN Species s ON ft.species_id = s.species_id
        JOIN Farm f ON sch.farm_id = f.farm_id
      `;
    } else {
      query = `
        SELECT ft.*,
               s.species_name,
               sch.food_type AS schedule_food_type,
               sch.feeding_interval AS schedule_feeding_interval
        FROM Feeding_Type ft
        JOIN Feeding_Schedule sch ON ft.schedule_id = sch.schedule_id
        JOIN Species s ON ft.species_id = s.species_id
        JOIN Farm f ON sch.farm_id = f.farm_id
        WHERE f.farm_id = ?
      `;
      params = [farmId];
    }
  
    db.query(query, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});

// Get a Specific Feeding Type by ID
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM Feeding_Type WHERE feeding_type_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Feeding type not found" });
        res.json(results[0]);
    });
});

// Create a New Feeding Type
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { food_type, schedule_id, species_id, description } = req.body;

    if (!food_type || !schedule_id || !species_id) {
        return res.status(400).json({ error: "food_type, schedule_id, and species_id are required" });
    }

    db.query(
        'INSERT INTO Feeding_Type (food_type, schedule_id, species_id, description) VALUES (?, ?, ?, ?)',
        [food_type, schedule_id, species_id, description || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Feeding type added successfully", feeding_type_id: result.insertId });
        }
    );
});

// Update a Feeding Type
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { food_type, schedule_id, species_id, description } = req.body;

    db.query(
        'UPDATE Feeding_Type SET food_type = ?, schedule_id = ?, species_id = ?, description = ? WHERE feeding_type_id = ?',
        [food_type, schedule_id, species_id, description, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Feeding type not found" });
            res.json({ message: "Feeding type updated successfully" });
        }
    );
});

// Delete a Feeding Type
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Feeding_Type WHERE feeding_type_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Feeding type not found" });
        res.json({ message: "Feeding type deleted successfully" });
    });
});

module.exports = router;
