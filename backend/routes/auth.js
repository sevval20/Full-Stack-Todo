const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Username or email is already in use'
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid username or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid username or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user info
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router; 