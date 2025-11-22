import { motion } from 'framer-motion';
import { BarChart3, Warehouse, ArrowRightLeft, FileText } from 'lucide-react';

export default function CoreFeatures() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Core Features That Drive Results
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Everything you need to manage inventory efficiently, from receipts to deliveries.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Receipts & Deliveries
                </h3>
                <p className="text-gray-400">
                  Process incoming goods from suppliers and outgoing deliveries to customers 
                  with automatic stock updates and comprehensive tracking.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Internal Transfers
                </h3>
                <p className="text-gray-400">
                  Move stock between warehouses, locations, or production areas with 
                  complete traceability and automated logging.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0">
                <Warehouse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Multi-Warehouse Support
                </h3>
                <p className="text-gray-400">
                  Manage inventory across multiple locations with centralized control 
                  and location-specific stock tracking.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Stock Ledger & Reports
                </h3>
                <p className="text-gray-400">
                  Complete audit trail of all stock movements with detailed reports 
                  and analytics to optimize your inventory operations.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-semibold">Inventory Dashboard</h4>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Chart area */}
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <div className="flex items-end gap-2 h-32">
                  {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 80].map((height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t flex-1"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-orange-500 text-sm">Total Products</div>
                  <div className="text-white text-xl font-bold">1,247</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-orange-500 text-sm">Low Stock</div>
                  <div className="text-white text-xl font-bold">23</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-orange-500 text-sm">Pending</div>
                  <div className="text-white text-xl font-bold">47</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}