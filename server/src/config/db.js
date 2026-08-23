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

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
        family: 4,
      }).catch((err) => {
        console.warn('[MongoDB Connect Warning]', err.message);
        return null;
      });
    }
    const connRes = await Promise.race([
      cached.promise,
      new Promise((res) => setTimeout(() => res(null), 2500)),
    ]);
    if (!connRes) {
      cached.promise = null;
    }
    return mongoose.connection.readyState === 1;
  } catch (err) {
    console.warn('[MongoDB Connect Exception]', err.message);
    cached.promise = null;
    cached.conn = null;
    return false;
  }
};

const getIsConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, getIsConnected };
