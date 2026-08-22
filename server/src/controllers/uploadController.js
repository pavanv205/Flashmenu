const multer = require('multer');
const { uploadImageBuffer } = require('../services/cloudinaryService');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { connectDB, getIsConnected } = require('../config/db');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP, and AVIF image files are allowed!'), false);
    }
  },
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image file to upload' });
    }

    const type = req.query.type || req.body.type || 'menu-items'; // 'logo', 'cover', 'menu-items', 'categories'
    let restaurantId = req.user?.restaurantId;

    if (!restaurantId && req.user?._id) {
      await connectDB();
      if (getIsConnected()) {
        const rest = await Restaurant.findOne({ ownerId: req.user._id });
        if (rest) restaurantId = rest._id.toString();
      } else {
        const rest = mockStore.restaurants.find((r) => String(r.ownerId) === String(req.user._id));
        if (rest) restaurantId = String(rest._id);
      }
    }

    const folderPath = restaurantId
      ? `flashmenu/restaurants/${restaurantId}/${type}`
      : `flashmenu/general/${type}`;

    const uploadResult = await uploadImageBuffer(req.file.buffer, req.file.mimetype, folderPath);

    return res.json({
      success: true,
      image: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
};

module.exports = { upload, uploadImage };
