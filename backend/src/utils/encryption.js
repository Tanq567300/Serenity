const crypto = require('crypto');

// Ensure ENCRYPTION_SECRET is set in .env
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_SECRET; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size

if (!SECRET_KEY) {
    console.warn('WARNING: ENCRYPTION_SECRET is not defined. Encryption will fail.');
}

/**
 * Encrypts a text string
 * @param {string} text 
 * @returns {string} - format: iv:encryptedText (hex)
 */
const encrypt = (text) => {
    if (!text) return text;
    if (!SECRET_KEY) throw new Error('Encryption secret missing');

    // If the secret is not 32 chars, we might want to hash it to fit, usually standard practice:
    // but for now, assume the user provides a valid 32-char or similar key.
    // Actually, let's hash the secret to ensure it's always 32 bytes (256 bits).
    const key = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substring(0, 32);

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypts an encrypted text string
 * @param {string} text - format: iv:encryptedText
 * @returns {string}
 */
const decrypt = (text) => {
    if (!text) return text;
    if (!text.includes(':')) return text; // Not encrypted or legacy format
    if (!SECRET_KEY) throw new Error('Encryption secret missing');

    const key = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substring(0, 32);

    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};

module.exports = {
    encrypt,
    decrypt
};
