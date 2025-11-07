import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export default generateToken;