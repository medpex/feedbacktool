
#!/bin/bash

echo "🚀 Starting Feedback System..."

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
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:4000/api"
echo "Admin: http://localhost:3000/admin (admin/admin123)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
