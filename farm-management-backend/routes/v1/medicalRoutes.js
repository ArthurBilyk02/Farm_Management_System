const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get all medical history records
router.get('/', (req, res) => {
    db.query('SELECT * FROM Medical_History', (err, results) => {
        if (err) {
            console.error("Error fetching medical history:", err);
            return res.status(500).json({ error: "Database error occurred" });
        }
        res.json(results);
    });
});

// Get a single medical history record by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Medical_History WHERE medical_id = ?', [id], (err, results) => {
        if (err) {
            console.error("Error fetching medical history record:", err);
            return res.status(500).json({ error: "Database error occurred" });
        }
        if (results.length === 0) return res.status(404).json({ message: "Medical history record not found" });
        res.json(results[0]);
    });
});

// Create a new medical history record
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { herd_id, visit_id, health_issue_id, treatment, vet_notes, date } = req.body;

    if (!herd_id || !visit_id || !health_issue_id || !treatment || !vet_notes || !date) {
        return res.status(400).json({ error: "herd_id, visit_id, health_issue_id, treatment, vet_notes, and date are required" });
    }

    db.query('SELECT * FROM Herd WHERE herd_id = ?', [herd_id], (err, herdResults) => {
        if (err) return res.status(500).json({ error: "Database error occurred" });
        if (herdResults.length === 0) {
            return res.status(400).json({ error: "Invalid herd_id. It does not exist." });
        }

        db.query('SELECT * FROM Veterinary_Visits WHERE visit_id = ?', [visit_id], (err, visitResults) => {
            if (err) return res.status(500).json({ error: "Database error occurred" });
            if (visitResults.length === 0) {
                return res.status(400).json({ error: "Invalid visit_id. It does not exist." });
            }

            db.query('SELECT * FROM Health_Issues WHERE health_issue_id = ?', [health_issue_id], (err, healthResults) => {
                if (err) return res.status(500).json({ error: "Database error occurred" });
                if (healthResults.length === 0) {
                    return res.status(400).json({ error: "Invalid health_issue_id. It does not exist." });
                }

                db.query(
                    'INSERT INTO Medical_History (herd_id, visit_id, health_issue_id, treatment, vet_notes, date) VALUES (?, ?, ?, ?, ?, ?)',
                    [herd_id, visit_id, health_issue_id, treatment, vet_notes, date],
                    (err, result) => {
                        if (err) {
                            console.error("Error inserting medical history:", err);
                            return res.status(500).json({ error: "Database error occurred" });
                        }
                        res.json({ message: "Medical history record added successfully", medical_id: result.insertId });
                    }
                );
            });
        });
    });
});

// Update an existing medical history record
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { herd_id, visit_id, health_issue_id, treatment, vet_notes, date } = req.body;

    db.query(
        'UPDATE Medical_History SET herd_id = ?, visit_id = ?, health_issue_id = ?, treatment = ?, vet_notes = ?, date = ? WHERE medical_id = ?',
        [herd_id, visit_id, health_issue_id, treatment, vet_notes, date, id],
        (err, result) => {
            if (err) {
                console.error("Error updating medical history:", err);
                return res.status(500).json({ error: "Database error occurred" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Medical history record not found" });
            }
            res.json({ message: "Medical history record updated successfully" });
        }
    );
});

// Delete a medical history record
router.delete('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Medical_History WHERE medical_id = ?', [id], (err, result) => {
        if (err) {
            console.error("Error deleting medical history:", err);
            return res.status(500).json({ error: "Database error occurred" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Medical history record not found" });
        }
        res.json({ message: "Medical history record deleted successfully" });
    });
});

module.exports = router;