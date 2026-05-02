const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: {
    description: { type: String, required: true },
    location: { type: String, required: true },
    uniqueMarks: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Prevent more than 3 claims per user per item
claimSchema.index({ item: 1, claimant: 1 }, { unique: false }); 

module.exports = mongoose.model('Claim', claimSchema);
