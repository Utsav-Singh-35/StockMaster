import { motion } from 'framer-motion';
import { Download, ArrowRightLeft, Truck, Settings } from 'lucide-react';

const steps = [
  {
    icon: Download,
    title: 'Receive Goods',
    description: 'Log incoming stock from vendors with automated PO matching',
    color: 'indigo',
  },
  {
    icon: ArrowRightLeft,
    title: 'Internal Transfer',
    description: 'Move inventory between warehouses and optimize distribution',
    color: 'purple',
  },
  {
    icon: Truck,
    title: 'Deliver Goods',
    description: 'Process outbound shipments and update stock levels',
    color: 'pink',
  },
  {
    icon: Settings,
    title: 'Adjust Stock',
    description: 'Handle corrections, damages, and manual adjustments',
    color: 'rose',
  },
];

const colorMap: Record<string, string> = {
  indigo: 'from-indigo-500 to-indigo-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  rose: 'from-rose-500 to-rose-600',
};

export default function Workflow() {
  return (
    <section id="workflow" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Streamlined workflow for complete inventory control
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative z-10 h-full"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                    colorMap[step.color]
                  } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <step.icon size={28} className="text-white" />
                </div>

                <div className="mb-3">
                  <span className="text-sm font-semibold text-slate-400">
                    STEP {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className="hidden md:block absolute top-1/3 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 z-0"
                  style={{ transformOrigin: 'left' }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <p className="text-lg text-slate-700 mb-4">
              All operations are tracked in real-time with complete audit trails
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
              See It In Action
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
