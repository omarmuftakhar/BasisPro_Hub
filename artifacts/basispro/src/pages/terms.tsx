import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing and using BasisPro, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.`,
  },
  {
    title: "2. Description of Service",
    body: `BasisPro is a professional learning platform for SAP Basis engineers, consultants, and architects. We provide technical guides, interview preparation, SAP TCode references, AI assistance, and architecture blueprints.`,
  },
  {
    title: "3. Subscription & Payment",
    body: `BasisPro offers two subscription plans: Monthly at $19.99/month and Yearly at $149/year. All payments are processed securely through Stripe. By subscribing you authorize us to charge your payment method on a recurring basis until cancelled.`,
  },
  {
    title: "4. Refund Policy",
    body: `All subscription payments are final and non-refundable. By subscribing to BasisPro, you acknowledge and agree that no refunds will be issued for any reason, including change of mind after purchase, partial use of the subscription period, cancellation before end of billing cycle, or yearly subscriptions cancelled mid-term.

You may cancel anytime to stop future charges. You retain full access until the end of your current billing period.`,
  },
  {
    title: "5. Account Responsibilities",
    body: `You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your account with others. BasisPro reserves the right to terminate accounts found in violation of these terms.`,
  },
  {
    title: "6. Intellectual Property",
    body: `All content on BasisPro including guides, questions, TCodes, and AI responses are the intellectual property of BasisPro. You may not reproduce, distribute, or resell any content without written permission.`,
  },
  {
    title: "7. Disclaimer",
    body: `BasisPro provides content for educational purposes only. We do not guarantee specific career outcomes or exam results. Content accuracy is maintained to the best of our ability but may not reflect the latest SAP updates.`,
  },
  {
    title: "8. Changes to Terms",
    body: `We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.`,
  },
  {
    title: "9. Contact",
    body: `For any questions regarding these terms, contact us at support@basispro.com`,
  },
];

export default function Terms() {
  const [, navigate] = useLocation();
  return (
    <div className="bg-[#F8FAFC] font-sans">
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
          <p className="text-muted-foreground text-sm">Last updated: April 2026</p>
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
