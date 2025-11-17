import User from '../../models/User.js';

class UserDAO {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id).populate('cart');
    }

    async create(userData) {
        return await User.create(userData);
    }

    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    async save(user) {
        return await user.save();
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default new UserDAO();