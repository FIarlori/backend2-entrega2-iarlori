 const authorizeCartOwner = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'No autenticado',
                message: 'Debes iniciar sesión para acceder a este recurso'
            });
        }

        const cartId = req.params.cid;
        
        if (req.user.cart.toString() !== cartId) {
            return res.status(403).json({ 
                error: 'Acceso denegado al carrito',
                message: 'Solo puedes acceder a tu propio carrito',
                details: {
                    carritoSolicitado: cartId,
                    carritoDelUsuario: req.user.cart?.toString(),
                    usuario: req.user.email
                }
            });
        }

        next();
    } catch (error) {
        console.error('Error en authorizeCartOwner:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al verificar propiedad del carrito' 
        });
    }
};
export default authorizeCartOwner;