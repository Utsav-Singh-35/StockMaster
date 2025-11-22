import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does StockMaster integrate with my existing systems?',
    answer: 'StockMaster offers seamless integration with major ERP, WMS, and logistics platforms through our REST API and pre-built connectors. You can connect systems like SAP, Oracle, Shopify, and more in minutes, ensuring real-time data synchronization across your entire supply chain.',
  },
  {
    question: 'What kind of support do you offer during setup?',
    answer: 'We provide dedicated onboarding support with a dedicated account manager, comprehensive documentation, video tutorials, and live training sessions. Our team is available 24/7 to help you get up and running quickly.',
  },
  {
    question: 'Can I track inventory across multiple warehouses?',
    answer: 'Yes, StockMaster supports unlimited warehouses and locations. You can track inventory levels, movements, transfers, and adjustments across all your warehouses in real-time from a single dashboard.',
  },
  {
    question: 'How does predictive analytics work?',
    answer: 'Our AI-powered analytics engine analyzes historical data, seasonal patterns, market trends, and current inventory levels to predict demand, identify potential stockouts, and recommend optimal reorder points. This helps you maintain optimal inventory levels while reducing costs.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use enterprise-grade security with end-to-end encryption, regular security audits, SOC 2 compliance, and GDPR compliance. Your data is stored in secure, redundant cloud infrastructure with regular backups.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Got Questions? We've Got Answers.
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From setup to advanced features, explore everything you need to know to get the most out of your supply chain solution.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#252525] border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#2A2A2A] transition-colors duration-200"
              >
                <span className="text-white font-semibold text-lg pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`text-white w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

