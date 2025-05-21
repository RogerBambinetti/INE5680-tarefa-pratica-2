import crypto from 'crypto';
import * as OTPAuth from "otpauth";
import qreate from 'qrcode-terminal';

export function derivePBKDF2Key(password, salt) {
    const key = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256');
    return key.toString('hex');
}

export function deriveScryptKey(password, salt) {
    const key = crypto.scryptSync(password, salt, 64);
    return key.toString('hex');
}

export function cipherGcm(message, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);

    let encrypted = cipher.update(message);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return [encrypted.toString('hex'), cipher.getAuthTag().toString('hex')];
}

export function decipherGcm(encryptedMessage, key, iv, authTag) {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(key, 'hex'),
        iv
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(Buffer.from(encryptedMessage, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
}

export function generateTOTP(secret) {
    const totp = new OTPAuth.TOTP({
        issuer: "INE5680 Sistema de autenticação 3FA",
        label: "2fa",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromHex(secret)
    });

    return qreate.generate(totp.toString(), { small: true });
}

export function validateTOTP(secret, token) {
    const totp = new OTPAuth.TOTP({
        issuer: "INE5680 Sistema de autenticação 3FA",
        label: "2fa",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromHex(secret)
    });

    const delta = totp.validate({ token });

    return delta !== null;
}

export function generateSalt(length = 16) {
    const saltBuffer = crypto.randomBytes(length);
    return saltBuffer.toString('base64');
}

export function generateIV() {
    const iv = crypto.randomBytes(12);
    return iv;
}

export async function getCountryFromIP() {
    const res = await fetch(`https://ipinfo.io/json?token=737679b6115d0e`);
    const data = await res.json();
    return data.country;
}
