const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createItem, getItems, verifyItem, deleteItem, getMyItems } = require('../controllers/itemController');

// Specific routes MUST come before general ones
router.get('/my-items', auth, getMyItems);
router.get('/', getItems);

router.post('/', auth, createItem); 
router.post('/:id/verify', auth, verifyItem); 
router.delete('/:id', auth, deleteItem); 

module.exports = router;
