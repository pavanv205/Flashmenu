export const getSubCategory = (item) => {
  if (item.subCategory && item.subCategory.trim()) {
    return item.subCategory;
  }

  const name = (item.name || '').toLowerCase();

  // Biryanis Sub-Categories Classification
  if (name.includes('biryani')) {
    if (name.includes('mutton')) {
      return '🐐 MUTTON BIRYANI';
    }
    if (name.includes('chicken') || name.includes('kodi')) {
      return '🍗 CHICKEN BIRYANI';
    }
    return '🥦 VEG BIRYANI';
  }

  // Main Course Sub-Categories Classification
  if (
    name.includes('curry') ||
    name.includes('pappu') ||
    name.includes('sambar') ||
    name.includes('pulihora') ||
    name.includes('vankaya') ||
    name.includes('pulusu') ||
    name.includes('makhani') ||
    name.includes('butter chicken') ||
    name.includes('kadhai')
  ) {
    if (
      item.vegType === 'non-veg' ||
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

  // Starters Sub-Categories Classification
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
