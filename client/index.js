import axios from 'axios';
import { getCountryFromIP } from '../shared/utils.js';
import prompt from 'prompt-sync';
import qreate from 'qrcode-terminal';

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
                });

                console.log(createResponse.data.message, createResponse.data.user);
                qreate.generate(createResponse.data.user.secret, { small: true });
                break;
            case '2':
                const usernameAuth = readPrompt('Digite o nome de usuário: ');
                const passwordAuth = readPrompt('Digite a senha: ');
                const locationAuth = await getCountryFromIP();

                const authResponse = await client.post('/user/auth', {
                    username: usernameAuth,
                    password: passwordAuth,
                    location: locationAuth
                }).catch((error) => {
                    console.log('Erro ao autenticar usuário:', error.message);
                });

                console.log(authResponse.data.message);

                const message = readPrompt('Digite a mensagem a ser enviada: ');

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