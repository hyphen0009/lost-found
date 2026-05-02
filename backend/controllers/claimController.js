const Claim = require('../models/Claim');
const Item = require('../models/Item');
const User = require('../models/User');
const { sendPushNotification } = require('../utils/push');

// Submit a new claim
const submitClaim = async (req, res) => {
  try {
    console.log('Claim submission attempt:', req.body);
    const { itemId, answers } = req.body;
    const claimantId = req.user.id;

    // 1. Check if item exists and isn't owned by the claimant
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.founder.toString() === claimantId) {
      return res.status(400).json({ error: 'You cannot claim your own found item' });
    }

    // 2. Check claim limit (max 3 per item per user)
    const existingClaims = await Claim.countDocuments({ item: itemId, claimant: claimantId });
    if (existingClaims >= 3) {
      return res.status(400).json({ error: 'You have reached the maximum number of claims (3) for this item.' });
    }

    // 3. Create claim
    const claim = await Claim.create({
      item: itemId,
      claimant: claimantId,
      answers
    });

    // 4. Notify the founder
    const founder = await User.findById(item.founder);
    if (founder) {
      sendPushNotification(founder, {
        title: 'New Claim Request! 🎒',
        body: `Someone has claimed your item: ${item.title}`,
        url: '/manage-claims'
      });
    }

    res.status(201).json(claim);
  } catch (err) {
    console.error('Claim Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all claims for an item (Founder only)
const getClaimsForItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.founder.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to see claims for this item' });
    }

    const claims = await Claim.find({ item: itemId }).populate('claimant', 'name email');
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update claim status (Founder only)
const updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const claim = await Claim.findById(claimId).populate('item');
    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    if (claim.item.founder.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    claim.status = status;
    await claim.save();

    // If approved, mark the item as resolved so it disappears from the main feed
    if (status === 'approved') {
      await Item.findByIdAndUpdate(claim.item._id, { status: 'resolved' });
    }

    // Notify the claimant
    const claimant = await User.findById(claim.claimant);
    if (claimant) {
      const isApproved = status === 'approved';
      sendPushNotification(claimant, {
        title: isApproved ? 'Claim Approved! 🎉' : 'Claim Rejected ❌',
        body: isApproved 
          ? `Great news! Your claim for "${claim.item.title}" was approved.` 
          : `Sorry, your claim for "${claim.item.title}" was rejected by the founder.`,
        url: '/my-claims'
      });
    }

    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get claims I have made
const getMyClaims = async (req, res) => {
  try {
    console.log('Fetching claims for user:', req.user.id);
    const claims = await Claim.find({ claimant: req.user.id })
      .populate({
        path: 'item',
        select: 'title image contact status'
      });
    console.log(`Found ${claims.length} claims.`);
    res.json(claims);
  } catch (err) {
    console.error('getMyClaims Error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitClaim, getClaimsForItem, updateClaimStatus, getMyClaims };
