import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "1. Introduction",
    body: `BasisPro ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the BasisPro platform ("Platform"). Please read this policy carefully.`,
  },
  {
    title: "2. Information We Collect",
    body: `Account Information: When you register, we collect your name, email address, and password (stored as a hashed value). We may also collect your job title and company name if provided.

Usage Data: We automatically collect information about how you interact with the Platform, including pages visited, features used, session duration, and AI Assistant queries. This data is used to improve the Platform and personalize your experience.

Payment Information: Subscription payments are processed by our payment provider (Stripe). We do not store full credit card numbers on our servers. We retain only the last 4 digits and card type for reference.

Communications: If you contact us via email or our contact form, we retain those communications to respond to your inquiry and improve our support.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use your information to:
— Provide and maintain the Platform
— Process subscription payments and send billing receipts
— Personalize your learning experience and track progress
— Send important account notifications and product updates
— Respond to support requests and inquiries
— Analyze usage trends to improve Platform quality
— Comply with legal obligations

We do not sell your personal information to third parties.`,
  },
  {
    title: "4. Cookies and Tracking",
    body: `We use cookies and similar tracking technologies to:
— Maintain your login session
— Remember your preferences and settings
— Analyze aggregate usage patterns (via analytics)
— Prevent fraudulent activity

Types of cookies we use:
• Essential cookies: required for the Platform to function
• Analytics cookies: help us understand usage patterns (e.g., Plausible Analytics — privacy-focused, no fingerprinting)
• Preference cookies: remember your settings

You can control cookies through your browser settings. Disabling essential cookies may impair Platform functionality.`,
  },
  {
    title: "5. Third-Party Services",
    body: `We work with the following third-party service providers, each subject to their own privacy policies:

• Stripe — payment processing
• Cloudflare — CDN, DDoS protection, and security
• Plausible Analytics — privacy-respecting usage analytics (no cross-site tracking)
• OpenAI / Anthropic — AI model inference for the AI Assistant (queries are not used to train models)
• Resend — transactional email delivery

We do not share personally identifiable information with these providers beyond what is necessary to deliver the service.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law (e.g., billing records, which are retained for 7 years).

Usage logs and analytics data are retained in aggregated, anonymized form indefinitely.`,
  },
  {
    title: "7. Your Rights",
    body: `Depending on your location, you may have the following rights regarding your personal data:

• Access: Request a copy of the personal data we hold about you
• Correction: Request correction of inaccurate data
• Deletion: Request deletion of your personal data ("right to be forgotten")
• Portability: Request your data in a portable, machine-readable format
• Objection: Object to processing based on legitimate interests
• Restriction: Request that we restrict processing in certain circumstances

To exercise any of these rights, please contact us at privacy@basispro.app. We will respond within 30 days.`,
  },
  {
    title: "8. Data Security",
    body: `We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, regular security audits, and strict access controls. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your BasisPro account.`,
  },
  {
    title: "9. Children's Privacy",
    body: `The Platform is not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will delete it promptly.`,
  },
  {
    title: "10. International Transfers",
    body: `BasisPro is operated from the United States. If you are accessing the Platform from outside the US, your information may be transferred to and processed in the US. We take appropriate safeguards to ensure such transfers comply with applicable data protection laws, including the EU Standard Contractual Clauses where required.`,
  },
  {
    title: "11. Changes to This Policy",
    body: `We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent notice on the Platform at least 14 days before the change takes effect.`,
  },
  {
    title: "12. Contact Us",
    body: `For privacy-related inquiries, please contact our Data Privacy team at:
Email: privacy@basispro.app
Mailing address: BasisPro, 1209 Orange Street, Wilmington, DE 19801, USA`,
  },
];

export default function Privacy() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">BasisPro</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: April 24, 2026 · Effective: April 24, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {sections.map((s, i) => (
              <div key={i} className="px-8 py-7">
                <h2 className="text-base font-bold text-foreground mb-3">{s.title}</h2>
                {s.body.split("\n\n").map((para, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0 whitespace-pre-line">{para}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} BasisPro. All rights reserved.
        </p>
      </div>
    </div>
  );
}
