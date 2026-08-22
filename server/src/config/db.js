const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.warn('[FlashMenu DB Warning] MONGODB_URI missing from environment variables.');
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log(`[FlashMenu DB] MongoDB Connected: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        console.warn(`[FlashMenu DB Warning] MongoDB Connection Error: ${err.message}`);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.conn = null;
  }

  return mongoose.connection.readyState === 1;
};

const getIsConnected = () => {
  return mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
};

module.exports = { connectDB, getIsConnected };
