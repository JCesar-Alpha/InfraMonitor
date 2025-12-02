import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/inframonitor'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    upload: {
        path: process.env.UPLOAD_PATH || './uploads',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
    }
};