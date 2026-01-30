import React, { useState } from "react";
import { Phone, Mail, ArrowRight, Lock, LogOut } from "lucide-react";
import {
  FaInstagram,
  FaXTwitter,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaThreads,
} from "react-icons/fa6";
import {
  BRAND,
  DISCLAIMER_TEXT,
  INSURANCE_DISCLAIMER_TEXT,
} from "../../constants";
import { useAuth } from "../../contexts/AuthContext";
import AdminLoginModal from "../AdminLoginModal";

const Footer = ({ setCurrentPage }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

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
  ];

  return (
    <footer className="bg-dark-green text-light-cream py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8 border-b border-slate-800 pb-8">
        <div className="md:col-span-1">
          {/* <p className="text-xs text-brand-orange">{BRAND.amfi_status}</p> */}

          <h4 className="text-white font-bold mb-3">Quick Links</h4>
          <ul className="space-y-1.5 text-sm">
            <li>
              <button
                onClick={() => setCurrentPage("home")}
                className="hover:text-brand-orange"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage("about")}
                className="hover:text-brand-orange"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage("services")}
                className="hover:text-brand-orange"
              >
                Our Services
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage("calculator")}
                className="hover:text-brand-orange"
              >
                Financial Calculators
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage("ai-advisor")}
                className="hover:text-brand-orange"
              >
                Kubera AI
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage("contact")}
                className="hover:text-brand-orange"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3">Investment Solutions</h4>
          <ul className="space-y-1.5 text-sm">
            <li>Mutual Funds</li>
            <li>Pre-IPO & NFO</li>
            <li>Bonds & Debentures</li>
            <li>GIFT City Products</li>
            <li>Loan Against Mutual Funds</li>
            <li>Alternative Investment Funds</li>
            <li>Portfolio Management Services</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3">Insurance Solutions</h4>
          <ul className="space-y-1.5 text-sm">
            <li>Life Insurance</li>
            <li>Health Insurance</li>
            <li>Travel Insurance</li>
            <li>Two & Four Wheeler Insurance</li>
            <li>Commercial Vehicle Insurance</li>
            <li>Pension & Guaranteed Income Plans</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3">Contact</h4>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={14} /> {BRAND.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} /> {BRAND.email}
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={14} /> {BRAND.website}
            </li>
          </ul>

          <div className="flex gap-4 mt-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-orange transition-colors cursor-pointer"
                title={`Visit our ${link.label}`}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Regulatory Disclaimer */}
      <div className="max-w-6xl mx-auto">
        <div className="p-4 rounded-lg mb-6">
          <span className="text-2xl font-bold text-brand-cream mb-2 block text-center">
            TrueWise FinSure
          </span>
          <p className="p-2 text-xl font-normal text-center">
            Securing your future with smart investment & insurance
            solutions{" "}
          </p>
          <p className="text-sm font-normal text-center">{BRAND.amfi_status}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto justify-center">
        <div className="p-4 rounded-lg mb-6">
          <p className="text-xs leading-relaxed text-white-400">
            <strong>Disclaimer:</strong> {DISCLAIMER_TEXT}
          </p>
          <p className="text-xs leading-relaxed text-white-400">
            <strong>Disclaimer: </strong>
            {INSURANCE_DISCLAIMER_TEXT}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex flex-col text-center md:text-left mb-2 md:mb-0">
            <p className="text-2xs leading-relaxed text-white-400">
              TrueWise FinSure is a proprietorship concern of Yash Anil Hastak.
            </p>
            <p>
              &copy; {new Date().getFullYear()} TrueWise FinSure. All rights
              reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 justify-center">
            <span
              onClick={() => setCurrentPage("privacy-policy")}
              className="hover:text-brand-orange transition-colors cursor-pointer"
            >
              Privacy Policy
            </span>
            <span>|</span>
            <span
              onClick={() => setCurrentPage("terms-conditions")}
              className="hover:text-brand-orange transition-colors cursor-pointer"
            >
              Terms & Conditions
            </span>
            <span>|</span>
            <span
              onClick={() => setCurrentPage("disclosure")}
              className="hover:text-brand-orange transition-colors cursor-pointer"
            >
              Disclosure
            </span>
            <span>|</span>
            <a
              href="https://www.sebi.gov.in/filings/mutual-funds.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              SID/SAI/KIM
            </a>
            <span>|</span>
            <a
              href="https://www.amfiindia.com/Themes/Theme1/downloads/RevisedCodeofConductforMutualFundDistributors-April2022.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              Code of Conduct
            </a>
            <span>|</span>
            <a
              href="https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=7&smid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              SEBI Circulars
            </a>
            <span>|</span>
            <a
              href="https://www.amfiindia.com/investor/knowledge-center-info?zoneName=riskInMutualFunds"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              AMFI Risk Factors
            </a>
            <span>|</span>
            {isAuthenticated ? (
              <>
                <span className="flex items-center gap-1 text-brand-orange">
                  <Lock size={12} /> Admin: {user?.username}
                </span>
                <span>|</span>
                <span
                  onClick={logout}
                  className="hover:text-brand-orange transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut size={12} /> Logout
                </span>
                <span>|</span>
              </>
            ) : (
              <>
                <span
                  onClick={() => setShowLoginModal(true)}
                  className="hover:text-brand-orange transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Lock size={12} /> Admin Login
                </span>
                <span>|</span>
              </>
            )}
          </div>
        </div>
      </div>
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </footer>
  );
};

export default Footer;
