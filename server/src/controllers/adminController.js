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
    const { subscriptionPlan, adminPassword } = req.body;

    const cleanPwd = String(adminPassword || '').trim();
    if (cleanPwd !== 'Pavan@2193' && cleanPwd.toLowerCase() !== 'pavan@2193') {
      return res.status(401).json({ message: 'Invalid admin security password. Plan update denied.' });
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

module.exports = { getAllRestaurants, updateRestaurantPlan, toggleRestaurantStatus, deleteRestaurant };
