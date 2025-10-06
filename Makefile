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

# Clean everything in Docker
.PHONY: clean
clean:
	@echo "🧹 Cleaning all Docker resources..."
	# Stop and remove all containers
	docker rm -f $$(docker ps -aq) 2>/dev/null || true
	# Remove all images
	docker rmi -f $$(docker images -aq) 2>/dev/null || true
	# Remove all volumes
	docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	# Remove all networks
	docker network rm $$(docker network ls -q) 2>/dev/null || true
	# Prune build cache
	docker builder prune -af
	@echo "✅ All Docker resources cleaned!"


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
