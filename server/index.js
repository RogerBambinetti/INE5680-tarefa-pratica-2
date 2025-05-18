import express from 'express';
import { readData, writeData } from './database.js';
import { generateSalt } from '../shared/utils.js';

const app = express();

export function initServer() {

    app.use(express.json());

    app.post('/user/create', (req, res) => {
        const user = { ...req.body, salt: generateSalt() };

        writeData('users', user);

        return res.status(200).json({
            message: 'Usuário cadastrado com sucesso!',
            user: {
                username: user.username,
                location: user.location,
            }
        });
    });

    app.post('/user/auth', (req, res) => {

    });

    app.listen(3000);
}

