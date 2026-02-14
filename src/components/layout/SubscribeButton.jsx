/**
 * SubscribeButton Component
 * 
 * Floating action button for newsletter subscription.
 * Positioned above the WhatsApp button.
 */

import React from 'react';
import { Mail } from 'lucide-react';

const SubscribeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-12 left-6 bg-brand-orange hover:bg-brand-gold text-white p-4 rounded-full shadow-2xl transition-all z-40 flex items-center justify-center group animate-bounce"
      aria-label="Subscribe to newsletter"
      data-track="subscribe-fab-btn"
    >
      <Mail size={24} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2">
        Subscribe
      </span>
    </button>
  );
};

export default SubscribeButton;
