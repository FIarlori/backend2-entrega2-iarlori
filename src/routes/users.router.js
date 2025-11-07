import express from 'express';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const cart = new Cart({ products: [] });
        await cart.save();

        const user = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: cart._id
        });

        await user.save();
        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('cart', 'products');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('cart', 'products');
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { password, ...updates } = req.body;
        if (password) {
            updates.password = bcrypt.hashSync(password, 10);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('cart');
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        if (user.cart) {
            await Cart.findByIdAndDelete(user.cart);
        }
        
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;