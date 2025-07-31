const express = require('express');
const router = express.Router();

// Placeholder route for now
router.get('/test-tasks', (req, res) => {
    res.send('Tasks route is working!');
});

module.exports = router;
