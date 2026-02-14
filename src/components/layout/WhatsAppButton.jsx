import React from 'react';
import { Send } from 'lucide-react';
import { BRAND } from '../../constants';

const WhatsAppButton = () => {
  return (
    <a 
      href={`https://wa.me/91${BRAND.phone}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-12 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all z-50 flex items-center justify-center animate-bounce"
      aria-label="Chat on WhatsApp"
      data-track="floating-whatsapp-btn"
    >
      <Send size={24} />
    </a>
  );
};

export default WhatsAppButton;
