const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');

// Get all restaurants for Master Admin
const getAllRestaurants = async (req, res) => {
  try {
    if (getIsConnected()) {
      const restaurants = await Restaurant.find().populate('ownerId', 'name email phone role').sort({ createdAt: -1 });

      const restaurantList = await Promise.all(
        restaurants.map(async (r) => {
          const itemCount = await MenuItem.countDocuments({ restaurantId: r._id });
          const isActive = r.isActive !== false && r.isOpen !== false;
          return {
            _id: r._id,
            name: r.name,
            slug: r.slug,
            city: r.city,
            phone: r.phone,
            subscriptionPlan: r.subscriptionPlan || 'basic',
            isActive,
            itemCount,
            createdAt: r.createdAt,
            owner: r.ownerId
              ? {
                  _id: r.ownerId._id,
                  name: r.ownerId.name,
                  email: r.ownerId.email,
                  phone: r.ownerId.phone,
                }
              : { name: 'N/A', email: r.email, phone: r.phone },
          };
        })
      );

      return res.json({
        totalRestaurants: restaurantList.length,
        activeCount: restaurantList.filter((r) => r.isActive).length,
        inactiveCount: restaurantList.filter((r) => !r.isActive).length,
        premiumCount: restaurantList.filter((r) => r.subscriptionPlan === 'premium').length,
        basicCount: restaurantList.filter((r) => r.subscriptionPlan !== 'premium').length,
        restaurants: restaurantList,
      });
    } else {
      const restaurantList = mockStore.restaurants.map((r) => {
        const owner = mockStore.users.find((u) => u._id === r.ownerId);
        const itemCount = mockStore.menuItems.filter((i) => i.restaurantId === r._id).length;
        const isActive = r.isActive !== false && r.isOpen !== false;
        return {
          _id: r._id,
          name: r.name,
          slug: r.slug,
          city: r.city,
          phone: r.phone,
          subscriptionPlan: r.subscriptionPlan || 'basic',
          isActive,
          itemCount,
          createdAt: new Date(),
          owner: owner
            ? { _id: owner._id, name: owner.name, email: owner.email, phone: owner.phone }
            : { name: 'N/A', email: r.email, phone: r.phone },
        };
      });

      return res.json({
        totalRestaurants: restaurantList.length,
        activeCount: restaurantList.filter((r) => r.isActive).length,
        inactiveCount: restaurantList.filter((r) => !r.isActive).length,
        premiumCount: restaurantList.filter((r) => r.subscriptionPlan === 'premium').length,
        basicCount: restaurantList.filter((r) => r.subscriptionPlan !== 'premium').length,
        restaurants: restaurantList,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Plan (Basic <-> Premium)
const updateRestaurantPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionPlan, secretCode, adminPassword } = req.body;

    const cleanCode = String(secretCode || adminPassword || '').trim();
    if (cleanCode !== 'Pavan@2193' && cleanCode.toLowerCase() !== 'pavan@2193') {
      return res.status(401).json({ message: 'Invalid secret authorization code. Plan update denied.' });
    }

    const plan = subscriptionPlan === 'premium' ? 'premium' : 'basic';

    if (getIsConnected()) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      restaurant.subscriptionPlan = plan;
      await restaurant.save();

      return res.json({ message: `Subscription plan updated to ${plan.toUpperCase()}`, restaurant });
    } else {
      const restaurant = mockStore.restaurants.find((r) => r._id === id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      restaurant.subscriptionPlan = plan;
      return res.json({ message: `Subscription plan updated to ${plan.toUpperCase()}`, restaurant });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Owner Status (Active <-> Inactive)
const toggleRestaurantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { secretCode, adminPassword } = req.body;

    const cleanCode = String(secretCode || adminPassword || '').trim();
    if (cleanCode !== 'Pavan@2193' && cleanCode.toLowerCase() !== 'pavan@2193') {
      return res.status(401).json({ message: 'Invalid secret authorization code. Status update denied.' });
    }

    if (getIsConnected()) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      const currentStatus = restaurant.isActive !== false && restaurant.isOpen !== false;
      const nextStatus = !currentStatus;

      restaurant.isActive = nextStatus;
      restaurant.isOpen = nextStatus;
      await restaurant.save();

      return res.json({ message: `Owner status updated to ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`, restaurant });
    } else {
      const restaurant = mockStore.restaurants.find((r) => r._id === id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      const currentStatus = restaurant.isActive !== false && restaurant.isOpen !== false;
      const nextStatus = !currentStatus;

      restaurant.isActive = nextStatus;
      restaurant.isOpen = nextStatus;
      return res.json({ message: `Owner status updated to ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`, restaurant });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Restaurant & Associated Data
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      await MenuItem.deleteMany({ restaurantId: id });
      await Category.deleteMany({ restaurantId: id });
      await User.findByIdAndDelete(restaurant.ownerId);
      await Restaurant.findByIdAndDelete(id);

      return res.json({ message: 'Restaurant and all associated customer data deleted successfully' });
    } else {
      mockStore.restaurants = mockStore.restaurants.filter((r) => r._id !== id);
      mockStore.menuItems = mockStore.menuItems.filter((i) => i.restaurantId !== id);
      mockStore.categories = mockStore.categories.filter((c) => c.restaurantId !== id);
      return res.json({ message: 'Restaurant deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Restaurant Owner Account (Zero Fees + Mandatory 2FA)
const createRestaurantOwner = async (req, res) => {
  try {
    const { name, email, password, phone, restaurantName, city, subscriptionPlan, requires2FA, secretCode } = req.body;

    const cleanCode = String(secretCode || '').trim();
    if (cleanCode !== 'Pavan@2193' && cleanCode !== '2193') {
      return res.status(401).json({ message: 'Invalid Master Admin authorization code.' });
    }

    if (!name || !email || !password || !restaurantName) {
      return res.status(400).json({ message: 'Name, Email, Password, and Restaurant Name are required.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const plan = subscriptionPlan === 'premium' ? 'premium' : 'basic';
    const enforce2FA = requires2FA !== false;

    const bcrypt = require('bcryptjs');
    const { defaultCategories } = require('../utils/defaultMenu');

    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email address already exists.' });
      }

      const { createSlug } = require('../utils/slugify');
      let baseSlug = createSlug(restaurantName);
      if (!baseSlug || baseSlug.length < 2) {
        baseSlug = `restaurant-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      let slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      let attempts = 0;
      while (await Restaurant.findOne({ slug })) {
        attempts++;
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
        if (attempts > 10) break;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newOwner = await User.create({
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? String(phone).trim() : '',
        role: 'owner',
        requires2FA: enforce2FA,
      });

      const newRestaurant = await Restaurant.create({
        ownerId: newOwner._id,
        name: String(restaurantName).trim(),
        slug,
        city: city ? String(city).trim() : 'Visakhapatnam',
        phone: phone ? String(phone).trim() : '',
        subscriptionPlan: plan,
        subscriptionCycle: 'lifetime',
        subscriptionStartDate: new Date(),
        subscriptionExpiresAt: null,
        isActive: true,
        isPaid: true,
      });

      try {
        if (defaultCategories && Array.isArray(defaultCategories)) {
          for (const cat of defaultCategories) {
            await Category.create({
              restaurantId: newRestaurant._id,
              name: cat.name,
              sortOrder: cat.sortOrder,
            });
          }
        }
      } catch (catErr) {}

      return res.status(201).json({
        message: `Restaurant Owner "${name}" created successfully with Zero Fees and ${enforce2FA ? 'Mandatory 2FA' : 'Standard'} Login!`,
        owner: {
          _id: newOwner._id,
          name: newOwner.name,
          email: newOwner.email,
          requires2FA: newOwner.requires2FA,
        },
        restaurant: newRestaurant,
      });
    } else {
      const newMockOwner = {
        _id: `user_${Date.now()}`,
        name: String(name).trim(),
        email: normalizedEmail,
        password: password,
        phone: phone ? String(phone).trim() : '',
        role: 'owner',
        requires2FA: enforce2FA,
      };

      const newMockRest = {
        _id: `rest_${Date.now()}`,
        ownerId: newMockOwner._id,
        name: String(restaurantName).trim(),
        slug: `mock-${Date.now()}`,
        city: city || 'Visakhapatnam',
        phone: phone || '',
        subscriptionPlan: plan,
        subscriptionCycle: 'lifetime',
        isActive: true,
        isPaid: true,
      };

      mockStore.users.push(newMockOwner);
      mockStore.restaurants.push(newMockRest);

      return res.status(201).json({
        message: `Restaurant Owner "${name}" created successfully in mock store with Zero Fees!`,
        owner: newMockOwner,
        restaurant: newMockRest,
      });
    }
  } catch (error) {
    console.error('Create Restaurant Owner Error:', error);
    return res.status(500).json({ message: error.message || 'Failed to create restaurant owner account.' });
  }
};

module.exports = { getAllRestaurants, updateRestaurantPlan, toggleRestaurantStatus, deleteRestaurant, createRestaurantOwner };
