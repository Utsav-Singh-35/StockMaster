import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  TruckIcon, 
  Send, 
  ArrowLeftRight, 
  FileText, 
  Settings, 
  Bell, 
  User, 
  LogOut, 
  Menu,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: TruckIcon, label: 'Receipts', path: '/receipts' },
    { icon: Send, label: 'Deliveries', path: '/deliveries' },
    { icon: ArrowLeftRight, label: 'Transfers', path: '/transfers' },
    { icon: FileText, label: 'Adjustments', path: '/adjustments' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="bg-[#252525] border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
              >
                <Menu size={24} className="text-gray-300" />
              </button>
              <h1 className="text-2xl font-bold text-white">StockMaster</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-[#1F1F1F] border border-gray-800 rounded-lg focus:outline-none focus:border-[#FF8C00] w-64 text-white placeholder-gray-500"
                />
              </div>

              <button className="relative p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors">
                <Bell size={20} className="text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                >
                  <User size={20} className="text-gray-300" />
                  <span className="hidden md:block text-sm text-gray-300">demo@stockmaster.com</span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-[#252525] rounded-lg shadow-lg border border-gray-800 py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2A2A2A] flex items-center gap-2"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2A2A2A] flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen bg-[#252525] border-r border-gray-800 transition-transform duration-300 z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ width: '280px', top: '73px' }}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/30'
                      : 'text-gray-300 hover:bg-[#2A2A2A]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
