
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Instagram } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="border-b border-vsrk-gold/20 bg-vsrk-beige/80 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="container mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl sm:text-3xl font-serif font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200" onClick={closeMenu}>
          VSRK Collections
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        )}

        {/* Desktop Navigation */}
        <nav className={cn(
          "md:flex items-center space-x-8",
          isMobile ? "hidden" : "flex"
        )}>
          <Link to="/" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">Home</Link>
          <Link to="/gallery" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">Gallery</Link>
          <Link to="/about" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">About</Link>
          <Link to="/contact" className="font-medium text-vsrk-dark hover:text-vsrk-gold transition duration-200">Contact</Link>
          <a 
            href="https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-vsrk-dark hover:text-vsrk-gold transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
        </nav>

        {/* Mobile Menu — dropdown below navbar */}
        {isMobile && isOpen && (
          <div className="absolute top-full left-0 right-0 bg-vsrk-light border-t border-vsrk-gold/20 shadow-lg z-50">
            <nav className="flex flex-col divide-y divide-vsrk-gold/10">
              <Link to="/" className="px-6 py-4 font-medium text-vsrk-dark hover:text-vsrk-gold hover:bg-vsrk-gold/5 transition-colors" onClick={closeMenu}>Home</Link>
              <Link to="/gallery" className="px-6 py-4 font-medium text-vsrk-dark hover:text-vsrk-gold hover:bg-vsrk-gold/5 transition-colors" onClick={closeMenu}>Gallery</Link>
              <Link to="/about" className="px-6 py-4 font-medium text-vsrk-dark hover:text-vsrk-gold hover:bg-vsrk-gold/5 transition-colors" onClick={closeMenu}>About</Link>
              <Link to="/contact" className="px-6 py-4 font-medium text-vsrk-dark hover:text-vsrk-gold hover:bg-vsrk-gold/5 transition-colors" onClick={closeMenu}>Contact</Link>
              <a
                href="https://www.instagram.com/vsrk.collections/?igsh=cGNiZGVmb2R3MGgy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 flex items-center gap-2 font-medium text-vsrk-dark hover:text-vsrk-gold hover:bg-vsrk-gold/5 transition-colors"
                onClick={closeMenu}
              >
                <Instagram size={18} /> Instagram
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
