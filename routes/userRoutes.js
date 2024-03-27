const express = require('express');
const User = require('../models/User'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../authMiddleware');
const router = express.Router();

// Route to create a new user with hashed password - No verifyToken here
router.post('/users', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        
        res.status(201).send({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route for user login - No verifyToken here
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token, userId: user._id.toString() });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

// Route to get all users
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Fetch all users but exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
