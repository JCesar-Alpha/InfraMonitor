import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/config.js';
import { database } from './config/database.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import { logger } from './utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
    constructor() {
        this.app = express();
        this.port = config.port;
        
        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    async initializeDatabase() {
        try {
            await database.connect();
            logger.info('Database inicializado com sucesso');
        } catch (error) {
            logger.error('Erro ao inicializar database', error);
            process.exit(1);
        }
    }

    initializeMiddlewares() {
        // Segurança
        this.app.use(helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" }
        }));
        
        // CORS
        this.app.use(corsMiddleware);
        
        // Logging
        if (config.env === 'development') {
            this.app.use(morgan('dev'));
        } else {
            this.app.use(morgan('combined'));
        }
        
        // Compressão
        this.app.use(compression());
        
        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // Servir arquivos estáticos (para uploads)
        this.app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
        
        // Health check básico
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: config.env,
                version: '1.0.0'
            });
        });
        
        logger.info('Middlewares inicializados com sucesso');
    }

    initializeRoutes() {
        // API Routes
        this.app.use('/api', apiRoutes);
        
        // Rota padrão para API não encontrada
        this.app.use('/api/*', notFound);
        
        logger.info('Rotas inicializadas com sucesso');
    }

    initializeErrorHandling() {
        this.app.use(errorHandler);
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            logger.info(`🚀 Servidor InfraMonitor rodando na porta ${this.port}`);
            logger.info(`📊 Ambiente: ${config.env}`);
            logger.info(`🔗 Health Check: http://localhost:${this.port}/health`);
            logger.info(`📚 API Docs: http://localhost:${this.port}/api`);
        });

        // Graceful shutdown
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
        process.on('SIGINT', this.gracefulShutdown.bind(this));
    }

    async gracefulShutdown() {
        logger.info('🛑 Iniciando desligamento gracioso...');
        
        this.server.close(async () => {
            logger.info('🔒 Servidor HTTP fechado');
            
            await database.disconnect();
            logger.info('📦 Database desconectado');
            
            process.exit(0);
        });

        // Force close after 10 seconds
        setTimeout(() => {
            logger.error('❌ Desligamento forçado após timeout');
            process.exit(1);
        }, 10000);
    }
}

// Inicializar aplicação
const app = new App();
app.start();

export default app;