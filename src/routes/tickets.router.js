import express from 'express';
import TicketRepository from '../repositories/TicketRepository.js';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorization.js';

const router = express.Router();

router.get('/my-tickets', auth, authorize(['user']), async (req, res) => {
    try {
        const tickets = await TicketRepository.getByPurchaser(req.user.email);
        res.json({
            success: true,
            tickets: tickets
        });
    } catch (error) {
        console.error('Error obteniendo tickets:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener los tickets'
        });
    }
});

router.get('/:code', auth, async (req, res) => {
    try {
        const ticket = await TicketRepository.getByCode(req.params.code);
        if (!ticket) {
            return res.status(404).json({ 
                error: 'Ticket no encontrado',
                message: `No se encontró un ticket con código: ${req.params.code}`
            });
        }

        if (ticket.purchaser !== req.user.email && req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Acceso denegado',
                message: 'Solo puedes ver tus propios tickets'
            });
        }

        res.json({
            success: true,
            ticket: ticket
        });
    } catch (error) {
        console.error('Error obteniendo ticket:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo obtener el ticket'
        });
    }
});

export default router;