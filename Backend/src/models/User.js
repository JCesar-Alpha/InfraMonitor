import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    profile: {
        avatar: String,
        bio: {
            type: String,
            maxlength: 200
        },
        location: {
            city: String,
            state: String
        }
    },
    stats: {
        reportsCount: {
            type: Number,
            default: 0
        },
        confirmationsCount: {
            type: Number,
            default: 0
        },
        points: {
            type: Number,
            default: 0
        },
        level: {
            type: Number,
            default: 1
        }
    },
    preferences: {
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: Date
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para incrementar estatísticas
userSchema.methods.incrementReports = function() {
    this.stats.reportsCount += 1;
    this.stats.points += 10; // 10 pontos por report
    this.updateLevel();
    return this.save();
};

userSchema.methods.incrementConfirmations = function() {
    this.stats.confirmationsCount += 1;
    this.stats.points += 5; // 5 pontos por confirmação
    this.updateLevel();
    return this.save();
};

userSchema.methods.updateLevel = function() {
    const points = this.stats.points;
    this.stats.level = Math.floor(points / 100) + 1; // Novo nível a cada 100 pontos
};

// Índices
userSchema.index({ email: 1 });
userSchema.index({ 'stats.points': -1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);