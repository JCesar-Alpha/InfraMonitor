export const OCCURRENCE_TYPES = {
    buraco: { 
        label: 'Buraco', 
        class: 'type-buraco',
        description: 'Buraco na via pública'
    },
    iluminacao: { 
        label: 'Iluminação', 
        class: 'type-iluminacao',
        description: 'Problema com iluminação pública'
    },
    lixo: { 
        label: 'Lixo', 
        class: 'type-lixo',
        description: 'Acúmulo de lixo ou entulho'
    },
    sinalizacao: { 
        label: 'Sinalização', 
        class: 'type-sinalizacao',
        description: 'Problema com sinalização de trânsito'
    },
    outros: { 
        label: 'Outros', 
        class: 'type-outros',
        description: 'Outros tipos de problemas'
    }
};

export const OCCURRENCE_STATUS = {
    new: { 
        label: 'Nova', 
        class: 'status-new',
        description: 'Ocorrência recém-reportada'
    },
    'in-progress': { 
        label: 'Em Andamento', 
        class: 'status-in-progress',
        description: 'Ocorrência sendo tratada'
    },
    resolved: { 
        label: 'Resolvida', 
        class: 'status-resolved',
        description: 'Ocorrência resolvida'
    }
};

export const INITIAL_MAP_CENTER = [-23.5505, -46.6333];
export const INITIAL_MAP_ZOOM = 13;

export const SAMPLE_OCCURRENCES = [
    { 
        id: 1, 
        lat: -23.551, 
        lng: -46.634, 
        type: 'buraco', 
        title: 'Buraco na Avenida Paulista', 
        description: 'Grande buraco na pista sentido centro, próximo ao número 900.',
        status: 'new', 
        confirmations: 5,
        date: '2023-10-15',
        address: 'Av. Paulista, 900 - Bela Vista, São Paulo - SP',
        createdAt: '2023-10-15T10:30:00Z',
        updatedAt: '2023-10-15T10:30:00Z'
    },
    { 
        id: 2, 
        lat: -23.552, 
        lng: -46.635, 
        type: 'iluminacao', 
        title: 'Poste quebrado', 
        description: 'Poste na Rua Augusta não acende há 3 dias.',
        status: 'in-progress', 
        confirmations: 8,
        date: '2023-10-12',
        address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
        createdAt: '2023-10-12T14:20:00Z',
        updatedAt: '2023-10-14T09:15:00Z'
    }
];