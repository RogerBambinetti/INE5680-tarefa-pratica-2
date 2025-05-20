import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

export async function deriveKey(password, salt) {
    const key = await pbkdf2(password, salt, 65536, 32, 'sha256');
    return key;
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