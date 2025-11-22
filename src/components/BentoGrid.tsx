import { motion } from 'framer-motion';
import { Database, Building2, Layers, Bell } from 'lucide-react';

const bentoItems = [
  {
    icon: Database,
    title: 'Real-time Stock Ledger',
    description: 'Every transaction tracked with complete history and audit trails',
    className: 'md:col-span-2',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Building2,
    title: 'Multi-Warehouse System',
    description: 'Manage unlimited locations with ease',
    className: 'md:col-span-1',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    icon: Layers,
    title: 'Vendor → Warehouse → Rack',
    description: 'Complete supply chain visibility from source to storage',
    className: 'md:col-span-1',
    gradient: 'from-pink-600 to-rose-600',
  },
  {
    icon: Bell,
    title: 'Smart Alerts & Thresholds',
    description: 'Automated notifications keep you ahead of stock issues',
    className: 'md:col-span-2',
    gradient: 'from-rose-600 to-orange-600',
  },
];

export default function BentoGrid() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Why Choose StockMaster
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built for modern businesses that need precision and control
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {bentoItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${item.className} bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`}
                />
              </div>

              <div className="relative z-10">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                >
                  <item.icon size={24} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>

              <div
                className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
