import { motion } from 'framer-motion';

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            A Dashboard Built to Keep You in Control
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Visualize stock, operations, transfers, and alerts in seconds — not minutes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>

            <div className="bg-white p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute top-0 right-0 w-16 h-16 bg-indigo-500 rounded-full blur-2xl"
                  />
                  <p className="text-sm text-indigo-600 font-semibold">Total Products</p>
                  <p className="text-3xl font-bold text-indigo-900">1,247</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.3,
                    }}
                    className="absolute top-0 right-0 w-16 h-16 bg-red-500 rounded-full blur-2xl"
                  />
                  <p className="text-sm text-red-600 font-semibold">Low Stock</p>
                  <p className="text-3xl font-bold text-red-900">23</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.6,
                    }}
                    className="absolute top-0 right-0 w-16 h-16 bg-amber-500 rounded-full blur-2xl"
                  />
                  <p className="text-sm text-amber-600 font-semibold">Pending</p>
                  <p className="text-3xl font-bold text-amber-900">47</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.9,
                    }}
                    className="absolute top-0 right-0 w-16 h-16 bg-green-500 rounded-full blur-2xl"
                  />
                  <p className="text-sm text-green-600 font-semibold">Warehouses</p>
                  <p className="text-3xl font-bold text-green-900">8</p>
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Recent Activity</p>
                      <p className="text-sm text-slate-500">
                        Stock received at Warehouse A
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">2 mins ago</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🚚</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Transfer Completed</p>
                      <p className="text-sm text-slate-500">Warehouse B → Warehouse C</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">15 mins ago</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Low Stock Alert</p>
                      <p className="text-sm text-slate-500">Item #SKU-2847 needs restock</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
