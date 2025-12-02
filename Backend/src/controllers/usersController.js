import { User } from '../models/User.js';
import { Occurrence } from '../models/Occurrence.js';

export const usersController = {
    // GET /api/users/profile - Perfil do usuário
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id)
                .select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            // Buscar ocorrências do usuário
            const userOccurrences = await Occurrence.find({ reportedBy: req.user.id })
                .sort({ createdAt: -1 })
                .limit(10);

            res.json({
                success: true,
                data: {
                    user,
                    recentOccurrences: userOccurrences
                }
            });
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar perfil'
            });
        }
    },

    // PUT /api/users/profile - Atualizar perfil
    async updateProfile(req, res) {
        try {
            const allowedUpdates = ['name', 'profile', 'preferences'];
            const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
            
            const updateData = {};
            updates.forEach(update => {
                updateData[update] = req.body[update];
            });

            const user = await User.findByIdAndUpdate(
                req.user.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            res.json({
                success: true,
                message: 'Perfil atualizado com sucesso',
                data: user
            });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar perfil'
            });
        }
    },

    // GET /api/users/leaderboard - Ranking de usuários
    async getLeaderboard(req, res) {
        try {
            const leaderboard = await User.find()
                .select('name profile stats')
                .sort({ 'stats.points': -1 })
                .limit(20);

            res.json({
                success: true,
                data: leaderboard.map((user, index) => ({
                    rank: index + 1,
                    name: user.name,
                    points: user.stats.points,
                    reportsCount: user.stats.reportsCount,
                    confirmationsCount: user.stats.confirmationsCount,
                    level: user.stats.level,
                    avatar: user.profile?.avatar
                }))
            });
        } catch (error) {
            console.error('Erro ao buscar leaderboard:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar leaderboard'
            });
        }
    },

    // GET /api/users/:id/occurrences - Ocorrências de um usuário
    async getUserOccurrences(req, res) {
        try {
            const occurrences = await Occurrence.find({ reportedBy: req.params.id })
                .populate('reportedBy', 'name profile.avatar')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                data: occurrences
            });
        } catch (error) {
            console.error('Erro ao buscar ocorrências do usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar ocorrências do usuário'
            });
        }
    }
};