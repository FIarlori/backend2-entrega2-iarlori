import express from 'express';
import passport from 'passport';
import sessionRouter from './src/routes/sessions.router.js';
import userRouter from './src/routes/users.router.js';
import connectDB from './src/config/database.js';
import 'dotenv/config';
import './src/config/passport.config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(passport.initialize());

app.use('/api/sessions', sessionRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;