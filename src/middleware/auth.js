import passport from 'passport';

const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno de autenticación' });
        }
        if (!user) {
            return res.status(401).json({ 
                error: 'No autorizado',
                message: 'Token inválido, expirado o no proporcionado',
                suggestion: 'Asegúrate de incluir un token JWT válido en el header Authorization'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export default auth;