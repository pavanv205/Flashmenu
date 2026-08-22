export const biryaniImages = [
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80',
];

export const starterImages = [
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
];

export const maincourseImages = [
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
];

export const breadImages = [
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
];

export const dessertImages = [
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
];

export const drinkImages = [
  'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
];

// Simple deterministic string hash to select unique image per dish name
const getHashIndex = (str = '', arrayLength = 1) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % arrayLength;
};

export const getCategoryFallbackImage = (categoryName = '', subCategory = '', itemName = '') => {
  const text = `${categoryName} ${subCategory} ${itemName}`.toLowerCase();
  const seedKey = `${itemName || subCategory || categoryName}`;

  if (text.includes('biryani') || text.includes('pulao') || text.includes('rice')) {
    return biryaniImages[getHashIndex(seedKey, biryaniImages.length)];
  }
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
    return starterImages[getHashIndex(seedKey, starterImages.length)];
  }
  if (text.includes('curry') || text.includes('gravy') || text.includes('main') || text.includes('dal') || text.includes('paneer') || text.includes('pulusu')) {
    return maincourseImages[getHashIndex(seedKey, maincourseImages.length)];
  }
  if (text.includes('naan') || text.includes('bread') || text.includes('roti') || text.includes('paratha')) {
    return breadImages[getHashIndex(seedKey, breadImages.length)];
  }
  if (text.includes('dessert') || text.includes('sweet') || text.includes('jamun') || text.includes('rasmalai') || text.includes('ice cream')) {
    return dessertImages[getHashIndex(seedKey, dessertImages.length)];
  }
  if (text.includes('drink') || text.includes('lassi') || text.includes('shake') || text.includes('coke') || text.includes('sprite') || text.includes('thums up') || text.includes('beverage')) {
    return drinkImages[getHashIndex(seedKey, drinkImages.length)];
  }

  return starterImages[getHashIndex(seedKey, starterImages.length)];
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

export const DEFAULT_FOOD_PLACEHOLDER = biryaniImages[0];
