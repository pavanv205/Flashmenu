const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');
const { deleteImage } = require('../services/cloudinaryService');

const getMyRestaurant = async (req, res) => {
  try {
    if (getIsConnected()) {
      let restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      if (!restaurant && req.user.email) {
        restaurant = await Restaurant.findOne({ email: req.user.email });
      }
      if (!restaurant) {
        restaurant = await Restaurant.create({
          ownerId: req.user._id,
          name: req.user.name ? `${req.user.name}'s Restaurant` : 'My Restaurant',
          slug: `restaurant-${Date.now().toString().slice(-4)}`,
          email: req.user.email || '',
          phone: req.user.phone || '',
          subscriptionPlan: 'basic',
        });
      }
      return res.json(restaurant);
    } else {
      let restaurant = mockStore.restaurants.find((r) => String(r.ownerId) === String(req.user._id));
      if (!restaurant) {
        restaurant = {
          _id: `rest_${Date.now()}`,
          ownerId: req.user._id,
          name: req.user.name ? `${req.user.name}'s Restaurant` : 'My Restaurant',
          slug: `restaurant-${Date.now().toString().slice(-4)}`,
          email: req.user.email || '',
          subscriptionPlan: 'basic',
        };
        mockStore.restaurants.push(restaurant);
      }
      return res.json(restaurant);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyRestaurant = async (req, res) => {
  try {
    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      // Clean up old Cloudinary images if replaced
      if (req.body.logoPublicId && restaurant.logoPublicId && req.body.logoPublicId !== restaurant.logoPublicId) {
        await deleteImage(restaurant.logoPublicId);
      }
      if (
        req.body.coverImagePublicId &&
        restaurant.coverImagePublicId &&
        req.body.coverImagePublicId !== restaurant.coverImagePublicId
      ) {
        await deleteImage(restaurant.coverImagePublicId);
      }

      Object.assign(restaurant, req.body);
      await restaurant.save();
      return res.json(restaurant);
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.ownerId === req.user._id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      Object.assign(restaurant, req.body);
      return res.json(restaurant);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyRestaurant, updateMyRestaurant };
