import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-black to-black" />
      
      {/* Glowing orb effect */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Inventory Management{' '}
            <br />
            <span className="text-orange-500">Made Simple</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto"
          >
            Replace manual registers and Excel sheets with a centralized, real-time inventory 
            management system. Track stock, manage receipts, and streamline operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="group px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              to="/login"
              className="group px-8 py-4 bg-transparent text-white border border-gray-600 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              Watch Demo
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
}
