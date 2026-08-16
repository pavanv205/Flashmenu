export const getSubCategory = (item, categoryName = '') => {
  const cat = (categoryName || item.categoryId?.name || '').toLowerCase().trim();
  const name = (item.name || '').toLowerCase();

  // 1. Starters Category ONLY
  if (cat.includes('starter')) {
    if (item.subCategory && item.subCategory.trim()) return item.subCategory;
    if (name.includes('fish') || name.includes('chepa') || name.includes('apollo')) {
      return '🐟 FISH STARTERS';
    }
    if (name.includes('prawn') || name.includes('royyala')) {
      return '🦐 PRAWN STARTERS';
    }
    if (
      name.includes('tandoori') ||
      name.includes('tikka') ||
      name.includes('kebab') ||
      name.includes('tangdi') ||
      name.includes('reshmi') ||
      name.includes('hariyali') ||
      name.includes('achari') ||
      name.includes('malai')
    ) {
      return '🔥 TANDOORI / KEBAB STARTERS';
    }
    if (item.vegType === 'non-veg' || name.includes('chicken') || name.includes('mutton') || name.includes('kodi')) {
      return '🍗 NON VEG STARTERS';
    }
    return '🥗 VEG STARTERS';
  }

  // 2. Biryanis Category ONLY
  if (cat.includes('biryani') || (cat === '' && name.includes('biryani'))) {
    if (item.subCategory && item.subCategory.trim() && item.subCategory.includes('BIRYANI')) {
      return item.subCategory;
    }
    if (name.includes('mutton')) {
      return '🐐 MUTTON BIRYANI';
    }
    if (name.includes('chicken') || name.includes('kodi')) {
      return '🍗 CHICKEN BIRYANI';
    }
    return '🥦 VEG BIRYANI';
  }

  // 3. Main Course Category ONLY
  if (cat.includes('main') || cat.includes('course')) {
    if (item.subCategory && item.subCategory.trim() && item.subCategory.includes('MAIN COURSE')) {
      return item.subCategory;
    }
    if (
      item.vegType === 'non-veg' ||
      item.vegType === 'egg' ||
      name.includes('chicken') ||
      name.includes('mutton') ||
      name.includes('fish') ||
      name.includes('egg') ||
      name.includes('prawn')
    ) {
      return '🍗 NON VEG MAIN COURSE';
    }
    return '🥦 VEG MAIN COURSE';
  }

  // If item has an explicit custom subCategory saved by the user
  if (item.subCategory && item.subCategory.trim()) {
    return item.subCategory;
  }

  // For all other categories (Breads, Desserts, Drinks, etc.), return empty string (NO sub-category pills!)
  return '';
};
