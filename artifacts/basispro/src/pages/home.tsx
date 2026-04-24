import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Server, Database, Cloud, Shield, Activity, RefreshCw, MoveRight, BarChart3, ChevronRight, BookOpen, MessageSquare, Terminal, Bot } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [scrolled, setScrolled] = useState(false);

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
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">

      {/* Navbar — sticky with scroll shadow */}
      <nav
        className="fixed top-0 w-full z-50 border-b border-border bg-white/95 backdrop-blur-sm transition-shadow duration-200"
        style={{ boxShadow: scrolled ? "0 2px 16px 0 rgba(0,0,0,0.08)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">BasisPro</span>
          </div>
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
      <section className="relative pt-24 pb-0 overflow-hidden">
        <div className="sap-hero-bg pt-20 pb-0">
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
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {/* Secondary CTA — ghost white outline */}
                  <button
                    className="inline-flex items-center justify-center h-12 px-8 text-base font-semibold rounded-md transition-colors hover:bg-white/10"
                    style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.85)", color: "#ffffff" }}
                    onClick={() => document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View All Topics
                  </button>
                </div>
              </div>

              {/* Right column — enhanced dashboard mockup */}
              <div className="hidden lg:flex justify-center items-start">
                <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                  {/* Fake browser bar */}
                  <div className="bg-[#F1F5F9] border-b border-[#E2E8F0] px-4 py-2.5 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex-1 mx-3 bg-white border border-[#E2E8F0] rounded-md px-3 py-1 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#E2E8F0]" />
                      <span className="text-[11px] text-[#94A3B8] font-medium tracking-tight">basispro.app/dashboard</span>
                    </div>
                  </div>

                  {/* Mockup sidebar + content layout */}
                  <div className="flex" style={{ minHeight: "520px" }}>
                    {/* Mini sidebar */}
                    <div className="w-[52px] bg-[#1E3A5F] flex flex-col items-center pt-3 gap-2 flex-shrink-0">
                      <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-[10px]">B</span>
                      </div>
                      {[
                        { icon: "▪", active: true },
                        { icon: "◆", active: false },
                        { icon: "●", active: false },
                        { icon: "▲", active: false },
                        { icon: "■", active: false },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px]"
                          style={{ background: item.active ? "rgba(37,99,235,0.3)" : "transparent", color: item.active ? "#93C5FD" : "#64748B" }}
                        >
                          {item.icon}
                        </div>
                      ))}
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 bg-[#F8FAFC] p-4 overflow-hidden">
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-[11px] font-bold text-[#1e293b]">Dashboard Overview</div>
                          <div className="text-[9px] text-[#94A3B8]">Friday, April 24, 2026</div>
                        </div>
                        <div className="w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-[8px]">SP</span>
                        </div>
                      </div>

                      {/* Welcome banner */}
                      <div
                        className="bg-white rounded-lg border border-[#E2E8F0] p-2.5 mb-3"
                        style={{ borderLeft: "3px solid #2563EB" }}
                      >
                        <div className="text-[10px] font-bold text-[#1e293b]">Welcome back, SAP Professional 👋</div>
                        <div className="text-[8px] text-[#64748b] mt-0.5">3 modules in progress · Last active today</div>
                        <div className="flex gap-1.5 mt-2">
                          {["Continue Learning", "Practice Interview", "AI Assistant"].map((label, i) => (
                            <div
                              key={i}
                              className="px-1.5 py-0.5 rounded-full text-[7px] font-semibold text-white"
                              style={{ background: ["#2563EB", "#DC2626", "#7C3AED"][i] }}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4 stat cards 2x2 */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[
                          { label: "Learning Topics", value: "21", color: "#2563EB", sub: "All modules", icon: <BookOpen className="w-3 h-3" style={{ color: "#2563EB" }} /> },
                          { label: "Interview Qs", value: "303", color: "#DC2626", sub: "20 categories", icon: <MessageSquare className="w-3 h-3" style={{ color: "#DC2626" }} /> },
                          { label: "SAP TCodes", value: "372", color: "#059669", sub: "All categories", icon: <Terminal className="w-3 h-3" style={{ color: "#059669" }} /> },
                          { label: "Live Modules", value: "13", color: "#7C3AED", sub: "of 21 live", icon: <Bot className="w-3 h-3" style={{ color: "#7C3AED" }} /> },
                        ].map((card, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-lg border border-[#E2E8F0] p-2.5"
                            style={{ borderLeft: `2px solid ${card.color}` }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${card.color}18` }}>
                                {card.icon}
                              </div>
                              <span className="text-[8px] font-semibold" style={{ color: card.color }}>{card.sub}</span>
                            </div>
                            <div className="text-base font-extrabold leading-none" style={{ color: card.color }}>{card.value}</div>
                            <div className="text-[8px] text-[#64748b] font-medium mt-0.5">{card.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Learning Progress */}
                      <div className="bg-white rounded-lg border border-[#E2E8F0] p-2.5 mb-3">
                        <div className="text-[10px] font-bold text-[#1e293b] mb-2">Learning Progress</div>
                        {[
                          { label: "HANA Database", pct: 78, color: "#2563EB" },
                          { label: "Oracle DB", pct: 65, color: "#059669" },
                          { label: "Sybase ASE", pct: 45, color: "#7C3AED" },
                        ].map((bar, i) => (
                          <div key={i} className={i < 2 ? "mb-2" : ""}>
                            <div className="flex justify-between mb-1">
                              <span className="text-[8px] text-[#475569] font-medium">{bar.label}</span>
                              <span className="text-[8px] font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
                            </div>
                            <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: bar.color }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Weekly Activity mini chart */}
                      <div className="bg-white rounded-lg border border-[#E2E8F0] p-2.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[10px] font-bold text-[#1e293b]">Weekly Activity</div>
                          <div className="flex items-center gap-2">
                            {[{ label: "Sessions", color: "#2563EB" }, { label: "Guides", color: "#059669" }].map((l) => (
                              <div key={l.label} className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                                <span className="text-[7px] text-[#94A3B8]">{l.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* SVG sparkline chart */}
                        <svg viewBox="0 0 200 48" className="w-full" style={{ height: "48px" }}>
                          {/* Grid lines */}
                          {[12, 24, 36].map((y) => (
                            <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                          ))}
                          {/* Sessions line */}
                          <polyline
                            points="0,36 33,28 66,20 100,24 133,12 166,18 200,10"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Sessions fill */}
                          <polyline
                            points="0,36 33,28 66,20 100,24 133,12 166,18 200,10 200,48 0,48"
                            fill="url(#blueGrad)"
                            opacity="0.15"
                          />
                          {/* Guides line */}
                          <polyline
                            points="0,42 33,38 66,34 100,36 133,30 166,32 200,28"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563EB" />
                              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Day labels */}
                          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                            <text key={i} x={i * 33 + 1} y={47} fontSize="6" fill="#CBD5E1" textAnchor="middle">{d}</text>
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>
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

      {/* CTA Section */}
      <section id="pricing" className="py-24 px-6 sap-hero-bg">
        <div className="max-w-3xl mx-auto text-center scroll-animate">
          <h2 className="text-4xl lg:text-5xl font-bold mb-5 text-white leading-tight">
            Ready to elevate your Basis expertise?
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Join the network of SAP Basis professionals. Get unlimited access to advanced playbooks, configuration guides, and architecture blueprints.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-10 text-base font-semibold" onClick={() => navigate("/dashboard")}>
              Subscribe Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-12 px-10 text-base font-semibold bg-transparent">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">BasisPro</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Status</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BasisPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
