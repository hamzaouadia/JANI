# Makefile for JANI Dockerized Monorepo

# Services
SERVICES := auth web
COMPOSE_FILE := docker-compose.yml

# Default target
.PHONY: up
up:
	@echo "🟢 Building & starting all services..."
	docker compose -f $(COMPOSE_FILE) up -d --build
	@echo "✅ All services started!"

# Stop all services
.PHONY: down
down:
	@echo "🔴 Stopping all services..."
	docker compose -f $(COMPOSE_FILE) down
	@echo "✅ All services stopped!"

# Clean Docker (containers, networks, volumes, images)
.PHONY: clean
clean:
	@echo "🧹 Cleaning Docker system (containers, volumes, images)..."
	docker compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	docker system prune -af --volumes
	@echo "✅ Docker cleaned!"

# Build only
.PHONY: build
build:
	@echo "🔨 Building all services..."
	docker compose -f $(COMPOSE_FILE) build
	@echo "✅ Build complete!"

# Logs
.PHONY: logs
logs:
	@echo "📜 Showing logs..."
	docker compose -f $(COMPOSE_FILE) logs -f

# Exec into a service
.PHONY: exec
exec:
	@read -p "Service name: " svc; docker compose -f $(COMPOSE_FILE) exec $$svc sh

# Restart services
.PHONY: restart
restart: down up
