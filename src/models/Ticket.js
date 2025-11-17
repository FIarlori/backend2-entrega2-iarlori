import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketSchema = new mongoose.Schema({
    code: { 
        type: String, 
        unique: true, 
        required: true,
        default: () => uuidv4()
    },
    purchase_datetime: { 
        type: Date, 
        default: Date.now 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    purchaser: { 
        type: String, 
        required: true 
    },
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        quantity: { 
            type: Number, 
            required: true 
        },
        price: {
            type: Number,
            required: true
        }
    }]
});

ticketSchema.pre('save', async function(next) {
    if (!this.code) {
        let isUnique = false;
        let attempts = 0;
        
        while (!isUnique && attempts < 5) {
            try {
                this.code = uuidv4();
                const existing = await mongoose.model('Ticket').findOne({ code: this.code });
                if (!existing) {
                    isUnique = true;
                }
            } catch (error) {
                attempts++;
                if (attempts >= 5) {
                    return next(new Error('No se pudo generar un código único para el ticket'));
                }
            }
        }
    }
    next();
});

export default mongoose.model('Ticket', ticketSchema);