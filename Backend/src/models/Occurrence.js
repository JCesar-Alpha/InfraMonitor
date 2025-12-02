import mongoose from 'mongoose';

const confirmationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    confirmedAt: {
        type: Date,
        default: Date.now
    }
});

const occurrenceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['buraco', 'iluminacao', 'lixo', 'sinalizacao', 'outros'],
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        lat: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        lng: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'resolved'],
        default: 'new',
        index: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    confirmations: [confirmationSchema],
    images: [{
        filename: String,
        originalName: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Virtual para contar confirmações
occurrenceSchema.virtual('confirmationCount').get(function() {
    return this.confirmations.length;
});

// Índices compostos para consultas otimizadas
occurrenceSchema.index({ type: 1, status: 1 });
occurrenceSchema.index({ 'location.lat': 1, 'location.lng': 1 });
occurrenceSchema.index({ createdAt: -1 });

// Método estático para buscar ocorrências com filtros
occurrenceSchema.statics.findWithFilters = function(filters = {}) {
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
    
    return this.find(query)
        .populate('reportedBy', 'name email')
        .sort({ createdAt: -1 });
};

// Método para confirmar ocorrência
occurrenceSchema.methods.addConfirmation = function(userId) {
    const existingConfirmation = this.confirmations.find(
        conf => conf.userId.toString() === userId.toString()
    );
    
    if (!existingConfirmation) {
        this.confirmations.push({ userId });
        return true;
    }
    
    return false;
};

export const Occurrence = mongoose.model('Occurrence', occurrenceSchema);