const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../../middlewares/apiKeyAuth');

router.get('/animals', apiKeyAuth, (req, res) => {
    res.json({ message: "Public users can only see animals" });
});

module.exports = router;
