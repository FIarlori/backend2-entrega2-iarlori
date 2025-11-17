import Product from '../../models/Product.js';

class ProductDAO {
    async findById(id) {
        return await Product.findById(id);
    }

    async create(data) {
        return await Product.create(data);
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async find() {
        return await Product.find();
    }

    async findByCode(code) {
        return await Product.findOne({ code });
    }
}

export default new ProductDAO();