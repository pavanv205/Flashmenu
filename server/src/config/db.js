const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flashmenu', {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[FlashMenu DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[FlashMenu DB Warning] Could not connect to local MongoDB (${error.message}). Running with in-memory fallback state if needed.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
