const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (mongoose.connection.readyState === 2 && cached.promise) {
    try {
      await Promise.race([
        cached.promise,
        new Promise((res) => setTimeout(() => res(null), 2000)),
      ]);
    } catch (e) {}
    return mongoose.connection.readyState === 1;
  }

  try {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    cached.conn = await cached.promise;
    return mongoose.connection.readyState === 1;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    return false;
  }
};

const getIsConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, getIsConnected };
