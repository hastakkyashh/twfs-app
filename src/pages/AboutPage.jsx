import React from "react";
import { User, CheckCircle } from "lucide-react";
import { SectionTitle } from "../components/ui";
import { BRAND } from "../constants";
import founderImg from "../assets/YH_pic.png";
import { PartnerCarousel } from "../components/layout";

const AboutPage = () => (
  <>
    <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
      <SectionTitle
        title="About TrueWise FinSure"
        subtitle="Your Partner in Investment and Insurance"
      />
      <div className="grid md:grid-cols-2 gap-12 items-center p-8">
        {/* THE UI CARD */}
        <div className="bg-dark-green text-white rounded-2xl shadow-xl relative overflow-hidden flex flex-col-reverse md:flex-row">
          {/* --- SECTION 1: TEXT CONTENT --- */}
          <div className="p-10 md:w-[60%]">
            <h3 className="text-2xl font-bold mb-2">{BRAND.founder}</h3>
            <p className="font-medium mb-6">Founder</p>
            <p className="mb-6 leading-relaxed text-slate-200">
              <i>"Investment and insurance should be personal, not complicated."</i>
            </p>
            <p className="mb-6 leading-relaxed text-slate-200">
              I founded this firm to be the transparent partner I always wished
              I had. We’re here to simplify your journey, protect what you’ve
              built, and help you grow with confidence.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span>Client-First Approach</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span>Transparency & Ethics</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span>Long-term Focus</span>
              </div>
            </div>
          </div>

          {/* --- SECTION 2: THE IMAGE --- */}
          <div className="relative w-full md:w-[40%] min-h-[300px] md:min-h-full">
            <img
              src={founderImg}
              alt={BRAND.founder}
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">
            Our Philosophy: Your Growth, Our Commitment
          </h3>
          <p className="text-xl text-slate-800 leading-relaxed">
            When you trust us with your investment and insurance, you aren't
            just getting an advisor, you are gaining a dedicated partner. We
            take great pride in deep research, constant risk assessments, and
            precise planning required to protect your legacy.
          </p>
          <p className="text-xl text-slate-800 leading-relaxed">
            Our willingness to go the extra mile is what defines us. We are here
            to navigate the complexities on your behalf, so you can focus on
            living your life. We are fully committed to your success, and we
            won't have it any other way.
          </p>
          <div className="bg-light-cream border-l-4 border-primary-green p-4">
            <p className="text-sm text-dark-green font-medium">
              "We don’t just sell policies or funds. We design the freedom you
              deserve."
            </p>
          </div>
        </div>
      </div>
    </section>
    <PartnerCarousel />
  </>
);

export default AboutPage;
