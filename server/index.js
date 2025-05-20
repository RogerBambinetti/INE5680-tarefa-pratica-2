import express from 'express';
import { readData, writeData } from './database.js';
import { generateSalt, derivePBKDF2Key, deriveScryptKey } from '../shared/utils.js';
import * as OTPAuth from "otpauth";

const app = express();

export function initServer() {

    app.use(express.json());

    app.post('/user/create', (req, res) => {
        const user = { ...req.body, passwordSalt: generateSalt(), totpSalt: generateSalt() };

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
        const { username, password } = req.body;

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

        const totp = new OTPAuth.TOTP({
            issuer: username,
            label: "2fa",
            algorithm: "SHA1",
            digits: 6,
            secret: secret
        });

        const isTokenValid = totp.validate({ token: req.body.tokenTotp });

        return res.status(200).json({ message: 'Usuário autenticado com sucesso!' });
    });

    app.listen(3000);
}

