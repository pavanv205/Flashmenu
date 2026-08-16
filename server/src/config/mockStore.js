const bcrypt = require('bcryptjs');

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Demo User
    const user = {
      _id: 'user_demo_1',
      name: 'Chef Rajesh Kumar',
      email: 'demo@flashmenu.com',
      password: hashedPassword,
      phone: '+91 98765 43210',
      role: 'owner',
      createdAt: new Date(),
    };
    this.users.push(user);

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

    // Categories
    const catData = [
      { id: 'cat_1', name: 'Starters', order: 1 },
      { id: 'cat_2', name: 'Biryanis', order: 2 },
      { id: 'cat_3', name: 'Main Course', order: 3 },
      { id: 'cat_4', name: 'Breads', order: 4 },
      { id: 'cat_5', name: 'Desserts', order: 5 },
      { id: 'cat_6', name: 'Drinks', order: 6 },
    ];

    catData.forEach((c) => {
      this.categories.push({
        _id: c.id,
        restaurantId: restaurant._id,
        name: c.name,
        order: c.order,
        isActive: true,
      });
    });

    // Menu Items
    const itemsData = [
      {
        _id: 'item_1',
        restaurantId: restaurant._id,
        categoryId: 'cat_1',
        name: 'Paneer Tikka Angara',
        description: 'Cottage cheese marinated in smoky hung curd & roasted cumin, grilled over charcoal embers.',
        price: 320,
        discountPrice: 290,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 2,
        isBestseller: true,
        isChefSpecial: true,
        isAvailable: true,
        order: 1,
      },
      {
        _id: 'item_2',
        restaurantId: restaurant._id,
        categoryId: 'cat_1',
        name: 'Tandoori Murgh (Half)',
        description: 'Spring chicken marinated with Kashmiri chilli powder, mustard oil & ginger-garlic paste.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 2,
        isBestseller: true,
        isAvailable: true,
        order: 2,
      },
      {
        _id: 'item_3',
        restaurantId: restaurant._id,
        categoryId: 'cat_1',
        name: 'Crispy Corn & Waterchestnut',
        description: 'Golden fried sweet corn kernels tossed with crushed pepper, scallions, and lemon butter.',
        price: 260,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 1,
        isNewItem: true,
        isAvailable: true,
        order: 3,
      },
      {
        _id: 'item_4',
        restaurantId: restaurant._id,
        categoryId: 'cat_2',
        name: 'Hyderabadi Dum Chicken Biryani',
        description: 'Long-grain basmati rice cooked on dum with succulent chicken pieces and aromatic saffron.',
        price: 360,
        discountPrice: 330,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 3,
        isBestseller: true,
        isAvailable: true,
        order: 1,
      },
      {
        _id: 'item_5',
        restaurantId: restaurant._id,
        categoryId: 'cat_2',
        name: 'Royal Mutton Dum Biryani',
        description: 'Tender tenderloin mutton marinated overnight in royal whole spices, layered with fragrant basmati.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 3,
        isChefSpecial: true,
        isAvailable: true,
        order: 2,
      },
      {
        _id: 'item_6',
        restaurantId: restaurant._id,
        categoryId: 'cat_2',
        name: 'Special Subz Handi Biryani',
        description: 'Garden fresh vegetables, paneer cubes, and cashew nuts sealed in clay pot with mint.',
        price: 310,
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 1,
        isAvailable: true,
        order: 3,
      },
      {
        _id: 'item_7',
        restaurantId: restaurant._id,
        categoryId: 'cat_3',
        name: 'Butter Chicken Grand Style',
        description: 'Tandoori chicken simmered in rich velvety tomato gravy infused with fenugreek & white butter.',
        price: 390,
        discountPrice: 360,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 1,
        isBestseller: true,
        isAvailable: true,
        order: 1,
      },
      {
        _id: 'item_8',
        restaurantId: restaurant._id,
        categoryId: 'cat_3',
        name: 'Dal Makhani Signature',
        description: 'Slow-cooked black lentils simmered overnight over clay tandoor with fresh churned cream.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        isAvailable: true,
        order: 2,
      },
      {
        _id: 'item_9',
        restaurantId: restaurant._id,
        categoryId: 'cat_3',
        name: 'Kadhai Paneer Special',
        description: 'Cottage cheese triangles cooked with bell peppers, onion petals, and hand-pounded kadhai masala.',
        price: 330,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 2,
        isAvailable: true,
        order: 3,
      },
      {
        _id: 'item_10',
        restaurantId: restaurant._id,
        categoryId: 'cat_4',
        name: 'Butter Garlic Naan',
        description: 'Leavened clay oven bread topped with crushed garlic and melted butter.',
        price: 75,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        isAvailable: true,
        order: 1,
      },
      {
        _id: 'item_11',
        restaurantId: restaurant._id,
        categoryId: 'cat_5',
        name: 'Gulab Jamun with Rabri',
        description: 'Warm soft khoya dumplings served over chilled cardamon flavored rabri.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        isAvailable: true,
        order: 1,
      },
      {
        _id: 'item_12',
        restaurantId: restaurant._id,
        categoryId: 'cat_6',
        name: 'Mango Lassi Delight',
        description: 'Thick creamy yoghurt beverage blended with fresh Alphonso mango pulp.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        isAvailable: true,
        order: 1,
      },
    ];

    this.menuItems.push(...itemsData);

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
      comment: 'The Hyderabadi Biryani was out of this world! Instant QR menu scan experience.',
      tableNumber: '4',
      customerName: 'Ananya S.',
      createdAt: new Date(),
    });

    this.feedbacks.push({
      _id: 'fb_2',
      restaurantId: restaurant._id,
      rating: 5,
      comment: 'Super fast digital menu, loved the Butter Chicken and Garlic Naan combo!',
      tableNumber: '12',
      customerName: 'Rahul Verma',
      createdAt: new Date(),
    });
  }
}

const mockStore = new MockStore();
mockStore.initDemoData();

module.exports = mockStore;
