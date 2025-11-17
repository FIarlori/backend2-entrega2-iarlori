import ProductDAO from '../daos/mongodb/ProductDAO.js';

class ProductRepository {
    constructor() {
        this.dao = ProductDAO;
    }

    async getById(id) {
        return await this.dao.findById(id);
    }

    async create(data) {
        try {
            return await this.dao.create(data);
        } catch (error) {
            if (error.code === 11000) {
                const duplicatedField = Object.keys(error.keyPattern)[0];
                const duplicatedValue = error.keyValue[duplicatedField];
                throw new Error(`Ya existe un producto con ${duplicatedField}: ${duplicatedValue}`);
            }
            throw error;
        }
    }

    async update(id, data) {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            if (error.code === 11000) {
                const duplicatedField = Object.keys(error.keyPattern)[0];
                const duplicatedValue = error.keyValue[duplicatedField];
                throw new Error(`Ya existe un producto con ${duplicatedField}: ${duplicatedValue}`);
            }
            throw error;
        }
    }

    async delete(id) {
        return await this.dao.delete(id);
    }

    async getAll() {
        return await this.dao.find();
    }

    async getByCode(code) {
        return await this.dao.findByCode(code);
    }
}

export default new ProductRepository();