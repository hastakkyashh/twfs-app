import React from 'react';
import { SectionTitle } from '../components/ui';

const DisclosurePage = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
    <SectionTitle title="Disclosure"/>
    
    <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
      <div className="bg-light-cream p-6 rounded-lg">
        <p className="mb-4">
          Details of scheme-level commissions on mutual funds are available to the relationship managers and will be produced on demand. This is on a best-effort basis and rates are updated as and when actual rates are received from AMCs. We are a NISM-certified / AMFI-registered mutual fund distributor and not an RIA. We get compensated/incentivised by AMCs. We don't charge any fees for our services.
        </p>
      </div>
    </div>
  </section>
);

export default DisclosurePage;
