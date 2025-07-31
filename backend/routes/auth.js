const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Registration Route
router.post('/register', register);
router.post('/login', login);

router.get('/test-auth', (req, res) => {
    res.send('Auth route is working!');
});

module.exports = router;
