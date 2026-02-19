/*
[file] App.jsx
[role] Map the URL routes to Page components.
[description] 
- React Router Integration
- Global Layout Manager (Header, Footer, WhatsApp Button, Subscribe Popup)
- Google Analytics Integration
- Page Navigation and State Management
- Component Rendering
- Event Tracking via tracker.js
- Scroll Restoration
[Internal]- 'lib/tracker' (Custom Telemetry), All Page & Calculator components.
[External]- 'react-ga4' (Google Analytics), 'react-router-dom' (Routing).

*/

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, WhatsAppButton } from './components/layout';
import tracker from './lib/tracker';
import SubscribePopup from './components/SubscribePopup';
import {
  HomePage,
  AboutPage,
  ServicesPage,
  EducationPage,
  ContactPage,
  AIAssistantPage,
  CalculatorHub,
  PrivacyPolicyPage,
  TermsConditionsPage,
  DisclosurePage,
  BlogsPage,
  BlogDetailPage,
  TeleLogsPage
} from './pages';
import ProposalWizard from './components/ProposalWizard';
import ProposalEditForm from './pages/ProposalEditForm';
import {
  LumpsumCalculator,
  RetirementCalculator,
  EMICalculator,
  SIPCalculator,
  CostOfDelayCalculator,
  EducationCalculator,
  MarriageCalculator,
  SIPTenureCalculator,
  SIPStepUpCalculator,
  SIPPlannerCalculator,
  STPCalculator,
  SWPCalculator,
  HumanLifeValueCalculator,
  PensionCalculator,
  BMICalculator
} from './pages/calculators';
import ReactGA from "react-ga4";

// Initialize tracker on module load
tracker.init();

// Component to handle scroll restoration and analytics
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const pagePath = location.pathname;
    const pageTitle = pagePath.split('/').filter(Boolean)[0] || 'home';
    
    ReactGA.send({ 
      hitType: "pageview", 
      page: pagePath, 
      title: pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1) 
    });
  }, [location.pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isFormPage = location.pathname === '/proposal-edit-form';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <ScrollToTop />
      {!isFormPage && <Header />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/ai-advisor" element={<AIAssistantPage />} />
          <Route path="/calculator" element={<CalculatorHub />} />
          <Route path="/proposal-wizard" element={<ProposalWizard />} />
          <Route path="/proposal-edit-form" element={<ProposalEditForm />} />
          <Route path="/sip-calculator" element={<SIPCalculator />} />
          <Route path="/lumpsum-calculator" element={<LumpsumCalculator />} />
          <Route path="/retirement-calculator" element={<RetirementCalculator />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/cost-of-delay-calculator" element={<CostOfDelayCalculator />} />
          <Route path="/education-calculator" element={<EducationCalculator />} />
          <Route path="/marriage-calculator" element={<MarriageCalculator />} />
          <Route path="/sip-tenure-calculator" element={<SIPTenureCalculator />} />
          <Route path="/sip-stepup-calculator" element={<SIPStepUpCalculator />} />
          <Route path="/sip-planner-calculator" element={<SIPPlannerCalculator />} />
          <Route path="/stp-calculator" element={<STPCalculator />} />
          <Route path="/swp-calculator" element={<SWPCalculator />} />
          <Route path="/human-life-value-calculator" element={<HumanLifeValueCalculator />} />
          <Route path="/pension-calculator" element={<PensionCalculator />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:blogId" element={<BlogDetailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/disclosure" element={<DisclosurePage />} />
          <Route path="/tele-logs" element={<TeleLogsPage />} />
        </Routes>
      </main>

      {!isFormPage && (
        <>
          <Footer />
          <WhatsAppButton />
          <SubscribePopup />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
