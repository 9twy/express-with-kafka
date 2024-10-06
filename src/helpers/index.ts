import crypto from 'crypto';

const SECRET = 'SAEED-REST-API';

// Generates a random salt for hashing
export const random = () => crypto.randomBytes(128).toString('base64');

// Hashes the password using HMAC with the provided salt and password
export const authentication = (salt: string, password: string) => {
    return crypto
        .createHmac('sha256', [salt, password].join('/'))
        .update(SECRET)
        .digest('hex'); // Convert Buffer to a hex string for readability
};