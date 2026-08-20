export const categoryDefaultImages = {
  starters: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
  biryanis: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  maincourse: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  breads: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
  desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
};

export const getCategoryFallbackImage = (categoryName = '', subCategory = '', itemName = '') => {
  const text = `${categoryName} ${subCategory} ${itemName}`.toLowerCase();

  if (text.includes('biryani') || text.includes('pulao') || text.includes('rice')) return categoryDefaultImages.biryanis;
  if (
    text.includes('starter') ||
    text.includes('kebab') ||
    text.includes('tikka') ||
    text.includes('65') ||
    text.includes('chilli') ||
    text.includes('manchurian') ||
    text.includes('fry') ||
    text.includes('lollipop') ||
    text.includes('wings') ||
    text.includes('vepudu') ||
    text.includes('apollo')
  ) {
    return categoryDefaultImages.starters;
  }
  if (text.includes('curry') || text.includes('gravy') || text.includes('main') || text.includes('dal') || text.includes('paneer') || text.includes('pulusu')) {
    return categoryDefaultImages.maincourse;
  }
  if (text.includes('naan') || text.includes('bread') || text.includes('roti') || text.includes('paratha')) {
    return categoryDefaultImages.breads;
  }
  if (text.includes('dessert') || text.includes('sweet') || text.includes('jamun') || text.includes('rasmalai') || text.includes('ice cream')) {
    return categoryDefaultImages.desserts;
  }
  if (text.includes('drink') || text.includes('lassi') || text.includes('shake') || text.includes('coke') || text.includes('sprite') || text.includes('thums up') || text.includes('beverage')) {
    return categoryDefaultImages.drinks;
  }

  return categoryDefaultImages.default;
};

export const getOptimizedImageUrl = (url, width = 300) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com')) {
    if (url.includes('/upload/w_') || url.includes('/upload/f_auto')) return url;
    return url.replace('/upload/', `/upload/w_${width},h_${width},c_fill,f_auto,q_auto/`);
  }
  if (url.includes('images.unsplash.com')) {
    if (url.includes('w=')) {
      return url.replace(/w=\d+/, `w=${width}`);
    }
    return `${url}&w=${width}&q=80&auto=format`;
  }
  return url;
};

export const DEFAULT_FOOD_PLACEHOLDER = categoryDefaultImages.default;
