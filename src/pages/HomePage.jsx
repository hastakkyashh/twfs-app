import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, PieChart, Sparkles, Target, Package, Award, UserCheck, Handshake, Smartphone, IndianRupee, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui';
import { BRAND } from '../constants';

const HomePage = ({ navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
  <div className="animate-fade-in">
    {/* Hero Section */}
    <section className="relative bg-dark-green text-white py-18 px-10 md:px-15 overflow-hidden">      
      <div className="absolute top-10 right-30 opacity-15 transform translate-x-1/4 -translate-y-1/4">
        <TrendingUp size={400} />
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-8">
        <div>
          <h1 className="text-4xl md:text-4xl font-extrabold mb-2 leading-tight text-white">
            SECURING YOUR FUTURE <br/>WITH SMART INVESTMENT <br/> & INSURANCE SOLUTIONS
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 font-light">
            Turn savings into a secure legacy 
            <br />
            with Investment and Insurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => {
              window.open('http://p.njw.bz/97660', '_blank')}} variant="secondary">
              Invest Now
            </Button>
            <Button onClick={() => {window.open('https://www.pbpartners.com/v2/partner/truewise-finsure-nagpur-Tfr', '_blank')}} variant="secondary">
              Insure Now
            </Button>
            <Button onClick={() => navigate('ai-advisor')} variant="outline" className="border-white text-white hover:bg-white hover:text-dark-green">
              <Sparkles className="w-4 h-4" /> Ask Kubera AI
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <div 
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Investment Journey Card */}
            <div 
              className={`bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl transition-all duration-700 ease-in-out ${
                currentSlide === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute top-0 left-0 w-full'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Your Investment Journey</h3>
                <p className="text-sm text-slate-300">See the power of disciplined investing</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-slate-300">Monthly SIP</span>
                  </div>
                  <p className="text-2xl font-bold">₹10,000</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-slate-300">Duration</span>
                  </div>
                  <p className="text-2xl font-bold">20 Years</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-5 rounded-lg border border-white/10 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-300">Potential Corpus</span>
                  <BarChart3 className="w-5 h-5 text-brand-orange" />
                </div>
                <p className="text-3xl font-extrabold text-light-cream mb-1">₹1.03 Cr</p>
                <p className="text-xs text-slate-300">@ 12% annual returns</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">Investment</span>
                  <span className="text-sm font-semibold">₹24L</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-[23%]"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">Returns</span>
                  <span className="text-sm font-semibold text-green-400">₹79L</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[77%]"></div>
                </div>
              </div>

              <p className="mt-6 text-xs text-slate-300 text-center">
                *Projections are for illustrative purposes only.
              </p>
            </div>

            {/* Insurance Journey Card */}
            <div 
              className={`bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl transition-all duration-700 ease-in-out ${
                currentSlide === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute top-0 left-0 w-full'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Your Insurance Journey</h3>
                <p className="text-sm text-slate-300">Secure your family's financial future</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-slate-300">Coverage</span>
                  </div>
                  <p className="text-2xl font-bold">₹1 Cr</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-xs text-slate-300">Policy Term</span>
                  </div>
                  <p className="text-2xl font-bold">30 Years</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-5 rounded-lg border border-white/10 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-300">Annual Premium</span>
                  <Shield className="w-5 h-5 text-brand-orange" />
                </div>
                <p className="text-3xl font-extrabold text-light-cream mb-1">₹12,000</p>
                <p className="text-xs text-slate-300">Term insurance for age 30</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">Total Premium (30 yrs)</span>
                  <span className="text-sm font-semibold">₹3.6L</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-400 w-[4%]"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">Life Cover</span>
                  <span className="text-sm font-semibold text-blue-400">₹1 Cr</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-400 w-[96%]"></div>
                </div>
              </div>

              <p className="mt-6 text-xs text-slate-300 text-center">
                *Projections are for illustrative purposes only.
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentSlide(0)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === 0 ? 'bg-white w-6' : 'bg-white/40'
                }`}
                aria-label="Investment slide"
              />
              <button
                onClick={() => setCurrentSlide(1)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === 1 ? 'bg-white w-6' : 'bg-white/40'
                }`}
                aria-label="Insurance slide"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Philosophy Preview */}
    <section className="py-20 bg-light-cream">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-brand-orange">Why Choose Us?</h1>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-light-cream rounded-full flex items-center justify-center mb-4">
              <Target className="text-dark-green" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Guidance</h3>
            <p className="text-slate-600">Tailored portfolios built for your goals. Our seasoned advisors craft personalized investment strategies that align with your financial aspirations and risk tolerance.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-light-cream rounded-full flex items-center justify-center mb-4">
              <Package className="text-dark-green" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">360° Solutions</h3>
            <p className="text-slate-600">A wide range of investment and insurance products under one roof. From mutual funds to life insurance, we provide comprehensive financial solutions for every need.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-light-cream rounded-full flex items-center justify-center mb-4">
              <Award className="text-dark-green" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Trusted Advice</h3>
            <p className="text-slate-600">Honest, data-backed, and ethical. We prioritize transparency and integrity, ensuring every recommendation is grounded in thorough research and your best interests.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-light-cream rounded-full flex items-center justify-center mb-4">
              <UserCheck className="text-dark-green" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Personalized Plans</h3>
            <p className="text-slate-600">Secure your future, maximize growth. Every financial plan is uniquely designed to match your life stage, income patterns, and long-term wealth objectives.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-light-cream rounded-full flex items-center justify-center mb-4">
              <Handshake className="text-dark-green" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lasting Partnership</h3>
            <p className="text-slate-600">With you for growth and beyond. We build enduring relationships, supporting you through every financial milestone and market cycle with dedicated service.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-light-cream rounded-full flex items-center justify-center mb-4">
              <Smartphone className="text-dark-green" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Digital & Human Touch</h3>
            <p className="text-slate-600">Seamless tech, expert support. Experience the convenience of digital platforms combined with personalized human guidance whenever you need it.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default HomePage;
