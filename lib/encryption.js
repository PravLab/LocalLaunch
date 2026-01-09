// /lib/encryption.js
// Industry-standard AES-256-GCM encryption

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;        // 128 bits
const AUTH_TAG_LENGTH = 16;  // 128 bits
const SALT_LENGTH = 32;      // 256 bits

/**
 * Get encryption key from environment variable
 * This key should be 32 bytes (256 bits) for AES-256
 */
function getEncryptionKey() {
  const masterKey = process.env.ENCRYPTION_MASTER_KEY;
  
  if (!masterKey) {
    throw new Error('ENCRYPTION_MASTER_KEY environment variable is required');
  }
  
  // If key is not exactly 32 bytes, derive it using SHA-256
  if (masterKey.length !== 32) {
    return crypto.createHash('sha256').update(masterKey).digest();
  }
  
  return Buffer.from(masterKey);
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param {string} plaintext - The data to encrypt
 * @returns {string} - Encrypted data in format: iv:authTag:encryptedData (all base64)
 */
export function encrypt(plaintext) {
  if (!plaintext) return null;
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encryptedData (all base64 encoded)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
    
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data encrypted with AES-256-GCM
 * @param {string} encryptedData - The encrypted string in format iv:authTag:data
 * @returns {string} - The decrypted plaintext
 */
export function decrypt(encryptedData) {
  if (!encryptedData) return null;
  
  try {
    // Check if data is in our encrypted format
    if (!encryptedData.includes(':')) {
      // Data is not encrypted (plain text) - return as is
      // This handles migration from old plain text storage
      console.log('⚠️ Data appears to be plain text (not encrypted)');
      return encryptedData;
    }
    
    const parts = encryptedData.split(':');
    
    if (parts.length !== 3) {
      // Invalid format, might be plain text
      console.log('⚠️ Invalid encrypted format, returning as-is');
      return encryptedData;
    }
    
    const [ivBase64, authTagBase64, encrypted] = parts;
    
    const key = getEncryptionKey();
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
    
  } catch (error) {
    console.error('Decryption error:', error.message);
    // If decryption fails, data might be plain text (old format)
    console.log('⚠️ Decryption failed, data might be plain text');
    return encryptedData;
  }
}

/**
 * Check if a string is encrypted (in our format)
 * @param {string} data - The string to check
 * @returns {boolean}
 */
export function isEncrypted(data) {
  if (!data || typeof data !== 'string') return false;
  
  const parts = data.split(':');
  if (parts.length !== 3) return false;
  
  // Check if parts look like base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return parts.every(part => base64Regex.test(part));
}

/**
 * Mask a key for display (show first and last few characters)
 * @param {string} key - The key to mask
 * @returns {string} - Masked key like "rzp_test_****xyz"
 */
export function maskKey(key) {
  if (!key) return null;
  
  // First decrypt if encrypted
  let plainKey = key;
  if (isEncrypted(key)) {
    try {
      plainKey = decrypt(key);
    } catch {
      return '****encrypted****';
    }
  }
  
  if (!plainKey || plainKey.length < 10) return '****';
  
  const start = plainKey.slice(0, 12);
  const end = plainKey.slice(-4);
  return `${start}****${end}`;
}

/**
 * Generate a secure random encryption key (for initial setup)
 * @returns {string} - 32 byte hex string
 */
export function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}