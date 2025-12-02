import mongoose from 'mongoose';

const confirmationSchema = new mongoose.Schema({
    occurrence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Occurrence',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    location: {
        lat: Number,
        lng: Number
    },
    comment: {
        type: String,
        maxlength: 200
    },
    severityAssessment: {
        type: String,
        enum: ['low', 'medium', 'high'],
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

// Índice composto para evitar confirmações duplicadas
confirmationSchema.index({ occurrence: 1, user: 1 }, { unique: true });

// Índice para consultas por usuário
confirmationSchema.index({ user: 1, createdAt: -1 });

export const Confirmation = mongoose.model('Confirmation', confirmationSchema);