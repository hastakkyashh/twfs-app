import React from 'react';
import { SectionTitle } from '../components/ui';
import { BRAND } from '../constants/brand';

const TermsConditionsPage = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
    <SectionTitle title="Terms and Conditions"/>
    
    <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
      <div className="bg-light-cream p-6 rounded-lg">
        <p className="text-sm text-slate-600 mb-6">
          <strong>Effective Date:</strong> January 17, 2026
        </p>
        
        <p className="mb-6">
          Welcome to TrueWise FinSure. If you continue to browse and use this website (www.truewisefinsure.com), you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our 'Privacy Policy', govern TrueWise FinSure's relationship with you.
        </p>

        <p className="mb-6">
          The term "TrueWise FinSure" (or "us"/"we"/"our") refers to the owner of the website, with its registered office at {BRAND.address}. The term "you" refers to the user or viewer of our website.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">1. Terms of Use</h2>
        <p className="mb-4">
          The use of this website is subject to the following terms:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Informational Purpose:</strong> You understand and accept that TrueWise FinSure maintains this website to provide visitors with information about us, our financial distribution services, and products.</li>
          <li><strong>Acceptance:</strong> You accept that visitors to the site are required to read these terms, and the use of the site constitutes your acceptance and agreement to be bound by such terms.</li>
          <li><strong>Updates:</strong> You will be bound by changes to these terms as communicated and made available on the website from time to time.</li>
        </ul>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">2. Intellectual Property</h2>
        <p className="mb-4">
          You are aware and accept that all information, content, materials, and products (including, but not limited to text, content, photographs, graphics, and logos) on the website are protected by copyright in favor of TrueWise FinSure under applicable copyright laws and general intellectual property law.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>User Submissions:</strong> You understand and accept that generic information (inquiries/feedback) submitted by you on the site generally becomes the property of TrueWise FinSure regarding its use for business improvement.</li>
          <li><strong>Communication Consent:</strong> On initiating contact through the site, you agree to be contacted by TrueWise FinSure, or any other entities with whom TrueWise FinSure has entered into an arrangement, via email, phone call, SMS, or WhatsApp.</li>
          <li><strong>Restrictions:</strong> You agree that you shall not copy, reproduce, sell, redistribute, publish, display, transmit, or in any way exploit any part of any information, content, materials, or services available on or through the site, except that which you may download for your own personal, non-commercial use.</li>
        </ul>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">3. Prohibited Use</h2>
        <p className="mb-4">
          You agree that you will not use TrueWise FinSure's website for any purpose that is unlawful or prohibited by these terms. You also agree you will not use the site in any manner that could damage, disable, or impair the website, or interfere with any other party's use or enjoyment of the website.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">4. Website Infrastructure</h2>
        <p className="mb-4">
          You acknowledge that the software and infrastructure underlying the site are the legal property of the respective vendors or TrueWise FinSure. The permission given by TrueWise FinSure to access the website will not convey any proprietary or ownership rights in the underlying software. You agree that you shall not attempt to modify, translate, disassemble, decompile, or reverse engineer the software underlying the website.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">5. Product Availability & Third-Party Links</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Availability:</strong> You understand and accept that not all products and services offered on this website may be available in all geographic areas. TrueWise FinSure reserves the right to determine the availability and eligibility for any product or service.</li>
          <li><strong>External Links:</strong> You understand and accept that TrueWise FinSure is not responsible for the availability of content or other services on third-party sites linked from the website. You are aware that accessing hyperlinks to other internet sites is at your own risk. The content, accuracy, and opinions expressed on these sites are not verified, monitored, or endorsed by TrueWise FinSure.</li>
          <li><strong>Disclaimer:</strong> TrueWise FinSure disclaims all warranties, express or implied, regarding merchantability or fitness for a particular purpose with respect to any information or services available on third-party websites.</li>
        </ul>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">6. Limitation of Liability & Force Majeure</h2>
        <p className="mb-4">
          TrueWise FinSure shall not be liable if any transaction or interaction does not fructify, or for any failure on the part of TrueWise FinSure to perform any of its obligations under these terms, if performance is prevented, hindered, or delayed by a Force Majeure event.
        </p>
        <p className="mb-4">
          "Force Majeure Event" means any event due to any cause beyond the reasonable control of TrueWise FinSure, including without limitation:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Unavailability of communication systems or internet service provider failures.</li>
          <li>Mechanical or technical errors/failures, power shutdowns, or faults in telecommunication.</li>
          <li>Cyber-attacks, viruses, or unauthorized access to systems.</li>
          <li>Acts of God, fire, flood, civil commotion, strikes, war, or acts of government.</li>
        </ul>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">7. Amendment Policy</h2>
        <p className="mb-4">
          You understand and accept that TrueWise FinSure has the absolute discretion to amend or supplement any of the terms at any time. We will endeavor to give prior notice of 30 days for significant changes where possible. The changed terms and conditions shall be communicated to you on the website. By continuing to use TrueWise FinSure's services/website, you shall be deemed to have accepted the changed terms.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">8. Governing Law and Jurisdiction</h2>
        <p className="mb-4">
          You accept that the courts in Nagpur, Maharashtra alone shall have exclusive jurisdiction regarding any claims or matters arising out of dealings with TrueWise FinSure. All disputes will be governed by the laws of India.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">9. Entire Agreement</h2>
        <p className="mb-4">
          You understand and agree that these terms are in addition to, and not in derogation of, the applicable terms and conditions relating to your usage of any specific TrueWise FinSure services (such as Mutual Fund investments or Insurance policies) that you may be currently availing, or may avail in the future.
        </p>
      </div>
    </div>
  </section>
);

export default TermsConditionsPage;
