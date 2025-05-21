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

                // console.log(authResponse.data.message);

                const { messageSalt } = authResponse.data;

                while (true) {
                    console.log('--- Menu de Mensagens ---');
                    console.log('1. Enviar mensagem');
                    console.log('2. Sair');

                    const messageOption = readPrompt('Selecione uma opção: ');

                    if (messageOption == '1') {
                            const message = readPrompt('Digite a mensagem a ser enviada: ');
                            const key = derivePBKDF2Key(tokenTotpAuth, messageSalt);
                            const iv = generateIV();

                            const [encryptedMessage, authTag] = cipherGcm(message, key, iv);

                            const messageResponse = await client.post('/user/message', {
                                username: usernameAuth,
                                encryptedMessage,
                                authTag,
                                iv,
                            }).catch((error) => {
                                console.error(error);
                            });
                    } else if (messageOption == '2') {
                        console.log('Voltaldo ao menu principal...');
                        break;
                    } else {
                        console.log('Opção inválida. Tente novamente.');
                    }
                }
                break;
            case '3':
                console.log('Saindo...');
                process.exit(0);
            default:
                console.log('Opção inválida. Tente novamente.');
        }
    }

}