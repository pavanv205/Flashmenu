const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
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

module.exports = { ensureDefaultMenuForRestaurant };
