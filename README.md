# Prune Text

Uma aplicação React moderna construída com Vite, TypeScript e shadcn/ui.

**Repositório:** https://github.com/rpsouza441/prune-text

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
git clone https://github.com/rpsouza441/prune-text.git

# Navegue para o diretório
cd prune-text

# Instale as dependências
npm i

# Inicie o servidor de desenvolvimento
npm run dev
```

### Opção 2: Com Docker (Recomendado)

```bash
# Construir e executar
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar os serviços
docker-compose down
```

Acesse: http://localhost:4080

## 🐳 Docker

### Estrutura do Build

O projeto utiliza um Dockerfile multi-stage:

- **Builder**: Constrói a aplicação Vite
- **Production**: Serve com Nginx otimizado para SPA

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
docker-compose exec app sh

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

Faça deploy usando Docker em qualquer plataforma de hospedagem que suporte containers:

```bash
docker-compose up -d --build
```

A aplicação estará disponível na porta 4080.



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


