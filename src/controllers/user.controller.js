import UserRepository from '../repositories/UserRepository.js';
import sendResetEmail from '../services/mail.service.js';
import passwordService from '../services/password.service.js';
import passwordUtils from '../utils/password.js';

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                error: 'Email requerido',
                message: 'El campo email es obligatorio' 
            });
        }

        const user = await UserRepository.getByEmail(email);
        
        if (!user) {
            return res.status(200).json({ 
                message: 'Si el email existe en nuestro sistema, recibirás instrucciones de recuperación en tu bandeja de entrada' 
            });
        }

        const token = passwordService.generateResetToken(user._id);
        await sendResetEmail(email, token);

        res.status(200).json({ 
            success: true,
            message: 'Email de recuperación enviado exitosamente',
            note: 'Revisa tu bandeja de entrada y carpeta de spam. El enlace expira en 1 hora.'
        });
    } catch (error) {
        console.error('Error en requestPasswordReset:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo procesar la solicitud de recuperación de contraseña'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ 
                error: 'Datos incompletos',
                message: 'Token y nueva contraseña son requeridos' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'Contraseña inválida',
                message: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        const decoded = passwordService.verifyResetToken(token);
        const user = await UserRepository.getById(decoded.id);

        if (!user) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado',
                message: 'No se encontró el usuario asociado al token' 
            });
        }

        if (passwordUtils.comparePassword(newPassword, user.password)) {
            return res.status(400).json({ 
                error: 'Contraseña idéntica',
                message: 'No puedes usar la misma contraseña anterior' 
            });
        }

        user.password = passwordUtils.hashPassword(newPassword);
        await UserRepository.update(user._id, { password: user.password });

        res.status(200).json({ 
            success: true,
            message: 'Contraseña actualizada exitosamente' 
        });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        
        if (error.message.includes('Token inválido') || error.message.includes('expirado')) {
            return res.status(400).json({ 
                error: 'Token inválido',
                message: error.message 
            });
        }
        
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo actualizar la contraseña' 
        });
    }
};

export default {
    requestPasswordReset,
    resetPassword
};