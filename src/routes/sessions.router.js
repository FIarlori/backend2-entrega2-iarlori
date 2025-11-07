import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/current', auth, (req, res) => {
    const userData = {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    };
    res.status(200).json(userData);
});

export default router;