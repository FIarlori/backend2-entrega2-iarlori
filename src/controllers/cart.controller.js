import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import CartDTO from '../dtos/CartDTO.js';


const addToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const product = await ProductRepository.getById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ error: 'Producto sin stock disponible' });
        }

        const cart = await CartRepository.getById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        console.log('🔍 Buscando producto existente en carrito...');
        console.log('   Product ID buscado:', pid);
        console.log('   Productos en carrito:', cart.products.map(p => ({
            productId: p.product._id.toString(),
            quantity: p.quantity
        })));

        const existingProduct = cart.products.find(p => {
            const productId = p.product._id ? p.product._id.toString() : p.product.toString();
            return productId === pid;
        });

        console.log('   Producto existente encontrado:', existingProduct ? 'Sí' : 'No');

        if (existingProduct) {
            const newQuantity = existingProduct.quantity + 1;
            if (newQuantity > product.stock) {
                return res.status(400).json({ 
                    error: 'No hay suficiente stock disponible',
                    available: product.stock,
                    requested: newQuantity,
                    currentInCart: existingProduct.quantity
                });
            }
            existingProduct.quantity = newQuantity;
            console.log('   ✅ Cantidad incrementada a:', existingProduct.quantity);
        } else {
            cart.products.push({ 
                product: pid, 
                quantity: 1 
            });
            console.log('   ✅ Nuevo producto agregado al carrito');
        }

        await CartRepository.save(cart);
        
        const updatedCart = await CartRepository.getById(cid);
        
        res.json({
            message: existingProduct ? 'Cantidad actualizada en el carrito' : 'Producto agregado al carrito exitosamente',
            cart: new CartDTO(updatedCart),
            summary: {
                totalProducts: updatedCart.products.length,
                totalItems: updatedCart.products.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        console.error('Error en addToCart:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo agregar el producto al carrito',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default addToCart;
