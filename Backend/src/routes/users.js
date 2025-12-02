import express from 'express';
import { usersController } from '../controllers/usersController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/leaderboard - Ranking público
router.get('/leaderboard', usersController.getLeaderboard);

// GET /api/users/:id/occurrences - Ocorrências de um usuário (público)
router.get('/:id/occurrences', usersController.getUserOccurrences);

// Rotas que requerem autenticação
router.use(authenticate);

// GET /api/users/profile - Perfil do usuário logado
router.get('/profile', usersController.getProfile);

// PUT /api/users/profile - Atualizar perfil
router.put('/profile', usersController.updateProfile);

export default router;