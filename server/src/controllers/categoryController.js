const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');

const getCategories = async (req, res) => {
  try {
    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const categories = await Category.find({ restaurantId: restaurant._id }).sort({ order: 1 });
      return res.json(categories);
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.ownerId === req.user._id);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const categories = mockStore.categories
        .filter((c) => c.restaurantId === restaurant._id)
        .sort((a, b) => a.order - b.order);
      return res.json(categories);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name required' });

    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      const count = await Category.countDocuments({ restaurantId: restaurant._id });
      const category = await Category.create({ restaurantId: restaurant._id, name, order: count + 1 });
      return res.status(201).json(category);
    } else {
      const restaurant = mockStore.restaurants.find((r) => r.ownerId === req.user._id);
      const count = mockStore.categories.filter((c) => c.restaurantId === restaurant._id).length;
      const category = {
        _id: `cat_${Date.now()}`,
        restaurantId: restaurant._id,
        name,
        order: count + 1,
        isActive: true,
      };
      mockStore.categories.push(category);
      return res.status(201).json(category);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (getIsConnected()) {
      const category = await Category.findById(id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      if (name) category.name = name;
      await category.save();
      return res.json(category);
    } else {
      const category = mockStore.categories.find((c) => c._id === id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      if (name) category.name = name;
      return res.json(category);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await MenuItem.deleteMany({ categoryId: id });
      await Category.deleteOne({ _id: id });
      return res.json({ message: 'Category deleted' });
    } else {
      mockStore.categories = mockStore.categories.filter((c) => c._id !== id);
      mockStore.menuItems = mockStore.menuItems.filter((i) => i.categoryId !== id);
      return res.json({ message: 'Category deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reorderCategories = async (req, res) => {
  try {
    const { items } = req.body;
    if (getIsConnected()) {
      const bulkOps = items.map((item) => ({
        updateOne: { filter: { _id: item.id }, update: { order: item.order } },
      }));
      await Category.bulkWrite(bulkOps);
    } else {
      items.forEach((item) => {
        const cat = mockStore.categories.find((c) => c._id === item.id);
        if (cat) cat.order = item.order;
      });
    }
    res.json({ message: 'Reordered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories };
