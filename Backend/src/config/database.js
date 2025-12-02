import mongoose from 'mongoose';
import { config } from './config.js';

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            this.connection = await mongoose.connect(config.mongodb.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            
            console.log('✅ Conectado ao MongoDB com sucesso');
            return this.connection;
        } catch (error) {
            console.error('❌ Erro ao conectar com MongoDB:', error);
            process.exit(1);
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('✅ Desconectado do MongoDB');
        } catch (error) {
            console.error('❌ Erro ao desconectar do MongoDB:', error);
        }
    }

    getConnection() {
        return this.connection;
    }
}

export const database = new Database();