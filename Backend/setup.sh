#!/bin/bash

echo "🚀 StockMaster Backend Setup Script"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your DATABASE_URL from Railway"
    echo "   Then run this script again."
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "railway.app" .env && ! grep -q "localhost" .env; then
    echo "⚠️  DATABASE_URL not configured in .env"
    echo "   Please add your Railway PostgreSQL connection string"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

echo ""
echo "🗄️  Running database migrations..."
npm run prisma:migrate

echo ""
echo "🌱 Seeding database with sample data..."
npm run prisma:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 You can now start the server with: npm run dev"
echo ""
echo "📊 Demo credentials:"
echo "   Email: demo@stockmaster.com"
echo "   Password: demo123"
echo ""
