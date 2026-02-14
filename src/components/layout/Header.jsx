import React, { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaFacebook, FaWhatsapp, FaTelegram, FaThreads, FaYoutube } from 'react-icons/fa6';
import { BRAND, NAV_LINKS } from '../../constants';

const Header = ({ currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  const handleCallNow = () => {
    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, open phone dialer
      window.location.href = `tel:+91${BRAND.phone}`;
    } else {
      // On desktop, navigate to contact page
      handleNavigation('contact');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark-green text-light-cream text-xs py-2 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="Instagram" data-track="header-social-instagram">
              <FaInstagram size={14} />
            </a>
            <a href={BRAND.X} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="X" data-track="header-social-x">
              <FaXTwitter size={14} />
            </a>
            <a href={BRAND.Facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="Facebook" data-track="header-social-facebook">
              <FaFacebook size={14} />
            </a>
            <a href={`https://wa.me/91${BRAND.phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="WhatsApp" data-track="header-social-whatsapp">
              <FaWhatsapp size={14} />
            </a>
            <a href={BRAND.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="Telegram" data-track="header-social-telegram">
              <FaTelegram size={14} />
            </a>
            <a href={BRAND.threads} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="Threads" data-track="header-social-threads">
              <FaThreads size={14} />
            </a>
            <a href={BRAND.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="YouTube" data-track="header-social-youtube">
              <FaYoutube size={14} />
            </a>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Phone size={12} /> {BRAND.phone}</span>
            <span className="flex items-center gap-1"><Mail size={12} /> {BRAND.email}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-light-cream shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* --- LOGO SECTION CHANGES HERE --- */}
          <div 
            className="flex flex-col items-center cursor-pointer" 
            onClick={() => handleNavigation('home')}
          >
            <img src="logoTWFS.png" alt="Logo" className="h-20 w-auto" />
          </div>
          {/* --- END LOGO SECTION CHANGES --- */}

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavigation(link.id)}
                className={`text-base font-medium hover:text-primary-green transition-colors flex items-center gap-1 ${
                  currentPage === link.id ? 'text-dark-green border-b-2 border-primary-green' : 'text-slate-600'
                }`}
                data-track={`header-nav-${link.id}`}
              >
                {link.label}
              </button>
            ))}
            <button 
              onClick={handleCallNow}
              className="bg-dark-green text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary-green transition-colors"
              data-track="header-cta-call-now"
            >
              Call Now
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-light-cream border-t border-slate-100 absolute w-full shadow-lg">
            <div className="flex flex-col p-4">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.id)}
                  className={`text-left py-3 px-2 border-b border-slate-50 ${
                     currentPage === link.id ? 'text-dark-green font-bold bg-light-cream' : 'text-slate-600'
                  }`}
                  data-track={`header-nav-${link.id}`}
                  >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;