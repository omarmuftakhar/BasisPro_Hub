import React, { useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Server, Database, Cloud, Shield, Activity, RefreshCw, MoveRight } from "lucide-react";

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in", "fade-in", "slide-in-from-bottom-8");
            entry.target.classList.remove("opacity-0");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      el.classList.add("opacity-0");
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const topics = [
    {
      title: "SAP S/4 HANA",
      desc: "Master the flagship next-gen ERP system. Deep dive into architecture, sizing, and daily operations of the digital core.",
      icon: <Server className="w-6 h-6 text-primary" />,
      stats: ["Architecture", "Sizing", "Fiori"]
    },
    {
      title: "HANA Platform",
      desc: "Command the in-memory database. High availability, disaster recovery, memory management, and scale-out scenarios.",
      icon: <Database className="w-6 h-6 text-primary" />,
      stats: ["In-Memory", "HA/DR", "Scale-out"]
    },
    {
      title: "Solution Manager",
      desc: "Centralized ALM and monitoring. Configure focused run, diagnostic agents, and system landscape directories.",
      icon: <Activity className="w-6 h-6 text-primary" />,
      stats: ["Monitoring", "ChaRM", "Focus Run"]
    },
    {
      title: "Cloud ALM",
      desc: "SAP's cloud-native application lifecycle management. Transition operations to the cloud with precision.",
      icon: <Cloud className="w-6 h-6 text-primary" />,
      stats: ["Implementation", "Operations", "Native Cloud"]
    },
    {
      title: "Cloud Connectors",
      desc: "Secure connectivity between on-premise systems and SAP Business Technology Platform (BTP).",
      icon: <Shield className="w-6 h-6 text-primary" />,
      stats: ["Security", "BTP", "Tunnels"]
    },
    {
      title: "SAC Configuration",
      desc: "SAP Analytics Cloud setup, live data connections, and SSO configurations across complex landscapes.",
      icon: <Terminal className="w-6 h-6 text-primary" />,
      stats: ["Live Data", "SSO", "SAML"]
    },
    {
      title: "Conversion & Upgrades",
      desc: "Flawless system conversion methodologies. Execute complex upgrade paths with zero unplanned downtime.",
      icon: <RefreshCw className="w-6 h-6 text-primary" />,
      stats: ["DMO", "SUM", "Downtime"]
    },
    {
      title: "Migration (Cloud/On-Prem)",
      desc: "Move massive SAP workloads seamlessly. OS/DB migrations, hyperscaler moves, and hybrid deployments.",
      icon: <MoveRight className="w-6 h-6 text-primary" />,
      stats: ["Hyperscalers", "OS/DB", "Hybrid"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg font-sans overflow-x-hidden scanline">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">BasisPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">Sign In</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm uppercase">Subscribe</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt="Data flows" className="w-full h-full object-cover opacity-20 mask-image:linear-gradient(to_bottom,black,transparent)" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-8 uppercase tracking-wider rounded-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              The Command Center for SAP Operations
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 glow-text text-white">
              Master the Technical Backbone of Enterprise Systems.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 font-light max-w-2xl">
              The authoritative platform for SAP Basis engineers, consultants, and architects. Deep, precise, and built for professionals who run mission-critical landscapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-mono uppercase tracking-wide group">
                Start Terminal Session
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary h-14 px-8 text-base font-mono uppercase tracking-wide">
                View Syllabus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Topics Grid */}
      <section className="py-24 px-6 border-t border-border/50 bg-card/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 scroll-animate">
            <h2 className="text-3xl font-display font-bold mb-4">Core Competencies</h2>
            <p className="text-muted-foreground font-mono text-sm">LOADING MODULES [8/8]...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, i) => (
              <div 
                key={i} 
                className="group border border-border bg-card/50 p-6 rounded-sm data-card-hover scroll-animate relative overflow-hidden"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <div className="mb-4 bg-background border border-border w-12 h-12 flex items-center justify-center rounded">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-white">{topic.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {topic.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {topic.stats.map(stat => (
                    <span key={stat} className="text-[10px] font-mono uppercase px-2 py-1 bg-secondary text-muted-foreground rounded-sm border border-border">
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Feature Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-animate">
            <div className="font-mono text-primary text-sm mb-4 tracking-wider uppercase">01 // Migration Protocol</div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight text-white">
              Execute Flawless Cloud to On-Premise Workloads
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Moving SAP workloads requires absolute precision. Learn the exact methodologies, tools (SUM, DMO, SWPM), and strategies to execute heterogeneous migrations with zero unplanned downtime. We provide the playbooks the top 1% use.
            </p>
            <ul className="space-y-4 font-mono text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                DMO of SUM with System Move
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Hyperscaler Architecture Setup
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Downtime Optimization Techniques
              </li>
            </ul>
          </div>
          <div className="relative scroll-animate" style={{ transitionDelay: "200ms" }}>
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative border border-border rounded-sm overflow-hidden bg-card">
              <div className="border-b border-border bg-background p-3 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <img src="/migration-bg.png" alt="Migration interface" className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard / Analytics Feature */}
      <section className="py-32 px-6 bg-card/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative scroll-animate">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative border border-border rounded-sm overflow-hidden bg-card">
              <div className="border-b border-border bg-background p-3 flex justify-between items-center">
                <span className="text-xs font-mono text-muted-foreground">SAC_CONFIG_NODE_01</span>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <img src="/dashboard-abstract.png" alt="Dashboard interface" className="w-full object-cover h-64 lg:h-96" />
            </div>
          </div>
          <div className="order-1 lg:order-2 scroll-animate" style={{ transitionDelay: "200ms" }}>
            <div className="font-mono text-primary text-sm mb-4 tracking-wider uppercase">02 // Deep Configuration</div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight text-white">
              Architect Centralized Monitoring & Analytics
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Master Solution Manager, Cloud ALM, and SAP Analytics Cloud configuration. Set up live data connections, configure single sign-on across complex landscapes, and establish proactive diagnostic agent topologies.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-border/50 p-4 bg-background rounded-sm">
                <div className="text-2xl text-white font-display mb-1">99.9%</div>
                <div className="text-xs font-mono text-muted-foreground uppercase">Availability Target</div>
              </div>
              <div className="border border-border/50 p-4 bg-background rounded-sm">
                <div className="text-2xl text-white font-display mb-1">&lt;50ms</div>
                <div className="text-xs font-mono text-muted-foreground uppercase">Latency SLA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center scroll-animate">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 glow-text text-white">
            Ready to elevate your Basis expertise?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join the elite network of SAP Basis professionals. Get unlimited access to advanced playbooks, configuration guides, and architecture blueprints.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-base font-mono uppercase tracking-wide">
              Subscribe Now
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary h-14 px-10 text-base font-mono uppercase tracking-wide">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg tracking-tight">BasisPro</span>
          </div>
          <div className="text-xs font-mono text-muted-foreground flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">SYS_STATUS</Link>
            <Link href="#" className="hover:text-primary transition-colors">TERMS</Link>
            <Link href="#" className="hover:text-primary transition-colors">PRIVACY</Link>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} BasisPro. Terminal Version 1.0.4
          </div>
        </div>
      </footer>
    </div>
  );
}