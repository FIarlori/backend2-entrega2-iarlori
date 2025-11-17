import jwt from 'jsonwebtoken';
import 'dotenv/config';

 const generateResetToken = (userId) => {
    return jwt.sign({ id: userId, type: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

 const verifyResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'password_reset') {
            throw new Error('Token inválido');
        }
        return decoded;
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

export default {
    generateResetToken,
    verifyResetToken
};