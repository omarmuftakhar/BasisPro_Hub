import React, { useState } from "react";
import { CheckCircle2, Circle, ChevronRight, Lock, Star, Zap, Award, Globe, Shield, Database, Cloud, BookOpen, Code, Settings, TrendingUp } from "lucide-react";

interface RoadmapNode {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  status: "done" | "active" | "upcoming" | "optional";
  skills: string[];
  tools?: string[];
  detail?: string;
  category: "foundation" | "core" | "advanced" | "expert" | "leadership";
}

interface RoadmapTrack {
  id: string;
  title: string;
  color: string;
  bg: string;
  ring: string;
  nodes: RoadmapNode[];
}

const TRACKS: RoadmapTrack[] = [
  {
    id: "basis",
    title: "SAP Basis Core Path",
    color: "text-[#0070F2]",
    bg: "bg-[#0070F2]",
    ring: "ring-[#0070F2]/20",
    nodes: [
      {
        id: "foundation",
        title: "Foundation",
        subtitle: "0–1 year",
        icon: <BookOpen className="w-5 h-5" />,
        status: "done",
        category: "foundation",
        detail: "Start here. Learn SAP basics, the ABAP stack, and core Basis tools.",
        skills: ["SAP NetWeaver architecture", "ABAP/Java stack basics", "STMS transport management", "SM36/SM37 background jobs", "User administration (SU01/PFCG)", "System log analysis (SM21/ST22)"],
        tools: ["SAP GUI", "SAP Service Marketplace", "STMS", "SM36/SM37", "SU01"],
      },
      {
        id: "core-basis",
        title: "Core Basis Administration",
        subtitle: "1–3 years",
        icon: <Settings className="w-5 h-5" />,
        status: "active",
        category: "core",
        detail: "Develop depth in client management, transport system, and system monitoring.",
        skills: ["Client administration (SCC4, SCCL)", "Profile parameters (RZ10/RZ11)", "Workprocess management (SM50/SM66)", "Support packages (SPAM/SAINT)", "Spool & output management", "CCMS monitoring (RZ20/AL01)", "RFC/SM59 connectivity", "SICF HTTP services"],
        tools: ["DBACOCKPIT", "ST04/ST06", "RZ20", "STRUST", "SMICM"],
      },
      {
        id: "database",
        title: "Database Administration",
        subtitle: "2–4 years",
        icon: <Database className="w-5 h-5" />,
        status: "upcoming",
        category: "advanced",
        detail: "Deep expertise in SAP HANA and at least one AnyDB platform.",
        skills: ["SAP HANA architecture & administration", "HANA System Replication (HSR)", "HANA backup & recovery (HANA Studio / hdbsql)", "Oracle brbackup/brrestore", "Database performance (ST04/DBACOCKPIT)", "MaxDB administration", "Index server tuning"],
        tools: ["HANA Studio", "SAP HANA Cockpit", "hdbsql", "DBACOCKPIT", "brbackup"],
      },
      {
        id: "cloud",
        title: "Cloud & Hyperscaler",
        subtitle: "3–5 years",
        icon: <Cloud className="w-5 h-5" />,
        status: "upcoming",
        category: "advanced",
        detail: "Run SAP workloads on AWS, Azure, or GCP. Understand RISE with SAP.",
        skills: ["SAP on AWS (EC2 sizing, EBS, HSR HA)", "SAP on Azure (M-series VMs, ANF, ACSS)", "SAP on GCP (M3, Filestore, SCC)", "RISE with SAP architecture", "Cloud connector & BTP basics", "IaC for SAP (Terraform / AWS Launch Wizard)", "Cost optimization for SAP cloud"],
        tools: ["AWS Console", "Azure Portal", "GCP Console", "SAP BTP Cockpit", "Cloud Connector"],
      },
      {
        id: "ha-dr",
        title: "HA/DR & Security",
        subtitle: "3–5 years",
        icon: <Shield className="w-5 h-5" />,
        status: "upcoming",
        category: "advanced",
        detail: "Design and implement high availability and disaster recovery architectures.",
        skills: ["Pacemaker cluster configuration", "HANA HSR SYNC/ASYNC modes", "Azure ILB / AWS Overlay IP HA", "SAP license management (SLICENSE/USMM)", "Security audit log (SM19/SM20)", "SSL/TLS certificate management (STRUST)", "Penetration testing readiness for SAP"],
        tools: ["Pacemaker/corosync", "STRUST", "SM19/SM20", "SLICENSE"],
      },
      {
        id: "alm",
        title: "ALM & Change Management",
        subtitle: "4–6 years",
        icon: <Code className="w-5 h-5" />,
        status: "upcoming",
        category: "expert",
        detail: "Own the ALM toolchain — Solution Manager, Cloud ALM, and change processes.",
        skills: ["Solution Manager 7.2 setup & LMDB", "ChaRM (Change Request Management)", "Cloud ALM onboarding (/SDF/ALM_SETUP)", "SAP BTP integration basics", "Cloud Connector HA configuration", "Content Server DMS (OAC0/BTP DMS)", "SAC live connection setup"],
        tools: ["SOLMAN_SETUP", "LMDB", "DSWP", "/SDF/ALM_SETUP", "Cloud ALM Launchpad"],
      },
    ],
  },
];

