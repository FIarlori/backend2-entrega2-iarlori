 const authorize = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ 
                    error: 'No autenticado',
                    message: 'Debes iniciar sesión para acceder a este recurso'
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    error: 'Acceso denegado',
                    message: `No tienes permisos para realizar esta acción`,
                    details: {
                        rolRequerido: roles,
                        rolActual: req.user.role,
                        acción: `${req.method} ${req.originalUrl}`
                    },
                    suggestion: roles.length === 1 && roles[0] === 'admin' 
                        ? 'Esta acción es exclusiva para administradores'
                        : roles.length === 1 && roles[0] === 'user'
                        ? 'Esta acción es exclusiva para usuarios regulares'
                        : `Se requiere uno de los siguientes roles: ${roles.join(', ')}`
                });
            }

            next();
        } catch (error) {
            console.error('Error en middleware de autorización:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor en la verificación de permisos' 
            });
        }
    };
};

export default authorize;