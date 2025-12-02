import { apiService } from '../../services/api.js';
import './Leaderboard.css';

export class Leaderboard {
    constructor() {
        this.leaderboard = [];
        this.badges = [
            { icon: '🥉', name: 'Iniciante', description: 'Primeiras contribuições' },
            { icon: '🥈', name: 'Colaborador', description: 'Contribuidor ativo' },
            { icon: '🥇', name: 'Sentinela Urbano', description: 'Alto impacto na comunidade' },
            { icon: '🔍', name: 'Detetive Cidadão', description: 'Muitas ocorrências validadas' },
            { icon: '✅', name: 'Verificador', description: 'Alta taxa de confirmações' }
        ];
        this.element = this.createLeaderboardSection();
    }

    createLeaderboardSection() {
        const section = document.createElement('section');
        section.className = 'gamification-section';
        section.id = 'gamification';
        section.innerHTML = `
            <div class="container">
                <h2 class="section-title">Gamificação e Reconhecimento</h2>
                
                <div class="leaderboard-container">
                    <div class="leaderboard">
                        <h3>Ranking de Colaboradores</h3>
                        <ul class="leaderboard-list" id="leaderboard-list">
                            <li class="leaderboard-loading">Carregando ranking...</li>
                        </ul>
                    </div>
                    
                    <div class="badges-section">
                        <h3>Conquistas</h3>
                        <div class="badges" id="badges-container">
                            ${this.badges.map(badge => `
                                <div class="badge" title="${badge.description}">
                                    <span class="badge-icon">${badge.icon}</span>
                                    <span class="badge-name">${badge.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    async loadLeaderboard() {
        try {
            const leaderboard = await apiService.getLeaderboard();
            this.updateLeaderboard(leaderboard);
        } catch (error) {
            console.error('Erro ao carregar leaderboard:', error);
            // Dados de exemplo
            this.updateLeaderboard([
                { name: 'João Silva', points: 1245 },
                { name: 'Maria Santos', points: 987 },
                { name: 'Pedro Oliveira', points: 756 },
                { name: 'Ana Costa', points: 632 },
                { name: 'Carlos Ferreira', points: 521 }
            ]);
        }
    }

    updateLeaderboard(leaderboard) {
        this.leaderboard = leaderboard;
        const listElement = this.element.querySelector('#leaderboard-list');
        
        if (leaderboard.length === 0) {
            listElement.innerHTML = '<li class="leaderboard-empty">Nenhum dado disponível</li>';
            return;
        }

        listElement.innerHTML = leaderboard.map((user, index) => `
            <li class="leaderboard-item ${index < 3 ? 'leaderboard-top' : ''}">
                <div class="leaderboard-rank">
                    <span class="rank-number">${index + 1}</span>
                    <span class="rank-medal">
                        ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                    </span>
                </div>
                <span class="leaderboard-name">${user.name}</span>
                <span class="leaderboard-points">${user.points} pontos</span>
            </li>
        `).join('');
    }

    render(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.appendChild(this.element);
        this.loadLeaderboard();
    }
}