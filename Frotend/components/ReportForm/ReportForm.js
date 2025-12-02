import { OCCURRENCE_TYPES } from '../../utils/constants.js';
import { apiService } from '../../services/api.js';
import './ReportForm.css';

export class ReportForm {
    constructor(onReportSubmitted) {
        this.onReportSubmitted = onReportSubmitted;
        this.selectedLocation = null;
        this.element = this.createForm();
    }

    createForm() {
        const section = document.createElement('section');
        section.className = 'occurrence-form';
        section.id = 'report';
        section.innerHTML = `
            <div class="container">
                <h3>Reportar Problema</h3>
                <form id="report-form">
                    <div class="form-group">
                        <label for="problem-type">Tipo de Problema</label>
                        <select id="problem-type" class="form-control" required>
                            <option value="">Selecione o tipo de problema...</option>
                            ${Object.entries(OCCURRENCE_TYPES).map(([key, type]) => `
                                <option value="${key}">${type.label}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="problem-title">Título</label>
                        <input type="text" id="problem-title" class="form-control" 
                               placeholder="Descreva brevemente o problema..." required>
                    </div>
                    <div class="form-group">
                        <label for="problem-description">Descrição Detalhada</label>
                        <textarea id="problem-description" class="form-control" rows="3" 
                                  placeholder="Forneça mais detalhes sobre o problema..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="problem-address">Endereço/Localização</label>
                        <input type="text" id="problem-address" class="form-control" 
                               placeholder="Digite o endereço ou localização aproximada..." required>
                    </div>
                    <div class="form-group">
                        <label for="problem-location">Coordenadas (opcional)</label>
                        <input type="text" id="problem-location" class="form-control" 
                               placeholder="Clique no mapa para selecionar a localização" readonly>
                        <small class="form-help">Clique no mapa para definir as coordenadas exatas</small>
                    </div>
                    <div class="form-group">
                        <label for="problem-image">Imagem (Opcional)</label>
                        <input type="file" id="problem-image" class="form-control" accept="image/*">
                        <small class="form-help">Adicione uma foto para ajudar na identificação do problema</small>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-accent">Enviar Relatório</button>
                        <button type="button" class="btn btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        this.setupEventListeners(section);
        return section;
    }

    setupEventListeners(container) {
        const form = container.querySelector('#report-form');
        const cancelBtn = container.querySelector('.btn-cancel');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.resetForm());
        }

        // Listen for location selection from map
        document.addEventListener('locationSelected', (e) => {
            this.setLocation(e.detail.latlng);
        });
    }

    setLocation(latlng) {
        this.selectedLocation = latlng;
        const locationInput = this.element.querySelector('#problem-location');
        locationInput.value = `Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}`;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const occurrenceData = {
            type: formData.get('problem-type'),
            title: formData.get('problem-title'),
            description: formData.get('problem-description'),
            address: formData.get('problem-address'),
            lat: this.selectedLocation ? this.selectedLocation.lat : -23.5505,
            lng: this.selectedLocation ? this.selectedLocation.lng : -46.6333
        };

        try {
            const newOccurrence = await apiService.createOccurrence(occurrenceData);
            
            // Reset form
            this.resetForm();
            
            // Show success message
            this.showSuccessMessage();
            
            // Notify parent component
            if (this.onReportSubmitted) {
                this.onReportSubmitted(newOccurrence);
            }
        } catch (error) {
            console.error('Erro ao enviar relatório:', error);
            this.showErrorMessage();
        }
    }

    resetForm() {
        const form = this.element.querySelector('#report-form');
        form.reset();
        this.selectedLocation = null;
        
        const locationInput = this.element.querySelector('#problem-location');
        locationInput.value = '';
    }

    showSuccessMessage() {
        this.showMessage('Problema reportado com sucesso! Obrigado por contribuir.', 'success');
    }

    showErrorMessage() {
        this.showMessage('Erro ao reportar problema. Tente novamente.', 'error');
    }

    showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.textContent = text;
        
        const form = this.element.querySelector('#report-form');
        form.insertBefore(message, form.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    render(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.appendChild(this.element);
    }
}