import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does StockMaster track inventory movements?",
      answer: "StockMaster automatically tracks all inventory movements through receipts, deliveries, transfers, and adjustments. Every transaction is logged in the stock ledger with timestamps, user information, and complete traceability for audit purposes."
    },
    {
      question: "Can I manage multiple warehouses with StockMaster?",
      answer: "Yes! StockMaster supports multi-warehouse operations. You can track stock levels per location, transfer items between warehouses, and get consolidated reports across all your facilities."
    },
    {
      question: "What happens when I receive goods from suppliers?",
      answer: "When you create a receipt in StockMaster, you add the supplier details and products received. Once validated, the system automatically increases your stock levels and creates a complete record of the transaction."
    },
    {
      question: "How do I handle stock discrepancies?",
      answer: "StockMaster includes a stock adjustment feature that lets you reconcile physical counts with recorded stock. Simply enter the actual counted quantity, and the system will automatically adjust your inventory and log the discrepancy."
    },
    {
      question: "Does StockMaster provide alerts for low stock?",
      answer: "Yes! StockMaster monitors your inventory levels and sends alerts when items fall below your defined thresholds. You can set custom reorder points for each product to ensure you never run out of critical items."
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Got Questions?
            <br />
            <span className="text-orange-500">We've Got Answers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300"
          >
            Find answers to common questions about StockMaster inventory management.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-orange-500 transition-transform duration-200 flex-shrink-0 ${
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
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">
            Still have questions? We're here to help.
          </p>
          <a
            href="mailto:support@stockmaster.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 font-semibold"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}