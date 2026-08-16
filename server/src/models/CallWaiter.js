const mongoose = require('mongoose');

const callWaiterSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    tableNumber: { type: String, required: true },
    type: { type: String, enum: ['water', 'bill', 'assistance'], default: 'assistance' },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CallWaiter', callWaiterSchema);
