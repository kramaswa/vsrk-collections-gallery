
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';
import { useWhatsAppNumber } from '@/hooks/useWhatsAppNumber';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const whatsappNumber = useWhatsAppNumber();

  return (
    <footer className="bg-vsrk-dark text-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl mb-3 text-vsrk-gold">VSRK Collections</h3>
            <p className="text-gray-300 text-sm mb-5 leading-relaxed">
              Curated South Indian jewelry from trusted vendors and artisans. Every piece personally handpicked.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-vsrk-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-vsrk-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={22} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl mb-4 text-vsrk-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-vsrk-gold transition-colors">Home</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-vsrk-gold transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-vsrk-gold transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-vsrk-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl mb-4 text-vsrk-gold">Get in Touch</h3>
            <p className="text-gray-300 text-sm mb-3">
              See something you like? Reach out on WhatsApp and we'll take it from there.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'm interested in your jewelry collection.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-vsrk-gold hover:text-white transition-colors text-sm font-medium"
            >
              <MessageCircle size={16} /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-500 text-sm">
          <p>© {year} VSRK Collections. All rights reserved.</p>
          <Link to="/admin" className="hover:text-vsrk-gold transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
