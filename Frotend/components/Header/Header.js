import './Header.css';

export class Header {
    constructor() {
        this.element = this.createHeader();
    }

    createHeader() {
        const header = document.createElement('header');
        header.innerHTML = `
            <div class="container">
                <nav class="navbar">
                    <div class="logo">
                        <span class="logo-icon">🔍</span>
                        <span>InfraMonitor</span>
                    </div>
                    <ul class="nav-links">
                        <li><a href="#home">Início</a></li>
                        <li><a href="#map">Mapa</a></li>
                        <li><a href="#occurrences">Ocorrências</a></li>
                        <li><a href="#gamification">Gamificação</a></li>
                        <li><a href="#about">Sobre Nós</a></li>
                    </ul>
                </nav>
            </div>
        `;
        return header;
    }

    render(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.appendChild(this.element);
    }
}