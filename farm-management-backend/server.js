require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const speciesRoutes = require('./routes/v1/speciesRoutes');
const animalRoutes = require('./routes/v1/animalRoutes');
const feedingScheduleRoutes = require('./routes/v1/feedingScheduleRoutes');
const transactionRoutes = require('./routes/v1/transactionRoutes');
const medicalRoutes = require('./routes/v1/medicalRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/v1/adminRoutes');
const employeeRoutes = require('./routes/v1/employeeRoutes');
const publicRoutes = require('./routes/v1/publicRoutes');
const herdRoutes = require('./routes/v1/herdRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/animals', animalRoutes);
app.use('/api/v1/feeding-schedule', feedingScheduleRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/medical', medicalRoutes);
app.use('/api/v1/species', speciesRoutes);
app.use('/api/v1/herd', herdRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
