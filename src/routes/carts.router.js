import express from 'express';
import addToCart from '../controllers/cart.controller.js';
import purchase from '../controllers/purchase.controller.js';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorization.js';
import authorizeCartOwner from '../middleware/cartAuthorization.js';

const router = express.Router();

router.post('/:cid/product/:pid', 
    auth, 
    authorize(['user']), 
    authorizeCartOwner, 
    addToCart
);

router.post('/:cid/purchase', 
    auth, 
    authorize(['user']), 
    authorizeCartOwner, 
    purchase
);

export default router;