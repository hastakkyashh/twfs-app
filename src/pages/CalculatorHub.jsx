import React from 'react';
import { Calculator, TrendingUp, PiggyBank, Target, Home, Briefcase, GraduationCap, FileText, Dumbbell, PersonStanding, HeartHandshake, Hourglass, ShieldPlus, Activity } from 'lucide-react';
import { SectionTitle } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const CalculatorHub = ({ navigate = () => {} }) => {
  const { isAuthenticated } = useAuth();
  const calculators = [
    {
      id: 'proposal-wizard',
      title: 'Proposal Wizard',
      description: 'Create comprehensive investment proposals with asset allocation strategies and projections.',
      icon: FileText,
      available: true,
      adminOnly: true
    },
    {
      id: 'otel-logs',
      title: 'OTel Logs',
      description: 'View user behavior analytics, sessions, events, and subscriber activity dashboard.',
      icon: Activity,
      available: true,
      adminOnly: true
    },
    {
      id: 'sip-calculator',
      title: 'SIP Calculator',
      description: 'Calculate returns on your Systematic Investment Plan with the power of compounding.',
      icon: TrendingUp,
      available: true
    },
    {
      id: 'lumpsum-calculator',
      title: 'Lumpsum Calculator',
      description: 'Estimate returns on one-time investments in mutual funds.',
      icon: PiggyBank,
      available: true
    },
    {
      id: 'sip-stepup-calculator',
      title: 'SIP Step-Up',
      description: 'Calculate returns with annual SIP increase to accelerate wealth creation.',
      icon: TrendingUp,
      available: true
    },
    {
      id: 'sip-planner-calculator',
      title: 'SIP Planner',
      description: 'Find the monthly SIP needed to reach your target amount.',
      icon: Target,
      available: true
    },
    {
      id: 'sip-tenure-calculator',
      title: 'SIP Tenure',
      description: 'Calculate how long it takes to reach your goal with current SIP.',
      icon: Calculator,
      available: true
    },
    {
      id: 'cost-of-delay-calculator',
      title: 'Cost of Delay',
      description: 'See how delaying your investment affects your wealth accumulation.',
      icon: TrendingUp,
      available: true
    },
    {
      id: 'retirement-calculator',
      title: 'Retirement Planning',
      description: 'Plan your retirement corpus and monthly savings required.',
      icon: Briefcase,
      available: true
    },
    {
      id: 'education-calculator',
      title: 'Education Planning',
      description: 'Plan for your child\'s education expenses with inflation adjustment.',
      icon: GraduationCap,
      available: true
    },
    {
      id: 'marriage-calculator',
      title: 'Marriage Planning',
      description: 'Plan for your child\'s wedding expenses systematically.',
      icon: Target,
      available: true
    },
    {
      id: 'emi-calculator',
      title: 'EMI Calculator',
      description: 'Calculate your loan EMI and total interest payable.',
      icon: Home,
      available: true
    },
    {
      id: 'swp-calculator',
      title: 'SWP Planner',
      description: 'Plan systematic withdrawals for regular income from your investments.',
      icon: PiggyBank,
      available: true
    },
    {
      id: 'stp-calculator',
      title: 'STP Planner',
      description: 'Gradually transfer from debt to equity funds systematically.',
      icon: Calculator,
      available: true
    },
    {
      id: 'bmi-calculator',
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and health status.',
      icon: Dumbbell,
      available: true
    },
    {
      id: 'human-life-value-calculator',
      title: 'Human Life Value Calculator',
      description: 'Calculate returns on market-linked insurance investments.',
      icon: PersonStanding,
      available: true
    },
    {
      id: 'pension-calculator',
      title: 'Pension Calculator',
      description: 'Calculate returns on market-linked insurance investments.',
      icon: Hourglass,
      available: true
    }
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
      <SectionTitle 
        title="Financial Calculators" 
        subtitle="Smart tools to plan your financial journey"
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators
          .filter(calc => !calc.adminOnly || isAuthenticated)
          .map((calc) => {
          const IconComponent = calc.icon;
          return (
            <div
              key={calc.id}
              onClick={() => calc.available && navigate(calc.id)}
              className={`bg-white p-8 rounded-xl shadow-sm border border-slate-100 transition-all group ${
                calc.available 
                  ? 'hover:border-primary-green hover:shadow-lg cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              data-track={`calc-card-${calc.id}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  calc.available 
                    ? 'bg-light-cream group-hover:bg-primary-green/20' 
                    : 'bg-slate-100'
                }`}>
                  <IconComponent className={`w-8 h-8 transition-colors ${
                    calc.available 
                      ? 'text-primary-green group-hover:text-dark-green' 
                      : 'text-slate-400'
                  }`} />
                </div>
                
                <h3 className={`text-xl font-bold mb-2 transition-colors ${
                  calc.available 
                    ? 'text-slate-900 group-hover:text-dark-green' 
                    : 'text-slate-500'
                }`}>
                  {calc.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {calc.description}
                </p>
                
                {calc.available && (
                  <div className="mt-4 text-primary-green text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    <Calculator className="w-4 h-4" />
                    <span>Calculate Now</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-light-cream border-l-4 border-primary-green p-6 rounded-lg">
        <h4 className="font-bold text-dark-green mb-2">💡 Pro Tip</h4>
        <p className="text-slate-700 text-sm">
          These calculators provide estimates based on assumed rates of return. Actual returns may vary depending on market conditions. 
          Use these tools for planning purposes and consult with us for personalized advice.
        </p>
      </div>
    </section>
  );
};

export default CalculatorHub;
