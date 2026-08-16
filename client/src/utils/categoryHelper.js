export const getSubCategory = (item) => {
  if (item.subCategory && item.subCategory.trim()) {
    return item.subCategory;
  }

  const name = (item.name || '').toLowerCase();

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
