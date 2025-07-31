const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

// Registration Route
router.post('/register', register);

router.get('/test-auth', (req, res) => {
    res.send('Auth route is working!');
});

module.exports = router;
