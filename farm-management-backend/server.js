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
const productStockRoutes = require('./routes/v1/productStockRoutes');
const supplierRoutes = require('./routes/v1/supplierRoutes');
const farmRoutes = require('./routes/v1/farmRoutes');
const veterinaryRoutes = require('./routes/v1/veterinaryRoutes');
const healthIssuesRoutes = require('./routes/v1/healthIssuesRoutes');
const environmentalConditionsRoutes = require('./routes/v1/environmentalConditionsRoutes');
const performanceMetricsRoutes = require('./routes/v1/performanceMetricsRoutes');
const alertSystemRoutes = require('./routes/v1/alertSystemRoutes');
const feedingTypeRoutes = require('./routes/v1/feedingTypeRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
	origin: ["http://54.78.191.66:3000", "http://localhost:3000"],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE"]
}));

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
app.use('/api/v1/product-stock', productStockRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/farm', farmRoutes);
app.use('/api/v1/veterinary-visits', veterinaryRoutes);
app.use('/api/v1/health-issues', healthIssuesRoutes);
app.use('/api/v1/environmental-conditions', environmentalConditionsRoutes);
app.use('/api/v1/performance-metrics', performanceMetricsRoutes);
app.use('/api/v1/alerts', alertSystemRoutes);
app.use('/api/v1/feeding-type', feedingTypeRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
