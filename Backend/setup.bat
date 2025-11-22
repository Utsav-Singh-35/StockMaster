@echo off
echo 🚀 StockMaster Backend Setup Script
echo ====================================
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your DATABASE_URL from Railway
    echo    Then run this script again.
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Generating Prisma Client...
call npm run prisma:generate

echo.
echo 🗄️  Running database migrations...
call npm run prisma:migrate

echo.
echo 🌱 Seeding database with sample data...
call npm run prisma:seed

echo.
echo ✅ Setup complete!
echo.
echo 🎉 You can now start the server with: npm run dev
echo.
echo 📊 Demo credentials:
echo    Email: demo@stockmaster.com
echo    Password: demo123
echo.
pause
