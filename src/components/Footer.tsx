import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Dashboard', 'Analytics', 'Pricing'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Help Center', 'Documentation', 'API Reference', 'Community'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-6 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-white">StockMaster</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Intelligent inventory management solutions for modern businesses. 
              Replace manual tracking with real-time, automated stock control.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
              >
                <Linkedin size={18} className="text-gray-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
              >
                <Twitter size={18} className="text-gray-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
              >
                <Github size={18} className="text-gray-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
              >
                <Mail size={18} className="text-gray-300" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-white">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 StockMaster — Intelligent Inventory Management Solutions
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <span>All rights reserved</span>
            <span>•</span>
            <span>Made with ❤️ for inventory professionals</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
