import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Introduction',
      content: `BeeBridge ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at beebridge.vercel.app.

Please read this policy carefully. If you disagree with its terms, please discontinue use of the platform.`,
    },
    {
      title: '2. Information We Collect',
      content: `We collect the following categories of personal information:

ACCOUNT INFORMATION
• Full name and email address
• Password (stored as a bcrypt hash — never in plain text)
• Profile picture (optional)
• Account creation date

SELLER-SPECIFIC INFORMATION
• Business address, city, state, and ZIP code
• Phone number
• Seller type (honey / beehive)
• KYC documents (government-issued ID — Aadhaar / Passport)

TRANSACTION DATA
• Order history, items purchased, total amounts
• Shipping address and delivery details

USAGE DATA (Automatically Collected)
• IP address and browser type
• Pages visited and time spent
• Device information and operating system
• Referring URL

We do NOT collect financial card details directly — payment processing is handled by our third-party payment provider.`,
    },
    {
      title: '3. How We Use Your Information',
      content: `We use your personal information to:

• Create and manage your user account
• Process and fulfill your orders
• Send transactional emails (verification, password reset, order confirmation)
• Verify seller identity through KYC processes
• Improve and personalize your platform experience
• Communicate important platform updates
• Detect and prevent fraud or security incidents
• Comply with legal obligations
• Analyze usage patterns to improve our services (aggregated, anonymized)

We will NOT use your information for unsolicited marketing without your explicit opt-in consent.`,
    },
    {
      title: '4. Data Storage and Security',
      content: `Your data is stored securely using the following measures:

DATABASE: Supabase (PostgreSQL with Row-Level Security policies) — your data is isolated at the database level and inaccessible to other users.

AUTHENTICATION: Passwords are hashed using Supabase's built-in bcrypt. JWT tokens are used for session management.

EMAIL VERIFICATION: Verification tokens are cryptographically generated (32-byte random hex), expire in 15 minutes, and are invalidated after use.

TRANSMISSION: All data is transmitted over HTTPS/TLS encryption.

KYC DOCUMENTS: Stored in Supabase private storage buckets with user-scoped access policies.

While we implement industry-standard security measures, no system is 100% secure. We encourage you to use a strong, unique password for your account.`,
    },
    {
      title: '5. Third-Party Services',
      content: `We share minimal data with the following third-party services:

SUPABASE (supabase.com)
Purpose: Database, authentication, file storage
Data shared: Account info, profile data, order data
Policy: https://supabase.com/privacy

GOOGLE OAUTH (accounts.google.com)
Purpose: Social sign-in ("Sign in with Google")
Data shared: Basic profile (name + email) — only if you choose Google login
Policy: https://policies.google.com/privacy

VERCEL (vercel.com)
Purpose: Website hosting and serverless functions
Data shared: Request logs (IP, headers)
Policy: https://vercel.com/legal/privacy-policy

GMAIL / NODEMAILER
Purpose: Transactional email delivery (verification, reset)
Data shared: Your email address

We do not sell, trade, or rent your personal information to any third party.`,
    },
    {
      title: '6. Cookies and Tracking',
      content: `We use minimal cookies necessary for platform functionality:

ESSENTIAL COOKIES (cannot be disabled)
• Supabase session token — keeps you logged in
• CSRF protection tokens

We do not use advertising cookies, tracking pixels, or third-party analytics that profile your behavior for advertising purposes.

You can control cookies through your browser settings. Disabling essential cookies will affect your ability to log in.`,
    },
    {
      title: '7. Your Rights',
      content: `You have the following rights regarding your personal data:

RIGHT TO ACCESS: Request a copy of the personal data we hold about you.

RIGHT TO CORRECTION: Request correction of inaccurate or incomplete data.

RIGHT TO DELETION: Request deletion of your account and associated data ("right to be forgotten"). Note: Some data may be retained for legal/audit obligations.

RIGHT TO DATA PORTABILITY: Request your data in a machine-readable format (JSON/CSV).

RIGHT TO OBJECT: Object to certain processing activities, such as marketing.

RIGHT TO WITHDRAW CONSENT: Where processing is based on consent, you may withdraw it at any time.

To exercise any of these rights, contact us at support@beebridge.vercel.app. We will respond within 30 days.`,
    },
    {
      title: '8. Data Retention',
      content: `We retain your data for the following periods:

• Active accounts: As long as your account is active
• Deleted accounts: Up to 90 days after deletion (for fraud prevention)
• Order records: Up to 7 years (legal compliance)
• KYC documents: Up to 5 years after account closure (regulatory requirement)
• Server logs: Up to 90 days

KYC verification documents are permanently deleted upon request, subject to legal retention requirements.`,
    },
    {
      title: '9. Children\'s Privacy',
      content: `BeeBridge is not intended for children under 18 years of age. We do not knowingly collect personal data from children under 18.

If you believe we have inadvertently collected information from a child, please contact us immediately and we will delete that information promptly.`,
    },
    {
      title: '10. International Data Transfers',
      content: `Your data may be stored and processed in servers located outside your country of residence (Supabase and Vercel operate global data centers). By using BeeBridge, you consent to this transfer.

We ensure that any international transfers comply with applicable data protection laws and that appropriate safeguards are in place.`,
    },
    {
      title: '11. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. When we make significant changes:

• We will update the "Last updated" date at the top of this page
• We will send an email notification to registered users if changes are material
• Continued use of BeeBridge after changes constitutes acceptance of the updated policy

We encourage you to review this policy periodically.`,
    },
    {
      title: '12. Contact Us',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Data Protection team:

📧 Email: support@beebridge.vercel.app
🌐 Website: https://beebridge.vercel.app
📋 Subject line: "Privacy Policy Inquiry — [Your Name]"

We are committed to resolving privacy concerns promptly and transparently.`,
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
              <Lock className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Last updated: April 2026 | We respect and protect your data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commitment banner */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-sm text-green-800 font-medium">
            🔒 BeeBridge does not sell your personal data. We collect only what is necessary to run the platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-honeybee-secondary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-black text-sm flex-shrink-0">
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
            Your privacy matters to us. We're committed to transparent data practices.
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => navigate('/terms-and-conditions')}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-honeybee-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
