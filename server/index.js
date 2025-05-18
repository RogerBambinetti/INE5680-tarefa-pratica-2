import express from 'express';
import { readData, writeData } from './database.js';

const app = express();

export function initServer() {

    app.use(express.json());

    app.post('/user/create', (req, res) => {
        writeData('users', req.body);

        return res.status(200).json({
            message: 'Usuário cadastrado com sucesso!',
        });
    });

    app.listen(3000);
}

