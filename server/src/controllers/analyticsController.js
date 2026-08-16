const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const MenuView = require('../models/MenuView');
const Feedback = require('../models/Feedback');
const CallWaiter = require('../models/CallWaiter');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');

const getDashboardOverview = async (req, res) => {
  try {
    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const restaurantId = restaurant._id;

      const totalCategories = await Category.countDocuments({ restaurantId });
      const totalItems = await MenuItem.countDocuments({ restaurantId });
      const availableItems = await MenuItem.countDocuments({ restaurantId, isAvailable: true });
      const soldOutItems = await MenuItem.countDocuments({ restaurantId, isAvailable: false });
      const totalViews = await MenuView.countDocuments({ restaurantId });

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const todayViews = await MenuView.countDocuments({ restaurantId, timestamp: { $gte: startOfToday } });
      const uniqueSessions = await MenuView.distinct('sessionHash', { restaurantId });
      const uniqueVisitors = uniqueSessions.length;

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d.setHours(0, 0, 0, 0));
        const dayEnd = new Date(d.setHours(23, 59, 59, 999));
        const dayViews = await MenuView.countDocuments({ restaurantId, timestamp: { $gte: dayStart, $lte: dayEnd } });
        const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        last7Days.push({ date: dayName, views: dayViews });
      }

      const topItems = await MenuItem.find({ restaurantId }).sort({ isBestseller: -1, price: -1 }).limit(5);
      const recentFeedback = await Feedback.find({ restaurantId }).sort({ createdAt: -1 }).limit(5);
      const waiterCalls = await CallWaiter.find({ restaurantId, status: 'pending' }).sort({ createdAt: -1 });

      return res.json({
        stats: { totalViews, todayViews, uniqueVisitors, totalCategories, totalItems, availableItems, soldOutItems },
        viewsGraph: last7Days,
        topItems,
        recentFeedback,
        waiterCalls,
      });
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.ownerId === req.user._id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const restaurantId = restaurant._id;

      const totalCategories = mockStore.categories.filter((c) => c.restaurantId === restaurantId).length;
      const totalItems = mockStore.menuItems.filter((i) => i.restaurantId === restaurantId).length;
      const availableItems = mockStore.menuItems.filter((i) => i.restaurantId === restaurantId && i.isAvailable).length;
      const soldOutItems = totalItems - availableItems;
      const views = mockStore.menuViews.filter((v) => v.restaurantId === restaurantId);

      const totalViews = views.length;
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const todayViews = views.filter((v) => new Date(v.timestamp) >= startOfToday).length;
      const uniqueVisitors = new Set(views.map((v) => v.sessionHash)).size;

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d.setHours(0, 0, 0, 0));
        const dayEnd = new Date(d.setHours(23, 59, 59, 999));
        const dayViews = views.filter((v) => {
          const vt = new Date(v.timestamp);
          return vt >= dayStart && vt <= dayEnd;
        }).length;
        const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        last7Days.push({ date: dayName, views: dayViews });
      }

      const topItems = mockStore.menuItems
        .filter((i) => i.restaurantId === restaurantId)
        .sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
        .slice(0, 5);

      const recentFeedback = mockStore.feedbacks.filter((f) => f.restaurantId === restaurantId).slice(0, 5);
      const waiterCalls = mockStore.waiterCalls.filter((w) => w.restaurantId === restaurantId && w.status === 'pending');

      return res.json({
        stats: { totalViews, todayViews, uniqueVisitors, totalCategories, totalItems, availableItems, soldOutItems },
        viewsGraph: last7Days,
        topItems,
        recentFeedback,
        waiterCalls,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveWaiterCall = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const call = await CallWaiter.findById(id);
      if (!call) return res.status(404).json({ message: 'Call not found' });
      call.status = 'resolved';
      await call.save();
      return res.json(call);
    } else {
      const call = mockStore.waiterCalls.find((w) => w._id === id);
      if (call) call.status = 'resolved';
      return res.json(call);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeedbackList = async (req, res) => {
  try {
    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      const feedbacks = await Feedback.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 });
      return res.json(feedbacks);
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.ownerId === req.user._id);
      const feedbacks = mockStore.feedbacks.filter((f) => f.restaurantId === restaurant._id);
      return res.json(feedbacks);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardOverview, resolveWaiterCall, getFeedbackList };
