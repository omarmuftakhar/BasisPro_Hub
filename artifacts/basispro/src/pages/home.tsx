import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Server, Database, Cloud, Shield, Activity, RefreshCw, MoveRight, BarChart3, ChevronRight } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-white/95 backdrop-blur-sm">
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

      {/* Hero Section */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        <div className="sap-hero-bg pt-20 pb-0">
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold mb-8 rounded-full uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                The SAP Basis Professional Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white">
                Master the Technical Backbone of Enterprise Systems.
              </h1>
              <p className="text-lg lg:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
                The authoritative platform for SAP Basis engineers, consultants, and architects. Deep, precise, and built for professionals who run mission-critical landscapes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-base font-semibold group" onClick={() => navigate("/dashboard")}>
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-12 px-8 text-base font-semibold bg-transparent">
                  View All Topics
                </Button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Migration Feature Section */}
      <section id="platform" className="py-24 px-6 bg-card border-y border-border">
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
