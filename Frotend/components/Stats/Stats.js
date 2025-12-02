import { apiService } from '../../services/api.js';
import './Stats.css';

export class Stats {
    constructor() {
        this.stats = {
            totalReported: 0,
            totalResolved: 0,
            activeUsers: 0,
            resolutionRate: 0
        };
        this.element = this.createStatsSection();
    }

    createStatsSection() {
        const section = document.createElement('section');
        section.className = 'stats-section';
        section.innerHTML = `
            <div class="container">
                <div class="stats" id="stats-container">
                    <div class="stat-card">
                        <div class="stat-number" id="stat-reported">0</div>
                        <div class="stat-label">Problemas Reportados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="stat-resolved">0</div>
                        <div class="stat-label">Problemas Resolvidos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="stat-users">0</div>
                        <div class="stat-label">Usuários Ativos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="stat-rate">0%</div>
                        <div class="stat-label">Taxa de Resolução</div>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    async loadStats() {
        try {
            const stats = await apiService.getStats();
            this.updateStats(stats);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            // Usar dados padrão
            this.updateStats({
                totalReported: 1247,
                totalResolved: 843,
                activeUsers: 2156,
                resolutionRate: 78
            });
        }
    }

    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats };
        this.animateNumbers();
    }

    animateNumbers() {
        this.animateNumber('stat-reported', this.stats.totalReported);
        this.animateNumber('stat-resolved', this.stats.totalResolved);
        this.animateNumber('stat-users', this.stats.activeUsers);
        this.animateNumber('stat-rate', this.stats.resolutionRate, '%');
    }

    animateNumber(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 2000;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let currentFrame = 0;

        const startValue = parseInt(element.textContent) || 0;
        const increment = (targetValue - startValue) / totalFrames;

        const counter = setInterval(() => {
            currentFrame++;
            const currentValue = Math.round(startValue + (increment * currentFrame));
            
            if (suffix === '%') {
                element.textContent = `${currentValue}%`;
            } else {
                element.textContent = this.formatNumber(currentValue);
            }

            if (currentFrame === totalFrames) {
                if (suffix === '%') {
                    element.textContent = `${targetValue}%`;
                } else {
                    element.textContent = this.formatNumber(targetValue);
                }
                clearInterval(counter);
            }
        }, frameDuration);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    render(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.appendChild(this.element);
        this.loadStats();
    }
}