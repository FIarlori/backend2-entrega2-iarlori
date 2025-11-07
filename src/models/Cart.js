import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

export default mongoose.model('Cart', cartSchema);