const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subCategory: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    vegType: { type: String, enum: ['veg', 'non-veg', 'egg'], default: 'veg' },
    spicyLevel: { type: Number, default: 0, min: 0, max: 3 }, // 0: None, 1: Mild, 2: Medium, 3: Hot
    isBestseller: { type: Boolean, default: false },
    isChefSpecial: { type: Boolean, default: false },
    isNewItem: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true }, // SOLD OUT toggle
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
