import express from 'express';
import { occurrencesController } from '../controllers/occurrencesController.js';
import { authenticate, optionalAuth, authorize } from '../middleware/auth.js';
import { validateOccurrence, validateConfirmation } from '../middleware/validation.js';

const router = express.Router();

// Todas as rotas públicas podem usar autenticação opcional
router.use(optionalAuth);

// GET /api/occurrences - Listar ocorrências (público)
router.get('/', occurrencesController.getOccurrences);

// GET /api/occurrences/:id - Obter ocorrência específica (público)
router.get('/:id', occurrencesController.getOccurrence);

// GET /api/occurrences/:id/confirmations - Listar confirmações (público)
router.get('/:id/confirmations', occurrencesController.getConfirmations);

// Rotas que requerem autenticação
router.use(authenticate);

// POST /api/occurrences - Criar ocorrência (usuário autenticado)
router.post('/', validateOccurrence, occurrencesController.createOccurrence);

// PUT /api/occurrences/:id/confirm - Confirmar ocorrência (usuário autenticado)
router.put('/:id/confirm', validateConfirmation, occurrencesController.confirmOccurrence);

// PUT /api/occurrences/:id - Atualizar ocorrência (admin ou dono)
router.put('/:id', validateOccurrence, occurrencesController.updateOccurrence);

// DELETE /api/occurrences/:id - Excluir ocorrência (admin ou dono)
router.delete('/:id', occurrencesController.deleteOccurrence);

export default router;