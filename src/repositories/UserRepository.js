import UserDAO from '../daos/mongodb/UserDAO.js';

class UserRepository {
    constructor() {
        this.dao = UserDAO;
    }

    async getByEmail(email) {
        return await this.dao.findByEmail(email);
    }

    async getById(id) {
        return await this.dao.findById(id);
    }

    async create(data) {
        return await this.dao.create(data);
    }

    async update(id, data) {
        return await this.dao.update(id, data);
    }

    async save(user) {
        return await this.dao.save(user);
    }

    async delete(id) {
        return await this.dao.delete(id);
    }
}

export default new UserRepository();