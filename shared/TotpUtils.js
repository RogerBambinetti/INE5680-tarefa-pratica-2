import { totp } from 'otplib';

export function generateTOTP(secret) {
    return totp.generate(secret);
}