.PHONY: help install dev build clean docker-clean docker-clean-all docker-up docker-down docker-rebuild logs test health

# Colors for terminal output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
BLUE   := $(shell tput -Txterm setaf 4)
RESET  := $(shell tput -Txterm sgr0)

help: ## Show this help message
	@echo '${GREEN}JANI Supply Chain Management${RESET}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  ${YELLOW}%-20s${RESET} %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	@echo "${GREEN}📦 Installing dependencies...${RESET}"
	@pnpm install

dev: ## Run all services in development mode (locally, not Docker)
	@echo "${GREEN}🚀 Starting development environment...${RESET}"
	@echo "${YELLOW}Starting MongoDB in Docker...${RESET}"
	# Ensure .env contains necessary defaults (script handles missing/empty values)
	@sh scripts/ensure-env.sh
	@docker compose up -d mongo redis
	@echo "${YELLOW}Waiting for services to be ready...${RESET}"
	@sleep 5
	@echo "${GREEN}Starting microservices...${RESET}"
	@echo "Use Ctrl+C to stop all services"

dev-web: ## Run only web app in development
	@echo "${GREEN}🌐 Starting web app...${RESET}"
	@cd apps/web && pnpm dev

dev-mobile: ## Run only mobile app in development
	@echo "${GREEN}📱 Starting mobile app...${RESET}"
	@cd apps/mobile && pnpm start

build: ## Build all services for production
	@echo "${GREEN}🔨 Building all services...${RESET}"
	@pnpm --filter web build
	@docker compose build

docker-up: ## Start all services with Docker Compose
	@echo "${GREEN}🐳 Starting Docker containers...${RESET}"
	@docker compose up -d
	@echo "${GREEN}✅ Services started!${RESET}"
	@echo ""
	@echo "${BLUE}Services:${RESET}"
	@echo "  Web:           ${YELLOW}http://localhost:3000${RESET}"
	@echo "  Auth Service:  ${YELLOW}http://localhost:4000${RESET}"
	@echo "  User Service:  ${YELLOW}http://localhost:4001${RESET}"
	@echo "  AI Service:    ${YELLOW}http://localhost:4002${RESET}"
	@echo "  MongoDB:       ${YELLOW}mongodb://localhost:27017${RESET}"
	@echo ""
	@echo "Run ${YELLOW}make logs${RESET} to view logs"

docker-down: ## Stop all Docker containers
	@echo "${YELLOW}🛑 Stopping Docker containers...${RESET}"
	@docker compose down

docker-rebuild: ## Rebuild and restart all Docker containers
	@echo "${YELLOW}🔄 Rebuilding Docker containers...${RESET}"
	@docker compose down
	@docker compose build --no-cache
	@docker compose up -d
	@echo "${GREEN}✅ Rebuild complete!${RESET}"

logs: ## Show logs from all containers
	@docker compose logs -f

logs-web: ## Show logs from web container
	@docker compose logs -f web

logs-mobile: ## Show logs from mobile container
	@docker compose logs -f mobile


logs-auth: ## Show logs from auth service
	@docker compose logs -f auth

logs-mongo: ## Show MongoDB logs
	@docker compose logs -f mongo

logs-traeability:
	@docker compose logs -f traceability

logs-user:
	@docker compose logs -f user

clean: ## Clean all build artifacts and dependencies
	@echo "${YELLOW}🧹 Cleaning project...${RESET}"
	@rm -rf node_modules
	@rm -rf apps/*/node_modules
	@rm -rf apps/*/.next
	@rm -rf services/*/node_modules
	@rm -rf services/*/dist
	@docker compose down -v
	@echo "${GREEN}✅ Clean complete!${RESET}"


docker-clean-all: ## Remove ALL Docker resources (containers, images, volumes, networks, cache) - NO CONFIRMATION
	@echo "${YELLOW}🧹 Removing ALL Docker resources for this project...${RESET}"
	@echo "${YELLOW}🛑 Stopping and removing all containers...${RESET}"
	@docker compose down -v --remove-orphans 2>/dev/null || true
	@echo "${YELLOW}🗑️  Removing project images...${RESET}"
	@docker images | grep jani | awk '{print $$3}' | xargs -r docker rmi -f 2>/dev/null || true
	@echo "${YELLOW}🗑️  Removing dangling images...${RESET}"
	@docker image prune -f
	@echo "${YELLOW}🗑️  Removing unused volumes...${RESET}"
	@docker volume prune -f
	@echo "${YELLOW}🗑️  Removing unused networks...${RESET}"
	@docker network prune -f
	@echo "${GREEN}✅ Docker cleanup complete!${RESET}"
	@echo "${BLUE}Run 'make docker-up' to rebuild everything${RESET}"

test: ## Run all tests
	@echo "${GREEN}🧪 Running tests...${RESET}"
	@pnpm test

lint: ## Run linting
	@echo "${GREEN}🔍 Running linters...${RESET}"
	@pnpm --filter web lint

format: ## Format code with Prettier
	@echo "${GREEN}✨ Formatting code...${RESET}"
	@pnpm format || echo "No format script found"

db-shell: ## Open MongoDB shell
	@docker compose exec mongo mongosh

db-backup: ## Backup MongoDB database
	@echo "${GREEN}💾 Backing up database...${RESET}"
	@mkdir -p backups
	@docker compose exec -T mongo mongodump --archive > backups/jani-backup-$$(date +%Y%m%d_%H%M%S).archive
	@echo "${GREEN}✅ Backup complete!${RESET}"

db-restore: ## Restore MongoDB database (use BACKUP_FILE=path/to/backup.archive)
	@echo "${YELLOW}📥 Restoring database...${RESET}"
	@if [ -z "$(BACKUP_FILE)" ]; then echo "❌ Error: BACKUP_FILE not specified"; exit 1; fi
	@docker compose exec -T mongo mongorestore --archive < $(BACKUP_FILE)
	@echo "${GREEN}✅ Restore complete!${RESET}"

setup: install ## Setup project (install + create env files)
	@echo "${GREEN}⚙️  Setting up project...${RESET}"
	@if [ ! -f apps/web/.env ]; then cp apps/web/.env.example apps/web/.env 2>/dev/null || echo "No web .env.example found"; fi
	@if [ ! -f services/auth/.env ]; then cp services/auth/.env.example services/auth/.env 2>/dev/null || echo "No auth .env.example found"; fi
	@if [ ! -f .env ]; then echo "Creating root .env file..."; echo "JWT_SECRET=$$(openssl rand -hex 32)" > .env; fi
	@echo "${GREEN}✅ Setup complete!${RESET}"
	@echo "${YELLOW}⚠️  Remember to edit .env files with your configuration${RESET}"

status: ## Show status of all services
	@echo "${BLUE}📊 Service Status:${RESET}"
	@docker compose ps

ps: status ## Alias for status

restart: docker-down docker-up ## Restart all Docker services

health: ## Check health status of all services
	@echo "🏥 Checking service health..."
	@./test-health.sh

.DEFAULT_GOAL := help
