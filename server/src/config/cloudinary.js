const cloudinary = require('cloudinary').v2;

const cleanCredential = (val, fallback = '') => {
  if (!val) return fallback;
  return String(val).replace(/["'\r\n\s]/g, '').trim() || fallback;
};

const cloudName = cleanCredential(process.env.CLOUDINARY_CLOUD_NAME, 'xt6ci0uh');
const apiKey = cleanCredential(process.env.CLOUDINARY_API_KEY, '348191171679119');
const apiSecret = cleanCredential(process.env.CLOUDINARY_API_SECRET, 'fcfoD3x20SYtb87jOjLHTxxB3TM');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

module.exports = cloudinary;
