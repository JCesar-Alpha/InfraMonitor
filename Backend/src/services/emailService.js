import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        if (config.email.host && config.email.user && config.email.pass) {
            this.transporter = nodemailer.createTransporter({
                host: config.email.host,
                port: config.email.port,
                secure: false,
                auth: {
                    user: config.email.user,
                    pass: config.email.pass
                }
            });
        } else {
            console.warn('⚠️  Configurações de email não encontradas. Emails não serão enviados.');
        }
    }

    async sendEmail(to, subject, html, text = '') {
        if (!this.transporter) {
            console.warn('❌ Transporter de email não configurado. Email não enviado:', { to, subject });
            return false;
        }

        try {
            const mailOptions = {
                from: `"InfraMonitor" <${config.email.user}>`,
                to,
                subject,
                text,
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email enviado:', info.messageId);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            return false;
        }
    }

    async sendWelcomeEmail(user) {
        const subject = 'Bem-vindo ao InfraMonitor!';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2c3e50;">Bem-vindo ao InfraMonitor!</h1>
                <p>Olá <strong>${user.name}</strong>,</p>
                <p>Estamos muito felizes em tê-lo(a) conosco na plataforma de monitoramento colaborativo da infraestrutura urbana.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #3498db;">Comece a contribuir:</h3>
                    <ul>
                        <li>📝 Reporte problemas de infraestrutura</li>
                        <li>✅ Confirme ocorrências de outros usuários</li>
                        <li>🏆 Ganhe pontos e suba no ranking</li>
                        <li>🗺️ Acompanhe o mapa em tempo real</li>
                    </ul>
                </div>

                <p>Juntos, podemos tornar nossa cidade um lugar melhor!</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p style="color: #666; font-size: 14px;">
                        Atenciosamente,<br>
                        Equipe InfraMonitor
                    </p>
                </div>
            </div>
        `;

        return await this.sendEmail(user.email, subject, html);
    }

    async sendOccurrenceUpdateEmail(user, occurrence, updateType) {
        const subjectMap = {
            confirmed: `Ocorrência confirmada: ${occurrence.title}`,
            resolved: `Problema resolvido: ${occurrence.title}`,
            new_confirmations: `Nova confirmação na sua ocorrência: ${occurrence.title}`
        };

        const subject = subjectMap[updateType] || `Atualização na ocorrência: ${occurrence.title}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">${subject}</h2>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #3498db;">${occurrence.title}</h3>
                    <p style="margin: 5px 0;"><strong>Local:</strong> ${occurrence.address}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> ${occurrence.status}</p>
                    <p style="margin: 5px 0;"><strong>Confirmações:</strong> ${occurrence.confirmationCount || occurrence.confirmations?.length || 0}</p>
                </div>

                <p>Obrigado por contribuir para uma cidade melhor!</p>
                
                <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <p style="color: #666; font-size: 14px;">
                        Equipe InfraMonitor
                    </p>
                </div>
            </div>
        `;

        return await this.sendEmail(user.email, subject, html);
    }
}

export const emailService = new EmailService();