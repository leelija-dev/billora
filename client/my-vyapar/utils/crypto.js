// Utility functions for encryption/decryption

// Secret key for XOR encryption (should be consistent across app)
const SECRET_KEY = 'fastbill2024secure';

/**
 * Encrypt a value to use in URLs using XOR cipher
 * @param {string|number} value - The value to encrypt
 * @returns {string} - The encrypted value (URL-safe)
 */
export function encryptId(value) {
  if (!value) return '';
  
  try {
    const str = value.toString();
    let encrypted = '';
    
    // XOR encryption with key
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    // Convert to base64
    const base64 = btoa(encrypted);
    // Make it URL-safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

/**
 * Decrypt a value from URL using XOR cipher
 * @param {string} encrypted - The encrypted value
 * @returns {string} - The decrypted value
 */
export function decryptId(encrypted) {
  if (!encrypted) return '';
  
  try {
    // Convert back from URL-safe encoding
    const base64 = encrypted.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    // Decode from base64
    const decoded = atob(padded);
    
    // XOR decryption with key
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}