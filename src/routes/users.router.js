import express from 'express';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import bcrypt from 'bcrypt';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorization.js';
import UserDTO from '../dtos/UserDTO.js';

const router = express.Router();

router.post('/', async (req, res) => {
    let user;
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Email duplicado',
                message: 'El email ya está registrado' 
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        user = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role || 'user'
        });
        await user.save();

        const cart = new Cart({ 
            user: email,
            user_id: user._id,
            products: [] 
        });
        await cart.save();

        user.cart = cart._id;
        await user.save();

        res.status(201).json({ 
            success: true,
            message: 'Usuario creado exitosamente',
            user: new UserDTO(user)
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        
        if (user && user._id) {
            await User.findByIdAndDelete(user._id);
        }
        
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo crear el usuario'
        });
    }
});

router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.find().populate('cart', 'products');
        res.status(200).json({
            success: true,
            count: users.length,
            users: users.map(user => new UserDTO(user))
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor', 
            message: 'No se pudieron obtener los usuarios'
        });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes ver tu propia información de usuario',
                details: {
                    usuarioSolicitado: req.params.id,
                    usuarioAutenticado: req.user._id.toString()
                }
            });
        }

        const user = await User.findById(req.params.id).populate('cart', 'products');
        if (!user) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado',
                message: `No se encontró un usuario con ID: ${req.params.id}`
            });
        }
        
        res.status(200).json({
            success: true,
            user: new UserDTO(user)
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo obtener el usuario'
        });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes actualizar tu propia información de usuario',
                details: {
                    usuarioSolicitado: req.params.id,
                    usuarioAutenticado: req.user._id.toString()
                }
            });
        }

        const { password, role, ...updates } = req.body;
        
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Acceso denegado', 
                message: 'Solo los administradores pueden cambiar roles'
            });
        }

        const allowedFieldsForUsers = ['first_name', 'last_name', 'age', 'password'];
        if (req.user.role !== 'admin') {
            Object.keys(updates).forEach(key => {
                if (!allowedFieldsForUsers.includes(key)) {
                    delete updates[key];
                }
            });
        }

        if (password) {
            updates.password = bcrypt.hashSync(password, 10);
        }
        if (role && req.user.role === 'admin') {
            updates.role = role;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { 
            new: true,
            runValidators: true 
        }).populate('cart');
        
        if (!user) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado',
                message: `No se encontró un usuario con ID: ${req.params.id}`
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: new UserDTO(user)
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo actualizar el usuario'
        });
    }
});

router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado',
                message: `No se encontró un usuario con ID: ${req.params.id}`
            });
        }
        
        if (user.cart) {
            await Cart.findByIdAndDelete(user.cart);
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Usuario eliminado exitosamente',
            deletedUser: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo eliminar el usuario'
        });
    }
});

export default router;