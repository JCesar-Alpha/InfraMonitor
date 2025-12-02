import { OCCURRENCE_TYPES, OCCURRENCE_STATUS } from './constants.js';

// Formatação de dados
export const formatOccurrence = (occurrence) => {
    if (!occurrence) return null;

    const typeInfo = OCCURRENCE_TYPES[occurrence.type] || OCCURRENCE_TYPES.outros;
    const statusInfo = OCCURRENCE_STATUS[occurrence.status] || OCCURRENCE_STATUS.new;

    return {
        ...occurrence.toObject ? occurrence.toObject() : occurrence,
        typeInfo,
        statusInfo,
        confirmationCount: occurrence.confirmations?.length || occurrence.confirmationCount || 0
    };
};

export const formatUser = (user) => {
    if (!user) return null;

    const userObj = user.toObject ? user.toObject() : user;
    
    // Calcular nível baseado nos pontos
    const level = Math.floor((userObj.stats?.points || 0) / 100) + 1;
    
    return {
        ...userObj,
        stats: {
            ...userObj.stats,
            level
        }
    };
};

// Validação de coordenadas
export const isValidCoordinate = (lat, lng) => {
    return (
        typeof lat === 'number' && 
        typeof lng === 'number' &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180
    );
};

// Cálculo de distância (Haversine)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance; // em km
};

// Filtragem e paginação
export const buildFilterQuery = (filters) => {
    const query = {};
    
    if (filters.type && filters.type !== 'all') {
        query.type = filters.type;
    }
    
    if (filters.status) {
        query.status = filters.status;
    }
    
    if (filters.bbox) {
        const [minLng, minLat, maxLng, maxLat] = filters.bbox.split(',').map(Number);
        query['location.lat'] = { $gte: minLat, $lte: maxLat };
        query['location.lng'] = { $gte: minLng, $lte: maxLng };
    }
    
    if (filters.severity) {
        query.severity = filters.severity;
    }
    
    if (filters.priority) {
        query.priority = filters.priority;
    }
    
    return query;
};

export const buildPagination = (page, limit, total) => {
    const currentPage = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const totalPages = Math.ceil(total / pageSize);
    
    return {
        current: currentPage,
        pageSize,
        totalPages,
        totalRecords: total,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};

// Gerar dados mock para desenvolvimento
export const generateMockOccurrences = (count = 10) => {
    const types = Object.keys(OCCURRENCE_TYPES);
    const statuses = Object.keys(OCCURRENCE_STATUS);
    
    // Centro de São Paulo
    const centerLat = -23.5505;
    const centerLng = -46.6333;
    
    return Array.from({ length: count }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Gerar coordenadas aleatórias próximas ao centro
        const lat = centerLat + (Math.random() - 0.5) * 0.1;
        const lng = centerLng + (Math.random() - 0.5) * 0.1;
        
        return {
            id: i + 1,
            type,
            title: `Ocorrência ${i + 1} - ${OCCURRENCE_TYPES[type].label}`,
            description: `Descrição da ocorrência ${i + 1} do tipo ${OCCURRENCE_TYPES[type].label}`,
            address: `Rua Exemplo ${i + 1}, São Paulo - SP`,
            location: { lat, lng },
            status,
            confirmations: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({})),
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
            updatedAt: new Date()
        };
    });
};

// Logger consistente
export const logger = {
    info: (message, meta = {}) => {
        console.log(`ℹ️  [INFO] ${message}`, Object.keys(meta).length ? meta : '');
    },
    error: (message, error = null, meta = {}) => {
        console.error(`❌ [ERROR] ${message}`, error || '', Object.keys(meta).length ? meta : '');
    },
    warn: (message, meta = {}) => {
        console.warn(`⚠️  [WARN] ${message}`, Object.keys(meta).length ? meta : '');
    },
    debug: (message, meta = {}) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`🐛 [DEBUG] ${message}`, Object.keys(meta).length ? meta : '');
        }
    }
};

// Sanitização de dados
export const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return input;
};

// Delay para testes
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));