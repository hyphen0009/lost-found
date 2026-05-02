const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/subscribe', auth, async (req, res) => {
  try {
    const subscription = req.body;
    const user = await User.findById(req.user.id);
    
    // Check if subscription already exists
    const exists = user.pushSubscriptions.find(s => s.endpoint === subscription.endpoint);
    if (!exists) {
      user.pushSubscriptions.push(subscription);
      await user.save();
    }
    
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET leaderboard (Top 10 by respect points)
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ respectPoints: -1 })
      .limit(10)
      .select('name gender respectPoints');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
