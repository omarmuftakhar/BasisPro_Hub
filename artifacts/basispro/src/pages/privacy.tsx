import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowUp } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect your name, email address, and payment information when you subscribe. We also collect usage data such as pages visited and features used to improve our platform.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to provide and improve our services, process payments, send important account notifications, and respond to support requests. We do not sell your personal data to third parties.`,
  },
  {
    title: "3. Payment Processing",
    body: `All payments are processed by Stripe. BasisPro does not store your credit card details. Please review Stripe's privacy policy for information on how they handle payment data.`,
  },
  {
    title: "4. Cookies",
    body: `We use essential cookies to keep you logged in and remember your preferences. We do not use advertising or tracking cookies.`,
  },
  {
    title: "5. Data Security",
    body: `We implement industry-standard security measures to protect your personal information. However no method of transmission over the internet is 100% secure.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your account data for as long as your account is active. You may request deletion of your data by contacting us at support@basispro.com`,
  },
  {
    title: "7. Your Rights",
    body: `You have the right to access, correct, or delete your personal data at any time. Contact us at support@basispro.com to make a request.`,
  },
  {
    title: "8. Changes to Privacy Policy",
    body: `We may update this policy from time to time. We will notify you of significant changes via email.`,
  },
  {
    title: "9. Contact",
    body: `For privacy related questions contact us at support@basispro.com`,
  },
];

export default function Privacy() {
  const [, navigate] = useLocation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#F8FAFC] font-sans">
      {/* Sticky navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border px-6 h-16 flex items-center shadow-sm">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
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

      {/* Back to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#2563EB",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
            zIndex: 100,
            transition: "opacity 0.2s",
          }}
        >
          <ArrowUp style={{ width: "18px", height: "18px" }} />
        </button>
      )}
    </div>
  );
}
