import { motion } from 'framer-motion';
import { MapPin, BarChart3, Infinity, LayoutDashboard, Shield, ArrowRightLeft } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description:
      'Monitor inventory movements across all warehouses with live updates and instant visibility.',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description:
      'Leverage AI-powered insights to forecast demand and prevent stockouts before they happen.',
  },
  {
    icon: Infinity,
    title: 'Seamless Integration',
    description:
      'Connect with your existing ERP, WMS, and logistics platforms effortlessly.',
  },
  {
    icon: LayoutDashboard,
    title: 'Smart Dashboard',
    description:
      'Visualize stock levels, operations, and alerts with beautiful, intuitive analytics.',
  },
  {
    icon: Shield,
    title: 'Secure Operations',
    description:
      'Enterprise-grade security ensures your inventory data is always protected.',
  },
  {
    icon: ArrowRightLeft,
    title: 'Multi-Warehouse Management',
    description:
      'Handle transfers, movements, and operations across unlimited warehouse locations.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            The Smarter Way to Manage Supply Chains
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real-time visibility. Predictive power. Seamless control.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-[#252525] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-800 overflow-hidden"
            >
              <div className="w-14 h-14 rounded-xl bg-[#FF8C00]/20 flex items-center justify-center mb-6 group-hover:bg-[#FF8C00]/30 transition-colors duration-300">
                <feature.icon size={28} className="text-[#FF8C00]" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
