export const biryaniImages = [
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030405/flashmenu/defaults/jmtug7nka8djwopq2bxj.jpg',
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030405/flashmenu/defaults/jmtug7nka8djwopq2bxj.jpg',
];

export const starterImages = [
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030230/flashmenu/defaults/pseykx1pl4d7yljdelei.webp',
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030020/flashmenu/defaults/jthgdhnlhe2kcwxxrtlg.jpg',
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030405/flashmenu/defaults/jmtug7nka8djwopq2bxj.jpg',
];

export const maincourseImages = [
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030020/flashmenu/defaults/jthgdhnlhe2kcwxxrtlg.jpg',
];

export const breadImages = [
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030230/flashmenu/defaults/pseykx1pl4d7yljdelei.webp',
];

export const dessertImages = [
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030405/flashmenu/defaults/jmtug7nka8djwopq2bxj.jpg',
];

export const drinkImages = [
  'https://res.cloudinary.com/xt6ci0uh/image/upload/v1787030405/flashmenu/defaults/jmtug7nka8djwopq2bxj.jpg',
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
