export const getSubCategory = (item, categoryName = '') => {
  const name = (item.name || '').toLowerCase();
  const cat = (categoryName || '').toLowerCase();

  // If item is specifically in Main Course category
  if (cat.includes('main') || cat.includes('course')) {
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

  // If item is in Biryani category
  if (cat.includes('biryani')) {
    if (name.includes('mutton')) {
      return '🐐 MUTTON BIRYANI';
    }
    if (name.includes('chicken') || name.includes('kodi')) {
      return '🍗 CHICKEN BIRYANI';
    }
    return '🥦 VEG BIRYANI';
  }

  // If item has explicit subCategory saved
  if (item.subCategory && item.subCategory.trim()) {
    return item.subCategory;
  }

  // Starters Category Classification
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
};
