import { motion } from 'framer-motion';

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
            {/* Browser header */}
            <div className="bg-gray-800 px-6 py-4 flex items-center gap-2 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="ml-4 text-gray-400 text-sm">stockmaster-dashboard.com</div>
            </div>

            {/* Dashboard content */}
            <div className="bg-gray-900 p-8">
              {/* Top navigation */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="text-white font-semibold text-lg">Dashboard</div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-orange-500">Overview</span>
                    <span className="text-gray-400">Analytics</span>
                    <span className="text-gray-400">Reports</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <span className="text-gray-300 text-sm">John Doe</span>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-2"
                >
                  <p className="text-sm text-gray-400">Total Products</p>
                  <p className="text-3xl font-bold text-white">1,247</p>
                  <p className="text-xs text-green-400">↗ +12% from last month</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-2"
                >
                  <p className="text-sm text-gray-400">Low Stock Items</p>
                  <p className="text-3xl font-bold text-white">23</p>
                  <p className="text-xs text-red-400">↗ +3 from yesterday</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-2"
                >
                  <p className="text-sm text-gray-400">Pending Receipts</p>
                  <p className="text-3xl font-bold text-white">47</p>
                  <p className="text-xs text-orange-400">↗ +8 from yesterday</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-2"
                >
                  <p className="text-sm text-gray-400">Warehouses</p>
                  <p className="text-3xl font-bold text-white">8</p>
                  <p className="text-xs text-gray-400">→ No change</p>
                </motion.div>
              </div>

              {/* Chart and activity */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold">Inventory Performance</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded">7D</button>
                      <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded">30D</button>
                      <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded">90D</button>
                    </div>
                  </div>
                  
                  <div className="h-48 flex items-end gap-2">
                    {[65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 80, 95].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t flex-1 min-h-[4px]"
                      />
                    ))}
                  </div>
                </div>

                {/* Recent activity */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white text-sm">Shipment delivered</p>
                        <p className="text-gray-400 text-xs">Order #12847 • 2 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white text-sm">Delay notification</p>
                        <p className="text-gray-400 text-xs">Route #A47 • 15 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white text-sm">New supplier added</p>
                        <p className="text-gray-400 text-xs">Acme Corp • 1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white text-sm">Alert: Low inventory</p>
                        <p className="text-gray-400 text-xs">SKU #2847 • 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 rounded-2xl blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
