import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        index: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        quantity: { 
            type: Number, 
            default: 1 
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('Cart', cartSchema);