const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { name, email, password, gender } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create({ name, email, password, gender });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { name: user.name, email: user.email, respectPoints: user.respectPoints } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, respectPoints: user.respectPoints } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
