#!/bin/bash

# Agraani Welfare Foundation - Development Setup Script

echo "🚀 Setting up Agraani Welfare Foundation Application..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and run this script again."
    echo ""
    echo "On Linux, start Docker with:"
    echo "  sudo systemctl start docker"
    echo ""
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL database
echo "📦 Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check database health
until docker-compose exec -T postgres pg_isready -U agraani > /dev/null 2>&1; do
    echo "  Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ Database is ready!"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Push database schema
echo "📊 Pushing database schema..."
npm run prisma:push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run prisma:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure Google OAuth credentials in .env file"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo "4. Admin panel: http://localhost:3000/admin"
echo ""
echo "📚 For more information, see README.md"
