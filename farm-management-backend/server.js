require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const speciesRoutes = require('./routes/speciesRoutes');
const animalRoutes = require('./routes/animalRoutes');
const feedingRoutes = require('./routes/feedingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const medicalRoutes = require('./routes/medicalRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/species', speciesRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/feeding', feedingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/medical', medicalRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
