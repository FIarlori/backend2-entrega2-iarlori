import Cart from '../../models/Cart.js';

class CartDAO {
    async findById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async create() {
        return await Cart.create({ products: [] });
    }

    async save(cart) {
        return await cart.save();
    }

    async update(id, data) {
        return await Cart.findByIdAndUpdate(id, data, { new: true }).populate('products.product');
    }
}

export default new CartDAO();