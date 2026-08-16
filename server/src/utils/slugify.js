function createSlug(text) {
  if (!text) return `rest-${Date.now()}`;
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with -
    .replace(/^-+|-+$/g, '');   // Remove leading and trailing -
}

module.exports = { createSlug };
