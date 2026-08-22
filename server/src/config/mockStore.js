const bcrypt = require('bcryptjs');
const { defaultCategories } = require('../utils/defaultMenu');

class MockStore {
  constructor() {
    this.users = [];
    this.restaurants = [];
    this.categories = [];
    this.menuItems = [];
    this.menuViews = [];
    this.feedbacks = [];
    this.waiterCalls = [];
    this.orders = [];
    this.initialized = false;
  }

  async initDemoData() {
    if (this.initialized) return;
    this.initialized = true;

    const pavanPassword = await bcrypt.hash('Pavan@2193', salt);

    // Demo User
    const user = {
      _id: 'user_demo_1',
      name: 'Chef Rajesh Kumar',
      email: 'demo@flashmenu.com',
      password: pavanPassword,
      phone: '+91 98765 43210',
      role: 'owner',
      createdAt: new Date(),
    };
    this.users.push(user);

    // Owner Accounts
    const ownerAccounts = [
      'pavanvadapalli26@gmail.com',
      'pavanvkadapalli04@gmail.com',
      'pjavanvadapalli26@gmail.com',
      'pavan1@gmail.com',
    ];

    ownerAccounts.forEach((emailAddr, idx) => {
      this.users.push({
        _id: `user_owner_${idx + 1}`,
        name: `Pavan Vadapalli (${emailAddr})`,
        email: emailAddr,
        password: pavanPassword,
        phone: '+91 99999 99999',
        role: 'owner',
        createdAt: new Date(),
      });
    });

    // Master Admin User
    const adminPassword = pavanPassword;
    const adminUser = {
      _id: 'user_master_admin',
      name: 'Pavan Vadapalli',
      email: 'pavanvadapalli205@gmail.com',
      password: adminPassword,
      phone: '+91 99999 99999',
      role: 'admin',
      createdAt: new Date(),
    };
    this.users.push(adminUser);

    // Demo Restaurant
    const restaurant = {
      _id: 'rest_spice_garden',
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
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        website: 'https://spicegarden.com',
      },
      isOpen: true,
      createdAt: new Date(),
    };
    this.restaurants.push(restaurant);

    // Pre-populate all starter categories and items for demo restaurant
    defaultCategories.forEach((catData, catIdx) => {
      const c = {
        _id: `cat_${catIdx + 1}`,
        restaurantId: restaurant._id,
        name: catData.name,
        order: catData.order,
        isActive: true,
      };
      this.categories.push(c);

      if (catData.items && catData.items.length > 0) {
        catData.items.forEach((item, itemIdx) => {
          this.menuItems.push({
            _id: `item_${catIdx + 1}_${itemIdx + 1}`,
            restaurantId: restaurant._id,
            categoryId: c._id,
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

    // Mock Views
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const count = 30 + Math.floor(Math.random() * 50);
      for (let j = 0; j < count; j++) {
        this.menuViews.push({
          _id: `view_${i}_${j}`,
          restaurantId: restaurant._id,
          sessionHash: `sess_${i}_${j}`,
          tableNumber: `${(j % 10) + 1}`,
          timestamp: d,
        });
      }
    }

    // Sample Feedback
    this.feedbacks.push({
      _id: 'fb_1',
      restaurantId: restaurant._id,
      rating: 5,
      comment: 'The Hyderabadi Biryani and Apollo Fish were out of this world! Instant QR menu scan experience.',
      tableNumber: '4',
      customerName: 'Ananya S.',
      createdAt: new Date(),
    });

    this.feedbacks.push({
      _id: 'fb_2',
      restaurantId: restaurant._id,
      rating: 5,
      comment: 'Super fast digital menu, loved the Paneer Majestic and Chicken 65!',
      tableNumber: '12',
      customerName: 'Rahul Verma',
      createdAt: new Date(),
    });
  }
}

const mockStore = new MockStore();
mockStore.initDemoData();

module.exports = mockStore;
