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
      { name: '🥗 Salads', order: 1 },
      { name: '🍲 Soups', order: 2 },
      { name: '🥟 Starters', order: 3 },
      { name: '🍗 Tandoori / Kebabs', order: 4 },
      { name: '🍛 Biryani', order: 5 },
      { name: '🍚 Rice & Pulao', order: 6 },
      { name: '🍜 Noodles', order: 7 },
      { name: '🍝 Pasta', order: 8 },
      { name: '🍕 Pizza', order: 9 },
      { name: '🍔 Burgers', order: 10 },
      { name: '🌯 Wraps & Rolls', order: 11 },
      { name: '🍛 Main Course', order: 12 },
      { name: '🫓 Indian Breads', order: 13 },
      { name: '🍱 Combos / Thalis', order: 14 },
      { name: '🥘 Chinese', order: 15 },
      { name: '🍨 Desserts', order: 16 },
      { name: '🥤 Soft Drinks', order: 17 },
      { name: '☕ Tea & Coffee', order: 18 },
      { name: '🧃 Juices & Shakes', order: 19 },
      { name: '🥛 Lassi & Milkshakes', order: 20 },
      { name: '🍹 Mocktails', order: 21 },
      { name: '👶 Kids Menu', order: 22 },
      { name: '⭐ Specials', order: 23 },
      { name: '📦 Takeaway / Combos', order: 24 },
    ];

    const defaultStarters = [
      {
        name: 'Chicken 65',
        description: 'Classic Andhra-style deep-fried chicken marinated in curry leaves, green chillies & yoghurt.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 2,
        isBestseller: true,
        order: 1,
      },
      {
        name: 'Apollo Fish',
        description: 'Popular Hyderabadi boneless fish cubes tossed in spicy garlic soy sauce with curry leaves.',
        price: 340,
        image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 2,
        isBestseller: true,
        isChefSpecial: true,
        order: 2,
      },
      {
        name: 'Paneer Majestic',
        description: 'Fried cottage cheese strips coated in yoghurt, mint & green chilli sauce.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 2,
        isBestseller: true,
        order: 3,
      },
      {
        name: 'Kodi Vepudu (Andhra Chicken Fry)',
        description: 'Spicy Guntur chicken fry roasted with cracked black pepper & roasted Guntur chillies.',
        price: 310,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 3,
        isBestseller: true,
        order: 4,
      },
      {
        name: 'Chilli Chicken',
        description: 'Indo-Chinese boneless chicken tossed with bell peppers, onion petals & green chillies.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 2,
        order: 5,
      },
      {
        name: 'Royyala Vepudu (Prawns Fry)',
        description: 'Succulent prawns roasted in spicy Andhra masala with shallots & fresh curry leaves.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 3,
        isChefSpecial: true,
        order: 6,
      },
      {
        name: 'Paneer 65',
        description: 'Crispy fried paneer cubes tossed with red chillies, curry leaves and South Indian spices.',
        price: 270,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 2,
        order: 7,
      },
      {
        name: 'Crispy Corn',
        description: 'Golden fried sweet corn kernels tossed with crushed pepper, spring onions & lemon butter.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 1,
        order: 8,
      },
      {
        name: 'Gobi 65',
        description: 'Cauliflower florets marinated in spiced batter and deep-fried to golden perfection.',
        price: 230,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 2,
        order: 9,
      },
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

      const createdCategoriesMap = {};
      for (const cat of defaultCategories) {
        const c = await Category.create({
          restaurantId: restaurant._id,
          name: cat.name,
          order: cat.order,
        });
        createdCategoriesMap[cat.name] = c._id;
      }

      // Add default starters to Starters category
      const startersCategoryId = createdCategoriesMap['🥟 Starters'] || Object.values(createdCategoriesMap)[0];
      for (const starter of defaultStarters) {
        await MenuItem.create({
          restaurantId: restaurant._id,
          categoryId: startersCategoryId,
          ...starter,
        });
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

      const createdCatsMap = {};
      defaultCategories.forEach((cat, idx) => {
        const c = {
          _id: `cat_${Date.now()}_${idx}`,
          restaurantId: restaurant._id,
          name: cat.name,
          order: cat.order,
          isActive: true,
        };
        mockStore.categories.push(c);
        createdCatsMap[cat.name] = c._id;
      });

      const startersCatId = createdCatsMap['🥟 Starters'] || Object.values(createdCatsMap)[0];
      defaultStarters.forEach((starter, idx) => {
        mockStore.menuItems.push({
          _id: `item_${Date.now()}_${idx}`,
          restaurantId: restaurant._id,
          categoryId: startersCatId,
          isAvailable: true,
          ...starter,
        });
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
