InfraMonitor - Monitoramento Colaborativo
Plataforma colaborativa para monitorar e reportar problemas de infraestrutura urbana. Juntos, podemos tornar nossa cidade um lugar melhor!

📋 Índice
Visão Geral

Funcionalidades

Tecnologias

Estrutura do Projeto

Instalação e Configuração

Desenvolvimento

API Documentation

Deploy

Contribuição

🎯 Visão Geral
O InfraMonitor é uma plataforma web que permite aos cidadãos reportar e acompanhar problemas de infraestrutura urbana como buracos nas vias, falta de iluminação, acúmulo de lixo, problemas de sinalização e outros. A plataforma utiliza gamificação para incentivar a participação da comunidade.

Principais Características
🗺️ Mapa Interativo: Visualize ocorrências em tempo real

📱 Design Responsivo: Funciona em desktop e mobile

👥 Sistema Colaborativo: Confirmação comunitária de ocorrências

🏆 Gamificação: Sistema de pontos, rankings e conquistas

📊 Dashboard: Estatísticas e relatórios detalhados

🔐 Autenticação Segura: Sistema de usuários com JWT

🚀 Funcionalidades
Frontend
Interface moderna e intuitiva

Mapa interativo com Leaflet

Filtros por tipo e status de ocorrências

Formulário de reporte com validação

Sistema de confirmação em um clique

Leaderboard e conquistas

Design responsivo e acessível

Backend
API RESTful completa

Autenticação JWT

Upload de imagens

Sistema de notificações

Gamificação e pontuação

Estatísticas em tempo real

Documentação automática da API

🛠 Tecnologias
Frontend
HTML5 - Estrutura semântica

CSS3 - Estilos e design responsivo

JavaScript ES6+ - Lógica da aplicação

Leaflet - Mapas interativos

Vite - Build tool e dev server

Backend
Node.js - Runtime JavaScript

Express.js - Framework web

MongoDB - Banco de dados NoSQL

Mongoose - ODM para MongoDB

JWT - Autenticação

Joi - Validação de dados

Multer - Upload de arquivos

Nodemailer - Sistema de email

📁 Estrutura do Projeto
text
inframonitor/
├── frontend/                 # Aplicação frontend
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/      # Componentes modulares
│   │   ├── services/        # Serviços de API
│   │   ├── utils/           # Utilitários e constantes
│   │   ├── styles/          # Estilos globais
│   │   └── App.js          # Aplicação principal
│   └── package.json
├── backend/                  # API backend
│   ├── src/
│   │   ├── controllers/     # Lógica dos endpoints
│   │   ├── models/          # Modelos de dados
│   │   ├── routes/          # Definição de rotas
│   │   ├── middleware/      # Middlewares customizados
│   │   ├── config/          # Configurações
│   │   ├── services/        # Serviços externos
│   │   ├── utils/           # Utilitários
│   │   └── app.js          # Aplicação Express
│   ├── data/               # Dados de exemplo
│   └── package.json
└── README.md
⚙️ Instalação e Configuração
Pré-requisitos
Node.js 16+

MongoDB 4.4+

npm ou yarn

1. Clone o repositório
bash
git clone https://github.com/seu-usuario/inframonitor.git
cd inframonitor
2. Configuração do Backend
bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
Edite o arquivo .env:

env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/inframonitor
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
CORS_ORIGIN=http://localhost:3000
3. Configuração do Frontend
bash
# Voltar à raiz e entrar na pasta do frontend
cd ../frontend

# Instalar dependências
npm install
4. Iniciar a aplicação
Terminal 1 - Backend:

bash
cd backend
npm run dev
Terminal 2 - Frontend:

bash
cd frontend
npm run dev
A aplicação estará disponível em:

Frontend: http://localhost:3000

Backend API: http://localhost:3001

Health Check: http://localhost:3001/health

🚀 Desenvolvimento
Scripts Disponíveis
Frontend:

bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
Backend:

bash
npm run dev          # Desenvolvimento com nodemon
npm start           # Produção
npm test            # Executar testes
Estrutura de Desenvolvimento
O projeto segue uma arquitetura modular:

Componentes Frontend: Reutilizáveis e independentes

API RESTful: Endpoints bem definidos

Validação: Schemas com Joi no backend

Error Handling: Tratamento consistente de erros

Security: Helmet, CORS, sanitização

📚 API Documentation
Endpoints Principais
Ocorrências
Método	Endpoint	Descrição
GET	/api/occurrences	Listar ocorrências
GET	/api/occurrences/:id	Buscar ocorrência
POST	/api/occurrences	Criar ocorrência
PUT	/api/occurrences/:id/confirm	Confirmar ocorrência
PUT	/api/occurrences/:id	Atualizar ocorrência
Autenticação
Método	Endpoint	Descrição
POST	/api/auth/register	Registrar usuário
POST	/api/auth/login	Login
GET	/api/auth/me	Perfil do usuário
Estatísticas
Método	Endpoint	Descrição
GET	/api/stats	Estatísticas gerais
GET	/api/stats/leaderboard	Ranking de usuários
Exemplo de Uso da API
Criar Ocorrência:

javascript
const response = await fetch('/api/occurrences', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
        type: 'buraco',
        title: 'Buraco na via principal',
        description: 'Buraco grande na rua...',
        address: 'Rua Exemplo, 123',
        lat: -23.5505,
        lng: -46.6333
    })
});
🚀 Deploy
Frontend (Vercel/Netlify)
bash
cd frontend
npm run build
Backend (Heroku/Railway)
bash
cd backend
npm start
Variáveis de Ambiente para Produção
Backend:

env
NODE_ENV=production
MONGODB_URI=sua_url_mongodb_atlas
JWT_SECRET=seu_jwt_secret_producao
CORS_ORIGIN=https://seu-dominio.com
🤝 Contribuição
Contribuições são bem-vindas! Siga estos passos:

Fork o projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

Padrões de Código
Use ESLint e Prettier

Siga as convenções do JavaScript Standard

Escreva testes para novas funcionalidades

Documente mudanças na API

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

👥 Time
Desenvolvido com ❤️ pela comunidade InfraMonitor.

📞 Suporte
📧 Email: contato@inframonitor.com

🐛 Issues: GitHub Issues

💬 Discord: Comunidade InfraMonitor

