const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    tagline: { type: String, default: 'Scan Tap Dine' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' },
    openingHours: { type: String, default: '10:00 AM - 11:00 PM' },
    cuisineType: { type: String, default: 'Multi-Cuisine' },
    primaryColor: { type: String, default: '#F59E0B' }, // Gold / Electric Yellow
    secondaryColor: { type: String, default: '#111827' }, // Dark background
    currency: { type: String, default: '₹' },
    tableCount: { type: Number, default: 25 },
    subscriptionPlan: { type: String, enum: ['basic', 'premium'], default: 'basic' },
    subscriptionCycle: { type: String, enum: ['1month', '6months', 'lifetime'], default: '1month' },
    subscriptionStartDate: { type: Date, default: Date.now },
    subscriptionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes test duration
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    isOpen: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
