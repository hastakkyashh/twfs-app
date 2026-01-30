import React from 'react';

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
    <div className="w-20 h-1 bg-primary-green mx-auto mb-4"></div>
    {subtitle && <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

export default SectionTitle;
