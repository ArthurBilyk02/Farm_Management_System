const db = require('../db');

const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: "API Key is required" });
    }

    db.query('SELECT * FROM Api_Keys WHERE key_value = ?', [apiKey], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(403).json({ error: "Invalid API Key" });
        }

        req.apiUser = results[0];
        next();
    });
};

module.exports = apiKeyAuth;
