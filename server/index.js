import { generateTOTP } from './totpUtils.js';
import { deriveKey, decryptAESGCM } from './cryptoUtils.js';

const secretTotp = 'JBSWY3DPEHPK3PXP';
const salt = Buffer.from('somesalt12345678');

const totpCode = generateTOTP(secretTotp);
const key = await deriveKey(totpCode, salt);

// Simule os valores recebidos do cliente
const receivedCipherText = '...';
const receivedIv = '...';
const receivedTag = '...';

const plainText = decryptAESGCM(receivedCipherText, key, receivedIv, receivedTag);
console.log('Mensagem recebida:', plainText);
