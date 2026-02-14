const crypto = require('crypto');
const config = require('../config');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    if (!text) return text;
    if (!config.encryptionSecret) {
        console.error('Encryption secret not found!');
        throw new Error('Encryption secret is not configured.');
    }

    // Ensure the key is 32 bytes
    // usage of scrypt to derive a 32 byte key from the string secret is better practice than raw slicing,
    // but for this phase we will ensure the user provides a strong key or we hash it.
    // For simplicity and to avoid async scrypt in sync path, we'll use a hash to get 32 bytes if length mismatch,
    // or assume user provided 32 char string? 
    // Let's use crypto.createHash to ensure consistent 32 byte key from any secret string.
    const key = crypto.createHash('sha256').update(String(config.encryptionSecret)).digest();

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Return IV:EncryptedData
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    if (!text) return text;
    if (!config.encryptionSecret) {
        throw new Error('Encryption secret is not configured.');
    }

    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        const key = crypto.createHash('sha256').update(String(config.encryptionSecret)).digest();
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed:', error);
        // Fallback or throw? For now, return null or original to indicate failure, but throwing is safer for security.
        throw new Error('Failed to decrypt message');
    }
}

module.exports = { encrypt, decrypt };
