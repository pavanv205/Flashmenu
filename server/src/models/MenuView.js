const mongoose = require('mongoose');

const menuViewSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    sessionHash: { type: String, required: true },
    tableNumber: { type: String, default: null },
    userAgent: { type: String, default: '' },
    referrer: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuView', menuViewSchema);
