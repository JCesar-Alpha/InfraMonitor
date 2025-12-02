import { Header } from './components/Header/Header.js';
import { MapComponent } from './components/Map/Map.js';
import { OccurrenceCard } from './components/OccurrenceCard/OccurrenceCard.js';
import { ReportForm } from './components/ReportForm/ReportForm.js';
import { Stats } from './components/Stats/Stats.js';
import { Leaderboard } from './components/Leaderboard/Leaderboard.js';
import { apiService } from './services/api.js';
import { OCCURRENCE_TYPES, OCCURRENCE_STATUS } from './utils/constants.js';

class App {
    constructor() {
        this.occurrences = [];
        this.components = {};
        this.init();
    }

    async init() {
        this.renderLayout();
        this.setupModal();
        await this.loadOccurrences();
        this.setupGlobalEventListeners();
    }

    renderLayout() {
        const appContainer = document.getElementById('app');
        
        // Header
        this.components.header = new Header();
        this.components.header.render(appContainer);

        // Hero Section
        this.renderHeroSection(appContainer);

        // Features Section
        this.renderFeaturesSection(appContainer);

        // Stats
        this.components.stats = new Stats();
        this.components.stats.render(appContainer);

        // Map
        this.components.map = new MapComponent((occurrenceId) => this.showOccurrenceDetails(occurrenceId));
        this.components.map.render(appContainer);

        // Report Form
        this.components.reportForm = new ReportForm((occurrence) => this.handleNewOccurrence(occurrence));
        this.components.reportForm.render(appContainer);

        // Leaderboard
        this.components.leaderboard = new Leaderboard();
        this.components.leaderboard.render(appContainer);

        // Occurrences List
        this.renderOccurrencesSection(appContainer);

        // Footer
        this.renderFooter(appContainer);

        // Make map component globally available for popup callbacks
        window.mapComponent = this.components.map;
    }

    renderHeroSection(container) {
        const hero = document.createElement('section');
        hero.className = 'hero';
        hero.id = 'home';
        hero.innerHTML = `
            <div class="container">
                <h1>InfraMonitor: Sua Cidade em Suas Mãos</h1>
                <p>Uma plataforma colaborativa para monitorar e reportar problemas de infraestrutura urbana. Juntos, podemos tornar nossa cidade um lugar melhor!</p>
                <div class="hero-actions">
                    <a href="#map" class="btn">Ver Mapa Interativo</a>
                    <a href="#report" class="btn btn-accent">Reportar Problema</a>
                </div>
            </div>
        `;
        container.appendChild(hero);
    }

    renderFeaturesSection(container) {
        const features = document.createElement('section');
        features.className = 'features';
        features.innerHTML = `
            <div class="container">
                <h2 class="section-title">Funcionalidades Principais</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🗺️</div>
                        <h3>Mapa Interativo</h3>
                        <p>Visualize problemas de infraestrutura em tempo real com nosso mapa interativo e filtros inteligentes.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">👥</div>
                        <h3>Sistema de Confirmação</h3>
                        <p>Comunidade valida as ocorrências para garantir informações confiáveis e precisas.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🏆</div>
                        <h3>Gamificação</h3>
                        <p>Ganhe pontos, conquistas e reconhecimento por contribuir com a melhoria da cidade.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>Painel de Dados</h3>
                        <p>Acompanhe estatísticas e relatórios detalhados sobre os problemas reportados.</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(features);
    }

    renderOccurrencesSection(container) {
        const section = document.createElement('section');
        section.id = 'occurrences';
        section.innerHTML = `
            <div class="container">
                <h2 class="section-title">Ocorrências Recentes</h2>
                <div id="occurrences-list" class="occurrences-list">
                    <div class="loading-message">Carregando ocorrências...</div>
                </div>
            </div>
        `;
        container.appendChild(section);
    }

    renderFooter(container) {
        const footer = document.createElement('footer');
        footer.id = 'about';
        footer.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>InfraMonitor</h3>
                        <p>Uma plataforma colaborativa para melhorar a infraestrutura urbana através da participação cidadã.</p>
                    </div>
                    <div class="footer-section">
                        <h3>Links Rápidos</h3>
                        <ul>
                            <li><a href="#home">Início</a></li>
                            <li><a href="#map">Mapa</a></li>
                            <li><a href="#occurrences">Ocorrências</a></li>
                            <li><a href="#gamification">Gamificação</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Contato</h3>
                        <p>Email: contato@inframonitor.com</p>
                        <p>Telefone: (11) 1234-5678</p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2023 InfraMonitor. Todos os direitos reservados.</p>
                </div>
            </div>
        `;
        container.appendChild(footer);
    }

