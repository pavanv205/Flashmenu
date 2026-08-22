const cloudinary = require('../config/cloudinary');

/**
 * Upload image buffer to Cloudinary with folder routing & auto-optimization
 */
const uploadImageBuffer = async (buffer, mimetype, folderPath = 'flashmenu/general') => {
  if (!buffer || !mimetype) {
    throw new Error('Image buffer and mimetype are required');
  }

  const b64 = Buffer.from(buffer).toString('base64');
  const dataURI = `data:${mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: folderPath,
    resource_type: 'auto',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};

/**
 * Delete image from Cloudinary by publicId
 */
const deleteImage = async (publicId) => {
  if (!publicId) return null;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary Cleanup] Deleted asset ${publicId}:`, res);
    return res;
  } catch (error) {
    console.warn(`[Cloudinary Warning] Failed to delete asset ${publicId}:`, error.message);
    return null;
  }
};

/**
 * Helper to build responsive optimized Cloudinary URL for public QR menu
 */
const getOptimizedUrl = (url, width = 600) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }
  // Inject transformation string into Cloudinary URL (e.g. /upload/w_600,f_auto,q_auto/)
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
};

module.exports = {
  uploadImageBuffer,
  deleteImage,
  getOptimizedUrl,
};
