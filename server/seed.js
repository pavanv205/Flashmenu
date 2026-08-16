const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');
const Restaurant = require('./src/models/Restaurant');
const Category = require('./src/models/Category');
const MenuItem = require('./src/models/MenuItem');
const MenuView = require('./src/models/MenuView');
const Feedback = require('./src/models/Feedback');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flashmenu', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB for seeding...');

    // Clear existing demo data
    const existingUser = await User.findOne({ email: 'demo@flashmenu.com' });
    if (existingUser) {
      const rest = await Restaurant.findOne({ ownerId: existingUser._id });
      if (rest) {
        await Category.deleteMany({ restaurantId: rest._id });
        await MenuItem.deleteMany({ restaurantId: rest._id });
        await MenuView.deleteMany({ restaurantId: rest._id });
        await Feedback.deleteMany({ restaurantId: rest._id });
        await Restaurant.deleteOne({ _id: rest._id });
      }
      await User.deleteOne({ _id: existingUser._id });
    }

    // Create Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Chef Rajesh Kumar',
      email: 'demo@flashmenu.com',
      password: hashedPassword,
      phone: '+91 98765 43210',
      role: 'owner',
    });

    // Create Demo Restaurant
    const restaurant = await Restaurant.create({
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
    });

    // Create 6 Categories
    const categoriesData = [
      { name: 'Starters', order: 1 },
      { name: 'Biryanis', order: 2 },
      { name: 'Main Course', order: 3 },
      { name: 'Breads', order: 4 },
      { name: 'Desserts', order: 5 },
      { name: 'Drinks', order: 6 },
    ];

    const categories = [];
    for (const cat of categoriesData) {
      const c = await Category.create({
        restaurantId: restaurant._id,
        name: cat.name,
        order: cat.order,
      });
      categories.push(c);
    }

    const catMap = {};
    categories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // Create 16 Realistic Menu Items
    const menuItemsData = [
      // Starters
      {
        categoryId: catMap['Starters'],
        name: 'Paneer Tikka Angara',
        description: 'Cottage cheese marinated in smoky hung curd & roasted cumin, grilled over charcoal embers.',
        price: 320,
        discountPrice: 290,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 2,
        isBestseller: true,
        isChefSpecial: true,
        order: 1,
      },
      {
        categoryId: catMap['Starters'],
        name: 'Tandoori Murgh (Half)',
        description: 'Spring chicken marinated with Kashmiri chilli powder, mustard oil & ginger-garlic paste.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 2,
        isBestseller: true,
        order: 2,
      },
      {
        categoryId: catMap['Starters'],
        name: 'Crispy Corn & Waterchestnut',
        description: 'Golden fried sweet corn kernels tossed with crushed pepper, scallions, and lemon butter.',
        price: 260,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 1,
        isNewItem: true,
        order: 3,
      },

      // Biryanis
      {
        categoryId: catMap['Biryanis'],
        name: 'Hyderabadi Dum Chicken Biryani',
        description: 'Long-grain basmati rice cooked on dum with succulent chicken pieces and aromatic saffron.',
        price: 360,
        discountPrice: 330,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 3,
        isBestseller: true,
        order: 1,
      },
      {
        categoryId: catMap['Biryanis'],
        name: 'Royal Mutton Dum Biryani',
        description: 'Tender tenderloin mutton marinated overnight in royal whole spices, layered with fragrant basmati.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 3,
        isChefSpecial: true,
        order: 2,
      },
      {
        categoryId: catMap['Biryanis'],
        name: 'Special Subz Handi Biryani',
        description: 'Garden fresh vegetables, paneer cubes, and cashew nuts sealed in clay pot with mint.',
        price: 310,
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 1,
        order: 3,
      },

      // Main Course
      {
        categoryId: catMap['Main Course'],
        name: 'Butter Chicken Grand Style',
        description: 'Tandoori chicken simmered in rich velvety tomato gravy infused with fenugreek & white butter.',
        price: 390,
        discountPrice: 360,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 1,
        isBestseller: true,
        order: 1,
      },
      {
        categoryId: catMap['Main Course'],
        name: 'Dal Makhani Signature',
        description: 'Slow-cooked black lentils simmered overnight over clay tandoor with fresh churned cream.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        order: 2,
      },
      {
        categoryId: catMap['Main Course'],
        name: 'Kadhai Paneer Special',
        description: 'Cottage cheese triangles cooked with bell peppers, onion petals, and hand-pounded kadhai masala.',
        price: 330,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 2,
        order: 3,
      },
      {
        categoryId: catMap['Main Course'],
        name: 'Mutton Rogan Josh',
        description: 'Traditional Kashmiri mutton delicacy cooked in red gravy flavored with ratanjot & fennel.',
        price: 460,
        image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=500&auto=format&fit=crop&q=80',
        vegType: 'non-veg',
        spicyLevel: 2,
        isChefSpecial: true,
        order: 4,
      },

      // Breads
      {
        categoryId: catMap['Breads'],
        name: 'Butter Garlic Naan',
        description: 'Leavened clay oven bread topped with crushed garlic and melted butter.',
        price: 75,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        order: 1,
      },
      {
        categoryId: catMap['Breads'],
        name: 'Cheese Chilli Naan',
        description: 'Naan stuffed with processed mozzarella and finely chopped green chillies.',
        price: 95,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 1,
        isNewItem: true,
        order: 2,
      },
      {
        categoryId: catMap['Breads'],
        name: 'Lachha Paratha',
        description: 'Multi-layered whole wheat tandoori bread brushed with clarified ghee.',
        price: 65,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        order: 3,
      },

      // Desserts
      {
        categoryId: catMap['Desserts'],
        name: 'Gulab Jamun with Rabri',
        description: 'Warm soft khoya dumplings served over chilled cardamon flavored rabri.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        order: 1,
      },
      {
        categoryId: catMap['Desserts'],
        name: 'Saffron Rasmalai',
        description: 'Spongy cottage cheese discs soaked in saffron-infused pistachio milk.',
        price: 210,
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isChefSpecial: true,
        order: 2,
      },

      // Drinks
      {
        categoryId: catMap['Drinks'],
        name: 'Mango Lassi Delight',
        description: 'Thick creamy yoghurt beverage blended with fresh Alphonso mango pulp.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: true,
        order: 1,
      },
    ];

    for (const item of menuItemsData) {
      await MenuItem.create({
        restaurantId: restaurant._id,
        ...item,
      });
    }

    // Seed mock views for recent 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const viewsCount = 45 + Math.floor(Math.random() * 80);
      for (let j = 0; j < viewsCount; j++) {
        await MenuView.create({
          restaurantId: restaurant._id,
          sessionHash: `session-${i}-${j}-${Math.random()}`,
          tableNumber: `${(j % 15) + 1}`,
          timestamp: d,
        });
      }
    }

    // Seed sample feedback
    await Feedback.create({
      restaurantId: restaurant._id,
      rating: 5,
      comment: 'The Hyderabadi Biryani was out of this world! Quick QR menu scan experience too.',
      tableNumber: 'Table 4',
      customerName: 'Ananya S.',
    });

    await Feedback.create({
      restaurantId: restaurant._id,
      rating: 5,
      comment: 'Super fast digital menu, loved the Butter Chicken and Garlic Naan combo!',
      tableNumber: 'Table 12',
      customerName: 'Rahul Verma',
    });

    console.log('✅ Seeding complete!');
    console.log(`Demo Restaurant Created: Spice Garden`);
    console.log(`Demo Public Menu URL: http://localhost:5173/menu/spice-garden`);
    console.log(`Demo Login: demo@flashmenu.com / password123`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
