const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');
const { ensureDefaultMenuForRestaurant } = require('../utils/seedHelper');

const getMenuItems = async (req, res) => {
  try {
    const restaurant =
      req.restaurant ||
      (getIsConnected()
        ? await Restaurant.findOne({ ownerId: req.user._id })
        : mockStore.restaurants.find((r) => String(r.ownerId) === String(req.user._id)));

    if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });

    // Auto-repair seed if menu items are empty
    await ensureDefaultMenuForRestaurant(restaurant._id);

    if (getIsConnected()) {
      const items = await MenuItem.find({ restaurantId: restaurant._id }).sort({ order: 1 });
      return res.json(items);
    } else {
      const items = mockStore.menuItems
        .filter((i) => String(i.restaurantId) === String(restaurant._id))
        .sort((a, b) => a.order - b.order);
      return res.json(items);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const restaurant =
      req.restaurant ||
      (getIsConnected()
        ? await Restaurant.findOne({ ownerId: req.user._id })
        : mockStore.restaurants.find((r) => String(r.ownerId) === String(req.user._id)));

    if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });

    if (getIsConnected()) {
      const item = await MenuItem.create({ restaurantId: restaurant._id, ...req.body });
      return res.status(201).json(item);
    } else {
      const item = {
        _id: `item_${Date.now()}`,
        restaurantId: restaurant._id,
        isAvailable: true,
        order: mockStore.menuItems.length + 1,
        ...req.body,
      };
      mockStore.menuItems.push(item);
      return res.status(201).json(item);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const item = await MenuItem.findById(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      Object.assign(item, req.body);
      await item.save();
      return res.json(item);
    } else {
      const item = mockStore.menuItems.find((i) => String(i._id) === String(id));
      if (!item) return res.status(404).json({ message: 'Item not found' });
      Object.assign(item, req.body);
      return res.json(item);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const item = await MenuItem.findById(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      item.isAvailable = !item.isAvailable;
      await item.save();
      return res.json(item);
    } else {
      const item = mockStore.menuItems.find((i) => String(i._id) === String(id));
      if (!item) return res.status(404).json({ message: 'Item not found' });
      item.isAvailable = !item.isAvailable;
      return res.json(item);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const duplicateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const item = await MenuItem.findById(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      const copy = await MenuItem.create({
        ...item.toObject(),
        _id: undefined,
        name: `${item.name} (Copy)`,
      });
      return res.status(201).json(copy);
    } else {
      const item = mockStore.menuItems.find((i) => String(i._id) === String(id));
      if (!item) return res.status(404).json({ message: 'Item not found' });
      const copy = { ...item, _id: `item_${Date.now()}`, name: `${item.name} (Copy)` };
      mockStore.menuItems.push(copy);
      return res.status(201).json(copy);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await MenuItem.deleteOne({ _id: id });
      return res.json({ message: 'Item deleted' });
    } else {
      mockStore.menuItems = mockStore.menuItems.filter((i) => String(i._id) !== String(id));
      return res.json({ message: 'Item deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reorderMenuItems = async (req, res) => {
  try {
    const { items } = req.body;
    if (getIsConnected()) {
      const bulkOps = items.map((item) => ({
        updateOne: { filter: { _id: item.id }, update: { order: item.order } },
      }));
      await MenuItem.bulkWrite(bulkOps);
    } else {
      items.forEach((item) => {
        const m = mockStore.menuItems.find((i) => String(i._id) === String(item.id));
        if (m) m.order = item.order;
      });
    }
    res.json({ message: 'Reordered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  duplicateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
};
