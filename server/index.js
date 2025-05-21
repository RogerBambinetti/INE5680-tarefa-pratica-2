import express from 'express';
import { readData, writeData, updateData } from './database.js';
import { generateSalt, derivePBKDF2Key, deriveScryptKey, validateTOTP, decipherGcm } from '../shared/utils.js';

const app = express();

export function initServer() {

    app.use(express.json());

    app.post('/user/create', (req, res) => {
        const user = { ...req.body, passwordSalt: generateSalt(), totpSalt: generateSalt(), messageSalt: generateSalt() };

        const encryptedPassword = deriveScryptKey(user.password, user.passwordSalt);
        user.password = encryptedPassword;

        writeData('users', user);

        return res.status(200).json({
            message: 'Usuário cadastrado com sucesso!',
            user: {
                username: user.username,
                location: user.location,
                secret: derivePBKDF2Key(user.phone, user.totpSalt)
            }
        });
    });

    app.post('/user/auth', (req, res) => {
        const { username, password, tokenTotp } = req.body;

        const { users } = readData();
        const user = users.find(user => user.username === username);

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado!' });
        }

        if (user.location !== req.body.location) {
            return res.status(401).json({ message: 'Localização inválida!' });
        }

        const encryptedPassword = deriveScryptKey(password, user.passwordSalt);

        if (encryptedPassword !== user.password) {
            return res.status(401).json({ message: 'Senha incorreta!' });
        }

        const secret = derivePBKDF2Key(user.phone, user.totpSalt);
        const isTokenValid = validateTOTP(secret, tokenTotp);

        if (!isTokenValid) {
            return res.status(401).json({ message: 'Token TOTP inválido!' });
        }

        user.sessionTotp = tokenTotp
        updateData('users', 'username', user.username, user)

        return res.status(200).json({ message: 'Usuário autenticado com sucesso!', messageSalt: user.messageSalt });
    });

    app.post('/user/message', (req, res) => {
        const { username, encryptedMessage, authTag, iv } = req.body;

        const { users } = readData();
        const user = users.find(user => user.username === username);

        const key = derivePBKDF2Key(user.sessionTotp, user.messageSalt);
        const decryptedMessage = decipherGcm(encryptedMessage, key, iv, authTag);

        console.log('Mensagem decifrada:', decryptedMessage);

        return res.status(200).json({ message: 'Mensagem recebida com sucesso!' });
    });

    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
}

initServer();
