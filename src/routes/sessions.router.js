import express from 'express';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository.js';
import generateToken from '../utils/jwt.js';
import auth from '../middleware/auth.js';
import CurrentUserDTO from '../dtos/CurrentUserDTO.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const user = await UserRepository.getByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generateToken(user);
        res.status(200).json({ 
            token,
            user: new CurrentUserDTO(user)
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/current', auth, (req, res) => {
    const userDTO = new CurrentUserDTO(req.user);
    res.json(userDTO);
});

router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

export default router;