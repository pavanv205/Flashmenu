const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    plan: { type: String, enum: ['FREE', 'PRO', 'BUSINESS'], default: 'FREE' },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
