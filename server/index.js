import express from 'express';
import { readData, writeData } from './database.js';
import { generateSalt } from '../shared/utils.js';

const app = express();

export function initServer() {

    app.use(express.json());

    app.post('/user/create', (req, res) => {
        const user = { ...req.body, salt: generateSalt() };

        return res.status(200).json({
            message: 'Usuário cadastrado com sucesso!',
            user
        });
    });

    app.listen(3000);
}

