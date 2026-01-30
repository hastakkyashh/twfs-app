import React, { useState } from 'react';

const PartnerCarousel = () => {
  const [isPaused, setIsPaused] = useState(false);

  const partners = [
    { name: 'Renewbuy', logo: '/renewbuy-logo.png' },
    { name: 'PolicyBazaar', logo: '/policybazaar-logo.png' },
    { name: 'NJ Wealth', logo: '/njwealth-logo.png' }
  ];

  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="w-full bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-2">
          Our Trusted Partners
        </h3>
        <p className="text-center text-slate-600">
          Collaborating with industry leaders to serve you better
        </p>
      </div>
      
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex gap-16 animate-scroll-left" style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
          {duplicatedPartners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-48 h-24 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain transition-all"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="text-slate-700 font-semibold text-lg">${partner.name}</span>`;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </div>
  );
};

export default PartnerCarousel;
