/**
 * SubscribePopup Component
 * * - Shows a modal after 1 minute.
 * - If closed, shows a floating trigger button above the WhatsApp button.
 * - Hides completely if the user successfully subscribes.
 */

import React, { useState, useEffect } from 'react';
import { X, Mail, Bell } from 'lucide-react';
import tracker from '../lib/tracker';
import { SubscribeButton } from './layout';

const POPUP_DELAY_MS = 60000; // 1 minute
const DISMISSED_KEY = 'twfs_subscribe_dismissed'; // Used to track auto-popup behavior
const SUBSCRIBED_KEY = 'twfs_subscribed';

const SubscribePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Check if already subscribed
    const subscribed = localStorage.getItem(SUBSCRIBED_KEY);
    if (subscribed) {
      setIsSubscribed(true);
      return;
    }

    // Check if previously dismissed (to decide whether to auto-open)
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    
    // Only set the auto-open timer if it hasn't been dismissed in this session
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        tracker.trackEvent('popup.show', 'subscribe-popup');
      }, POPUP_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as dismissed so it doesn't auto-open again this session
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    tracker.trackEvent('popup.dismiss', 'subscribe-popup');
  };

  const handleOpen = () => {
    setIsOpen(true);
    tracker.trackEvent('popup.open_manual', 'subscribe-fab');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      tracker.identify(email);
      localStorage.setItem(SUBSCRIBED_KEY, email);
      
      setSubmitStatus('success');
      tracker.trackEvent('form.subscribe', 'subscribe-popup', { email });

      // Close modal and mark as subscribed (hides everything)
      setTimeout(() => {
        setIsOpen(false);
        setIsSubscribed(true);
      }, 2000);
    } catch (error) {
      console.error('Subscribe error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. If user is fully subscribed, render nothing.
  if (isSubscribed) {
    return null;
  }

  // 2. If modal is NOT open, render the Floating Trigger Button (Minimized state)
  if (!isOpen) {
    return <SubscribeButton onClick={handleOpen} />;  
  }

  // 3. Render the Modal (Expanded state)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
          data-track="subscribe-popup-close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Bell size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Stay Updated!</h2>
          <p className="text-blue-100 text-sm">
            Get expert financial tips and exclusive updates delivered to your inbox.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {submitStatus === 'success' ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-medium">Thank you for subscribing!</p>
              <p className="text-slate-500 text-sm mt-1">We'll keep you updated.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                  data-track="subscribe-email-input"
                />
              </div>

              {submitStatus === 'error' && (
                <p className="text-red-500 text-sm text-center">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                data-track="subscribe-submit-btn"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </button>

              <p className="text-xs text-slate-400 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscribePopup;