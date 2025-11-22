import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Products', 'Solutions', 'Resources', 'Enterprise', 'Pricing'];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'h-16 bg-[#1A1A1A]/95 backdrop-blur-lg border-b border-gray-800'
          : 'h-20 bg-transparent'
      }`}
    >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-[#FF8C00] w-6 h-6" />
            <div className="text-2xl font-semibold tracking-wide text-white">
              StockMaster
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#apps"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm"
            >
              Explore apps
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm"
            >
              Contact Sales
            </a>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-[#FF8C00] text-white rounded-lg hover:bg-[#FF9500] transition-all duration-200 font-medium text-sm"
            >
              Sign Up
            </Link>
          </div>

          <button
            className="lg:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#1A1A1A]/95 backdrop-blur-lg border-t border-gray-800"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-[#FF8C00] text-white rounded-lg hover:bg-[#FF9500] transition-all duration-200 text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>
  );
}
