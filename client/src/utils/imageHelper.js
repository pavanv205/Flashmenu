export const categoryDefaultImages = {
  starters: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
  vegStarters: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
  nonVegStarters: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
  biryanis: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  rice: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
  maincourse: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  breads: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
  desserts: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  water: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
};

export const getCategoryFallbackImage = (categoryName = '', subCategory = '', itemName = '') => {
  const text = `${categoryName} ${subCategory} ${itemName}`.toLowerCase();

  // 1. Water & Beverages
  if (text.includes('water') || text.includes('mineral') || text.includes('bottle')) {
    return categoryDefaultImages.water;
  }
  if (
    text.includes('drink') ||
    text.includes('beverage') ||
    text.includes('lassi') ||
    text.includes('shake') ||
    text.includes('coke') ||
    text.includes('sprite') ||
    text.includes('thums up') ||
    text.includes('juice') ||
    text.includes('soda') ||
    text.includes('mojito')
  ) {
    return categoryDefaultImages.drinks;
  }

  // 2. Sweets & Desserts
  if (
    text.includes('dessert') ||
    text.includes('sweet') ||
    text.includes('jamun') ||
    text.includes('rabri') ||
    text.includes('rasmalai') ||
    text.includes('ice cream') ||
    text.includes('halwa') ||
    text.includes('kheer') ||
    text.includes('kulfi') ||
    text.includes('gulab')
  ) {
    return categoryDefaultImages.desserts;
  }

  // 3. Rice vs Biryani
  if (text.includes('biryani') || text.includes('pulao')) {
    return categoryDefaultImages.biryanis;
  }
  if (text.includes('sambar') || text.includes('rasam') || text.includes('curd rice') || text.includes('dal rice') || text.includes('fried rice') || text.includes('rice')) {
    return categoryDefaultImages.rice;
  }

  // 4. Starters (Veg vs Non-Veg)
  if (
    text.includes('gobi') ||
    text.includes('paneer') ||
    text.includes('corn') ||
    text.includes('mushroom') ||
    text.includes('manchurian') ||
    text.includes('veg starter')
  ) {
    return categoryDefaultImages.vegStarters;
  }
  if (
    text.includes('chicken') ||
    text.includes('mutton') ||
    text.includes('fish') ||
    text.includes('prawn') ||
    text.includes('kebab') ||
    text.includes('tikka') ||
    text.includes('lollipop') ||
    text.includes('wings') ||
    text.includes('starter')
  ) {
    return categoryDefaultImages.nonVegStarters;
  }

  // 5. Curries & Main Course
  if (text.includes('curry') || text.includes('gravy') || text.includes('main') || text.includes('dal') || text.includes('pulusu')) {
    return categoryDefaultImages.maincourse;
  }

  // 6. Indian Breads
  if (text.includes('naan') || text.includes('bread') || text.includes('roti') || text.includes('paratha') || text.includes('kulcha')) {
    return categoryDefaultImages.breads;
  }

  return categoryDefaultImages.default;
};

export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  }
  return url;
};

export const DEFAULT_FOOD_PLACEHOLDER = categoryDefaultImages.default;
