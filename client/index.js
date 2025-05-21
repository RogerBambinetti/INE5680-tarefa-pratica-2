import superagent from 'superagent';
import prompt from 'prompt-sync';
import { getCountryFromIP, generateTOTP, generateIV, derivePBKDF2Key, cipherGcm } from '../shared/utils.js';

const originalConsoleError = console.error;

const redColor = '\x1b[31m';
const resetColor = '\x1b[0m';

console.error = function () {
    const args = Array.from(arguments);

    if (typeof args[0] === 'string') {
        args[0] = redColor + args[0];
    } else {
        args.unshift(redColor);
    }

    args.push(resetColor);

    return originalConsoleError.apply(console, args);
};

const baseURL = 'http://localhost:3000';

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

                const createResponse = await superagent.post(baseURL + '/user/create').send({
                    username,
                    password,
                    location,
                    phone
                }).catch((error) => {
                    console.error(error.response.text);
                });

                if (!createResponse) {
                    break;
                }

                generateTOTP(createResponse.body.user.secret);

                break;
            case '2':
                const usernameAuth = readPrompt('Digite o nome de usuário: ');
                const passwordAuth = readPrompt('Digite a senha: ');
                const tokenTotpAuth = readPrompt('Digite o token TOTP: ');
                const locationAuth = await getCountryFromIP();

                const authResponse = await superagent.post(baseURL + '/user/auth').send({
                    username: usernameAuth,
                    password: passwordAuth,
                    tokenTotp: tokenTotpAuth,
                    location: locationAuth
                }).catch((error) => {
                    console.error(error.response.text);
                });

                if (!authResponse) {
                    break;
                }

                const { messageSalt } = authResponse.body;

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

                        const messageResponse = await superagent.post(baseURL + '/user/message').send({
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

initClient();