import { OCCURRENCE_TYPES, OCCURRENCE_STATUS } from '../../utils/constants.js';
import { formatDateShort } from '../../utils/helpers.js';
import './OccurrenceCard.css';

export class OccurrenceCard {
    constructor(occurrence, onConfirm, onViewDetails) {
        this.occurrence = occurrence;
        this.onConfirm = onConfirm;
        this.onViewDetails = onViewDetails;
        this.element = this.createCard();
    }

    createCard() {
        const card = document.createElement('div');
        card.className = 'occurrence-card';
        
        const typeInfo = OCCURRENCE_TYPES[this.occurrence.type];
        const statusInfo = OCCURRENCE_STATUS[this.occurrence.status];
        
        card.innerHTML = `
            <div class="occurrence-header">
                <span class="occurrence-type ${typeInfo?.class || ''}">
                    ${typeInfo?.label || this.occurrence.type}
                </span>
                <span class="occurrence-status ${statusInfo?.class || ''}">
                    ${statusInfo?.label || this.occurrence.status}
                </span>
            </div>
            <h3 class="occurrence-title">${this.occurrence.title}</h3>
            <p class="occurrence-description">${this.occurrence.description}</p>
            <div class="occurrence-meta">
                <span class="occurrence-date">
                    📅 ${formatDateShort(this.occurrence.date)}
                </span>
                <span class="occurrence-address">
                    📍 ${this.occurrence.address}
                </span>
            </div>
            <div class="confirmation-count">
                <span>✅</span>
                <span>${this.occurrence.confirmations} confirmações</span>
            </div>
            <div class="occurrence-actions">
                ${this.occurrence.status !== 'resolved' ? `
                    <button class="btn btn-success confirm-btn">
                        Confirmar
                    </button>
                ` : ''}
                <button class="btn details-btn">
                    Detalhes
                </button>
            </div>
        `;

        this.setupEventListeners(card);
        return card;
    }

    setupEventListeners(card) {
        const confirmBtn = card.querySelector('.confirm-btn');
        const detailsBtn = card.querySelector('.details-btn');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (this.onConfirm) {
                    this.onConfirm(this.occurrence.id);
                }
            });
        }

        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
                if (this.onViewDetails) {
                    this.onViewDetails(this.occurrence.id);
                }
            });
        }
    }

    update(occurrence) {
        this.occurrence = occurrence;
        const newElement = this.createCard();
        this.element.parentNode.replaceChild(newElement, this.element);
        this.element = newElement;
    }

    render(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.appendChild(this.element);
    }
}