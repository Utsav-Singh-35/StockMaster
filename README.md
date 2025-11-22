# StockMaster - Inventory Management System

![StockMaster Logo](https://via.placeholder.com/200x80/f97316/ffffff?text=StockMaster)

A modern, comprehensive inventory management system built with React, TypeScript, and Node.js. StockMaster digitizes and streamlines all stock-related operations, replacing manual registers and Excel sheets with a centralized, real-time solution.

## 🚀 Features

### 🔐 Authentication & Security
- **User Registration & Login** - Secure account creation and authentication
- **OTP-based Password Reset** - Forgot password functionality with email OTP verification
- **Role-based Access Control** - Admin and user role management
- **Session Management** - Secure token-based authentication

### 📊 Dashboard & Analytics
- **Real-time KPI Dashboard** - Total products, low stock alerts, pending operations
- **Interactive Charts** - Visual representation of inventory performance
- **Quick Actions** - Fast access to common operations
- **Multi-warehouse Overview** - Centralized view of all locations

### 📦 Product Management
- **Product Catalog** - Create, edit, and manage product information
- **SKU Management** - Unique product codes and categorization
- **Multi-location Stock Tracking** - Track inventory across multiple warehouses
- **Reorder Level Alerts** - Automated low stock notifications
- **Product Categories** - Organize products by type and classification
- **Units of Measure** - Support for various measurement units (kg, liters, pieces, etc.)

### 📥 Receipts (Incoming Stock)
- **Supplier Management** - Track goods received from vendors
- **Multi-product Receipts** - Add multiple products in single receipt
- **Automatic Stock Updates** - Real-time inventory level adjustments
- **Receipt Validation** - Approve and validate incoming goods
- **Supplier History** - Track all receipts from specific suppliers

### 📤 Deliveries (Outgoing Stock)
- **Customer Orders** - Manage outgoing shipments to customers
- **Multi-stage Process** - Draft → Picking → Packing → Ready → Shipped
- **Delivery Tracking** - Complete order fulfillment workflow
- **Automatic Stock Deduction** - Real-time inventory updates
- **Shipping Integration** - Track packages with delivery status

### 🔄 Internal Transfers
- **Inter-warehouse Transfers** - Move stock between locations
- **Transfer Tracking** - Complete audit trail of all movements
- **Multi-location Support** - Transfer between warehouses, production floors, storage areas
- **Transfer History** - Detailed logs of all stock movements

### ⚖️ Stock Adjustments
- **Physical Count Reconciliation** - Fix discrepancies between recorded and actual stock
- **Adjustment Reasons** - Track why adjustments were made (damage, theft, count errors)
- **Automatic Calculations** - System calculates differences automatically
- **Audit Trail** - Complete history of all stock adjustments

### 🏢 Warehouse Management
- **Multi-warehouse Support** - Manage multiple storage locations
- **Warehouse Configuration** - Set up locations, capacity, and details
- **Location-specific Stock** - Track inventory by specific warehouse
- **Warehouse Analytics** - Performance metrics per location

### 👤 User Management
- **User Profiles** - Manage personal information and preferences
- **Department Assignment** - Organize users by department
- **Role Management** - Admin and user permission levels
- **Password Management** - Secure password change functionality

### 🎨 Modern UI/UX
- **Dark Theme** - Professional dark interface with orange accents
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Intuitive Navigation** - Easy-to-use sidebar navigation
- **Real-time Updates** - Live data updates without page refresh
- **Interactive Modals** - Smooth, animated form interactions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **JWT Authentication** - Secure token-based auth
- **Bcrypt** - Password hashing
- **Nodemailer** - Email functionality for OTP

### Database
- **PostgreSQL** - Robust relational database
- **Prisma ORM** - Type-safe database access
- **Database Migrations** - Version-controlled schema changes

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stockmaster.git
cd stockmaster
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd Backend
npm install
```

### 4. Environment Configuration

Create `.env` files in both root and Backend directories:

**Root `.env`:**
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend `.env`:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/stockmaster"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001

# Email Configuration for OTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

### 5. Database Setup
```bash
cd Backend
npx prisma migrate dev
npx prisma generate
```

### 6. Start the Application

**Backend (Terminal 1):**
```bash
cd Backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🔑 Default Login Credentials

For testing purposes, use these demo credentials:

```
Email: demo@stockmaster.com
Password: demo123
```

## 📱 Usage Guide

### Getting Started
1. **Register** a new account or use demo credentials
2. **Explore the Dashboard** to see inventory overview
3. **Add Products** to build your catalog
4. **Create Warehouses** to organize locations
5. **Process Receipts** when goods arrive
6. **Manage Deliveries** for outgoing orders
7. **Perform Adjustments** to maintain accuracy

### Key Workflows

#### Adding New Products
1. Navigate to **Products** page
2. Click **Create Product** button
3. Fill in product details (name, SKU, category, unit)
4. Set reorder level for low stock alerts
5. Save to add to catalog

#### Processing Receipts
1. Go to **Receipts** page
2. Click **Create Receipt**
3. Select supplier and warehouse
4. Add products with quantities
5. Validate to update stock levels

#### Managing Deliveries
1. Visit **Deliveries** page
2. Create new delivery order
3. Add customer and products
4. Progress through: Picking → Packing → Ready → Shipped
5. Track delivery status

#### Stock Adjustments
1. Access **Adjustments** page
2. Select product and warehouse
3. Enter actual counted quantity
4. Provide reason for adjustment
5. System calculates and applies difference

## 🔒 Password Reset Process

### Forgot Password Flow
1. Click **"Forgot Password?"** on login page
2. Enter your registered email address
3. Check email for 6-digit OTP code
4. Enter OTP on verification page
5. Set new password
6. Login with new credentials

### OTP Configuration
The system sends OTP emails using SMTP. Configure your email settings in the backend `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🏗️ Project Structure

```
stockmaster/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── lib/               # API utilities and helpers
│   └── types/             # TypeScript type definitions
├── Backend/               # Backend source code
│   ├── src/               # Backend source files
│   ├── prisma/            # Database schema and migrations
│   └── routes/            # API route handlers
├── public/                # Static assets
└── docs/                  # Documentation files
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user info

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory Endpoints
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt
- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create new delivery
- `GET /api/transfers` - Get all transfers
- `POST /api/transfers` - Create new transfer
- `GET /api/adjustments` - Get all adjustments
- `POST /api/adjustments` - Create new adjustment

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

**Email OTP Not Sending:**
- Verify SMTP configuration
- Check email credentials
- Ensure "Less secure app access" is enabled (Gmail)

**Frontend Not Loading:**
- Check if backend is running on port 3001
- Verify VITE_API_URL in frontend `.env`
- Clear browser cache

**Build Errors:**
- Delete `node_modules` and reinstall
- Check Node.js version compatibility
- Verify all environment variables

## 📊 Performance & Scalability

- **Database Indexing** - Optimized queries for large datasets
- **Pagination** - Efficient data loading for large inventories
- **Caching** - Redis integration ready for production
- **API Rate Limiting** - Protection against abuse
- **Horizontal Scaling** - Microservices architecture ready

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **Input Validation** - Prevent SQL injection and XSS
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API abuse prevention
- **Environment Variables** - Secure configuration management

## 📈 Future Roadmap

- [ ] **Mobile App** - React Native mobile application
- [ ] **Barcode Scanning** - QR/Barcode integration
- [ ] **Advanced Reporting** - PDF/Excel export functionality
- [ ] **Supplier Portal** - External supplier access
- [ ] **API Webhooks** - Real-time integrations
- [ ] **Multi-currency Support** - International operations
- [ ] **Advanced Analytics** - Machine learning insights
- [ ] **Audit Logs** - Comprehensive activity tracking

## 📞 Support

For support and questions:

- **Email**: support@stockmaster.com
- **Documentation**: [docs.stockmaster.com](https://docs.stockmaster.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/stockmaster/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/stockmaster/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Lucide** - For beautiful icons
- **Prisma** - For the excellent ORM
- **All Contributors** - Thank you for your contributions!

---

**Built with ❤️ for inventory professionals**

*StockMaster - Making inventory management simple, efficient, and intelligent.*