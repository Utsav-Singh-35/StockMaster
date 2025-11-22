import { motion } from 'framer-motion';
import { Package, TrendingUp, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Product Management',
    description:
      'Organize SKUs, categories, units, and multi-warehouse stock effortlessly.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Inventory Operations',
    description:
      'Track receiving, transfers, deliveries, and adjustments in real-time.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Smart Dashboard',
    description:
      'Visualize stock levels, operations, and alerts with beautiful analytics.',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Everything You Need to Manage Inventory
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features that make inventory management simple and efficient
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
              >
                <feature.icon size={32} className="text-white" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>

              <div
                className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
