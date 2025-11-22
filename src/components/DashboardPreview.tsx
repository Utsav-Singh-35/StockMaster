import { motion } from 'framer-motion';

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            A Dashboard Built to Keep You in Control
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
          <div className="relative bg-[#252525] rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="bg-[#1A1A1A] px-6 py-4 flex items-center gap-2 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>

            <div className="bg-[#1F1F1F] p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#252525] border border-gray-800 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <p className="text-sm text-gray-400 font-semibold">TOTAL SALES</p>
                  <p className="text-3xl font-bold text-white">$6,652.85</p>
                  <p className="text-xs text-green-500">+12.5%</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#252525] border border-gray-800 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <p className="text-sm text-gray-400 font-semibold">FULFILLED ORDERS</p>
                  <p className="text-3xl font-bold text-white">8,021</p>
                  <p className="text-xs text-green-500">+8.2%</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#252525] border border-gray-800 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <p className="text-sm text-gray-400 font-semibold">SUPPLIER COSTS</p>
                  <p className="text-3xl font-bold text-white">$4,382.40</p>
                  <p className="text-xs text-red-500">-3.1%</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#252525] border border-gray-800 rounded-xl p-6 space-y-2 relative overflow-hidden"
                >
                  <p className="text-sm text-gray-400 font-semibold">INVENTORY VALUE</p>
                  <p className="text-3xl font-bold text-white">$15,827.00</p>
                  <p className="text-xs text-green-500">+15.3%</p>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#252525] border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Sales Trend Overview</h3>
                  <div className="h-32 bg-gradient-to-t from-[#FF8C00]/20 to-transparent rounded-lg flex items-end justify-around p-4">
                    {[40, 60, 45, 75, 65, 85, 90].map((height, i) => (
                      <div
                        key={i}
                        className="bg-[#FF8C00] rounded-t w-8"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-[#252525] border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Order Volume Distribution</h3>
                  <div className="h-32 flex items-end justify-around gap-2 p-4">
                    {[70, 50, 80, 60, 90, 75].map((height, i) => (
                      <div
                        key={i}
                        className="bg-blue-500 rounded-t flex-1"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#252525] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF8C00]/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Recent Activity</p>
                      <p className="text-sm text-gray-400">
                        Stock received at Warehouse A
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 mins ago</span>
                </div>

                <div className="bg-[#252525] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🚚</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Transfer Completed</p>
                      <p className="text-sm text-gray-400">Warehouse B → Warehouse C</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">15 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