    setupModal() {
        const modal = document.getElementById('occurrence-modal');
        const closeBtn = document.getElementById('close-modal');

        closeBtn.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal();
            }
        });
    }

    async loadOccurrences() {
        try {
            this.occurrences = await apiService.getOccurrences();
            this.renderOccurrencesList();
        } catch (error) {
            console.error('Erro ao carregar ocorrências:', error);
            this.showError('Erro ao carregar ocorrências. Tente novamente.');
        }
    }

    renderOccurrencesList() {
        const container = document.getElementById('occurrences-list');
        if (!container) return;

        if (this.occurrences.length === 0) {
            container.innerHTML = '<div class="empty-message">Nenhuma ocorrência encontrada.</div>';
            return;
        }

        container.innerHTML = '';
        this.occurrences.slice(0, 5).forEach(occurrence => {
            const card = new OccurrenceCard(
                occurrence,
                (id) => this.confirmOccurrence(id),
                (id) => this.showOccurrenceDetails(id)
            );
            card.render(container);
        });
    }

    async confirmOccurrence(occurrenceId) {
        try {
            await apiService.confirmOccurrence(occurrenceId);
            
            // Atualizar a ocorrência na lista
            const occurrence = this.occurrences.find(o => o.id === occurrenceId);
            if (occurrence) {
                occurrence.confirmations++;
            }
            
            // Recarregar componentes
            await this.loadOccurrences();
            if (this.components.map) {
                this.components.map.loadOccurrences();
            }
            
            this.showSuccess('Ocorrência confirmada com sucesso!');
        } catch (error) {
            console.error('Erro ao confirmar ocorrência:', error);
            this.showError('Erro ao confirmar ocorrência. Tente novamente.');
        }
    }

    async showOccurrenceDetails(occurrenceId) {
        try {
            const occurrence = await apiService.getOccurrence(occurrenceId);
            this.openOccurrenceModal(occurrence);
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            this.showError('Erro ao carregar detalhes da ocorrência.');
        }
    }

    openOccurrenceModal(occurrence) {
        const modal = document.getElementById('occurrence-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');

        const typeInfo = OCCURRENCE_TYPES[occurrence.type];
        const statusInfo = OCCURRENCE_STATUS[occurrence.status];

        modalTitle.textContent = occurrence.title;
        
        modalContent.innerHTML = `
            <div class="occurrence-header">
                <span class="occurrence-type ${typeInfo?.class || ''}">
                    ${typeInfo?.label || occurrence.type}
                </span>
                <span class="occurrence-status ${statusInfo?.class || ''}">
                    ${statusInfo?.label || occurrence.status}
                </span>
            </div>
            <p><strong>Descrição:</strong> ${occurrence.description}</p>
            <p><strong>Endereço:</strong> ${occurrence.address}</p>
            <p><strong>Data do registro:</strong> ${new Date(occurrence.date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Coordenadas:</strong> ${occurrence.lat.toFixed(6)}, ${occurrence.lng.toFixed(6)}</p>
            <div class="confirmation-count">
                <span>✅</span>
                <span>${occurrence.confirmations} confirmações</span>
            </div>
            <div class="occurrence-actions" style="margin-top: 1.5rem;">
                <button class="btn btn-success" id="modal-confirm-btn">
                    Confirmar Ocorrência
                </button>
            </div>
        `;

        // Configurar botão de confirmação no modal
        const confirmBtn = document.getElementById('modal-confirm-btn');
        confirmBtn.addEventListener('click', () => {
            this.confirmOccurrence(occurrence.id);
            this.closeModal();
        });

        modal.style.display = 'flex';
    }

    closeModal() {
        const modal = document.getElementById('occurrence-modal');
        modal.style.display = 'none';
    }

    async handleNewOccurrence(occurrence) {
        // Adicionar a nova ocorrência à lista
        this.occurrences.unshift(occurrence);
        this.renderOccurrencesList();
        
        // Recarregar o mapa
        if (this.components.map) {
            this.components.map.loadOccurrences();
        }
        
        // Recarregar estatísticas
        if (this.components.stats) {
            this.components.stats.loadStats();
        }
    }

    setupGlobalEventListeners() {
        // Smooth scroll para links âncora
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Listen for occurrence confirmations from map
        if (this.components.map) {
            this.components.map.element.addEventListener('occurrenceConfirmed', (e) => {
                this.confirmOccurrence(e.detail.occurrenceId);
            });
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Implementar sistema de notificações toast
        console.log(`${type}: ${message}`);
        // Em produção, usar uma biblioteca de notificações toast
        alert(message);
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Adicionar estilos para componentes não cobertos pelos CSS modules
const additionalStyles = `
    .hero {
        background: linear-gradient(rgba(44, 62, 80, 0.8), rgba(155, 89, 182, 0.8)), url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
        background-size: cover;
        background-position: center;
        color: white;
        padding: 4rem 0;
        text-align: center;
    }
    
    .hero h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }
    
    .hero p {
        font-size: 1.2rem;
        max-width: 700px;
        margin: 0 auto 2rem;
    }
    
    .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .features {
        padding: 4rem 0;
        background-color: white;
    }
    
    .occurrences-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .loading-message,
    .empty-message {
        text-align: center;
        padding: 2rem;
        color: var(--text-light);
        font-style: italic;
    }
    
    footer {
        background-color: var(--primary);
        color: white;
        padding: 3rem 0 1.5rem;
    }
    
    .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .footer-section h3 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
    
    .footer-section ul {
        list-style: none;
    }
    
    .footer-section ul li {
        margin-bottom: 0.5rem;
    }
    
    .footer-section a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: color 0.3s;
    }
    
    .footer-section a:hover {
        color: white;
    }
    
    .footer-bottom {
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    @media (max-width: 768px) {
        .hero h1 {
            font-size: 2rem;
        }
        
        .hero-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .hero-actions .btn {
            width: 100%;
            max-width: 300px;
        }
    }
`;

// Adicionar estilos adicionais ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);