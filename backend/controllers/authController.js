const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    });
};

const register = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Validation
        if (!loginId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide login ID and password'
            });
        }

        if (loginId.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Login ID must be at least 3 characters long'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ loginId: loginId.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this login ID already exists'
            });
        }

        // Create user
        const user = await User.create({
            loginId: loginId.trim().toLowerCase(),
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                loginId: user.loginId,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User with this login ID already exists'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

const login = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Validation
        if (!loginId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide login ID and password'
            });
        }

        // Find user
        const user = await User.findOne({ loginId: loginId.trim().toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid login credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid login credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                loginId: user.loginId,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                loginId: user.loginId,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};