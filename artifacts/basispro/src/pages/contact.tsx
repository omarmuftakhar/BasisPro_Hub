import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Mail, Clock, CheckCircle } from "lucide-react";

export default function Contact() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center">
        <div className="max-w-5xl mx-auto w-full flex items-center gap-4">
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

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-xl">Have a question, need support, or want to explore a partnership? We're here to help.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Message Sent!</h2>
                <p className="text-muted-foreground mb-8 max-w-sm">
                  Thanks for reaching out. We've received your message and will respond within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">Send us a message</h2>
                </div>
                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ahmed Al-Khalidi"
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-border bg-[#F8FAFC] focus:bg-white"}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-border bg-[#F8FAFC] focus:bg-white"}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Subject <span className="text-red-500">*</span></label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.subject ? "border-red-400 bg-red-50 text-foreground" : "border-border bg-[#F8FAFC] focus:bg-white"} ${!form.subject ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      <option value="" disabled>Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="partnership">Partnership</option>
                    </select>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your question or issue in detail…"
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-border bg-[#F8FAFC] focus:bg-white"}`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                      <span className="text-xs text-muted-foreground">{form.message.length} chars</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-semibold py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Email Us Directly</h3>
              <p className="text-sm text-muted-foreground mb-3">For support, billing, or general questions:</p>
              <a href="mailto:support@basispro.app" className="text-sm font-semibold text-primary hover:underline">support@basispro.app</a>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Response Time</h3>
              <p className="text-sm text-muted-foreground mb-3">We aim to respond to all inquiries promptly:</p>
              <div className="space-y-2">
                {[
                  { type: "Technical Support", time: "Within 24 hours" },
                  { type: "Billing Inquiries", time: "Within 24 hours" },
                  { type: "General Inquiries", time: "Within 48 hours" },
                  { type: "Partnership", time: "Within 3–5 business days" },
                ].map((r) => (
                  <div key={r.type} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{r.type}</span>
                    <span className="font-semibold text-foreground">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E3A5F] rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-1">Enterprise & Teams</h3>
              <p className="text-sm text-white/70 mb-4">Need multi-seat licenses or a custom arrangement for your organization?</p>
              <a href="mailto:enterprise@basispro.app" className="text-sm font-semibold text-white underline">enterprise@basispro.app</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
