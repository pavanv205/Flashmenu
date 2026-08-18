const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');
const { defaultCategories } = require('./defaultMenu');

const ensureDefaultMenuForRestaurant = async (restaurantId) => {
  if (!restaurantId) return;

  try {
    if (getIsConnected()) {
      let items = await MenuItem.find({ restaurantId });

      if (items.length === 0) {
        let existingCategories = await Category.find({ restaurantId });

        for (const catData of defaultCategories) {
          let categoryDoc = existingCategories.find(
            (c) => c.name.toLowerCase() === catData.name.toLowerCase()
          );
          if (!categoryDoc) {
            categoryDoc = await Category.create({
              restaurantId,
              name: catData.name,
              order: catData.order,
              isActive: true,
            });
          }

          if (catData.items && catData.items.length > 0) {
            const itemDocs = catData.items.map((item, idx) => ({
              restaurantId,
              categoryId: categoryDoc._id,
              subCategory: item.subCategory || '',
              name: item.name,
              description: item.description || '',
              price: item.price,
              image: item.image || '',
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
      } else {
        // Auto-update missing images on existing items from defaultCategories map
        const bulkUpdates = [];
        for (const defaultCat of defaultCategories) {
          for (const defaultItem of defaultCat.items) {
            if (defaultItem.image) {
              bulkUpdates.push({
                updateMany: {
                  filter: {
                    restaurantId,
                    name: defaultItem.name,
                    $or: [{ image: '' }, { image: { $exists: false } }],
                  },
                  update: { $set: { image: defaultItem.image } },
                },
              });
            }
          }
        }
        if (bulkUpdates.length > 0) {
          await MenuItem.bulkWrite(bulkUpdates);
        }
      }
    } else {
      // In-memory store fallback auto-seed
      const userItems = mockStore.menuItems.filter(
        (i) => String(i.restaurantId) === String(restaurantId)
      );
      if (userItems.length === 0) {
        defaultCategories.forEach((catData, catIdx) => {
          let c = mockStore.categories.find(
            (cat) =>
              String(cat.restaurantId) === String(restaurantId) &&
              cat.name.toLowerCase() === catData.name.toLowerCase()
          );
          if (!c) {
            c = {
              _id: `cat_${Date.now()}_${catIdx}`,
              restaurantId,
              name: catData.name,
              order: catData.order,
              isActive: true,
            };
            mockStore.categories.push(c);
          }

          if (catData.items && catData.items.length > 0) {
            catData.items.forEach((item, itemIdx) => {
              mockStore.menuItems.push({
                _id: `item_${Date.now()}_${catIdx}_${itemIdx}`,
                restaurantId,
                categoryId: c._id,
                subCategory: item.subCategory || '',
                name: item.name,
                description: item.description || '',
                price: item.price,
                image: item.image || '',
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
      }
    }
  } catch (err) {
    console.error('Error auto-seeding default menu items:', err);
  }
};

const ensureSpiceGardenRestaurant = async () => {
  try {
    if (getIsConnected()) {
      let restaurant = await Restaurant.findOne({
        slug: { $regex: new RegExp('^spice-garden$', 'i') },
      });

      if (!restaurant) {
        let user = await User.findOne({ email: 'demo@flashmenu.com' });
        if (!user) {
          const bcrypt = require('bcryptjs');
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('password123', salt);
          user = await User.create({
            name: 'Chef Rajesh Kumar',
            email: 'demo@flashmenu.com',
            password: hashedPassword,
            phone: '+91 98765 43210',
            role: 'owner',
          });
        }

        restaurant = await Restaurant.create({
          ownerId: user._id,
          name: 'Spice Garden',
          slug: 'spice-garden',
          tagline: 'Authentic Indian & Fusion Gastronomy',
          description: 'Experience rich aromas, royal biryanis, and artisan tandoori bread crafted with organic spices.',
          logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
          coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
          phone: '+91 98765 43210',
          email: 'contact@spicegarden.com',
          address: '102 Jubilee Hills Main Road',
          city: 'Hyderabad',
          googleMapsUrl: 'https://maps.google.com',
          openingHours: '11:30 AM - 11:00 PM',
          cuisineType: 'North Indian, Mughlai & Fusion',
          primaryColor: '#F59E0B',
          secondaryColor: '#0F172A',
          currency: '₹',
          tableCount: 25,
          isActive: true,
          isOpen: true,
          subscriptionPlan: 'premium',
        });
      } else if (!restaurant.isActive) {
        restaurant.isActive = true;
        await restaurant.save();
      }

      await ensureDefaultMenuForRestaurant(restaurant._id);
      return restaurant;
    } else {
      await mockStore.initDemoData();
      return mockStore.restaurants.find((r) => r.slug === 'spice-garden');
    }
  } catch (err) {
    console.error('Error ensuring Spice Garden demo restaurant:', err);
    return null;
  }
};

module.exports = { ensureDefaultMenuForRestaurant, ensureSpiceGardenRestaurant };
