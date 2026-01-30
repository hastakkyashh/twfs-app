import React from "react";
import { CheckCircle } from "lucide-react";
import { BRAND } from "../../constants/brand"; 
import founderImg from "../../assets/YH_pic.png"; 

const FounderCard = ({ id, pdfSafe = false }) => {
  const InvestSvc = [
    "Mutual Funds",
    "Pre-IPO & NFO",
    "Bonds & Debentures",
    "GIFT City Products",
    "Loan Against Mutual Funds",
    "Alternative Investment Funds",
    "Portfolio Management Services", 
    "Life Insurance",
    "Health Insurance",
    "Travel Insurance",
    "Two & Four Wheeler Insurance",
    "Commercial Vehicle Insurance",
    "Pension & Guaranteed Income Plans"
  ];

  if (pdfSafe) {
    return (
      <div 
        id={id} 
        style={{
          backgroundColor: '#337b1c',
          color: '#ffffff',
          borderRadius: '12px', // Slightly reduced radius
          boxShadow: 'none', // Remove shadow for print to save ink/cleaner look
          width: '100%',     // Use 100% of the container width
          maxWidth: '800px', // Cap the width so it's not massive
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'block',
          paddingBottom: '16px' // Reduced bottom padding
        }}
      >
        {/* Founder Info + Image Section */}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ padding: '28px', width: '65%' }}> {/* Reduced padding: 40px -> 28px */}
            <h3 style={{ fontSize: '23px', fontWeight: 'bold', marginBottom: '4px' }}>{BRAND.founder}</h3> {/* Font: 30px -> 23px */}
            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '16px' }}>Founder</p> {/* Font: 20px -> 14px */}
            
            <p style={{ marginBottom: '12px', fontSize: '12px', lineHeight: '1.4', color: '#e2e8f0', fontStyle: 'italic' }}>
              "Investment and insurance should be personal, not complicated."
            </p>
            
            <p style={{ marginBottom: '16px', fontSize: '12px', lineHeight: '1.4', color: '#e2e8f0' }}>
              I founded this firm to be the transparent partner I always wished I had.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}> {/* Reduced gap: 12px -> 8px */}
              {["Client-First Approach", "Transparency & Ethics", "Long-term Focus"].map((text) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle style={{ color: '#4ade80', width: '16px', height: '16px' }} /> {/* Icon: 24px -> 16px */}
                  <span style={{ fontSize: '12px' }}>{text}</span> {/* Font: 18px -> 12px */}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ width: '35%', minHeight: '250px' }}> {/* Reduced minHeight: 400px -> 250px */}
            <img 
              src={founderImg} 
              alt={BRAND.founder} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopRightRadius: '12px' }} 
            />
          </div>
        </div>
        
        {/* Services Section */}
        <div style={{ padding: '24px', paddingTop: '0', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}> {/* Reduced padding */}
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', marginTop: '16px' }}>Our Services</h4> {/* Font: 24px -> 16px */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}> {/* Reduced gap: 16px -> 8px */}
            {InvestSvc.map((service) => (
              <div key={service} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle style={{ color: '#4ade80', width: '14px', height: '14px', flexShrink: 0 }} /> {/* Icon: 20px -> 14px */}
                <span style={{ fontSize: '11px', color: '#e2e8f0' }}>{service}</span> {/* Font: 16px -> 11px */}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Regular Tailwind version (Unchanged)
  return (
    <div id={id} className="bg-[#337b1c] text-white rounded-2xl shadow-xl overflow-hidden flex flex-col w-full max-w-4xl mx-auto"> 
      <div className="flex flex-row">
        <div className="p-10 w-[60%]">
          <h3 className="text-3xl font-bold mb-2">{BRAND.founder}</h3>
          <p className="text-xl font-medium mb-6">Founder</p>
          <p className="mb-6 leading-relaxed text-slate-200 italic">
            "Investment and insurance should be personal, not complicated."
          </p>
          <p className="mb-6 leading-relaxed text-slate-200">
            I founded this firm to be the transparent partner I always wished I had.
          </p>
          <div className="space-y-3">
            {["Client-First Approach", "Transparency & Ethics", "Long-term Focus"].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-6 h-6" />
                <span className="text-lg">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[40%] min-h-[400px]">
          <img src={founderImg} alt={BRAND.founder} className="w-full h-full object-cover" />
        </div>
      </div>
      
      <div className="p-10 pt-0 border-t border-white/20">
        <h4 className="text-2xl font-bold mb-5 mt-5">Our Services</h4>
        <div className="grid grid-cols-2 gap-4">
          {InvestSvc.map((service) => (
            <div key={service} className="flex items-center gap-3">
              <CheckCircle className="text-green-400 w-5 h-5 shrink-0" />
              <span className="text-base text-slate-200">{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FounderCard;