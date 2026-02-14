import React, { useState, useEffect } from 'react';
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
  OTelLogsPage
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

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const pagePath = `/${currentPage}`;
    
    ReactGA.send({ 
      hitType: "pageview", 
      page: pagePath, 
      title: currentPage.charAt(0).toUpperCase() + currentPage.slice(1) 
    });
  }, [currentPage]);

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage navigate={setCurrentPage} />;
      case 'about': return <AboutPage />;
      case 'services': return <ServicesPage />;
      case 'education': return <EducationPage />;
      case 'ai-advisor': return <AIAssistantPage />;
      case 'calculator': return <CalculatorHub navigate={setCurrentPage} />;
      case 'proposal-wizard': return <ProposalWizard />;
      case 'proposal-preview': return <ProposalPreview />;
      case 'proposal-edit-form': return <ProposalEditForm />;
      case 'sip-calculator': return <SIPCalculator />;
      case 'lumpsum-calculator': return <LumpsumCalculator />;
      case 'retirement-calculator': return <RetirementCalculator />;
      case 'emi-calculator': return <EMICalculator />;
      case 'cost-of-delay-calculator': return <CostOfDelayCalculator />;
      case 'education-calculator': return <EducationCalculator />;
      case 'marriage-calculator': return <MarriageCalculator />;
      case 'sip-tenure-calculator': return <SIPTenureCalculator />;
      case 'sip-stepup-calculator': return <SIPStepUpCalculator />;
      case 'sip-planner-calculator': return <SIPPlannerCalculator />;
      case 'stp-calculator': return <STPCalculator />;
      case 'swp-calculator': return <SWPCalculator />;
      case 'human-life-value-calculator': return <HumanLifeValueCalculator />;
      case 'pension-calculator': return <PensionCalculator />;
      case 'bmi-calculator': return <BMICalculator />;
      case 'contact': return <ContactPage />;
      case 'blogs': return <BlogsPage navigate={setCurrentPage} />;
      case 'privacy-policy': return <PrivacyPolicyPage />;
      case 'terms-conditions': return <TermsConditionsPage />;
      case 'disclosure': return <DisclosurePage />;
      case 'otel-logs': return <OTelLogsPage />;
      default: {
        if (currentPage.startsWith('blog-detail-')) {
          const blogId = currentPage.replace('blog-detail-', '');
          return <BlogDetailPage navigate={setCurrentPage} blogId={blogId} />;
        }
        return <HomePage navigate={setCurrentPage} />;
      }
    }
  };

  const isFormPage = currentPage === 'proposal-edit-form';

return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {!isFormPage && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      {!isFormPage && (
        <>
          <Footer setCurrentPage={setCurrentPage} />
          <WhatsAppButton />
          <SubscribePopup />
        </>
      )}
    </div>
  );
};
export default App;
