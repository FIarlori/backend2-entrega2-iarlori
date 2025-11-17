class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.user = cart.user;
        this.products = cart.products.map(item => ({
            product: item.product ? {
                id: item.product._id,
                title: item.product.title,
                price: item.product.price
            } : item.product,
            quantity: item.quantity
        }));
        this.totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        this.totalAmount = cart.products.reduce((sum, item) => {
            return sum + (item.product ? item.product.price * item.quantity : 0);
        }, 0);
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }
}

export default CartDTO;