const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER a new user
exports.register = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ loginId });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({ loginId, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// LOGIN a user
exports.login = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Find user by loginId
        const user = await User.findOne({ loginId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({ message: 'Login successful', token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};