import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A1A1A] pt-32">
      {/* Orange gradient glow from bottom center */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-t from-[#FF8C00]/40 via-[#FF8C00]/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight"
          >
            Your Inventory Management,{' '}
            <span className="text-[#FF8C00]">Secured And Streamlined</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Track movements, predict disruptions, and keep operations running without interruption.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-4"
          >
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-[#FF8C00] text-white rounded-lg hover:bg-[#FF9500] hover:shadow-lg hover:shadow-[#FF8C00]/30 transition-all duration-300 font-semibold text-lg"
            >
              Start Monitoring Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
