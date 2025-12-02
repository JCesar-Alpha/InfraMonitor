import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { User } from '../models/User.js';

export const authController = {
    // POST /api/auth/register - Registrar usuário
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Verificar se usuário já existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email já cadastrado'
                });
            }

            // Criar usuário
            const user = new User({
                name,
                email,
                password
            });

            await user.save();

            // Gerar token
            const token = jwt.sign(
                { userId: user.id },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            );

            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        stats: user.stats
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno no registro'
            });
        }
    },

    // POST /api/auth/login - Login do usuário
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar usuário
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Verificar senha
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Atualizar último login
            user.lastLogin = new Date();
            await user.save();

            // Gerar token
            const token = jwt.sign(
                { userId: user.id },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            );

            res.json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        stats: user.stats,
                        profile: user.profile
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno no login'
            });
        }
    },

    // GET /api/auth/me - Obter usuário atual
    async getMe(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar usuário'
            });
        }
    },

    // PUT /api/auth/change-password - Alterar senha
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            const user = await User.findById(req.user.id);
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);

            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Senha atual incorreta'
                });
            }

            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Senha alterada com sucesso'
            });
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao alterar senha'
            });
        }
    }
};