import { emailService } from './emailService.js';
import { User } from '../models/User.js';

class NotificationService {
    constructor() {
        this.websocketConnections = new Map();
    }

    // Sistema de notificações em tempo real (WebSocket)
    addConnection(userId, ws) {
        this.websocketConnections.set(userId, ws);
        console.log(`🔗 WebSocket conectado para usuário: ${userId}`);
    }

    removeConnection(userId) {
        this.websocketConnections.delete(userId);
        console.log(`🔌 WebSocket desconectado para usuário: ${userId}`);
    }

    sendWebSocketNotification(userId, type, data) {
        const connection = this.websocketConnections.get(userId);
        if (connection && connection.readyState === 1) { // 1 = OPEN
            try {
                connection.send(JSON.stringify({
                    type,
                    data,
                    timestamp: new Date().toISOString()
                }));
                return true;
            } catch (error) {
                console.error('❌ Erro ao enviar notificação WebSocket:', error);
                this.removeConnection(userId);
                return false;
            }
        }
        return false;
    }

    // Notificações por email
    async sendEmailNotification(userId, type, data) {
        try {
            const user = await User.findById(userId);
            if (!user || !user.preferences?.notifications?.email) {
                return false;
            }

            switch (type) {
                case 'welcome':
                    return await emailService.sendWelcomeEmail(user);
                
                case 'occurrence_confirmed':
                    return await emailService.sendOccurrenceUpdateEmail(user, data.occurrence, 'confirmed');
                
                case 'occurrence_resolved':
                    return await emailService.sendOccurrenceUpdateEmail(user, data.occurrence, 'resolved');
                
                case 'new_confirmation':
                    return await emailService.sendOccurrenceUpdateEmail(user, data.occurrence, 'new_confirmations');
                
                default:
                    console.warn(`Tipo de notificação não suportado: ${type}`);
                    return false;
            }
        } catch (error) {
            console.error('❌ Erro ao enviar notificação por email:', error);
            return false;
        }
    }

    // Notificação combinada (WebSocket + Email)
    async sendNotification(userId, type, data) {
        const wsSent = this.sendWebSocketNotification(userId, type, data);
        const emailSent = await this.sendEmailNotification(userId, type, data);

        return { wsSent, emailSent };
    }

    // Notificação para múltiplos usuários
    async broadcastToUsers(userIds, type, data) {
        const results = [];
        
        for (const userId of userIds) {
            const result = await this.sendNotification(userId, type, data);
            results.push({ userId, ...result });
        }

        return results;
    }

    // Notificação para administradores
    async notifyAdmins(type, data) {
        try {
            const admins = await User.find({ role: 'admin' }).select('_id');
            const adminIds = admins.map(admin => admin._id.toString());
            
            return await this.broadcastToUsers(adminIds, type, data);
        } catch (error) {
            console.error('❌ Erro ao notificar administradores:', error);
            return [];
        }
    }

    // Estatísticas de notificações
    getStats() {
        return {
            activeConnections: this.websocketConnections.size,
            totalUsers: Array.from(this.websocketConnections.keys()).length
        };
    }
}

export const notificationService = new NotificationService();