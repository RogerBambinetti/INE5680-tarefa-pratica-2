import { generateTOTP } from './totpUtils.js';
import { deriveKey, encryptAESGCM } from './cryptoUtils.js';

const senha = 'minhaSenha123';
const secretTotp = 'JBSWY3DPEHPK3PXP';
const salt = Buffer.from('somesalt12345678');

const totpCode = generateTOTP(secretTotp);
const key = await deriveKey(totpCode, salt);

const { cipherText, iv, tag } = encryptAESGCM('Mensagem secreta para o servidor', key);

console.log('Mensagem cifrada:', cipherText);
console.log('IV:', iv);
console.log('Tag:', tag);