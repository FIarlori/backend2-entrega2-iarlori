import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import TicketDTO from '../dtos/TicketDTO.js';


 const purchase = async (req, res) => {
    const { cid } = req.params;
    const user = req.user;

    try {
        const cart = await CartRepository.getById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        if (cart._id.toString() !== user.cart?.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para acceder a este carrito' 
            });
        }

        if (!cart.products || cart.products.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        let totalAmount = 0;
        const purchasedProducts = [];
        const failedProducts = [];
        const productsToUpdate = [];

        for (const item of cart.products) {
            try {
                const product = item.product;
                
                if (!product) {
                    failedProducts.push({
                        productId: item.product?._id || 'Desconocido',
                        productName: 'Producto no encontrado',
                        reason: 'Producto no existe',
                        quantity: item.quantity
                    });
                    continue;
                }

                if (product.stock < item.quantity) {
                    failedProducts.push({
                        productId: product._id,
                        productName: product.title,
                        reason: 'Stock insuficiente',
                        available: product.stock,
                        requested: item.quantity
                    });
                    continue;
                }

                const subtotal = product.price * item.quantity;
                totalAmount += subtotal;

                purchasedProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price, 
                    name: product.title, 
                    subtotal: subtotal
                });

                productsToUpdate.push({
                    productId: product._id,
                    newStock: product.stock - item.quantity
                });

            } catch (error) {
                console.error(`Error procesando producto:`, error);
                failedProducts.push({
                    productId: item.product?._id || 'Desconocido',
                    productName: 'Error al procesar',
                    reason: 'Error interno',
                    quantity: item.quantity
                });
            }
        }

        if (purchasedProducts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo procesar ningún producto - stock insuficiente',
                failedProducts: failedProducts
            });
        }

        for (const update of productsToUpdate) {
            await ProductRepository.update(update.productId, { 
                stock: update.newStock 
            });
        }

        const ticketData = {
            amount: totalAmount,
            purchaser: user.email,
            products: purchasedProducts
        };

        const ticket = await TicketRepository.create(ticketData);

        const remainingProducts = cart.products.filter(cartItem => {
            return failedProducts.some(failed => 
                failed.productId.toString() === cartItem.product._id.toString()
            );
        });

        cart.products = remainingProducts;
        await CartRepository.save(cart);

        res.status(200).json({
            success: true,
            message: `Compra finalizada exitosamente`,
            ticket: new TicketDTO(ticket),
            summary: {
                purchased: purchasedProducts.length,
                failed: failedProducts.length,
                totalAmount: totalAmount
            },
            failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
            remainingInCart: cart.products.length > 0 ? cart.products : 'Carrito vacío'
        });

    } catch (error) {
        console.error('Error en el proceso de compra:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo completar el proceso de compra',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default purchase;