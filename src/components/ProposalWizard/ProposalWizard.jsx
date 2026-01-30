import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LandingStep from './steps/LandingStep';
import InvestorStep from './steps/InvestorStep';
import ObjectiveStep from './steps/ObjectiveStep';
import HorizonStep from './steps/HorizonStep';
import InvestmentStep from './steps/InvestmentStep';
import ResultStep from './steps/ResultStep';

const ProposalWizard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientAge: '',
    objective: '',
    horizon: 10,
    lumpsum: 0,
    monthlySIP: 0,
    stepUpPercentage: 0,
    selectedStrategies: [],
    advisorName: '',
    advisorEmail: '',
    advisorMobile: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LandingStep onNext={nextStep} />;
      case 2:
        return (
          <InvestorStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ObjectiveStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <HorizonStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <InvestmentStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <ResultStep
            formData={formData}
            updateFormData={updateFormData}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-green to-light-cream px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Lock className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-gray-700 text-left">
              The Proposal Wizard is restricted to authorized administrators only. Please log in using the Admin Login button in the footer to access this feature.
            </p>
          </div>
          <p className="text-gray-600 text-sm">
            If you are an administrator and need access, please contact the system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="print:hidden min-h-screen" style={{ background: 'linear-gradient(to bottom right, #ecf4e4, #ffffff, #fef3e2)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all"
                    style={{
                      backgroundColor: currentStep >= step ? '#73b030' : '#e5e7eb',
                      color: currentStep >= step ? 'white' : '#6b7280'
                    }}
                  >
                    {step}
                  </div>
                  {step < 6 && (
                    <div
                      className="w-16 h-1 mx-2 transition-all"
                      style={{
                        backgroundColor: currentStep > step ? '#73b030' : '#e5e7eb'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ProposalWizard;
