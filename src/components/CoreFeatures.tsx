import { motion } from 'framer-motion';
import { BarChart3, Network } from 'lucide-react';

export default function CoreFeatures() {
  return (
    <section className="py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Core Features That Drive Results
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From real-time tracking to AI-powered insights, discover the technology that keeps your supply chain moving forward.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-[#252525] border border-gray-800 rounded-2xl p-8 h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FF8C00]/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-[#FF8C00] w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Analytics Dashboard</h3>
                </div>
                <div className="bg-[#1F1F1F] rounded-xl p-6 h-64 flex items-end justify-around">
                  {[40, 60, 45, 75, 65, 85, 90, 70].map((height, i) => (
                    <div
                      key={i}
                      className="bg-[#FF8C00] rounded-t w-8"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <p className="text-center text-gray-400 font-medium mt-4">
                  Interactive Analytics Dashboard
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-[#252525] border border-gray-800 rounded-2xl p-8 h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FF8C00]/20 rounded-xl flex items-center justify-center">
                    <Network className="text-[#FF8C00] w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">System Integration</h3>
                </div>
                <div className="bg-[#1F1F1F] rounded-xl p-8 h-64 flex items-center justify-center relative">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute w-32 h-32 bg-[#FF8C00] rounded-full blur-3xl opacity-30"
                    />
                    <div className="relative w-24 h-24 bg-[#FF8C00] rounded-2xl flex items-center justify-center transform rotate-45 shadow-lg shadow-[#FF8C00]/50">
                      <div className="transform -rotate-45 text-white font-bold text-xl">SM</div>
                    </div>
                    <div className="absolute top-4 left-1/4 w-8 h-8 bg-gray-700 rounded-lg" />
                    <div className="absolute top-4 right-1/4 w-8 h-8 bg-gray-700 rounded-lg" />
                    <div className="absolute bottom-4 left-1/4 w-8 h-8 bg-gray-700 rounded-lg" />
                    <div className="absolute bottom-4 right-1/4 w-8 h-8 bg-gray-700 rounded-lg" />
                  </div>
                </div>
                <p className="text-center text-gray-400 font-medium mt-4">
                  Seamless System Integration
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

