const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    tableNumber: { type: String, default: '' },
    customerName: { type: String, default: 'Anonymous' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
