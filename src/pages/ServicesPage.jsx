import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SectionTitle } from '../components/ui';
import { SERVICES } from '../constants';

const ServicesPage = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
    <SectionTitle title="Our Services" subtitle="Comprehensive Financial Solutions tailored for you" />
    <div className="grid md:grid-cols-2 gap-8">
      {SERVICES.map((service, index) => {
        const IconComponent = service.icon;
        return (
          <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:border-primary-green hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-light-cream transition-colors">
                <IconComponent className="w-8 h-8 text-primary-green" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-dark-green transition-colors">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default ServicesPage;
