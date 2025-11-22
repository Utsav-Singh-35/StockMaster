import { motion } from 'framer-motion';
import { Database, Box, Truck, Package, ShoppingCart, FileText, Zap, Globe, Server, Cloud, BarChart, Users } from 'lucide-react';

const integrations = [
  { icon: Database, name: 'ERP' },
  { icon: Box, name: 'WMS' },
  { icon: Truck, name: 'Logistics' },
  { icon: Package, name: 'E-Commerce' },
  { icon: ShoppingCart, name: 'Retail' },
  { icon: FileText, name: 'Accounting' },
  { icon: Zap, name: 'Automation' },
  { icon: Globe, name: 'Global' },
  { icon: Server, name: 'Cloud' },
  { icon: Cloud, name: 'SaaS' },
  { icon: BarChart, name: 'Analytics' },
  { icon: Users, name: 'CRM' },
  { icon: Database, name: 'Database' },
  { icon: Box, name: 'Inventory' },
  { icon: Truck, name: 'Shipping' },
];

export default function Integrations() {
  const centerIndex = Math.floor(integrations.length / 2);

  return (
    <section className="py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Unified integrations that make teamwork effortless
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Connect your ERP, WMS, and logistics platforms in one place. Share data instantly across teams and partners to keep everyone aligned, informed, and moving forward without friction.
          </p>
        </motion.div>

        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto mb-8">
          {integrations.map((integration, index) => {
            const isCenter = index === centerIndex;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className={`relative ${isCenter ? 'col-span-1 md:col-span-1' : ''}`}
              >
                {isCenter ? (
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.7, 0.4],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-[#FF8C00] rounded-2xl blur-2xl"
                    />
                    <div className="relative w-full aspect-square bg-[#FF8C00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF8C00]/50 transform rotate-45">
                      <div className="transform -rotate-45 text-white font-bold text-lg">SM</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-[#252525] border border-gray-800 rounded-2xl flex items-center justify-center hover:border-gray-700 transition-colors duration-300">
                    <integration.icon className="text-gray-400 w-6 h-6 md:w-8 md:h-8" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-right"
        >
          <button className="px-6 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-[#FF9500] transition-all duration-300 font-semibold inline-flex items-center gap-2">
            See All Integrations
            <span>→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

