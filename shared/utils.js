import crypto from 'crypto';

export function derivePBKDF2Key(password, salt) {
    const key = crypto.pbkdf2Sync(password, salt, 65536, 32, 'sha256');
    return key.toString('hex');
}

export function deriveScryptKey(password, salt) {
    const key = crypto.scryptSync(password, salt, 64);
    return key.toString('hex');
}

export function generateTOTP(secret) {
    return totp.generate(secret);
}

export function generateSalt(length = 16) {
    const saltBuffer = crypto.randomBytes(length);
    return saltBuffer.toString('base64');
}

export async function getCountryFromIP() {
    const res = await fetch(`https://ipinfo.io/json?token=737679b6115d0e`);
    const data = await res.json();
    return data.country;
}