import mongoose from 'mongoose';
import 'dotenv/config';
import '../models/User.js';
import '../models/Cart.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error de conexión:', error);
        process.exit(1);
    }
};

export default connectDB;