// Tipos de ocorrência
export const OCCURRENCE_TYPES = {
    buraco: {
        label: 'Buraco',
        description: 'Buraco na via pública',
        severity: 'medium',
        priority: 'high',
        icon: '🕳️',
        color: '#e74c3c'
    },
    iluminacao: {
        label: 'Iluminação',
        description: 'Problema com iluminação pública',
        severity: 'low',
        priority: 'medium',
        icon: '💡',
        color: '#f39c12'
    },
    lixo: {
        label: 'Lixo',
        description: 'Acúmulo de lixo ou entulho',
        severity: 'medium',
        priority: 'medium',
        icon: '🗑️',
        color: '#2ecc71'
    },
    sinalizacao: {
        label: 'Sinalização',
        description: 'Problema com sinalização de trânsito',
        severity: 'high',
        priority: 'high',
        icon: '🚸',
        color: '#3498db'
    },
    outros: {
        label: 'Outros',
        description: 'Outros tipos de problemas',
        severity: 'low',
        priority: 'low',
        icon: '📌',
        color: '#9b59b6'
    }
};

// Status das ocorrências
export const OCCURRENCE_STATUS = {
    new: {
        label: 'Nova',
        description: 'Ocorrência recém-reportada',
        color: '#e74c3c',
        icon: '🆕'
    },
    'in-progress': {
        label: 'Em Andamento',
        description: 'Ocorrência sendo tratada',
        color: '#f39c12',
        icon: '🔄'
    },
    resolved: {
        label: 'Resolvida',
        description: 'Ocorrência resolvida',
        color: '#2ecc71',
        icon: '✅'
    }
};

// Níveis de severidade
export const SEVERITY_LEVELS = {
    low: {
        label: 'Baixa',
        color: '#2ecc71',
        priority: 1
    },
    medium: {
        label: 'Média',
        color: '#f39c12',
        priority: 2
    },
    high: {
        label: 'Alta',
        color: '#e74c3c',
        priority: 3
    }
};

// Níveis de prioridade
export const PRIORITY_LEVELS = {
    low: {
        label: 'Baixa',
        color: '#95a5a6',
        weight: 1
    },
    medium: {
        label: 'Média',
        color: '#3498db',
        weight: 2
    },
    high: {
        label: 'Alta',
        color: '#e67e22',
        weight: 3
    },
    urgent: {
        label: 'Urgente',
        color: '#e74c3c',
        weight: 4
    }
};

// Pontuação do sistema de gamificação
export const POINTS_SYSTEM = {
    REPORT_OCCURRENCE: 10,
    CONFIRM_OCCURRENCE: 5,
    OCCURRENCE_RESOLVED: 20,
    ACHIEVEMENT_UNLOCKED: 50,
    DAILY_ACTIVITY: 2
};

// Conquistas
export const ACHIEVEMENTS = {
    FIRST_REPORT: {
        id: 'first_report',
        name: 'Primeiro Reporte',
        description: 'Reportou a primeira ocorrência',
        icon: '🎯',
        points: 50
    },
    COMMUNITY_HELPER: {
        id: 'community_helper',
        name: 'Ajudante da Comunidade',
        description: 'Confirmou 10 ocorrências',
        icon: '🤝',
        points: 100
    },
    URBAN_EXPLORER: {
        id: 'urban_explorer',
        name: 'Explorador Urbano',
        description: 'Reportou ocorrências em 5 bairros diferentes',
        icon: '🗺️',
        points: 150
    },
    PROBLEM_SOLVER: {
        id: 'problem_solver',
        name: 'Solucionador de Problemas',
        description: 'Teve 5 ocorrências resolvidas',
        icon: '🔧',
        points: 200
    },
    TOP_CONTRIBUTOR: {
        id: 'top_contributor',
        name: 'Top Contribuidor',
        description: 'Alcançou o top 10 do ranking',
        icon: '🏆',
        points: 500
    }
};

// Configurações padrão
export const DEFAULT_CONFIG = {
    PAGINATION: {
        DEFAULT_LIMIT: 50,
        MAX_LIMIT: 100
    },
    MAP: {
        DEFAULT_CENTER: [-23.5505, -46.6333], // São Paulo
        DEFAULT_ZOOM: 13,
        MAX_BOUNDS: [
            [-90, -180], // sudoeste
            [90, 180]   // nordeste
        ]
    },
    NOTIFICATIONS: {
        BATCH_SIZE: 100,
        RETRY_ATTEMPTS: 3
    }
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
    VALIDATION_ERROR: 'Erro de validação nos dados fornecidos',
    NOT_FOUND: 'Recurso não encontrado',
    UNAUTHORIZED: 'Acesso não autorizado',
    FORBIDDEN: 'Acesso proibido',
    INTERNAL_ERROR: 'Erro interno do servidor',
    DUPLICATE_ENTRY: 'Registro duplicado',
    INVALID_CREDENTIALS: 'Credenciais inválidas'
};