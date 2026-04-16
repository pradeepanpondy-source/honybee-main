import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using BeeBridge ("the Platform", "we", "our", or "us"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.

These Terms constitute a legally binding agreement between you and BeeBridge. We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes your acceptance of the updated terms.`,
    },
    {
      title: '2. Description of Services',
      content: `BeeBridge is an online marketplace connecting honey farmers, beekeepers, and consumers. Our services include:

• A platform for buying and selling honey products and beekeeping supplies
• Seller registration and verification services
• Order management and payment processing facilitation
• Customer account management
• Communication tools between buyers and sellers

We act solely as a marketplace facilitator. We are not responsible for the quality, safety, or legality of products listed by third-party sellers.`,
    },
    {
      title: '3. User Account Registration',
      content: `To use certain features of BeeBridge, you must create an account. You agree to:

• Provide accurate, current, and complete information during registration
• Maintain and promptly update your account information
• Keep your password confidential and secure
• Notify us immediately of any unauthorized use of your account
• Be solely responsible for all activities that occur under your account

You must be at least 18 years of age to create an account.`,
    },
    {
      title: '4. Seller Requirements',
      content: `Sellers on BeeBridge must:

• Complete the seller registration process and KYC (Know Your Customer) verification
• Provide accurate product descriptions, pricing, and availability
• Maintain adequate stock for listed products
• Fulfill orders promptly and professionally
• Comply with all applicable laws and food safety regulations
• Not engage in fraudulent or misleading practices

Seller accounts are subject to approval. BeeBridge reserves the right to suspend or terminate any seller account that violates these terms.`,
    },
    {
      title: '5. Buyer Responsibilities',
      content: `As a buyer on BeeBridge, you agree to:

• Provide accurate shipping and payment information
• Use the platform only for lawful purchases
• Respect sellers' product listings and policies
• Not engage in fraudulent chargebacks or false disputes
• Report any counterfeit or unsafe products to us immediately`,
    },
    {
      title: '6. Prohibited Activities',
      content: `You may not use BeeBridge to:

• Violate any local, state, national, or international law or regulation
• Infringe upon intellectual property rights of others
• Upload, post, or transmit any fraudulent, harmful, or offensive content
• Attempt to gain unauthorized access to any part of the Platform
• Engage in any automated data collection (scraping, crawling)
• Post fake reviews or engage in review manipulation
• Sell counterfeit, dangerous, or prohibited products
• Use the Platform to harass, spam, or harm other users`,
    },
    {
      title: '7. Payments and Transactions',
      content: `BeeBridge facilitates transactions between buyers and sellers. By using our payment features:

• You authorize the processing of payment for orders you place
• All prices displayed include applicable taxes unless stated otherwise
• Payment processing is subject to our payment provider's terms
• BeeBridge may charge service fees for platform usage — these will be clearly disclosed

Refunds and disputes are handled according to our Refund Policy.`,
    },
    {
      title: '8. Intellectual Property',
      content: `The BeeBridge platform, including its design, logos, and content, is protected by intellectual property laws. You may not:

• Copy, modify, or distribute the Platform's content without permission
• Use our trademarks or branding without written consent
• Reverse engineer any part of the Platform

Sellers retain ownership of their product images and descriptions but grant BeeBridge a license to display this content on the Platform.`,
    },
    {
      title: '9. Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, BEEBRIDGE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.

Our total liability for any claim arising from these Terms or your use of BeeBridge shall not exceed the amount you paid to BeeBridge in the 12 months preceding the claim.`,
    },
    {
      title: '10. Termination',
      content: `We may suspend or terminate your account at any time, with or without cause, including for violation of these Terms. Upon termination:

• Your right to use the Platform ceases immediately
• We may delete your account and associated data in accordance with our Privacy Policy
• Any pending orders will be managed according to our standard procedures`,
    },
    {
      title: '11. Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
    },
    {
      title: '12. Contact Information',
      content: `For questions about these Terms and Conditions, please contact us:

📧 Email: support@beebridge.vercel.app
🌐 Website: https://beebridge.vercel.app
📍 Platform: BeeBridge — Farm-to-Home Honey Marketplace`,
    },
  ];

  return (
    <div className="min-h-screen bg-honeybee-light">
      {/* Header */}
      <div className="bg-honeybee-secondary text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-honeybee-primary rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Terms &amp; Conditions
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Last updated: April 2026 | Effective immediately
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intro banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-sm text-amber-800 font-medium">
            📋 Please read these Terms carefully before using BeeBridge. By creating an account, you agree to these terms.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-honeybee-secondary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-honeybee-primary/10 rounded-lg flex items-center justify-center text-honeybee-primary font-black text-sm flex-shrink-0">
                  {index + 1}
                </span>
                {section.title.replace(/^\d+\.\s*/, '')}
              </h2>
              <div className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 bg-honeybee-secondary rounded-2xl p-6 text-center text-white">
          <p className="font-bold text-lg mb-1">🐝 BeeBridge</p>
          <p className="text-white/70 text-sm">
            Farm-to-Home Honey Marketplace · Terms effective April 2026
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="mt-4 bg-honeybee-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all"
          >
            I Understand — Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
