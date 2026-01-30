import React from "react";
import { SectionTitle } from "../components/ui";
import { BRAND } from "../constants/brand";

const PrivacyPolicyPage = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
    <SectionTitle title="Privacy Policy" />

    <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
      <div className="bg-light-cream p-6 rounded-lg">
        <p className="text-sm text-slate-600 mb-6">
          <strong>Effective Date:</strong> January 17, 2026
        </p>

        <p className="mb-6">
          At TrueWise FinSure, we value the trust you place in us. This Privacy
          Policy outlines how TrueWise FinSure uses, protects, and manages the
          information you share with us when using our website
          (www.truewisefinsure.com) or availing of our financial distribution
          services.
        </p>

        <p className="mb-6">
          TrueWise FinSure is committed to ensuring that your privacy is
          protected at all times. Should we ask you to provide certain
          information by which you can be identified, you can be assured that it
          will only be used in accordance with this privacy statement.
        </p>

        <p className="mb-6 italic text-sm">
          <strong>Note:</strong> TrueWise FinSure may change this policy from
          time to time by updating this page. We encourage you to review this
          page periodically to ensure you are comfortable with any changes.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          1. Our Commitment
        </h2>
        <p className="mb-4">
          We understand that financial relationships are built on faith and
          integrity. As an{" "}
          <strong>AMFI Registered Mutual Fund Distributor (ARN-342645)</strong>{" "}
          and{" "}
          <strong>IRDAI Authorised Insurance POSP (POS Code-IP212377)</strong>,
          we adhere to strict regulatory standards.
        </p>
        <p className="mb-4">
          In the course of using this website or availing our services, TrueWise
          FinSure may become privy to personal information, including
          confidential financial data. We are strictly committed to protecting
          the privacy of our customers and have taken reasonable measures to
          protect the confidentiality of customer information during
          transmission through the World Wide Web.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          2. Information We Collect
        </h2>
        <p className="mb-4">
          To provide you with comprehensive financial planning and investment
          services, we may collect the following:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Identity Details:</strong> Name, Contact Number, Email Id
            and Location.
          </li>
          <li>
            <strong>Regulatory Data:</strong> Personal information required for
            compliance, including Date of Birth, Aadhaar Number, and Permanent
            Account Number (PAN).
          </li>
          <li>
            <strong>Demographics:</strong> Information such as gender, income
            bracket, and occupation.
          </li>
          <li>
            <strong>Service Data:</strong> Other information relevant to
            customer surveys, investment preferences, and service improvements.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          3. How We Use Your Information
        </h2>
        <p className="mb-4">
          We require this information to understand your needs and provide you
          with better service, specifically for the following reasons:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Regulatory Compliance:</strong> To conduct
            Know-Your-Customer (KYC) registration and other mandatory checks as
            required by SEBI (Securities and Exchange Board of India), IRDAI
            (Insurance Regulatory and Development Authority of India), and AMFI.
          </li>
          <li>
            <strong>Internal Records:</strong> To maintain accurate internal
            records and compliance logs.
          </li>
          <li>
            <strong>Service Improvement:</strong> To analyze and improve our
            portfolio offerings and website functionality.
          </li>
          <li>
            <strong>Communication:</strong> To periodically send emails or
            messages via our official channels (including Telegram or WhatsApp)
            regarding your investments, new products, market updates, or other
            information we think you may find relevant.
          </li>
          <li>
            <strong>Market Research:</strong> From time to time, we may use your
            information to contact you for market research purposes.
          </li>
        </ul>
        <p className="mb-4 italic text-sm">
          <strong>Note:</strong> You are free to unsubscribe from our marketing
          communications at any time.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          4. Information Sharing & Disclosure
        </h2>
        <p className="mb-4">
          We value your privacy and do not sell, distribute, or lease your
          personal information to third parties, with the following exceptions:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Regulatory Requirement:</strong> We may disclose your
            personal information to the government, judicial bodies, SEBI,
            IRDAI, or our regulators if required by law.
          </li>
          <li>
            <strong>Service Necessity:</strong> We may share data with Asset
            Management Companies (AMCs) or Insurance partners solely for the
            purpose of processing the transactions you have requested.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          5. Security Measures
        </h2>
        <p className="mb-4">
          TrueWise FinSure is fully aware of the security implications of
          handling financial data. We have implemented suitable physical,
          electronic, and managerial procedures to safeguard your data.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Data Encryption:</strong> Passwords and sensitive data are
            encrypted before storage.
          </li>
          <li>
            <strong>Secure Transmission:</strong> All communication between you,
            us, and our service providers (Mutual Fund Companies/Insurers) is
            encrypted using high-standard security protocols (SSL).
          </li>
          <li>
            <strong>Hosting:</strong> Our digital infrastructure is hosted with
            top-tier hosting service providers to ensure data safety and
            continuity of operations.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          6. Links to Other Websites
        </h2>
        <p className="mb-4">
          Our website or social media channels (Instagram, Facebook, X, Threads)
          may contain links to other websites of interest. However, once you
          have used these links to leave our site, you should note that we do
          not have any control over that other website. Therefore, we cannot be
          responsible for the protection and privacy of any information which
          you provide whilst visiting such sites. You should exercise caution
          and look at the privacy statement applicable to the website in
          question.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          7. Controlling Your Personal Information
        </h2>
        <p className="mb-4">
          If you believe that any information we are holding on you is incorrect
          or incomplete, please write to us as soon as possible at:
        </p>
        <p className="font-semibold">TrueWise FinSure</p>
        <p>Email: {BRAND.email}</p>
        <p>Phone: +91 {BRAND.phone}</p>
        <p>Address: {BRAND.address}</p>
        <p className="mb-4">
          We will promptly correct any information found to be incorrect.
        </p>

        <h2 className="text-xl font-bold text-dark-green mb-4 mt-8">
          8. Governing Law and Jurisdiction
        </h2>
        <p className="mb-4">
          This Privacy Policy and any dispute or claim arising out of or in
          connection with it shall be governed by and construed in accordance
          with the laws of India. The courts of Nagpur, Maharashtra, shall have
          exclusive jurisdiction to settle any dispute or claim that arises out
          of or in connection with this policy.
        </p>
        <p className="mb-4">
          <p className="font-semibold text-dark-green mb-2">TrueWise FinSure</p>
          <p className="text-sm mb-2">
            Yash Anil Hastak is an AMFI-Registered Mutual Fund Distributor
            (ARN-342645). Mutual fund distribution services are provided under
            the proprietorship TrueWise FinSure.
          </p>
          <p className="text-sm mb-2">
            Insurance services are facilitated by Yash Anil Hastak,
            IRDAI-certified POSP (Code-IP212377), acting as per IRDAI guidelines.
            All insurance proposals are subject to insurer approval.
          </p>
          <p className="text-sm mb-2">
            Insurance services are facilitated by Anil Prabhakar Hastak,
            IRDAI-certified POSP (Code-D2D00423241), acting as per IRDAI guidelines.
            All insurance proposals are subject to insurer approval.
          </p>
        </p>
      </div>
    </div>
  </section>
);

export default PrivacyPolicyPage;
