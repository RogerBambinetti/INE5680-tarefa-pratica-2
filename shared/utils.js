import crypto from 'crypto';
import { promisify } from 'util';
import { totp } from 'otplib';

const pbkdf2 = promisify(crypto.pbkdf2);

export async function deriveKey(password, salt) {
    const key = await pbkdf2(password, salt, 65536, 32, 'sha256');
    return key;
}

export function encryptAESGCM(plaintext, key) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        cipherText: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64')
    };
}

export function decryptAESGCM(cipherText, key, ivBase64, tagBase64) {
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(cipherText, 'base64')),
        decipher.final()
    ]);
    return decrypted.toString();
}

export function generateTOTP(secret) {
    return totp.generate(secret);
}

export async function getCountryFromIP() {
    const res = await fetch(`https://ipinfo.io/json?token=737679b6115d0e`);
    const data = await res.json();
    return data.country;
}