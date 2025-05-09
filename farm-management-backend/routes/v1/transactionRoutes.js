const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verifyToken, requireRole } = require('../../middlewares/authMiddleware');

// Get All Transactions
router.get('/', verifyToken, (req, res) => {
    const query = `
      SELECT t.*, f.location AS farm_name
      FROM Transactions t
      LEFT JOIN Farm f ON t.farm_id = f.farm_id
    `;
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

// Get a Specific Transaction by ID
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Transactions WHERE transaction_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Transaction not found" });
        res.json(results[0]);
    });
});

// Create a New Transaction
router.post('/', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { product_id, transaction_type, quantity, transaction_date, total_cost, farm_id } = req.body;
  
    if (!product_id || !transaction_type || !quantity || !total_cost || !farm_id) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    db.query('SELECT * FROM Product_Stock WHERE product_id = ?', [product_id], (err, productResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (productResults.length === 0) {
        return res.status(400).json({ error: "Invalid product_id. Product does not exist." });
      }
  
      const currentStock = productResults[0].stock_level;
      let newStock;
  
      if (transaction_type === 'Stock_Purchase') {
        newStock = currentStock + parseFloat(quantity);
      } else if (transaction_type === 'Stock_Sale') {
        newStock = currentStock - parseFloat(quantity);
        if (newStock < 0) {
          return res.status(400).json({ error: "Not enough stock to complete this sale." });
        }
      } else {
        newStock = currentStock;
      }
  
      db.query('UPDATE Product_Stock SET stock_level = ? WHERE product_id = ?', [newStock, product_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
  
        db.query(
          'INSERT INTO Transactions (product_id, transaction_type, quantity, transaction_date, total_cost, farm_id) VALUES (?, ?, ?, ?, ?, ?)',
          [product_id, transaction_type, quantity, transaction_date || new Date(), total_cost, farm_id],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Transaction created and stock updated", transaction_id: result.insertId });
          }
        );
      });
    });
  });

// Update a Transaction
router.put('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
    const { product_id, transaction_type, quantity, transaction_date, total_cost } = req.body;
  
    db.query('SELECT * FROM Transactions WHERE transaction_id = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Transaction not found" });
  
      const oldTransaction = results[0];
  
      db.query('SELECT * FROM Product_Stock WHERE product_id = ?', [product_id], (err, productResults) => {
        if (err) return res.status(500).json({ error: err.message });
  
        let currentStock = productResults[0].stock_level;
  
        if (oldTransaction.transaction_type === 'Stock_Purchase') {
          currentStock -= oldTransaction.quantity;
        } else if (oldTransaction.transaction_type === 'Stock_Sale') {
          currentStock += oldTransaction.quantity;
        }
  
        if (transaction_type === 'Stock_Purchase') {
          currentStock += parseFloat(quantity);
        } else if (transaction_type === 'Stock_Sale') {
          currentStock -= parseFloat(quantity);
          if (currentStock < 0) {
            return res.status(400).json({ error: "Not enough stock to apply this change." });
          }
        }
  
        db.query('UPDATE Product_Stock SET stock_level = ? WHERE product_id = ?', [currentStock, product_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
  
          db.query(
            'UPDATE Transactions SET product_id = ?, transaction_type = ?, quantity = ?, transaction_date = ?, total_cost = ? WHERE transaction_id = ?',
            [product_id, transaction_type, quantity, transaction_date, total_cost, id],
            (err, result) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ message: "Transaction and stock updated successfully" });
            }
          );
        });
      });
    });
  });

// Delete a Transaction
router.delete('/:id', verifyToken, requireRole(['admin', 'employee']), (req, res) => {
    const { id } = req.params;
  
    db.query('SELECT * FROM Transactions WHERE transaction_id = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Transaction not found" });
  
      const { product_id, transaction_type, quantity } = results[0];
  
      db.query('SELECT * FROM Product_Stock WHERE product_id = ?', [product_id], (err, productResults) => {
        if (err) return res.status(500).json({ error: err.message });
  
        let currentStock = productResults[0].stock_level;

        if (transaction_type === 'Stock_Purchase') {
          currentStock -= quantity;
        } else if (transaction_type === 'Stock_Sale') {
          currentStock += quantity;
        }
  
        db.query('UPDATE Product_Stock SET stock_level = ? WHERE product_id = ?', [currentStock, product_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
  
          db.query('DELETE FROM Transactions WHERE transaction_id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Transaction deleted and stock reverted" });
          });
        });
      });
    });
  });

module.exports = router;
