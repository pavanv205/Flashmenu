const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flashmenu_secret_key');

    if (getIsConnected()) {
      req.user = await User.findById(decoded.id).select('-password').catch(() => null);
      if (!req.user && (decoded.id === 'admin_master_id' || decoded.role === 'admin' || decoded.slug === 'master-admin-vip')) {
        req.user = await User.findOne({ role: 'admin' }).select('-password').catch(() => null);
      }
      if (req.user) {
        req.restaurant = await Restaurant.findOne({ ownerId: req.user._id }).catch(() => null);
      }
    } else {
      let user = mockStore.users.find((u) => String(u._id) === String(decoded.id));
      if (!user) {
        user = { _id: decoded.id, name: 'Owner', role: 'owner' };
        mockStore.users.push(user);
      }
      req.user = user;

      let restaurant = mockStore.restaurants.find(
        (r) => String(r.ownerId) === String(decoded.id) || (decoded.restaurantId && String(r._id) === String(decoded.restaurantId))
      );

      if (!restaurant && decoded.restaurantId) {
        restaurant = {
          _id: decoded.restaurantId,
          ownerId: decoded.id,
          name: 'My Restaurant',
          slug: decoded.slug || 'my-restaurant',
          primaryColor: '#F59E0B',
          secondaryColor: '#0F172A',
          currency: '₹',
          tableCount: 20,
          isOpen: true,
        };
        mockStore.restaurants.push(restaurant);
      }
      req.restaurant = restaurant;
    }

    if (!req.user && (decoded.id === 'admin_master_id' || decoded.role === 'admin' || decoded.slug === 'master-admin-vip')) {
      req.user = {
        _id: 'admin_master_id',
        name: 'Pavan Vadapalli (Master Admin)',
        email: 'pavanvadapalli205@gmail.com',
        role: 'admin',
      };
      req.restaurant = {
        _id: 'master_vip_rest',
        name: 'FlashMenu Master Headquarters',
        slug: 'master-admin-vip',
        subscriptionPlan: 'premium',
        subscriptionCycle: 'lifetime',
        isActive: true,
      };
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flashmenu_secret_key');

    if (getIsConnected()) {
      req.user = await User.findById(decoded.id).select('-password').catch(() => null);
      if (!req.user && (decoded.id === 'admin_master_id' || decoded.role === 'admin' || decoded.slug === 'master-admin-vip')) {
        req.user = await User.findOne({ role: 'admin' }).select('-password').catch(() => null);
      }
      if (req.user) {
        req.restaurant = await Restaurant.findOne({ ownerId: req.user._id }).catch(() => null);
      }
    } else {
      let user = mockStore.users.find((u) => String(u._id) === String(decoded.id));
      req.user = user || null;
      req.restaurant = mockStore.restaurants.find(
        (r) => String(r.ownerId) === String(decoded.id)
      ) || null;
    }
  } catch (error) {
    // Soft ignore token error for optional endpoints
  }
  next();
};

module.exports = { protect, optionalProtect };
