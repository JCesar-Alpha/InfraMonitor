import { Occurrence } from '../models/Occurrence.js';
import { Confirmation } from '../models/Confirmation.js';
import { User } from '../models/User.js';

export const occurrencesController = {
    // GET /api/occurrences - Listar ocorrências com filtros
    async getOccurrences(req, res) {
        try {
            const { type, status, bbox, page = 1, limit = 50 } = req.query;
            
            const filters = {};
            if (type && type !== 'all') filters.type = type;
            if (status) filters.status = status;
            if (bbox) filters.bbox = bbox;

            const occurrences = await Occurrence.findWithFilters(filters)
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const total = await Occurrence.countDocuments(
                Occurrence.findWithFilters(filters).getFilter()
            );

            res.json({
                success: true,
                data: occurrences,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    totalRecords: total
                }
            });
        } catch (error) {
            console.error('Erro ao buscar ocorrências:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar ocorrências'
            });
        }
    },

    // GET /api/occurrences/:id - Obter ocorrência específica
    async getOccurrence(req, res) {
        try {
            const occurrence = await Occurrence.findById(req.params.id)
                .populate('reportedBy', 'name email profile.avatar')
                .populate('confirmations.userId', 'name profile.avatar');

            if (!occurrence) {
                return res.status(404).json({
                    success: false,
                    message: 'Ocorrência não encontrada'
                });
            }

            res.json({
                success: true,
                data: occurrence
            });
        } catch (error) {
            console.error('Erro ao buscar ocorrência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar ocorrência'
            });
        }
    },

    // POST /api/occurrences - Criar nova ocorrência
    async createOccurrence(req, res) {
        try {
            const occurrenceData = {
                ...req.body,
                location: {
                    lat: req.body.lat,
                    lng: req.body.lng
                },
                reportedBy: req.user?.id || 'anonymous' // Em produção, sempre requer auth
            };

            // Se usuário autenticado, associar à conta
            if (req.user) {
                occurrenceData.reportedBy = req.user.id;
            }

            const occurrence = new Occurrence(occurrenceData);
            await occurrence.save();

            // Atualizar estatísticas do usuário se autenticado
            if (req.user) {
                await User.findByIdAndUpdate(req.user.id, {
                    $inc: { 'stats.reportsCount': 1, 'stats.points': 10 }
                });
            }

            // Popular dados para resposta
            await occurrence.populate('reportedBy', 'name email');

            res.status(201).json({
                success: true,
                message: 'Ocorrência criada com sucesso',
                data: occurrence
            });
        } catch (error) {
            console.error('Erro ao criar ocorrência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao criar ocorrência'
            });
        }
    },

    // PUT /api/occurrences/:id/confirm - Confirmar ocorrência
    async confirmOccurrence(req, res) {
        try {
            const occurrence = await Occurrence.findById(req.params.id);
            
            if (!occurrence) {
                return res.status(404).json({
                    success: false,
                    message: 'Ocorrência não encontrada'
                });
            }

            // Verificar se usuário já confirmou (se autenticado)
            if (req.user) {
                const alreadyConfirmed = occurrence.confirmations.some(
                    conf => conf.userId.toString() === req.user.id
                );

                if (alreadyConfirmed) {
                    return res.status(400).json({
                        success: false,
                        message: 'Você já confirmou esta ocorrência'
                    });
                }

                // Adicionar confirmação
                occurrence.confirmations.push({
                    userId: req.user.id,
                    ...req.body
                });

                // Atualizar estatísticas do usuário
                await User.findByIdAndUpdate(req.user.id, {
                    $inc: { 'stats.confirmationsCount': 1, 'stats.points': 5 }
                });
            } else {
                // Confirmação anônima (apenas incrementa contador simples)
                occurrence.confirmations.push({});
            }

            await occurrence.save();
            await occurrence.populate('confirmations.userId', 'name profile.avatar');

            res.json({
                success: true,
                message: 'Ocorrência confirmada com sucesso',
                data: occurrence
            });
        } catch (error) {
            console.error('Erro ao confirmar ocorrência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao confirmar ocorrência'
            });
        }
    },

    // PUT /api/occurrences/:id - Atualizar ocorrência
    async updateOccurrence(req, res) {
        try {
            const occurrence = await Occurrence.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('reportedBy', 'name email');

            if (!occurrence) {
                return res.status(404).json({
                    success: false,
                    message: 'Ocorrência não encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Ocorrência atualizada com sucesso',
                data: occurrence
            });
        } catch (error) {
            console.error('Erro ao atualizar ocorrência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar ocorrência'
            });
        }
    },

    // DELETE /api/occurrences/:id - Excluir ocorrência
    async deleteOccurrence(req, res) {
        try {
            const occurrence = await Occurrence.findById(req.params.id);
            
            if (!occurrence) {
                return res.status(404).json({
                    success: false,
                    message: 'Ocorrência não encontrada'
                });
            }

            // Verificar permissões (apenas admin ou quem criou)
            if (req.user.role !== 'admin' && occurrence.reportedBy.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Sem permissão para excluir esta ocorrência'
                });
            }

            await Occurrence.findByIdAndDelete(req.params.id);

            res.json({
                success: true,
                message: 'Ocorrência excluída com sucesso'
            });
        } catch (error) {
            console.error('Erro ao excluir ocorrência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao excluir ocorrência'
            });
        }
    },

    // GET /api/occurrences/:id/confirmations - Listar confirmações
    async getConfirmations(req, res) {
        try {
            const confirmations = await Confirmation.find({ occurrence: req.params.id })
                .populate('user', 'name profile.avatar')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                data: confirmations
            });
        } catch (error) {
            console.error('Erro ao buscar confirmações:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar confirmações'
            });
        }
    }
};