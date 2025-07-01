
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

# Stop and remove existing containers
echo "📦 Stopping existing containers..."
docker-compose down -v

# Build containers
echo "🔨 Building containers..."
docker-compose build --no-cache

# Start services
echo "🏃 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose ps

echo "✅ Setup complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend API: http://${SERVER_IP}:4000/api"
echo "Admin: $FRONTEND_URL/admin (admin/admin123)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
