// Utility functions for slug generation and decoding

/**
 * Convert a string to a URL-friendly slug
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
export function slugify(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}

/**
 * Convert a slug back to readable text
 * @param {string} slug - The slug to decode
 * @returns {string} - The decoded text
 */
export function unslugify(slug) {
  if (!slug) return '';
  
  return slug
    .toString()
    .replace(/-/g, ' ')           // Replace - with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
}

/**
 * Get the original tag name from a slug (keeps original casing)
 * @param {string} slug - The slug to decode
 * @returns {string} - The decoded text with original casing preserved
 */
export function decodeSlug(slug) {
  if (!slug) return '';
  
  return slug.replace(/-/g, ' ');
}