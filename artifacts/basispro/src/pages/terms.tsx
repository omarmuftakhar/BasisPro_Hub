import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using BasisPro ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform. These Terms constitute a legally binding agreement between you ("User") and BasisPro ("Company", "we", "us").`,
  },
  {
    title: "2. Account Usage",
    body: `You must be at least 18 years of age to create an account. You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your account with others or allow unauthorized access to your account. BasisPro reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activity.

Each subscription license is granted to a single individual. Multi-seat or organizational licenses must be arranged separately through our sales team.`,
  },
  {
    title: "3. Subscription and Payment",
    body: `BasisPro offers Monthly and Annual subscription plans. By subscribing, you authorize us to charge your payment method on a recurring basis at the applicable rate.

Monthly subscriptions are billed every 30 days. Annual subscriptions are billed once per year. All prices are displayed in USD and are exclusive of any applicable taxes.

We reserve the right to change subscription pricing with at least 30 days' notice. Continued use of the Platform after a price change constitutes acceptance of the new pricing.`,
  },
  {
    title: "4. Refund Policy",
    body: `Monthly subscribers may request a refund within 7 days of the initial purchase or renewal date. Annual subscribers may request a full refund within 14 days of the initial purchase date.

Refund requests must be submitted to support@basispro.app. Refunds will be processed to the original payment method within 5–10 business days.

No refunds are issued for partial subscription periods after the refund window has elapsed. BasisPro reserves the right to deny refunds in cases of suspected abuse of the refund policy.`,
  },
  {
    title: "5. Intellectual Property",
    body: `All content on the BasisPro Platform — including but not limited to text, guides, blueprints, architecture diagrams, code samples, interview questions, and AI-generated responses — is the intellectual property of BasisPro or its licensors.

You may access and use Platform content solely for your personal, non-commercial professional development. You may not reproduce, distribute, publish, sell, sublicense, or create derivative works from any Platform content without prior written consent from BasisPro.

Feedback or suggestions you submit to BasisPro may be used by us without compensation or attribution.`,
  },
  {
    title: "6. Acceptable Use",
    body: `You agree not to use the Platform to: (a) violate any applicable law or regulation; (b) transmit malicious code or attempt unauthorized access; (c) scrape, crawl, or systematically extract Platform content; (d) impersonate any person or entity; (e) harass, threaten, or harm other users.

BasisPro may monitor usage to ensure compliance with these Terms and may remove content or suspend access without notice if violations are detected.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    body: `The Platform is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement. BasisPro does not warrant that the Platform will be uninterrupted, error-free, or free of harmful components.

All technical content on BasisPro is for educational purposes. BasisPro assumes no liability for decisions made based on Platform content in production SAP environments.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `To the maximum extent permitted by law, BasisPro's total liability for any claim arising from or related to these Terms or your use of the Platform shall not exceed the total amount paid by you to BasisPro in the 12 months preceding the claim.

BasisPro shall not be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.`,
  },
  {
    title: "9. Governing Law",
    body: `These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the American Arbitration Association rules.`,
  },
  {
    title: "10. Changes to Terms",
    body: `We may update these Terms from time to time. We will notify registered users via email at least 14 days before material changes take effect. Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.`,
  },
  {
    title: "11. Contact",
    body: `For questions about these Terms, please contact us at: legal@basispro.app or through our Contact page.`,
  },
];

export default function Terms() {
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
          <h1 className="text-4xl font-bold text-foreground mb-3">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: April 24, 2026 · Effective: April 24, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {sections.map((s, i) => (
              <div key={i} className="px-8 py-7">
                <h2 className="text-base font-bold text-foreground mb-3">{s.title}</h2>
                {s.body.split("\n\n").map((para, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0">{para}</p>
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
