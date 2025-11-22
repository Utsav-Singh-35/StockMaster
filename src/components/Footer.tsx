import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative bg-[#1A1A1A] text-white py-16 overflow-hidden">
      {/* Orange gradient glow from bottom center */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-t from-[#FF8C00]/30 via-[#FF8C00]/15 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © StockMaster Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
