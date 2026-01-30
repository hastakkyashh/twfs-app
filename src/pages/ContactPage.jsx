import React, { useState } from 'react'; // 1. Import useState
import { User, Phone, Mail, Send, MapPin } from 'lucide-react';
import { SectionTitle } from '../components/ui';
import { BRAND } from '../constants/brand';
import { SERVICES } from '../constants/services';

const ContactPage = () => {
  // 2. State to store form data
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    service: ''
  });

  // 3. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 4. Handle Form Submission (WhatsApp Redirection)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.phone) {
      alert("Please fill in at least Name and Phone Number");
      return;
    }

    // Format the message for the Admin
    // %0a creates a new line in the WhatsApp message
    const message = `*New Consultation Request* %0a%0a` +
      `*Name:* ${formData.name}%0a` +
      `*Age:* ${formData.age}%0a` +
      `*Phone:* ${formData.phone}%0a` +
      `*Interested Service:* ${formData.service}`;

    // Create the WhatsApp URL
    // assuming BRAND.phone is the number without country code
    const whatsappUrl = `https://wa.me/91${BRAND.phone}?text=${message}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
      <SectionTitle title="Get in Touch" subtitle="Start your investment & insurance journey today" />
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column - Contact Info */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-dark-green">
          <h3 className="text-2xl font-bold mb-6 text-slate-800">Contact Information</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-light-cream p-3 rounded-full">
                <User className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{BRAND.founder}</p>
                <p className="text-slate-600">Founder</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-light-cream p-3 rounded-full">
                <Phone className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p className="text-slate-600">{BRAND.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-light-cream p-3 rounded-full">
                <Mail className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p className="text-slate-600">{BRAND.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-light-cream p-3 rounded-full">
                <MapPin className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Address</p>
                <p className="text-slate-600">{BRAND.address}</p>
              </div>
            </div>

            <div className="pt-6">
              <a 
                href={`https://wa.me/91${BRAND.phone}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold gap-2 transition-colors"
              >
                <Send className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
          <h3 className="text-2xl font-bold mb-6 text-slate-800">Book Consultation</h3>
          
          {/* 5. Attached handleSubmit */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              {/* Added name, value, onChange */}
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none" 
                placeholder="Your Name" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                type="tel" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none" 
                placeholder="Your Age" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none" 
                placeholder="10-digit number" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service Interested In</label>
              <select 
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none"
              >
                <option value="">Select a service</option>
                {SERVICES.map((service, index) => (
                  <option key={index} value={service.title}>{service.title}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-dark-green text-white py-3 rounded-md font-bold hover:bg-primary-green transition-colors">
              Request Callback
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;