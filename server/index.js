import express from 'express';

const app = express();

export function initServer() {

    app.use(express.json());

    app.post('/user/create', (req, res) => {
        const { username, password, salt, location } = req.body;

        return res.status(200).json({
            message: 'Usuário cadastrado com sucesso!',
            user: {
                username,
                location
            },
        });
    });

    app.listen(3000);
}

