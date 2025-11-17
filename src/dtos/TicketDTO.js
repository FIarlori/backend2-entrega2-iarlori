class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.products = ticket.products.map(item => ({
            product: {
                id: item.product._id,
                title: item.product.title,
                price: item.product.price
            },
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }));
        this.summary = {
            totalProducts: ticket.products.length,
            totalItems: ticket.products.reduce((sum, item) => sum + item.quantity, 0)
        };
    }
}

export default TicketDTO;