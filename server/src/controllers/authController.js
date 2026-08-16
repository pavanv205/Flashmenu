const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const mockStore = require('../config/mockStore');
const { createSlug } = require('../utils/slugify');
const { getIsConnected } = require('../config/db');
const { defaultCategories } = require('../utils/defaultMenu');

const generateToken = (id, restaurantId = '', slug = '') => {
  return jwt.sign({ id, restaurantId, slug }, process.env.JWT_SECRET || 'flashmenu_secret_key', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, restaurantName, city, address, subscriptionPlan } = req.body;

    if (!name || !email || !password || !restaurantName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const plan = subscriptionPlan === 'premium' ? 'premium' : 'basic';

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });
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
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? String(phone).trim() : '',
      });

      const restaurant = await Restaurant.create({
        ownerId: user._id,
        name: restaurantName.trim(),
        slug,
        city: city ? String(city).trim() : '',
        address: address ? String(address).trim() : '',
        phone: phone ? String(phone).trim() : '',
        email: normalizedEmail,
        subscriptionPlan: plan,
      });

      // Create main categories and starter items grouped by subCategory
      for (const catData of defaultCategories) {
        const c = await Category.create({
          restaurantId: restaurant._id,
          name: catData.name,
          order: catData.order,
        });

        if (catData.items && catData.items.length > 0) {
          const itemDocs = catData.items.map((item, idx) => ({
            restaurantId: restaurant._id,
            categoryId: c._id,
            subCategory: item.subCategory || '',
            name: item.name,
            description: item.description || '',
            price: item.price,
            vegType: item.vegType || 'veg',
            spicyLevel: item.spicyLevel || 0,
            isBestseller: Boolean(item.isBestseller),
            isChefSpecial: Boolean(item.isChefSpecial),
            isAvailable: true,
            order: idx + 1,
          }));
          await MenuItem.insertMany(itemDocs);
        }
      }

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
          subscriptionPlan: restaurant.subscriptionPlan || plan,
        },
      });
    } else {
      // In-Memory Fallback
      const existing = mockStore.users.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
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
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? String(phone).trim() : '',
        role: 'owner',
      };
      mockStore.users.push(user);

      const restaurant = {
        _id: `rest_${Date.now()}`,
        ownerId: user._id,
        name: restaurantName.trim(),
        slug,
        city: city ? String(city).trim() : '',
        address: address ? String(address).trim() : '',
        phone: phone ? String(phone).trim() : '',
        email: normalizedEmail,
        cuisineType: 'Multi-Cuisine',
        openingHours: '10:00 AM - 11:00 PM',
        primaryColor: '#F59E0B',
        currency: '₹',
        tableCount: 20,
        isOpen: true,
        subscriptionPlan: plan,
      };
      mockStore.restaurants.push(restaurant);

      defaultCategories.forEach((catData, catIdx) => {
        const c = {
          _id: `cat_${Date.now()}_${catIdx}`,
          restaurantId: restaurant._id,
          name: catData.name,
          order: catData.order,
          isActive: true,
        };
        mockStore.categories.push(c);

        if (catData.items && catData.items.length > 0) {
          catData.items.forEach((item, itemIdx) => {
            mockStore.menuItems.push({
              _id: `item_${Date.now()}_${catIdx}_${itemIdx}`,
              restaurantId: restaurant._id,
              categoryId: c._id,
              subCategory: item.subCategory || '',
              name: item.name,
              description: item.description || '',
              price: item.price,
              vegType: item.vegType || 'veg',
              spicyLevel: item.spicyLevel || 0,
              isBestseller: Boolean(item.isBestseller),
              isChefSpecial: Boolean(item.isChefSpecial),
              isAvailable: true,
              order: itemIdx + 1,
            });
          });
        }
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
          subscriptionPlan: restaurant.subscriptionPlan || plan,
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

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    if (getIsConnected()) {
      const user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });
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
              subscriptionPlan: restaurant.subscriptionPlan || 'basic',
            }
          : null,
      });
    } else {
      const user = mockStore.users.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
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
              subscriptionPlan: restaurant.subscriptionPlan || 'basic',
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
