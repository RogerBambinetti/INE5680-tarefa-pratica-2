import axios from 'axios';
import { getCountryFromIP } from '../shared/utils.js';
import prompt from 'prompt-sync';

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
                const location = await getCountryFromIP();

                const { data: createData } = await client.post('/user/create', {
                    username,
                    password,
                    location
                });

                console.log(createData.message, createData.user);
                break;
            case '2':
                const usernameAuth = readPrompt('Digite o nome de usuário: ');
                const passwordAuth = readPrompt('Digite a senha: ');
                const totpCode = readPrompt('Digite o código TOTP: ');
                const secretTotp = readPrompt('Digite o segredo TOTP: ');

                const { data: authData } = await client.post('/user/auth', {
                    username: usernameAuth,
                    password: passwordAuth,
                    totpCode,
                    secretTotp
                });

                console.log('Usuário autenticado com sucesso!');

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