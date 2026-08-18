import { REGIONAL_CATALOG } from '../data/regionalCatalog';

// Generic fallback food image
export const DEFAULT_FOOD_PLACEHOLDER =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

/**
 * Category Default Image Mapping
 */
export const categoryDefaultImages = {
  starters: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
  biryanis: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  'main-course': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  breads: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
  desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
};

/**
 * Item-Specific Default Image Mapping (AP & Telangana key dishes)
 * Maps normalized slug -> optimized Unsplash image URL or local fallback path
 */
export const menuItemDefaultImages = {
  'hyderabadi-chicken-biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  'hyderabadi-mutton-biryani': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
  'chicken-biryani': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  'mutton-biryani': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
  'chicken-65': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
  'gobi-65': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
  'paneer-65': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
  'chilli-chicken': 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?auto=format&fit=crop&w=600&q=80',
  'chilli-paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
  'chicken-majestic': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
  'chicken-555': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
  'crispy-corn': 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80',
  'chicken-lollipop': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
  'apollo-fish': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  'chilli-fish': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  'gongura-chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
  'gongura-mutton': 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',
  'andhra-chicken-curry': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
  'andhra-mutton-curry': 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',
  'kodi-pulusu': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
  'chicken-fry': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
  'mutton-fry': 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',
  'double-ka-meetha': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  'qubani-ka-meetha': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  'irani-chai': 'https://images.unsplash.com/photo-1571934811356-5cc561d6821f?auto=format&fit=crop&w=600&q=80',
  lassi: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  buttermilk: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
};

/**
 * Robust string normalization for dish names
 * E.g. "Chicken 65", "chicken-65", "CHICKEN_65" -> "chicken-65"
 */
export const normalizeDishSlug = (name = '') => {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove punctuation
    .replace(/[\s_]+/g, '-'); // replace spaces/underscores with hyphens
};

/**
 * Normalize category slug
 */
export const normalizeCategorySlug = (categoryName = '') => {
  const norm = String(categoryName || '')
    .toLowerCase()
    .trim()
    .replace(/s$/, '') // remove trailing 's' for plural match
    .replace(/[\s_]+/g, '-');

  if (norm.includes('starter')) return 'starters';
  if (norm.includes('biryani')) return 'biryanis';
  if (norm.includes('main') || norm.includes('curry')) return 'main-course';
  if (norm.includes('bread') || norm.includes('naan') || norm.includes('roti')) return 'breads';
  if (norm.includes('dessert') || norm.includes('sweet')) return 'desserts';
  if (norm.includes('drink') || norm.includes('beverage') || norm.includes('chai')) return 'drinks';

  return norm;
};

/**
 * Cloudinary CDN transformation helper
 */
export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  }
  return url;
};

/**
 * Smart Item Image Matcher
 * Priority Cascade:
 * 1. User-uploaded image / stored item.image
 * 2. Exact menu-item default image (by item name or alias match)
 * 3. Category default image
 * 4. Generic food fallback
 */
export const getMenuItemImage = (item = {}, categoryName = '') => {
  // 1. User uploaded image takes highest priority
  if (item && item.image && typeof item.image === 'string' && item.image.trim() !== '') {
    return getOptimizedImageUrl(item.image.trim(), 600);
  }

  const itemName = item?.name || (typeof item === 'string' ? item : '');
  const itemSlug = normalizeDishSlug(itemName);

  // 2. Check exact dish match in default item images
  if (menuItemDefaultImages[itemSlug]) {
    return menuItemDefaultImages[itemSlug];
  }

  // Check aliases from REGIONAL_CATALOG
  const catalogMatch = REGIONAL_CATALOG.find((catItem) => {
    if (catItem.slug === itemSlug) return true;
    return catItem.aliases?.some((alias) => normalizeDishSlug(alias) === itemSlug);
  });

  if (catalogMatch && menuItemDefaultImages[catalogMatch.slug]) {
    return menuItemDefaultImages[catalogMatch.slug];
  }

  // 3. Category default image fallback
  const catSlug = normalizeCategorySlug(categoryName || item?.categoryId?.name || item?.category || '');
  if (categoryDefaultImages[catSlug]) {
    return categoryDefaultImages[catSlug];
  }

  // 4. Generic food fallback
  return DEFAULT_FOOD_PLACEHOLDER;
};

/**
 * Handle broken image load error cascade with infinite loop prevention
 */
export const handleImageErrorCascade = (e, item = {}, categoryName = '') => {
  const target = e.target;
  const currentStep = Number(target.dataset.fallbackStep || 0);

  if (currentStep === 0) {
    // Step 1 failed -> Fallback to exact item default or category default
    target.dataset.fallbackStep = '1';
    const catSlug = normalizeCategorySlug(categoryName || item?.categoryId?.name || item?.category || '');
    target.src = categoryDefaultImages[catSlug] || DEFAULT_FOOD_PLACEHOLDER;
  } else if (currentStep === 1) {
    // Step 2 failed -> Fallback to generic food placeholder
    target.dataset.fallbackStep = '2';
    target.src = DEFAULT_FOOD_PLACEHOLDER;
  } else {
    // Step 3 failed -> Stop error listener to prevent infinite loop
    target.onerror = null;
  }
};
