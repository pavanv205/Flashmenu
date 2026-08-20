const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');

const getRestaurantOrders = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      // Clean up order history older than 7 days
      await Order.deleteMany({ restaurantId: restaurant._id, createdAt: { $lt: sevenDaysAgo } });

      const orders = await Order.find({ restaurantId: restaurant._id, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.ownerId === req.user._id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

      // Clean up mockStore order history older than 7 days
      mockStore.orders = mockStore.orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo);

      const orders = mockStore.orders.filter(
        (o) => o.restaurantId === restaurant._id && new Date(o.createdAt) >= sevenDaysAgo
      );
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (getIsConnected()) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      order.status = status;
      await order.save();
      return res.json(order);
    } else {
      const order = mockStore.orders.find((o) => o._id === id);
      if (order) order.status = status;
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRestaurantOrders, updateOrderStatus };
