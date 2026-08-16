const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const mockStore = require('../config/mockStore');
const { createSlug } = require('../utils/slugify');
const { getIsConnected } = require('../config/db');

const generateToken = (id, restaurantId = '', slug = '') => {
  return jwt.sign({ id, restaurantId, slug }, process.env.JWT_SECRET || 'flashmenu_secret_key', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, restaurantName, city, address } = req.body;

    if (!name || !email || !password || !restaurantName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const defaultCategories = [
      { name: 'Starters', order: 1 },
      { name: 'Biryanis', order: 2 },
      { name: 'Main Course', order: 3 },
      { name: 'Breads', order: 4 },
      { name: 'Desserts', order: 5 },
      { name: 'Drinks', order: 6 },
    ];

    if (getIsConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      let slug = createSlug(restaurantName);
      const existingRestaurant = await Restaurant.findOne({ slug });
      if (existingRestaurant) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone: phone || '',
      });

      const restaurant = await Restaurant.create({
        ownerId: user._id,
        name: restaurantName,
        slug,
        city: city || '',
        address: address || '',
        phone: phone || '',
        email: email,
      });

      const createdCategories = [];
      for (const cat of defaultCategories) {
        const c = await Category.create({
          restaurantId: restaurant._id,
          name: cat.name,
          order: cat.order,
        });
        createdCategories.push(c);
      }

      await MenuItem.create({
        restaurantId: restaurant._id,
        categoryId: createdCategories[0]._id,
        name: 'Crispy Garlic Bread',
        description: 'Toasted baguette with fresh garlic butter, parsley, and melted mozzarella.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        isBestseller: true,
        order: 1,
      });

      const token = generateToken(user._id, restaurant._id, restaurant.slug);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          slug: restaurant.slug,
        },
      });
    } else {
      // In-Memory Fallback
      const existing = mockStore.users.find((u) => u.email === email);
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      let slug = createSlug(restaurantName);
      if (mockStore.restaurants.some((r) => r.slug === slug)) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = {
        _id: `user_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        phone: phone || '',
        role: 'owner',
      };
      mockStore.users.push(user);

      const restaurant = {
        _id: `rest_${Date.now()}`,
        ownerId: user._id,
        name: restaurantName,
        slug,
        city: city || '',
        address: address || '',
        phone: phone || '',
        email,
        cuisineType: 'Multi-Cuisine',
        openingHours: '10:00 AM - 11:00 PM',
        primaryColor: '#F59E0B',
        currency: '₹',
        tableCount: 20,
        isOpen: true,
      };
      mockStore.restaurants.push(restaurant);

      const createdCats = [];
      defaultCategories.forEach((cat, idx) => {
        const c = {
          _id: `cat_${Date.now()}_${idx}`,
          restaurantId: restaurant._id,
          name: cat.name,
          order: cat.order,
          isActive: true,
        };
        mockStore.categories.push(c);
        createdCats.push(c);
      });

      mockStore.menuItems.push({
        _id: `item_${Date.now()}`,
        restaurantId: restaurant._id,
        categoryId: createdCats[0]._id,
        name: 'Crispy Garlic Bread',
        description: 'Toasted baguette with fresh garlic butter, parsley, and melted mozzarella.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        isBestseller: true,
        isAvailable: true,
        order: 1,
      });

      const token = generateToken(user._id, restaurant._id, restaurant.slug);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          slug: restaurant.slug,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (getIsConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const restaurant = await Restaurant.findOne({ ownerId: user._id });
      const token = generateToken(user._id, restaurant?._id || '', restaurant?.slug || '');

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: restaurant
          ? {
              _id: restaurant._id,
              name: restaurant.name,
              slug: restaurant.slug,
            }
          : null,
      });
    } else {
      const user = mockStore.users.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const restaurant = mockStore.restaurants.find((r) => String(r.ownerId) === String(user._id));
      const token = generateToken(user._id, restaurant?._id || '', restaurant?.slug || '');

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: restaurant
          ? {
              _id: restaurant._id,
              name: restaurant.name,
              slug: restaurant.slug,
            }
          : null,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    if (getIsConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      return res.json({ user, restaurant });
    } else {
      const user = mockStore.users.find((u) => String(u._id) === String(req.user._id)) || req.user;
      const restaurant =
        mockStore.restaurants.find((r) => String(r.ownerId) === String(req.user._id)) || req.restaurant;
      return res.json({ user, restaurant });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
