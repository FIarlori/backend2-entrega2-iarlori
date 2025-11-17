import CartDAO from '../daos/mongodb/CartDAO.js';

class CartRepository {
    constructor() {
        this.dao = CartDAO;
    }

    async getById(id) {
        return await this.dao.findById(id);
    }

    async create() {
        return await this.dao.create();
    }

    async save(cart) {
        return await this.dao.save(cart);
    }
}

export default new CartRepository();