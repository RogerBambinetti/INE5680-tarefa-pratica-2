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

export async function getCountryFromIP() {
    const res = await fetch(`https://ipinfo.io/json?token=737679b6115d0e`);
    const data = await res.json();
    return data.country;
}