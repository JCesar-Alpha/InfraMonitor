import { Occurrence } from '../models/Occurrence.js';
import { User } from '../models/User.js';
import { Confirmation } from '../models/Confirmation.js';

export const statsController = {
    // GET /api/stats - Estatísticas gerais
    async getStats(req, res) {
        try {
            const [
                totalOccurrences,
                resolvedOccurrences,
                totalUsers,
                totalConfirmations,
                occurrencesByType,
                occurrencesByStatus,
                recentActivity
            ] = await Promise.all([
                Occurrence.countDocuments(),
                Occurrence.countDocuments({ status: 'resolved' }),
                User.countDocuments(),
                Confirmation.countDocuments(),
                Occurrence.aggregate([
                    { $group: { _id: '$type', count: { $sum: 1 } } }
                ]),
                Occurrence.aggregate([
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                Occurrence.find()
                    .populate('reportedBy', 'name')
                    .sort({ createdAt: -1 })
                    .limit(5)
            ]);

            const resolutionRate = totalOccurrences > 0 
                ? Math.round((resolvedOccurrences / totalOccurrences) * 100)
                : 0;

            const statsByType = occurrencesByType.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {});

            const statsByStatus = occurrencesByStatus.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {});

            res.json({
                success: true,
                data: {
                    totalReported: totalOccurrences,
                    totalResolved: resolvedOccurrences,
                    activeUsers: totalUsers,
                    totalConfirmations,
                    resolutionRate,
                    byType: statsByType,
                    byStatus: statsByStatus,
                    recentActivity
                }
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar estatísticas'
            });
        }
    },

    // GET /api/stats/leaderboard - Ranking de usuários
    async getLeaderboard(req, res) {
        try {
            const leaderboard = await User.find()
                .select('name profile stats points')
                .sort({ 'stats.points': -1 })
                .limit(10);

            res.json({
                success: true,
                data: leaderboard.map(user => ({
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

    // GET /api/stats/overview - Visão geral para dashboard
    async getOverview(req, res) {
        try {
            const today = new Date();
            const startOfToday = new Date(today.setHours(0, 0, 0, 0));
            const startOfWeek = new Date(today.setDate(today.getDate() - 7));
            const startOfMonth = new Date(today.setDate(today.getDate() - 30));

            const [
                todayReports,
                weekReports,
                monthReports,
                todayConfirmations,
                activeAreas
            ] = await Promise.all([
                Occurrence.countDocuments({ createdAt: { $gte: startOfToday } }),
                Occurrence.countDocuments({ createdAt: { $gte: startOfWeek } }),
                Occurrence.countDocuments({ createdAt: { $gte: startOfMonth } }),
                Confirmation.countDocuments({ createdAt: { $gte: startOfToday } }),
                Occurrence.aggregate([
                    { 
                        $group: { 
                            _id: { 
                                lat: { $round: ['$location.lat', 2] },
                                lng: { $round: ['$location.lng', 2] }
                            },
                            count: { $sum: 1 }
                        } 
                    },
                    { $sort: { count: -1 } },
                    { $limit: 5 }
                ])
            ]);

            res.json({
                success: true,
                data: {
                    today: {
                        reports: todayReports,
                        confirmations: todayConfirmations
                    },
                    period: {
                        week: weekReports,
                        month: monthReports
                    },
                    hotspots: activeAreas.map(area => ({
                        lat: area._id.lat,
                        lng: area._id.lng,
                        count: area.count
                    }))
                }
            });
        } catch (error) {
            console.error('Erro ao buscar overview:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar overview'
            });
        }
    }
};