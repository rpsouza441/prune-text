# Prune Text

Uma aplicação React moderna construída com Vite, TypeScript e shadcn/ui.

## 🚀 Tecnologias

Este projeto utiliza:

- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **React** - Biblioteca de UI
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Framework de CSS
- **Docker** - Containerização

## 🛠️ Desenvolvimento Local

### Opção 1: Com Node.js

Requisitos: Node.js & npm - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone o repositório
git clone <YOUR_GIT_URL>

# Navegue para o diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm i

# Inicie o servidor de desenvolvimento
npm run dev
```

### Opção 2: Com Docker (Recomendado)

#### Produção (Padrão)
```bash
# Construir e executar em modo produção
docker-compose up --build

# Executar em background (padrão)
docker-compose up -d --build

# Parar os serviços
docker-compose down
```

Acesse: http://localhost:4080

#### Desenvolvimento
```bash
# Construir e executar em modo desenvolvimento
docker-compose --profile dev up --build

# Executar em background
docker-compose --profile dev up -d --build

# Parar os serviços
docker-compose --profile dev down
```

Acesse: http://localhost:8080

## 🐳 Docker

### Estrutura do Build

O projeto utiliza um Dockerfile multi-stage:

- **Builder**: Constrói a aplicação Vite
- **Production**: Serve com Nginx otimizado para SPA
- **Development**: Servidor de desenvolvimento com hot reload

### Configurações do Nginx (Produção)

- Suporte a React Router (SPA routing)
- Compressão Gzip
- Cache de assets estáticos
- Headers de segurança
- Health check endpoint: `/health`
- Porta externa: 4080 (mapeada para porta 80 interna do container)

### Comandos Úteis do Docker

```bash
# Ver logs
docker-compose logs -f

# Reconstruir apenas a imagem
docker-compose build

# Limpar volumes e containers
docker-compose down -v --remove-orphans

# Executar comandos dentro do container
docker-compose exec app-dev sh

# Verificar health check
curl http://localhost:4080/health
```

### Troubleshooting

**Rebuild completo:**
```bash
docker-compose down -v --remove-orphans
docker-compose build --no-cache
docker-compose up
```

**Problemas de permissão (Windows):**
```bash
docker-compose down -v
docker system prune -f
```

## 🚀 Deploy

### Lovable Platform

Abra [Lovable](https://lovable.dev/projects/0e2b0892-0f42-4537-a2ac-37f30a76db72) e clique em Share -> Publish.

### Docker Production

Use o comando padrão para deploy em qualquer ambiente que suporte Docker:

```bash
docker-compose up -d --build
```

## 🌐 Domínio Customizado

Para conectar um domínio customizado:

1. Navegue para Project > Settings > Domains
2. Clique em Connect Domain

Leia mais: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 📝 Outras Formas de Editar

**Editar diretamente no GitHub:**
- Navegue para o arquivo desejado
- Clique no botão "Edit" (ícone de lápis)
- Faça suas alterações e commit

**GitHub Codespaces:**
- Vá para a página principal do repositório
- Clique no botão "Code" (verde)
- Selecione a aba "Codespaces"
- Clique em "New codespace"


