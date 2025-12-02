import express from 'express';
import { statsController } from '../controllers/statsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de stats são públicas
router.use(optionalAuth);

// GET /api/stats - Estatísticas gerais
router.get('/', statsController.getStats);

// GET /api/stats/leaderboard - Ranking de usuários
router.get('/leaderboard', statsController.getLeaderboard);

// GET /api/stats/overview - Visão geral para dashboard
router.get('/overview', statsController.getOverview);

export default router;