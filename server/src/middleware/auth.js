const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockStore = require('../config/mockStore');
const { getIsConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flashmenu_secret_key');

    if (getIsConnected()) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = mockStore.users.find((u) => String(u._id) === String(decoded.id));
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
