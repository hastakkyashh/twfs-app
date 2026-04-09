import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import {
  FaInstagram,
  FaXTwitter,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaThreads,
  FaYoutube,
} from "react-icons/fa6";
import { BRAND, NAV_LINKS } from "../../constants";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const socialLinks = [
    { label: "Instagram", url: BRAND.instagram, icon: FaInstagram },
    { label: "X", url: BRAND.X, icon: FaXTwitter },
    { label: "Facebook", url: BRAND.Facebook, icon: FaFacebook },
    {
      label: "WhatsApp",
      url: `https://wa.me/91${BRAND.phone}`,
      icon: FaWhatsapp,
    },
    { label: "Telegram", url: BRAND.telegram, icon: FaTelegram },
    { label: "Threads", url: BRAND.threads, icon: FaThreads },
    { label: "YouTube", url: BRAND.youtube, icon: FaYoutube },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleCallNow = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `tel:+91${BRAND.phone}`;
    } else {
      handleNavigation("/contact");
    }
  };

  return (
    <>
      <div className="bg-dark-green text-light-cream text-xs py-2 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-3 items-center">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-orange transition-colors"
                title={link.label}
                data-track={`header-social-${link.label.toLowerCase()}`}
              >
                <link.icon size={14} />
              </a>
            ))}
          </div>
          
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} /> {BRAND.phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail size={12} /> {BRAND.email}
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-light-cream shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex flex-col items-center">
            <img src="logoTWFS.webp" alt="Logo" className="h-20 w-auto" />
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.id}
                to={link.id === 'home' ? '/' : `/${link.id}`}
                className={({ isActive }) => `text-base font-medium hover:text-primary-green transition-colors flex items-center gap-1 ${
                  isActive
                    ? "text-dark-green border-b-2 border-primary-green"
                    : "text-slate-600"
                }`}
                data-track={`header-nav-${link.id}`}
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleCallNow}
              className="bg-dark-green text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary-green transition-colors"
              data-track="header-cta-call-now"
            >
              Call Now
            </button>
          </nav>

          <button
            className="md:hidden text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-light-cream border-t border-slate-100 absolute w-full shadow-lg">
            <div className="flex flex-col p-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.id === 'home' ? '/' : `/${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `text-left py-3 px-2 border-b border-slate-50 ${
                    isActive
                      ? "text-dark-green font-bold bg-light-cream"
                      : "text-slate-600"
                  }`}
                  data-track={`header-nav-${link.id}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
