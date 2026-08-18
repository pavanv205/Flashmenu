export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  }
  return url;
};

export const DEFAULT_FOOD_PLACEHOLDER =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
