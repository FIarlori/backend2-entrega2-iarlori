import Ticket from '../../models/Ticket.js';

class TicketDAO {
    async create(data) {
        try {
            return await Ticket.create(data);
        } catch (error) {
            if (error.code === 11000) { 
                delete data.code; 
                return await Ticket.create(data);
            }
            throw error;
        }
    }

    async findByCode(code) {
        return await Ticket.findOne({ code }).populate('products.product');
    }

    async findByPurchaser(email) {
        return await Ticket.find({ purchaser: email })
            .populate('products.product')
            .sort({ purchase_datetime: -1 });
    }
}

export default new TicketDAO();