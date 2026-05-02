const Item = require('../models/Item');
const User = require('../models/User');

const createItem = async (req, res) => {
  try {
    const { title, description, location, color, image, contact } = req.body;
    const item = await Item.create({ 
      title, 
      description, 
      category: 'found', // Always found as per new CORE RULE
      location, 
      color, 
      image, 
      contact,
      founder: req.user.id 
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { respectPoints: 50 } });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'active' }; // Only show active items
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query).populate('founder', 'name').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyItems = async (req, res) => {
  try {
    console.log('Fetching items for user:', req.user.id);
    const items = await Item.find({ founder: req.user.id }).sort({ createdAt: -1 });
    console.log(`Found ${items.length} items.`);
    res.json(items);
  } catch (err) {
    console.error('getMyItems Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    // Only the founder can delete their post
    if (item.founder.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, location } = req.body;
    
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Case-insensitive matching for color and location
    const isColorMatch = item.color.toLowerCase() === color.toLowerCase();
    const isLocationMatch = item.location.toLowerCase() === location.toLowerCase();

    if (isColorMatch && isLocationMatch) {
      res.json({ verified: true, contact: item.contact });
    } else {
      res.status(400).json({ verified: false, error: 'Details do not match. Try again.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createItem, getItems, verifyItem, deleteItem, getMyItems };
