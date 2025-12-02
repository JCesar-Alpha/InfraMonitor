import cors from 'cors';
import { config } from '../config/config.js';

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requisições sem origin (como mobile apps ou curl)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            config.cors.origin,
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://inframonitor.vercel.app'
        ];
        
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Não permitido por CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
};

export const corsMiddleware = cors(corsOptions);