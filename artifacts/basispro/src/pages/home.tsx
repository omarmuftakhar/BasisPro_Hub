import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Server, Database, Cloud, Shield, Activity, RefreshCw, MoveRight, BarChart3, ChevronRight, BookOpen, MessageSquare, Terminal, Bot, ChevronLeft, Send } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const SLIDE_COUNT = 3;

  const nextSlide = useCallback(() => setSlideIndex((i) => (i + 1) % SLIDE_COUNT), []);
  const prevSlide = useCallback(() => setSlideIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [paused, nextSlide]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const topics = [
    {
      title: "SAP S/4 HANA",
      desc: "Master the flagship next-gen ERP system. Architecture, sizing, Fiori setup, and daily operations of the digital core.",
      icon: <Server className="w-6 h-6 text-primary" />,
      tags: ["Architecture", "Sizing", "Fiori"],
    },
    {
      title: "HANA Platform",
      desc: "Command the in-memory database. High availability, disaster recovery, memory management, and scale-out scenarios.",
      icon: <Database className="w-6 h-6 text-primary" />,
      tags: ["In-Memory", "HA/DR", "Scale-out"],
    },
    {
      title: "Solution Manager",
      desc: "Centralized ALM and monitoring. Configure Focused Run, diagnostic agents, and System Landscape Directories.",
      icon: <Activity className="w-6 h-6 text-primary" />,
      tags: ["Monitoring", "ChaRM", "Focused Run"],
    },
    {
      title: "Cloud ALM",
      desc: "SAP's cloud-native application lifecycle management. Transition operations to the cloud with precision and control.",
      icon: <Cloud className="w-6 h-6 text-primary" />,
      tags: ["Implementation", "Operations", "Cloud Native"],
    },
    {
      title: "Cloud Connectors",
      desc: "Secure connectivity between on-premise systems and SAP Business Technology Platform (BTP).",
      icon: <Shield className="w-6 h-6 text-primary" />,
      tags: ["Security", "BTP", "Tunnels"],
    },
    {
      title: "SAC Configuration",
      desc: "SAP Analytics Cloud setup, live data connections, and SSO configurations across complex landscapes.",
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      tags: ["Live Data", "SSO", "SAML"],
    },
    {
      title: "Conversion & Upgrades",
      desc: "Flawless system conversion methodologies. Execute complex upgrade paths with zero unplanned downtime.",
      icon: <RefreshCw className="w-6 h-6 text-primary" />,
      tags: ["DMO", "SUM", "Downtime"],
    },
    {
      title: "Migration (Cloud/On-Prem)",
      desc: "Move massive SAP workloads seamlessly — OS/DB migrations, hyperscaler moves, and hybrid deployments.",
      icon: <MoveRight className="w-6 h-6 text-primary" />,
      tags: ["Hyperscalers", "OS/DB", "Hybrid"],
    },
  ];

  const stats = [
    { value: "8", label: "Core SAP Domains" },
    { value: "200+", label: "Technical Guides" },
    { value: "99.9%", label: "Uptime SLA Coverage" },
    { value: "50+", label: "Architecture Blueprints" },
  ];

  const testimonials = [
    {
      initials: "AK",
      name: "Ahmed Al-Khalidi",
      title: "SAP Basis Architect",
      company: "Aramco",
      color: "#2563EB",
      quote: "The depth on HANA administration is unmatched. The migration runbooks alone saved our team weeks of prep work on a critical S/4 HANA conversion. This is exactly what senior Basis architects need.",
    },
    {
      initials: "SP",
      name: "Sanjay Patel",
      title: "Senior SAP Consultant",
      company: "Deloitte",
      color: "#059669",
      quote: "The interview prep section is exceptional. I walked into my final round at Deloitte having already worked through 200+ Basis-specific questions. It directly helped me land the role.",
    },
    {
      initials: "MR",
      name: "Maria Rodriguez",
      title: "Basis Team Lead",
      company: "SAP SE",
      color: "#7C3AED",
      quote: "The AI Assistant is genuinely impressive — it answers complex Basis queries better than most consultants I've worked with. I use it daily for configuration questions and architecture decisions.",
    },
    {
      initials: "KR",
      name: "Khalid Al-Rashidi",
      title: "Basis Administrator",
      company: "SABIC",
      color: "#EA580C",
      quote: "Honestly didn't expect much when I signed up, but the HANA troubleshooting guides are the real deal. Saved me during a production outage at 2am.",
    },
    {
      initials: "PN",
      name: "Priya Nambiar",
      title: "SAP Technical Consultant",
      company: "Infosys",
      color: "#0D9488",
      quote: "The interview prep is insanely good. I went through 50 questions before my client interview and got the contract. Worth every riyal.",
    },
    {
      initials: "TB",
      name: "Thomas Brecker",
      title: "SAP Basis Engineer",
      company: "Deutsche Telekom",
      color: "#DC2626",
      quote: "Finally a platform that treats Basis as a serious discipline. The depth on transport management and system copies is unmatched.",
    },
    {
      initials: "FZ",
      name: "Fatima Al-Zahrawi",
      title: "SAP Cloud Architect",
      company: "Accenture",
      color: "#2563EB",
      quote: "The Cloud ALM and BTP content is exactly what I needed for my S/4HANA migration project. Clear, practical, no fluff.",
    },
    {
      initials: "RS",
      name: "Ravi Shankar",
      title: "Senior Basis Consultant",
      company: "TCS",
      color: "#059669",
      quote: "I have 12 years of SAP experience and I still learned things from the architecture blueprints. The content quality is exceptional.",
    },
    {
      initials: "EW",
      name: "Emma Wilson",
      title: "Basis Team Lead",
      company: "Capgemini",
      color: "#7C3AED",
      quote: "The AI Assistant is like having a senior Basis expert on call 24/7. Asked it about an RFC gateway issue and got a step-by-step fix instantly.",
    },
  ];

  return (
    <div className="bg-background text-foreground font-sans" style={{ overflowX: "clip" }}>

      {/* Navbar — sticky with scroll shadow */}
      <nav
        className="fixed top-0 w-full z-50 border-b border-border bg-white/95 backdrop-blur-sm transition-shadow duration-200"
        style={{ boxShadow: scrolled ? "0 2px 16px 0 rgba(0,0,0,0.08)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">BasisPro</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#topics" className="hover:text-primary transition-colors">Topics</a>
            <a href="#platform" className="hover:text-primary transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary" onClick={() => navigate("/dashboard")}>Sign In</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-5" onClick={() => navigate("/dashboard")}>
              Subscribe
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section — 50/50 split */}
      <section className="relative sap-hero-bg pb-0 overflow-hidden" style={{ paddingTop: 0, marginTop: 0 }}>
        {/* Spacer equal to fixed navbar height so content clears the navbar */}
        <div style={{ height: "64px" }} />
        <div className="pt-4 pb-0">
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left column */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold mb-8 rounded-full uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                  The SAP Basis Professional Platform
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white">
                  Master the Technical Backbone of Enterprise Systems.
                </h1>
                <p className="text-lg lg:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
                  The authoritative platform for SAP Basis engineers, consultants, and architects. Deep, precise, and built for professionals who run mission-critical landscapes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Primary CTA — solid white, blue text, no border */}
                  <button
                    className="inline-flex items-center justify-center h-12 px-8 text-base font-semibold rounded-md group transition-opacity hover:opacity-90"
                    style={{ background: "#ffffff", color: "#2563EB", border: "none" }}
                    onClick={() => navigate("/dashboard")}
                  >
                    Subscribe Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right column — auto-rotating carousel */}
              <div
                className="hidden lg:flex flex-col justify-center items-center gap-4"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* Carousel track */}
                <div className="relative w-full max-w-[500px]" style={{ height: "480px" }}>

                  {/* Arrow — left */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 border border-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Arrow — right */}
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 border border-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm"
                    aria-label="Next slide"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* ── Slide 1: Dashboard Overview ── */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: slideIndex === 0 ? 1 : 0, pointerEvents: slideIndex === 0 ? "auto" : "none" }}
                  >
                    <div className="w-full h-full bg-[#F8FAFC] rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                      {/* Slide label */}
                      <div className="bg-[#1E3A5F] px-4 py-2 flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#2563EB] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[9px]">B</span>
                        </div>
                        <span className="text-[11px] font-semibold text-white/90">Dashboard Overview</span>
                        <div className="ml-auto flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="text-[9px] text-white/60">Live</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {/* Welcome banner */}
                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3" style={{ borderLeft: "3px solid #2563EB" }}>
                          <div className="text-[11px] font-bold text-[#1e293b]">Welcome back, SAP Professional 👋</div>
                          <div className="text-[9px] text-[#64748b] mt-0.5">3 modules in progress · Last active today</div>
                          <div className="flex gap-1.5 mt-2">
                            {[["Continue Learning","#2563EB"],["Practice Interview","#DC2626"],["AI Assistant","#7C3AED"]].map(([lbl, col]) => (
                              <span key={lbl} className="px-2 py-0.5 rounded-full text-[8px] font-semibold text-white" style={{ background: col }}>{lbl}</span>
                            ))}
                          </div>
                        </div>
                        {/* 4 stat cards */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Learning Topics", value: "21",  color: "#2563EB", sub: "All modules",    icon: <BookOpen    className="w-3 h-3" style={{ color: "#2563EB" }} /> },
                            { label: "Interview Qs",    value: "303", color: "#DC2626", sub: "20 categories",  icon: <MessageSquare className="w-3 h-3" style={{ color: "#DC2626" }} /> },
                            { label: "SAP TCodes",      value: "372", color: "#059669", sub: "All categories", icon: <Terminal     className="w-3 h-3" style={{ color: "#059669" }} /> },
                            { label: "Live Modules",    value: "13",  color: "#7C3AED", sub: "of 21 live",     icon: <Bot         className="w-3 h-3" style={{ color: "#7C3AED" }} /> },
                          ].map((c, i) => (
                            <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-2.5" style={{ borderLeft: `2px solid ${c.color}` }}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${c.color}18` }}>{c.icon}</div>
                                <span className="text-[8px] font-semibold" style={{ color: c.color }}>{c.sub}</span>
                              </div>
                              <div className="text-lg font-extrabold leading-none" style={{ color: c.color }}>{c.value}</div>
                              <div className="text-[8px] text-[#64748b] font-medium mt-0.5">{c.label}</div>
                            </div>
                          ))}
                        </div>
                        {/* Progress bars */}
                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
                          <div className="text-[10px] font-bold text-[#1e293b] mb-2.5">Learning Progress</div>
                          {[
                            { label: "HANA Database", pct: 78, color: "#2563EB" },
                            { label: "Oracle DB",     pct: 65, color: "#059669" },
                            { label: "Sybase ASE",    pct: 45, color: "#7C3AED" },
                          ].map((b, i) => (
                            <div key={i} className={i < 2 ? "mb-2" : ""}>
                              <div className="flex justify-between mb-1">
                                <span className="text-[8px] text-[#475569] font-medium">{b.label}</span>
                                <span className="text-[8px] font-bold" style={{ color: b.color }}>{b.pct}%</span>
                              </div>
                              <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Mini chart */}
                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-[#1e293b]">Weekly Activity</span>
                            <div className="flex gap-2">
                              {[["Sessions","#2563EB"],["Guides","#059669"]].map(([l,c]) => (
                                <div key={l} className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} /><span className="text-[7px] text-[#94A3B8]">{l}</span></div>
                              ))}
                            </div>
                          </div>
                          <svg viewBox="0 0 200 40" className="w-full" style={{ height: "40px" }}>
                            {[10,20,30].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#F1F5F9" strokeWidth="1" />)}
                            <polyline points="0,30 33,22 66,14 100,18 133,8 166,12 200,6" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="0,36 33,32 66,28 100,30 133,24 166,26 200,22" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Slide 2: AI Assistant ── */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: slideIndex === 1 ? 1 : 0, pointerEvents: slideIndex === 1 ? "auto" : "none" }}
                  >
                    <div className="w-full h-full bg-[#F8FAFC] rounded-2xl overflow-hidden flex flex-col" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                      {/* Header */}
                      <div className="bg-[#1E3A5F] px-4 py-2.5 flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-7 h-7 bg-[#7C3AED] rounded-xl flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white">SAP Basis AI Assistant</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-[8px] text-white/60">Online · Powered by BasisPro AI</span>
                          </div>
                        </div>
                      </div>
                      {/* Chat messages */}
                      <div className="flex-1 p-4 space-y-3 overflow-hidden">
                        {/* AI greeting */}
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-[#7C3AED] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="bg-[#F0F2F5] rounded-[4px_16px_16px_16px] px-3 py-2 max-w-[80%]">
                            <p className="text-[10px] text-[#1e293b] leading-relaxed">Hello! I'm your SAP Basis AI Assistant. Ask me anything about system administration, migrations, or troubleshooting.</p>
                          </div>
                        </div>
                        {/* User message */}
                        <div className="flex items-start gap-2 justify-end">
                          <div className="bg-[#2563EB] rounded-[16px_16px_4px_16px] px-3 py-2 max-w-[80%]">
                            <p className="text-[10px] text-white leading-relaxed">How do I fix a transport RC8 error?</p>
                          </div>
                          <div className="w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white font-bold text-[8px]">SP</span>
                          </div>
                        </div>
                        {/* AI response */}
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-[#7C3AED] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="bg-[#F0F2F5] rounded-[4px_16px_16px_16px] px-3 py-2.5 max-w-[85%]">
                            <p className="text-[10px] font-semibold text-[#1e293b] mb-1.5">RC8 means the transport ended with errors. Here's how to fix it:</p>
                            <div className="space-y-1.5">
                              {[
                                { step: "1", text: "Go to STMS → Import Queue → find the failed transport" },
                                { step: "2", text: "Check the transport log in SE09 for the exact error code" },
                                { step: "3", text: "Common cause: missing objects → re-release from SE10 in source" },
                                { step: "4", text: "Re-import with option 'Ignore Prerequisites' if objects exist" },
                              ].map((s) => (
                                <div key={s.step} className="flex gap-1.5 items-start">
                                  <div className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-[7px] font-bold">{s.step}</span>
                                  </div>
                                  <span className="text-[9px] text-[#334155] leading-tight">{s.text}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {["STMS","SE09","SE10"].map(tc => (
                                <span key={tc} className="px-1.5 py-0.5 bg-[#7C3AED]/10 text-[#7C3AED] text-[8px] font-bold rounded">{tc}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Input bar */}
                      <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex-shrink-0">
                        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2">
                          <span className="text-[9px] text-[#94A3B8] flex-1">Ask about SAP Basis, HANA, migrations…</span>
                          <div className="w-5 h-5 bg-[#2563EB] rounded-lg flex items-center justify-center">
                            <Send className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Slide 3: Interview Prep ── */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: slideIndex === 2 ? 1 : 0, pointerEvents: slideIndex === 2 ? "auto" : "none" }}
                  >
                    <div className="w-full h-full bg-[#F8FAFC] rounded-2xl overflow-hidden flex flex-col" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                      {/* Header */}
                      <div className="bg-[#1E3A5F] px-4 py-2.5 flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-7 h-7 bg-[#DC2626] rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white">Interview Prep</div>
                          <div className="text-[8px] text-white/60 mt-0.5">SAP Basis · Architecture Track</div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-[10px] font-bold text-white">47 / 303</div>
                          <div className="text-[8px] text-white/60">questions</div>
                        </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                        {/* Progress bar */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[9px] text-[#64748b] font-medium">Overall Progress</span>
                            <span className="text-[9px] font-bold text-[#DC2626]">15.5%</span>
                          </div>
                          <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#DC2626]" style={{ width: "15.5%" }} />
                          </div>
                        </div>
                        {/* Question card */}
                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-[#DC2626]/10 text-[#DC2626] text-[8px] font-bold rounded-full">Question 47</span>
                            <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748b] text-[8px] font-medium rounded-full">Architecture</span>
                            <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] text-[8px] font-medium rounded-full">Medium</span>
                          </div>
                          <p className="text-[11px] font-semibold text-[#1e293b] leading-snug mb-4">
                            What is the difference between ABAP and Java stack in SAP NetWeaver?
                          </p>
                          <div className="space-y-2">
                            {[
                              { letter: "A", text: "ABAP stack runs ABAP programs; Java stack supports J2EE apps and portals", correct: true },
                              { letter: "B", text: "Both stacks are identical but serve different client types", correct: false },
                              { letter: "C", text: "Java stack is for database operations; ABAP for UI only", correct: false },
                              { letter: "D", text: "ABAP stack is deprecated in S/4HANA", correct: false },
                            ].map((opt) => (
                              <div
                                key={opt.letter}
                                className="flex items-start gap-2.5 p-2 rounded-lg border transition-colors"
                                style={{
                                  borderColor: opt.correct ? "#059669" : "#E2E8F0",
                                  background: opt.correct ? "#F0FDF4" : "transparent",
                                }}
                              >
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                                  style={{
                                    background: opt.correct ? "#059669" : "#F1F5F9",
                                    color: opt.correct ? "#fff" : "#64748b",
                                  }}
                                >
                                  {opt.letter}
                                </div>
                                <span className="text-[9px] leading-snug" style={{ color: opt.correct ? "#065F46" : "#334155", fontWeight: opt.correct ? 600 : 400 }}>
                                  {opt.text}
                                </span>
                                {opt.correct && (
                                  <svg className="w-3.5 h-3.5 text-green-600 ml-auto flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                  </svg>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Navigation row */}
                        <div className="flex items-center justify-between flex-shrink-0">
                          <button className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[9px] font-semibold text-[#64748b] bg-white">← Previous</button>
                          <span className="text-[9px] text-[#94A3B8]">47 of 303 completed</span>
                          <button className="px-3 py-1.5 rounded-lg text-[9px] font-semibold text-white bg-[#DC2626]">Next Question →</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: slideIndex === i ? "24px" : "8px",
                        height: "8px",
                        background: slideIndex === i ? "#ffffff" : "rgba(255,255,255,0.4)",
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wave separator */}
          <div className="relative h-16 overflow-hidden">
            <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0 64L1440 64L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 64Z" fill="white"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 px-6 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center scroll-animate" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Topics Grid */}
      <section id="topics" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 scroll-animate">
            <div className="text-primary text-sm font-semibold mb-3 uppercase tracking-wider">Core Competency Areas</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Everything SAP Basis, in one place</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              From initial system setup to complex migrations and cloud transitions — comprehensive coverage across all eight critical Basis domains.
            </p>
          </div>

          {/* Two rows of 4 cards with extra row gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-9">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="topic-card group border border-border bg-white rounded-xl p-6 cursor-pointer scroll-animate"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <div className="mb-4 w-11 h-11 bg-accent rounded-lg flex items-center justify-center">
                  {topic.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{topic.title}</h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  {topic.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topic.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-medium px-2 py-0.5 bg-accent text-accent-foreground rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section — 9 cards, 3 columns */}
      <section className="py-24 px-6 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 scroll-animate">
            <div className="text-primary text-sm font-semibold mb-3 uppercase tracking-wider">Testimonials</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What Professionals Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trusted by SAP Basis experts worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-[#F8FAFC] border border-border rounded-2xl p-7 flex flex-col scroll-animate"
                style={{ transitionDelay: `${(i % 3) * 100}ms` }}
              >
                {/* 5 gold stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className="w-4 h-4" viewBox="0 0 20 20" fill="#F59E0B">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[15px] text-foreground leading-relaxed italic flex-1 mb-6">
                  "{t.quote}"
                </p>

                {/* Author — large bold initials avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: t.color, fontSize: "16px" }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.title} · {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Feature Section */}
      <section id="platform" className="py-24 px-6 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-animate">
            <div className="text-primary text-sm font-semibold mb-3 uppercase tracking-wider">Migration & Upgrades</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
              Execute Flawless Cloud to On-Premise Migrations
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Moving SAP workloads requires absolute precision. Get the exact methodologies, tools (SUM, DMO, SWPM), and runbooks that top-tier Basis consultants rely on to execute heterogeneous migrations with zero unplanned downtime.
            </p>
            <ul className="space-y-3 mb-8">
              {["DMO of SUM with System Move", "Hyperscaler Architecture Setup (AWS, Azure, GCP)", "Downtime Optimization Techniques", "OS/DB Migration Runbooks"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-3 h-3 text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="bg-primary text-white hover:bg-primary/90 font-semibold">
              Explore Migration Guides
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="scroll-animate" style={{ transitionDelay: "150ms" }}>
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="border-b border-border bg-card px-5 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-muted-foreground font-medium">Migration Checklist — Phase 3: Cutover</span>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { done: true, text: "Pre-migration system backup completed" },
                  { done: true, text: "SUM tool initialized — SP level confirmed" },
                  { done: true, text: "SPDD/SPAU modifications reviewed" },
                  { done: false, text: "Database export via R3load in progress..." },
                  { done: false, text: "Target system import pending" },
                  { done: false, text: "Post-migration smoke tests" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${item.done ? "bg-primary" : "border-2 border-border"}`}>
                      {item.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>{item.text}</span>
                    {!item.done && i === 3 && <span className="ml-auto text-xs text-primary font-semibold animate-pulse">Live</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAC + SolMan Feature */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 scroll-animate">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="border-b border-border px-5 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Solution Manager — System Monitoring</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  All Systems Healthy
                </span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { sys: "PRD (Production)", type: "S/4 HANA 2023", status: "green", cpu: "41%", mem: "78%" },
                  { sys: "QAS (Quality)", type: "S/4 HANA 2023", status: "green", cpu: "12%", mem: "52%" },
                  { sys: "DEV (Development)", type: "S/4 HANA 2023", status: "green", cpu: "8%", mem: "38%" },
                  { sys: "SolMan (HA)", type: "Solution Manager 7.2", status: "yellow", cpu: "67%", mem: "84%" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border text-sm">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${row.status === "green" ? "bg-green-500" : "bg-yellow-400"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{row.sys}</div>
                      <div className="text-xs text-muted-foreground">{row.type}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-muted-foreground">CPU <span className="font-semibold text-foreground">{row.cpu}</span></div>
                      <div className="text-xs text-muted-foreground">MEM <span className="font-semibold text-foreground">{row.mem}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 scroll-animate" style={{ transitionDelay: "150ms" }}>
            <div className="text-primary text-sm font-semibold mb-3 uppercase tracking-wider">Monitoring & Analytics</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
              Architect Centralized Monitoring Across Your Landscape
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Master Solution Manager Focused Run, Cloud ALM Operations, and SAP Analytics Cloud configuration. Set up live data connections, configure SSO across complex landscapes, and establish proactive monitoring topologies.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Availability Target", value: "99.9%" },
                { label: "Latency SLA", value: "<50ms" },
                { label: "Monitoring Scenarios", value: "40+" },
                { label: "Alert Configurations", value: "120+" },
              ].map((s, i) => (
                <div key={i} className="sap-stat p-4 rounded-xl">
                  <div className="text-2xl font-bold text-primary mb-1">{s.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
                </div>
              ))}
            </div>
            <Button className="bg-primary text-white hover:bg-primary/90 font-semibold">
              Explore Monitoring Guides
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 sap-hero-bg">
        <div className="max-w-lg mx-auto scroll-animate">
          {/* Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold mb-5 rounded-full uppercase tracking-wide">
              Simple Pricing
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
              One plan. Full access.
            </h2>
            <p className="text-lg text-white/75">
              Everything you need to master SAP Basis, at one straightforward price.
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "32px" }}>
            {/* Monthly label */}
            <span style={{
              fontSize: "14px",
              fontWeight: !isYearly ? 700 : 400,
              color: !isYearly ? "#ffffff" : "rgba(255,255,255,0.4)",
              transition: "color 0.25s, font-weight 0.25s",
              whiteSpace: "nowrap",
            }}>
              Monthly
            </span>

            {/* Track */}
            <button
              onClick={() => setIsYearly((v) => !v)}
              aria-label="Toggle billing period"
              style={{
                position: "relative",
                flexShrink: 0,
                width: "52px",
                height: "28px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                outline: "none",
                background: isYearly ? "#22C55E" : "rgba(255,255,255,0.3)",
                transition: "background 0.25s",
                padding: 0,
              }}
            >
              {/* Knob — 22×22px, 3px gap on each side */}
              <span style={{
                position: "absolute",
                top: "3px",
                left: "0px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                transform: isYearly ? "translateX(27px)" : "translateX(3px)",
                transition: "transform 0.25s ease",
              }} />
            </button>

            {/* Yearly label + badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontSize: "14px",
                fontWeight: isYearly ? 700 : 400,
                color: isYearly ? "#ffffff" : "rgba(255,255,255,0.4)",
                transition: "color 0.25s, font-weight 0.25s",
                whiteSpace: "nowrap",
              }}>
                Yearly
              </span>
              {isYearly && (
                <span style={{
                  padding: "3px 10px",
                  background: "#22C55E",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                }}>
                  Save 38%
                </span>
              )}
            </div>
          </div>

          {/* Pricing card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Price header */}
            <div className="px-8 pt-8 pb-6 border-b border-border text-center">
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-5xl font-extrabold text-foreground">
                  {isYearly ? "$149" : "$19.99"}
                </span>
                <span className="text-muted-foreground font-medium mb-2">
                  {isYearly ? "/year" : "/month"}
                </span>
              </div>
              {isYearly && (
                <div className="text-sm text-muted-foreground mb-1">
                  <span className="line-through mr-1 text-[#94A3B8]">$19.99/month</span>
                  <span className="font-semibold text-green-600">$12.50/month</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {isYearly ? "Billed annually, cancel anytime" : "Billed monthly, cancel anytime"}
              </p>
            </div>

            {/* Features */}
            <div className="px-8 py-6">
              <div className="space-y-3 mb-7">
                {[
                  "Everything SAP Basis in one place",
                  "AI Assistant for instant troubleshooting",
                  "303 real interview questions",
                  "372 SAP TCodes reference",
                  "Step-by-step migration runbooks",
                  "Cancel anytime, no commitment",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#1e293b" }}>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90"
                style={{ background: "#2563EB" }}
                onClick={() => navigate("/dashboard")}
              >
                Subscribe Now
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Secure checkout · Instant access · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white pt-10 pb-10 px-6" style={{ margin: 0, paddingBottom: "40px" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">BasisPro</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/status" className="hover:text-primary transition-colors">Status</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BasisPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
