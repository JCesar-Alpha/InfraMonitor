import express from 'express';
import occurrencesRoutes from './occurrences.js';
import statsRoutes from './stats.js';
import usersRoutes from './users.js';
import authRoutes from './auth.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API InfraMonitor está funcionando!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Rotas da API
router.use('/occurrences', occurrencesRoutes);
router.use('/stats', statsRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);

// Rota padrão para API não encontrada
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota da API não encontrada: ${req.method} ${req.originalUrl}`
    });
});

export default router;