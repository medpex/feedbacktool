
#!/bin/bash

echo "🚀 Starting Feedback System..."

# Get server IP automatically
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
    SERVER_IP="localhost"
fi

# Set FRONTEND_URL if not already set
if [ -z "$FRONTEND_URL" ]; then
    export FRONTEND_URL="http://${SERVER_IP}:3000"
fi

echo "📍 Server IP detected: $SERVER_IP"
echo "🌐 Frontend URL: $FRONTEND_URL"

# Detect docker compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Error: Neither 'docker-compose' nor 'docker compose' found!"
    echo "Please install Docker Compose first."
    exit 1
fi

echo "🐳 Using Docker Compose command: $DOCKER_COMPOSE"

# Stop only frontend and backend containers (preserve database)
echo "📦 Stopping frontend and backend containers..."
$DOCKER_COMPOSE stop frontend backend

# Remove only frontend and backend containers (preserve database)
echo "🗑️ Removing frontend and backend containers..."
$DOCKER_COMPOSE rm -f frontend backend

# Build only frontend and backend containers
echo "🔨 Building frontend and backend containers..."
$DOCKER_COMPOSE build --no-cache frontend backend

# Start all services (database will continue running if already started)
echo "🏃 Starting services..."
$DOCKER_COMPOSE up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Checking service status..."
$DOCKER_COMPOSE ps

echo "✅ Setup complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend API: http://${SERVER_IP}:4000/api"
echo "Admin: $FRONTEND_URL/admin (admin/admin123)"
echo ""
echo "To view logs: $DOCKER_COMPOSE logs -f"
echo "To stop: $DOCKER_COMPOSE down"
echo "To reset database: $DOCKER_COMPOSE down -v && $DOCKER_COMPOSE up -d"
