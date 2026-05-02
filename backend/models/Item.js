const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['lost', 'found'], required: true },
    location: { type: String, required: true },
    color: { type: String, required: true }, // Verification field
    image: { type: String, default: '' },
    contact: { type: String, required: true },
    founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    createdAt: { type: Date, default: Date.now, expires: 604800 } // Auto-delete after 7 days (604800 seconds)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
