import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateUser, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// POST /api/auth/register - Registro público
router.post('/register', validateUser, authController.register);

// POST /api/auth/login - Login público
router.post('/login', validateLogin, authController.login);

// Rotas que requerem autenticação
router.use(authenticate);

// GET /api/auth/me - Obter usuário atual
router.get('/me', authController.getMe);

// PUT /api/auth/change-password - Alterar senha
router.put('/change-password', authController.changePassword);

export default router;