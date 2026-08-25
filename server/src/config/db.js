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

  if (cached.conn) {
    return true;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,
    };
    cached.promise = mongoose.connect(uri, opts).then((m) => {
      cached.conn = m;
      return m;
    }).catch((err) => {
      console.warn('[MongoDB Connect Warning]', err.message);
      cached.promise = null;
      cached.conn = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
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
