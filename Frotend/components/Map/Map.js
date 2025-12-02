import { mapService } from '../../services/mapService.js';
import { apiService } from '../../services/api.js';
import { OCCURRENCE_TYPES, INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM } from '../../utils/constants.js';
import './Map.css';

export class MapComponent {
    constructor(onOccurrenceClick) {
        this.map = null;
        this.markers = [];
        this.currentFilter = 'all';
        this.onOccurrenceClick = onOccurrenceClick;
        this.selectedLocation = null;
        this.element = this.createMapContainer();
    }

    createMapContainer() {
        const section = document.createElement('section');
        section.className = 'map-section';
        section.id = 'map';
        section.innerHTML = `
            <div class="container">
                <h2 class="section-title">Mapa de Ocorrências</h2>
                
                <div class="map-controls">
                    <button class="filter-btn active" data-filter="all">Todos</button>
                    <button class="filter-btn" data-filter="buraco">Buracos</button>
                    <button class="filter-btn" data-filter="iluminacao">Iluminação</button>
                    <button class="filter-btn" data-filter="lixo">Lixo</button>
                    <button class="filter-btn" data-filter="sinalizacao">Sinalização</button>
                    <button class="filter-btn" data-filter="outros">Outros</button>
                </div>
                
                <div id="map-container"></div>
            </div>
        `;
        return section;
    }

    async initialize() {
        this.map = mapService.initializeMap('map-container', INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);
        this.setupEventListeners();
        await this.loadOccurrences();
    }

    setupEventListeners() {
        // Filtros do mapa
        const filterButtons = this.element.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.applyFilter(filter);
                
                // Atualizar botões ativos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Capturar clique no mapa para selecionar localização
        this.map.on('click', (e) => {
            this.selectedLocation = e.latlng;
            this.dispatchEvent(new CustomEvent('locationSelected', {
                detail: { latlng: e.latlng }
            }));
        });
    }

    async loadOccurrences(filters = {}) {
        try {
            const occurrences = await apiService.getOccurrences(filters);
            this.displayOccurrences(occurrences);
        } catch (error) {
            console.error('Erro ao carregar ocorrências:', error);
            // Fallback para dados de exemplo
            this.displayOccurrences([]);
        }
    }

    displayOccurrences(occurrences) {
        // Limpar marcadores existentes
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Adicionar novos marcadores
        occurrences.forEach(occurrence => {
            const marker = mapService.addMarker(
                this.map,
                [occurrence.lat, occurrence.lng],
                { 
                    icon: mapService.createCustomIcon(occurrence.type),
                    occurrence: occurrence
                }
            );

            marker.bindPopup(this.createPopupContent(occurrence));
            this.markers.push(marker);
        });
    }

    createPopupContent(occurrence) {
        const typeInfo = OCCURRENCE_TYPES[occurrence.type];
        return `
            <div class="map-popup">
                <h3>${occurrence.title}</h3>
                <p><strong>Tipo:</strong> ${typeInfo?.label || occurrence.type}</p>
                <p><strong>Status:</strong> ${occurrence.status}</p>
                <p><strong>Confirmações:</strong> ${occurrence.confirmations}</p>
                <div class="popup-actions">
                    <button class="btn btn-success" onclick="window.mapComponent.confirmOccurrence(${occurrence.id})">
                        Confirmar
                    </button>
                    <button class="btn" onclick="window.mapComponent.viewOccurrenceDetails(${occurrence.id})">
                        Detalhes
                    </button>
                </div>
            </div>
        `;
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        this.loadOccurrences({ type: filter });
    }

    async confirmOccurrence(occurrenceId) {
        try {
            await apiService.confirmOccurrence(occurrenceId);
            await this.loadOccurrences({ type: this.currentFilter });
            this.dispatchEvent(new CustomEvent('occurrenceConfirmed', {
                detail: { occurrenceId }
            }));
        } catch (error) {
            console.error('Erro ao confirmar ocorrência:', error);
            alert('Erro ao confirmar ocorrência. Tente novamente.');
        }
    }

    viewOccurrenceDetails(occurrenceId) {
        if (this.onOccurrenceClick) {
            this.onOccurrenceClick(occurrenceId);
        }
    }

    addMarkerAtLocation(latlng, type = 'outros') {
        const marker = mapService.addMarker(
            this.map,
            latlng,
            { icon: mapService.createCustomIcon(type) }
        );
        this.markers.push(marker);
        return marker;
    }

    dispatchEvent(event) {
        this.element.dispatchEvent(event);
    }

    render(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.appendChild(this.element);
        
        // Inicializar mapa após renderizar
        setTimeout(() => this.initialize(), 100);
    }
}