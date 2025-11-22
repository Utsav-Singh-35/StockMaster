import { motion } from 'framer-motion';
import { Package, TrendingUp, AlertTriangle, RotateCcw } from 'lucide-react';

export default function SmartManagement() {
  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Product Management",
      description: "Create and manage products with SKU codes, categories, and units of measure. Track stock levels across multiple locations."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Stock Operations",
      description: "Handle receipts, deliveries, and internal transfers with automated stock updates and comprehensive logging."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Smart Alerts",
      description: "Get notified about low stock levels, pending operations, and inventory discrepancies before they become problems."
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Stock Adjustments",
      description: "Easily reconcile physical counts with recorded stock and maintain accurate inventory records."
    }
  ];

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
            The Smarter Way to Manage
            <br />
            <span className="text-orange-500">Your Inventory</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Replace manual tracking with a digital solution that provides real-time visibility, 
            automated workflows, and comprehensive inventory control.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}