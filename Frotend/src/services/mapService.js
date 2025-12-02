class MapService {
    createCustomIcon(type) {
        const iconColors = {
            buraco: 'red',
            iluminacao: 'orange',
            lixo: 'green',
            sinalizacao: 'blue',
            outros: 'purple'
        };
        
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background-color: ${iconColors[type]}; 
                    width: 24px; 
                    height: 24px; 
                    border-radius: 50%; 
                    border: 3px solid white; 
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                ">
                    ${this.getTypeAbbreviation(type)}
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    }

    getTypeAbbreviation(type) {
        const abbreviations = {
            buraco: 'B',
            iluminacao: 'I',
            lixo: 'L',
            sinalizacao: 'S',
            outros: 'O'
        };
        return abbreviations[type] || '?';
    }

    initializeMap(containerId, center, zoom = 13) {
        const map = L.map(containerId).setView(center, zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        return map;
    }

    addMarker(map, latlng, options = {}) {
        const marker = L.marker(latlng, options).addTo(map);
        return marker;
    }

    // Geocoding simples (para demonstração)
    async geocodeAddress(address) {
        // Em produção, usar um serviço de geocoding como Nominatim
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        
        return null;
    }
}

export const mapService = new MapService();