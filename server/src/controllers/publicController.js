const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const MenuView = require('../models/MenuView');
const Feedback = require('../models/Feedback');
const CallWaiter = require('../models/CallWaiter');
const Order = require('../models/Order');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');
const crypto = require('crypto');

const getPublicMenu = async (req, res) => {
  try {
    const { slug } = req.params;
    const { table } = req.query;

    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ slug });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      const categories = await Category.find({ restaurantId: restaurant._id, isActive: true }).sort({ order: 1 });
      const menuItems = await MenuItem.find({ restaurantId: restaurant._id }).sort({ order: 1 });

      try {
        const userAgent = req.headers['user-agent'] || '';
        const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
        const todayStr = new Date().toISOString().split('T')[0];
        const sessionHash = crypto.createHash('sha256').update(`${ip}-${userAgent}-${todayStr}-${slug}`).digest('hex');

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const existingView = await MenuView.findOne({
          restaurantId: restaurant._id,
          sessionHash,
          timestamp: { $gte: oneHourAgo },
        });

        if (!existingView) {
          await MenuView.create({
            restaurantId: restaurant._id,
            sessionHash,
            tableNumber: table || null,
            userAgent,
            referrer: req.headers['referer'] || '',
          });
        }
      } catch (err) {}

      return res.json({ restaurant, categories, menuItems, tableNumber: table || null });
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.slug === slug);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      const categories = mockStore.categories
        .filter((c) => c.restaurantId === restaurant._id && c.isActive !== false)
        .sort((a, b) => a.order - b.order);

      const menuItems = mockStore.menuItems
        .filter((i) => i.restaurantId === restaurant._id)
        .sort((a, b) => a.order - b.order);

      mockStore.menuViews.push({
        _id: `view_${Date.now()}`,
        restaurantId: restaurant._id,
        sessionHash: `sess_${Date.now()}`,
        tableNumber: table || null,
        timestamp: new Date(),
      });

      return res.json({ restaurant, categories, menuItems, tableNumber: table || null });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const callWaiter = async (req, res) => {
  try {
    const { restaurantSlug, tableNumber, type, note } = req.body;
    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ slug: restaurantSlug });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const call = await CallWaiter.create({
        restaurantId: restaurant._id,
        tableNumber,
        type: type || 'assistance',
        note: note || '',
      });
      return res.status(201).json({ message: 'Waiter notified', request: call });
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.slug === restaurantSlug);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const call = {
        _id: `call_${Date.now()}`,
        restaurantId: restaurant._id,
        tableNumber,
        type: type || 'assistance',
        status: 'pending',
        createdAt: new Date(),
      };
      mockStore.waiterCalls.push(call);
      return res.status(201).json({ message: 'Waiter notified', request: call });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { restaurantSlug, rating, comment, tableNumber, customerName } = req.body;
    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ slug: restaurantSlug });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const fb = await Feedback.create({
        restaurantId: restaurant._id,
        rating: Number(rating),
        comment: comment || '',
        tableNumber: tableNumber || '',
        customerName: customerName || 'Anonymous',
      });
      return res.status(201).json({ message: 'Feedback submitted', feedback: fb });
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.slug === restaurantSlug);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const fb = {
        _id: `fb_${Date.now()}`,
        restaurantId: restaurant._id,
        rating: Number(rating),
        comment: comment || '',
        tableNumber: tableNumber || '',
        customerName: customerName || 'Anonymous',
        createdAt: new Date(),
      };
      mockStore.feedbacks.push(fb);
      return res.status(201).json({ message: 'Feedback submitted', feedback: fb });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPublicOrder = async (req, res) => {
  try {
    const { restaurantSlug, tableNumber, items, customerName, customerPhone } = req.body;
    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ slug: restaurantSlug });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      let totalAmount = 0;
      const formattedItems = [];
      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (menuItem) {
          const price = menuItem.discountPrice || menuItem.price;
          totalAmount += price * item.quantity;
          formattedItems.push({ menuItemId: menuItem._id, name: menuItem.name, price, quantity: item.quantity });
        }
      }

      const order = await Order.create({
        restaurantId: restaurant._id,
        tableNumber,
        items: formattedItems,
        totalAmount,
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        status: 'NEW',
      });

      return res.status(201).json({ message: 'Order submitted', order });
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.slug === restaurantSlug);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      let totalAmount = 0;
      const formattedItems = [];
      for (const item of items) {
        const menuItem = mockStore.menuItems.find((m) => m._id === item.menuItemId);
        if (menuItem) {
          const price = menuItem.discountPrice || menuItem.price;
          totalAmount += price * item.quantity;
          formattedItems.push({ menuItemId: menuItem._id, name: menuItem.name, price, quantity: item.quantity });
        }
      }

      const order = {
        _id: `ord_${Date.now()}`,
        restaurantId: restaurant._id,
        tableNumber,
        items: formattedItems,
        totalAmount,
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        status: 'NEW',
        createdAt: new Date(),
      };
      mockStore.orders.push(order);

      return res.status(201).json({ message: 'Order submitted', order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPublicMenu, callWaiter, submitFeedback, createPublicOrder };
