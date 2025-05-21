import axios from 'axios';
import prompt from 'prompt-sync';
import { getCountryFromIP, generateTOTP, generateIV, derivePBKDF2Key, cipherGcm } from '../shared/utils.js';

const client = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

const readPrompt = prompt({ sigint: true });

export async function initClient() {

    while (true) {

        console.log('--- Menu ---');
        console.log('1. Cadastrar usuário');
        console.log('2. Autenticar usuário');
        console.log('3. Sair');

        const option = readPrompt('Selecione uma opção: ');

        switch (option) {
            case '1':
                const username = readPrompt('Digite o nome de usuário: ');
                const password = readPrompt('Digite a senha: ');
                const phone = readPrompt('Digite o telefone: ');
                const location = await getCountryFromIP();

                const createResponse = await client.post('/user/create', {
                    username,
                    password,
                    location,
                    phone
                }).catch((error) => {
                    console.error(error.response.data.message);
                });

                if (!createResponse) {
                    break;
                }

                generateTOTP(createResponse.data.user.secret);

                break;
            case '2':
                const usernameAuth = readPrompt('Digite o nome de usuário: ');
                const passwordAuth = readPrompt('Digite a senha: ');
                const tokenTotpAuth = readPrompt('Digite o token TOTP: ');
                const locationAuth = await getCountryFromIP();

                const authResponse = await client.post('/user/auth', {
                    username: usernameAuth,
                    password: passwordAuth,
                    tokenTotp: tokenTotpAuth,
                    location: locationAuth
                }).catch((error) => {
                    console.error(error.response.data.message);
                });

                if (!authResponse) {
                    break;
                }

                console.log(authResponse.data.message);

                const { messageSalt } = authResponse.data;

                const message = readPrompt('Digite a mensagem a ser enviada: ');
                const key = derivePBKDF2Key(tokenTotpAuth, messageSalt);

                const iv = generateIV();

                const encryptedMessage = cipherGcm(message, key, iv);

                console.log('Mensagem criptografada:', encryptedMessage);

                console.log('Mensagem enviada com sucesso!');

                break;
            case '3':
                console.log('Saindo...');
                process.exit(0);
            default:
                console.log('Opção inválida. Tente novamente.');
        }
    }

}