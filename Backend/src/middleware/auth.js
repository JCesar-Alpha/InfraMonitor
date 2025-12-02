import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acesso negado. Token não fornecido.'
            });
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido. Usuário não encontrado.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Acesso negado. Usuário não autenticado.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado. Permissões insuficientes.'
            });
        }

        next();
    };
};

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, config.jwt.secret);
            const user = await User.findById(decoded.userId).select('-password');
            req.user = user;
        }
        
        next();
    } catch (error) {
        // Continua sem autenticação em caso de erro
        next();
    }
};