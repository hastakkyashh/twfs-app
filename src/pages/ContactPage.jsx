import React, { useState } from 'react';
import { User, Phone, Mail, Send, MapPin } from 'lucide-react';
import { SectionTitle } from '../components/ui';
import { BRAND } from '../constants/brand';
import { SERVICES } from '../constants/services';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    place: '',
    phone: '',
    email: '',
    service: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      alert("Please fill in at least Name and Phone Number");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const message = `*New Consultation Request* %0a%0a` +
      `*Name:* ${formData.name}%0a` +
      `*DOB:* ${formData.dob}%0a` +
      `*Place:* ${formData.place}%0a` +
      `*Phone:* ${formData.phone}%0a` +
      `*Email:* ${formData.email}%0a` +
      `*Interested Service:* ${formData.service}`;

    const whatsappUrl = `https://wa.me/91${BRAND.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
      <SectionTitle title="Get in Touch" subtitle="Start your investment & insurance journey today" />
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-dark-green h-full flex flex-col">
          <h3 className="text-3xl font-bold mb-6 text-slate-800">Contact Information</h3>
         <div className="space-y-6 flex-grow">
            <div className="flex items-start gap-4">
              <div className="bg-light-cream p-3 rounded-full">
                <User className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{BRAND.founder}</p>
                <p className="text-slate-600">Founder</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-light-cream p-3 rounded-full">
                <Phone className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p className="text-slate-600">{BRAND.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-light-cream p-3 rounded-full">
                <Mail className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p className="text-slate-600">{BRAND.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-light-cream p-3 rounded-full">
                <MapPin className="text-dark-green w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Address</p>
                <p className="text-slate-600">{BRAND.address}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-auto">
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

        {/* Right Column - Form */}
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 h-full">
          <h3 className="text-2xl font-bold mb-6 text-slate-800">Book Consultation</h3>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Place</label>
              <input 
                type="text" 
                name="place"
                value={formData.place}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none" 
                placeholder="Your Place" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                maxLength={10}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none" 
                placeholder="10-digit number" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary-green focus:outline-none" 
                placeholder="Your Email" 
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