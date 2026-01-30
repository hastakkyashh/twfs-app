import React from 'react';
import { BookOpen } from 'lucide-react';
import { SectionTitle } from '../components/ui';
import { EDUCATION_CONTENT } from '../constants';

const EducationPage = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
    <SectionTitle title="Knowledge Center" subtitle="Educate yourself before you invest" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {EDUCATION_CONTENT.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-dark-green mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-green" />
            {item.title}
          </h3>
          <p className="text-slate-600">{item.content}</p>
        </div>
      ))}
    </div>
  </section>
);

export default EducationPage;
