import TicketDAO from '../daos/mongodb/TicketDAO.js';
import TicketDTO from '../dtos/TicketDTO.js';


class TicketRepository {
    constructor() {
        this.dao = TicketDAO;
    }

    async create(data) {
        const { code, ...ticketData } = data;
        return await this.dao.create(ticketData);
    }

    async getByCode(code) {
        const ticket = await this.dao.findByCode(code);
        if (!ticket) return null;
        
        return this._formatTicketResponse(ticket);
    }

    async getByPurchaser(email) {
        const tickets = await this.dao.findByPurchaser(email);
        return tickets.map(ticket => this._formatTicketResponse(ticket));
    }

    _formatTicketResponse(ticket) {
        return new TicketDTO(ticket);
    }
}

export default new TicketRepository();