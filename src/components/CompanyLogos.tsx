import { motion } from 'framer-motion';

const companies = [
  { name: 'Coinbase', logo: 'Coinbase' },
  { name: 'SpaceX', logo: 'SpaceX' },
  { name: 'Upwork', logo: 'Upwork' },
  { name: 'Dropbox', logo: 'Dropbox' },
  { name: 'Webflow', logo: 'Webflow' },
  { name: 'Zoom', logo: 'Zoom' },
];

export default function CompanyLogos() {
  return (
    <section className="py-16 bg-[#1A1A1A] border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gray-300 text-lg">
            Empowering 4,000+ businesses with smarter inventory control
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-white text-xl font-semibold"
            >
              {company.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

