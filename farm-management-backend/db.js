require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL Connection Failed:', err);
        process.exit(1);
    } else {
        console.log('✅ MySQL Connected...');
        connection.release(); 
    }
});

module.exports = pool;
