import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              Inventory Management That Works Like{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Magic
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-600 leading-relaxed"
          >
            Real-time stock movement, smart alerts, multi-warehouse tracking — all
            beautifully organized.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/signup"
              className="group px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              Sign Up
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              to="/login"
              className="group px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full hover:border-indigo-600 hover:text-indigo-600 hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              Login
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <motion.div
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Total Products</p>
                    <p className="text-3xl font-bold text-slate-900">1,247</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl text-white">📦</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 space-y-1">
                    <p className="text-xs text-green-600 font-medium">In Stock</p>
                    <p className="text-2xl font-bold text-green-700">892</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 space-y-1">
                    <p className="text-xs text-red-600 font-medium">Low Stock</p>
                    <p className="text-2xl font-bold text-red-700">23</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-amber-600 font-medium">
                        Pending Deliveries
                      </p>
                      <p className="text-2xl font-bold text-amber-700">47</p>
                    </div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="w-3 h-3 bg-amber-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-3xl blur-2xl transform scale-110" />
        </motion.div>
      </div>
    </section>
  );
}