const CAREER_LEVELS = [
  {
    title: "Junior Basis",
    years: "0–2 yrs",
    color: "from-blue-400 to-blue-600",
    ring: "ring-blue-200",
    desc: "Execute standard Basis tasks under supervision. Handle transport management, user admin, monitoring.",
    salary: "$55K–$80K",
    certs: ["C_TADM55_75", "C_HANATEC_18"],
  },
  {
    title: "Basis Consultant",
    years: "2–5 yrs",
    color: "from-indigo-500 to-violet-600",
    ring: "ring-indigo-200",
    desc: "Independent delivery of complex tasks. HANA DBA, HA/DR design, support package management.",
    salary: "$85K–$120K",
    certs: ["C_HANATEC_18", "C_S4ADM_2404", "SAP Certified Associate"],
  },
  {
    title: "Senior Basis",
    years: "5–10 yrs",
    color: "from-violet-500 to-purple-700",
    ring: "ring-purple-200",
    desc: "Architecture decisions, cloud migrations, SolMan/Cloud ALM strategy, security hardening.",
    salary: "$125K–$165K",
    certs: ["SAP Certified Professional", "AWS SAA-C03", "Azure AZ-104"],
  },
  {
    title: "Basis Architect",
    years: "10+ yrs",
    color: "from-purple-600 to-pink-600",
    ring: "ring-pink-200",
    desc: "Lead landscape transformations (RISE, S/4 conversions, cloud-native ECS). Design enterprise ALM strategies.",
    salary: "$170K–$220K+",
    certs: ["SAP Certified Enterprise Architect", "TOGAF", "AWS SAP Specialty"],
  },
];

const STATUS_STYLES = {
  done: { dot: "bg-emerald-500", card: "border-emerald-200 bg-emerald-50/30", badge: "bg-emerald-100 text-emerald-700" },
  active: { dot: "bg-[#0070F2] animate-pulse", card: "border-[#0070F2] bg-blue-50/40 ring-2 ring-[#0070F2]/20", badge: "bg-blue-100 text-blue-700" },
  upcoming: { dot: "bg-gray-300", card: "border-gray-200 bg-white", badge: "bg-gray-100 text-gray-500" },
  optional: { dot: "bg-amber-400", card: "border-amber-200 bg-amber-50/30", badge: "bg-amber-100 text-amber-700" },
};

const STATUS_LABEL = { done: "Completed", active: "In Progress", upcoming: "Next", optional: "Optional" };

export default function CareerRoadmap() {
  const [expandedNode, setExpandedNode] = useState<string | null>("core-basis");
  const [activeTrack] = useState("basis");

  const track = TRACKS.find((t) => t.id === activeTrack)!;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0070F2] to-violet-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Career Development</span>
        </div>
        <h1 className="text-2xl font-extrabold mb-1">SAP Basis Career Roadmap</h1>
        <p className="text-sm opacity-80 max-w-lg">
          Your structured path from Junior Basis to Enterprise Architect — skills, tools, certifications, and salary benchmarks at each stage.
        </p>
      </div>

      {/* Career Levels */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Career Progression</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAREER_LEVELS.map((level, i) => (
            <div key={i} className={`rounded-2xl border ring-1 ${level.ring} bg-white overflow-hidden`}>
              <div className={`h-2 bg-gradient-to-r ${level.color}`} />
              <div className="p-4">
                <div className="font-bold text-gray-900 text-sm">{level.title}</div>
                <div className="text-xs text-gray-400 mb-2">{level.years}</div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{level.desc}</p>
                <div className="text-xs font-semibold text-emerald-600 mb-2">{level.salary}</div>
                <div className="flex flex-wrap gap-1">
                  {level.certs.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap track */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Learning Path — {track.title}</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#0070F2] via-violet-400 to-gray-200 hidden sm:block" />

          <div className="space-y-3">
            {track.nodes.map((node, idx) => {
              const s = STATUS_STYLES[node.status];
              const isExpanded = expandedNode === node.id;
              return (
                <div key={node.id} className="relative sm:pl-14">
                  {/* Dot on timeline */}
                  <div className={`hidden sm:flex absolute left-0 top-4 w-12 items-center justify-center`}>
                    <div className={`w-4 h-4 rounded-full ${s.dot} ring-2 ring-white ring-offset-0 shadow-md flex-shrink-0`} />
                  </div>

                  {/* Card */}
                  <div
                    className={`border rounded-2xl transition-all cursor-pointer ${s.card}`}
                    onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#0070F2]/10 to-violet-100 flex items-center justify-center text-[#0070F2] flex-shrink-0`}>
                        {node.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">{node.title}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
                            {STATUS_LABEL[node.status]}
                          </span>
                        </div>
                        {node.subtitle && (
                          <div className="text-xs text-gray-400">{node.subtitle}</div>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      />
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-4 space-y-4">
                        {node.detail && (
                          <p className="text-sm text-gray-600">{node.detail}</p>
                        )}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills to Master</div>
                            <ul className="space-y-1">
                              {node.skills.map((skill) => (
                                <li key={skill} className="flex items-start gap-1.5 text-xs text-gray-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {node.tools && (
                            <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Tools / TCodes</div>
                              <div className="flex flex-wrap gap-1.5">
                                {node.tools.map((tool) => (
                                  <span key={tool} className="text-xs font-mono px-2 py-0.5 bg-[#0070F2]/10 text-[#0070F2] rounded-md">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tip banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-amber-800 mb-1">Pro Tip</div>
          <p className="text-xs text-amber-700 leading-relaxed">
            The fastest path to Senior Basis is hands-on cloud experience (AWS or Azure) + SAP HANA DBA skills. 
            Combine your existing Basis background with cloud certifications (AWS SAA or Azure AZ-104) 
            to unlock a 40–60% salary jump within 2–3 years.
          </p>
        </div>
      </div>
    </div>
  );
}
