export const formatDate = (dateString) => {
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export const formatDateShort = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getStatusColor = (status) => {
    const colors = {
        new: '#e74c3c',
        'in-progress': '#f39c12',
        resolved: '#2ecc71'
    };
    return colors[status] || '#95a5a6';
};

export const getTypeColor = (type) => {
    const colors = {
        buraco: '#e74c3c',
        iluminacao: '#f39c12',
        lixo: '#2ecc71',
        sinalizacao: '#3498db',
        outros: '#9b59b6'
    };
    return colors[type] || '#95a5a6';
};