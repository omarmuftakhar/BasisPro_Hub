import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Server, Database, Cloud, Shield, Activity, BookOpen,
  FileText, Map, Terminal, LayoutGrid, Plug, BarChart3,
  Brain, Bell, Search, User, ChevronRight, ChevronDown,
  TrendingUp, Users, BookMarked, Cpu, Globe, Bot, LogOut,
  Home, HardDrive, Layers, MonitorDot, Workflow, FolderOpen,
  Key, Zap, Menu, X, RefreshCw, ArrowUpRight,
  Award, MessageSquare,
} from "lucide-react";
import ModuleView from "@/components/ModuleView";
import { moduleRegistry } from "@/data/moduleRegistry";
import TCodeLibrary from "@/components/TCodeLibrary";
import CareerRoadmap from "@/components/CareerRoadmap";
import CloudCertifications from "@/components/CloudCertifications";
import InterviewPrep from "@/components/InterviewPrep";

// ─── Data ──────────────────────────────────────────────────────────────
const activityData = [
  { day: "Mon", sessions: 42, guides: 18, ai: 12 },
  { day: "Tue", sessions: 58, guides: 24, ai: 19 },
  { day: "Wed", sessions: 51, guides: 21, ai: 15 },
  { day: "Thu", sessions: 74, guides: 31, ai: 28 },
  { day: "Fri", sessions: 69, guides: 27, ai: 24 },
  { day: "Sat", sessions: 38, guides: 14, ai: 8 },
  { day: "Sun", sessions: 29, guides: 10, ai: 6 },
];

const moduleUsageData = [
  { name: "HANA Database", value: 26 },
  { name: "Oracle", value: 22 },
  { name: "Sybase ASE", value: 18 },
  { name: "MaxDB", value: 14 },
  { name: "Cloud ALM", value: 12 },
  { name: "Others", value: 8 },
];
const PIE_COLORS = ["#1565C0", "#1976D2", "#2196F3", "#42A5F5", "#90CAF9", "#BBDEFB"];

const recentActivity = [
  { user: "Rahul M.", action: "Opened HANA System Replication setup guide", time: "2 min ago", cat: "HANA Database" },
  { user: "Sarah K.", action: "Reviewed Oracle brbackup Runbook", time: "11 min ago", cat: "Oracle" },
  { user: "James T.", action: "Studied Sybase ASE Always-On warm standby", time: "22 min ago", cat: "Sybase ASE" },
  { user: "Priya S.", action: "Opened MaxDB Hot Standby Architecture node", time: "38 min ago", cat: "MaxDB" },
  { user: "Chen W.", action: "Used AI Assistant — HANA HSR failover query", time: "55 min ago", cat: "AI Assistant" },
  { user: "Amir N.", action: "Reviewed Oracle RAC Cache Fusion guide", time: "1h ago", cat: "Oracle" },
];

const topContent = [
  { title: "HANA System Replication (HSR) Setup", category: "HANA Database", views: 1_540, trend: "+18%" },
  { title: "Oracle 19c Upgrade with SAP Bundle Patch", category: "Oracle", views: 1_210, trend: "+14%" },
  { title: "Sybase ASE Backup & Recovery Procedure", category: "Sybase ASE", views: 980, trend: "+9%" },
  { title: "MaxDB Hot Standby Architecture", category: "MaxDB", views: 754, trend: "+22%" },
  { title: "Oracle brbackup — Online Backup Guide", category: "Oracle", views: 631, trend: "+6%" },
];

const moduleProgress = [
  { label: "HANA Database", nodes: 7, total: 7, color: "#0070F2" },
  { label: "Oracle", nodes: 10, total: 10, color: "#C62828" },
  { label: "Sybase ASE", nodes: 10, total: 10, color: "#E53935" },
  { label: "MaxDB", nodes: 9, total: 9, color: "#E65100" },
];

// ─── Nav definition ────────────────────────────────────────────────────
type NavItem = { label: string; icon: React.ReactNode; id: string; badge?: number };
type NavGroup = { group: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    group: "Operating Systems",
    items: [
      { label: "Linux", icon: <Terminal className="w-4 h-4" />, id: "linux" },
      { label: "Windows", icon: <MonitorDot className="w-4 h-4" />, id: "windows" },
    ],
  },
  {
    group: "Cloud Platforms",
    items: [
      { label: "SAP on AWS", icon: <Cloud className="w-4 h-4" />, id: "aws" },
      { label: "SAP on GCP", icon: <Globe className="w-4 h-4" />, id: "gcp" },
      { label: "SAP on Azure", icon: <Layers className="w-4 h-4" />, id: "azure" },
    ],
  },
  {
    group: "Databases",
    items: [
      { label: "HANA Database", icon: <Database className="w-4 h-4" />, id: "hana" },
      { label: "Sybase ASE", icon: <HardDrive className="w-4 h-4" />, id: "sybase" },
      { label: "MaxDB", icon: <Server className="w-4 h-4" />, id: "maxdb" },
      { label: "Oracle", icon: <Cpu className="w-4 h-4" />, id: "oracle" },
    ],
  },
  {
    group: "Resources",
    items: [
      { label: "SAP Basis TCodes", icon: <Key className="w-4 h-4" />, id: "tcodes" },
    ],
  },
  {
    group: "Applications",
    items: [
      { label: "Fiori & UI5", icon: <LayoutGrid className="w-4 h-4" />, id: "fiori" },
      { label: "BTP & Integrations", icon: <Plug className="w-4 h-4" />, id: "btp" },
    ],
  },
  {
    group: "ALM & Operations",
    items: [
      { label: "Solution Manager", icon: <Activity className="w-4 h-4" />, id: "solman" },
      { label: "Cloud ALM", icon: <Workflow className="w-4 h-4" />, id: "cloudAlm" },
      { label: "Content Server DMS", icon: <FolderOpen className="w-4 h-4" />, id: "dms" },
    ],
  },
  {
    group: "Analytics & Cloud",
    items: [
      { label: "SAC Configuration", icon: <BarChart3 className="w-4 h-4" />, id: "sac" },
      { label: "Cloud Connectors", icon: <Shield className="w-4 h-4" />, id: "connectors" },
    ],
  },
  {
    group: "Career",
    items: [
      { label: "Roadmap", icon: <TrendingUp className="w-4 h-4" />, id: "roadmap" },
      { label: "Cloud Certifications", icon: <Award className="w-4 h-4" />, id: "certifications" },
      { label: "Interview Prep", icon: <MessageSquare className="w-4 h-4" />, id: "interviewPrep" },
    ],
  },
  {
    group: "AI",
    items: [
      { label: "AI Assistant", icon: <Bot className="w-4 h-4" />, id: "ai", badge: 3 },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

const TOTAL_INTERVIEW_QS = 303;
const TOTAL_TCODES = 372;

// ─── Custom tooltip ─────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── AI Assistant ───────────────────────────────────────────────────────
interface StructuredAIResponse {
  title: string;
  summary: string;
  steps: string[];
  tcodes: string[];
  nextAction: string;
}
interface ChatMessage {
  role: "user" | "assistant";
  text?: string;
  structured?: StructuredAIResponse;
}

const AI_RESPONSES: Array<{ keywords: string[]; response: StructuredAIResponse }> = [
  {
    keywords: ["hana", "hdb", "memory", "replication", "hsr", "delta merge", "backup"],
    response: {
      title: "HANA Troubleshooting Checklist",
      summary: "Systematic approach for HANA performance, memory, replication, and backup issues.",
      steps: [
        "Run hdbnsutil -sr_state to verify System Replication status",
        "Review nameserver alert log: /usr/sap/<SID>/HDB<nr>/work/nameserver_alert*.trc",
        "Open DBACOCKPIT → Memory Overview → compare Peak Used vs. Allocated memory",
        "Check System Replication: DBACOCKPIT → System Replication → status must be ACTIVE",
        "Query M_CS_TABLES where LAST_MERGE_REASON = 'CRITICAL' for delta merge pressure",
        "Verify backup catalog: DBACOCKPIT → Backup → Catalog — confirm last successful run",
        "Check M_SERVICES for any restarted or failed HANA services",
      ],
      tcodes: ["DBACOCKPIT", "HDB info", "hdbnsutil -sr_state", "M_SERVICES", "M_SYSTEM_REPLICATION"],
      nextAction: "If SR lag > 15 min, consider takeover (hdbnsutil --sr_takeover). Escalate to SAP if HANA services fail to restart. Reference SAP Notes 1999997 (sizing) and 2380176 (memory).",
    },
  },
  {
    keywords: ["transport", "stms", "rc8", "return code", "import", "tr", "ctc"],
    response: {
      title: "Transport Failure — STMS Analysis",
      summary: "Diagnose and resolve SAP transport import errors including RC8, RC12, and queue dependency issues.",
      steps: [
        "Open STMS → Import Queue → select failing TP → check Import Log",
        "RC8 = warning (import completed with non-critical issues — investigate but don't ignore)",
        "RC12 = error (import failed — stop and diagnose before retrying)",
        "Run tp showbuffer <SID> to list all pending transports and verify order",
        "Open SE09 / SE10 to check the transport's release status and object list",
        "Verify prerequisite TRs are present and imported in the correct sequence",
        "Review SM21 for system log entries at the exact time of the import failure",
      ],
      tcodes: ["STMS", "SE09", "SE10", "SM21", "SLOG"],
      nextAction: "Resolve the root cause, then re-import via STMS. Never skip RC12 — always investigate. Use SCC1 for emergency client copy if objects are missing.",
    },
  },
  {
    keywords: ["job", "sm37", "background", "batch", "schedule", "sla", "abap dump"],
    response: {
      title: "Background Job Failure — SM37 Workflow",
      summary: "Trace and resolve cancelled or stuck SAP background jobs using standard monitoring tools.",
      steps: [
        "SM37 → Job Selection → filter by status: Cancelled or Active",
        "Select the failed job → Job Log → identify the failing step and error message",
        "ST22 → ABAP Short Dump analysis for program-level errors",
        "SM50 / SM66 → verify work process availability (no free BGD WPs = queuing issue)",
        "SM12 → check enqueue lock entries that may be blocking the job",
        "DB13 → confirm no conflicting DBA operations (backup, stats) ran at the same time",
        "SM36 → reschedule with adjusted start condition or target server",
      ],
      tcodes: ["SM37", "SM21", "ST22", "SM50"],
      nextAction: "After fixing root cause, reschedule via SM36. Monitor the next execution via SM37 → Refresh. Check SM21 for system log entries around the failure time.",
    },
  },
  {
    keywords: ["rfc", "sm59", "connection", "destination", "abap", "idoc", "interface"],
    response: {
      title: "RFC Connection Issue — SM59 Diagnosis",
      summary: "Troubleshoot failed RFC destinations including connection test failures, auth errors, and gateway issues.",
      steps: [
        "SM59 → select RFC destination → run Connection Test and Authorization Test",
        "Check host name resolution: ping the target host from OS level",
        "Verify the RFC user exists and is not locked: SU01 on the target system",
        "Confirm S_RFC authorization object is assigned to the RFC user with correct values",
        "SM58 → review tRFC / qRFC queue for stuck or failed IDoc calls",
        "SMGW → Gateway Monitor → check for gateway errors, connection limits, or ACL blocks",
        "Verify SAP port (33<SysNr>) is reachable through firewalls between systems",
      ],
      tcodes: ["SM59", "SMGW", "SMICM", "ST22"],
      nextAction: "Test the connection after each corrective step. Use SMGW to reset the gateway if needed. Open an SAP ticket if auth errors persist after SU01 fix.",
    },
  },
  {
    keywords: ["tcode", "transaction", "se38", "se80", "su01", "sm50", "st05", "sm21"],
    response: {
      title: "SAP Basis TCode Quick Reference",
      summary: "Core transaction codes for SAP Basis operations, system monitoring, and administration tasks.",
      steps: [
        "SM50 — Work process overview: active sessions, stuck DIA/BGD processes",
        "SM37 — Background job monitor: status, logs, schedule, and re-run",
        "SM21 — System log: errors, warnings, logon failures across the instance",
        "ST05 — SQL/RFC/HTTP trace for performance and bottleneck analysis",
        "SM59 — RFC destination configuration, connection and authorization test",
        "SU01 — User administration: lock/unlock, password reset, validity dates",
        "STMS — Transport Management System: import queue and transport overview",
        "DBACOCKPIT — Database admin cockpit (HANA, Oracle, Sybase, MaxDB)",
        "SM12 — Lock entry management (enqueue monitoring)",
        "ST22 — ABAP short dump analysis",
        "RZ10 — Profile parameter maintenance (requires restart for most params)",
        "SMICM — Internet Communication Manager monitor (HTTP/HTTPS services)",
      ],
      tcodes: ["SM50", "SM37", "SM21", "ST05", "SM59", "SU01", "STMS", "DBACOCKPIT"],
      nextAction: "For a full searchable TCode library with descriptions and categories, navigate to SAP Basis TCodes in the sidebar.",
    },
  },
  {
    keywords: ["cloud", "aws", "azure", "gcp", "rise", "btp", "migration", "s4hana", "s/4"],
    response: {
      title: "SAP Cloud Migration Guidance",
      summary: "Key steps and considerations for migrating SAP landscapes to AWS, Azure, or GCP via RISE or customer-managed IaaS.",
      steps: [
        "Assessment: run SAP Readiness Check and Maintenance Planner for system compatibility",
        "RISE vs IaaS: RISE = SAP-managed infrastructure; IaaS = full customer control and responsibility",
        "Sizing: use HANA Hardware Directory and cloud-provider SAP sizing tools (AWS/Azure/GCP)",
        "Network: provision dedicated ExpressRoute / Direct Connect — minimize HANA round-trip latency",
        "HA/DR: deploy HANA System Replication (HSR) + Pacemaker cluster for ASCS high availability",
        "Migration rehearsal: run minimum 2 full test migrations before the production cutover",
        "Cutover: freeze transports 48h before, sync final HANA replication delta, validate post-migration",
      ],
      tcodes: ["DBACOCKPIT", "SMICM", "STMS", "RZ10"],
      nextAction: "Start with SAP Readiness Check. Engage SAP or a certified cloud partner for RISE migrations. Navigate to Cloud Platforms in the sidebar for AWS, Azure, and GCP module content.",
    },
  },
  {
    keywords: ["user", "su01", "locked", "password", "logon", "auth", "role", "profile"],
    response: {
      title: "User & Authorization Issue Analysis",
      summary: "Diagnose and resolve SAP user lock-outs, password issues, and authorization failures.",
      steps: [
        "SU01 → check user status: locked, password expired, validity date, and logon data",
        "SU53 → run as the affected user immediately after failure to see the missing authorization",
        "SUIM → User by Auth Value — find who currently holds a specific authorization object",
        "ST01 → authorization trace (use in DEV/QAS only — never leave running in production)",
        "AGR_USERS — table: view which roles are currently assigned to the user",
        "SU10 → mass user change tool for multiple users in one operation",
        "SCUL → CUA central user administration replication status check",
      ],
      tcodes: ["SU01", "SU53", "SUIM", "ST01"],
      nextAction: "Never assign SAP_ALL in production. Use role-based access with PFCG. Verify SU53 output before requesting new authorizations.",
    },
  },
  {
    keywords: ["performance", "slow", "st12", "st05", "workload", "load", "bottleneck", "response time"],
    response: {
      title: "Performance Analysis Workflow",
      summary: "Identify and resolve SAP system performance bottlenecks using trace and monitoring tools.",
      steps: [
        "ST05 → SQL trace: identify expensive SELECT statements and missing indexes",
        "ST12 → ABAP trace: pinpoint slow function calls, loops, or unnecessary DB hits",
        "SM50 / SM66 → work process utilization across all dialog and background instances",
        "OS07N → OS-level CPU, memory, and swap usage at time of slowness",
        "DBACOCKPIT → SQL Plan Cache → top SQL by total execution time",
        "ST03N → Workload Monitor: compare current response times vs. historical baseline",
        "SM21 → system log for errors and resource exhaustion at the time of issue",
      ],
      tcodes: ["ST05", "ST12", "SM50", "ST03N"],
      nextAction: "First determine scope: is it one user / one transaction, or system-wide? Scope defines the analysis path. Check OS07N first for system-wide resource saturation.",
    },
  },
];

const AI_DEFAULT_STRUCTURED: StructuredAIResponse = {
  title: "SAP Basis AI Assistant",
  summary: "I can help with SAP Basis topics. Try one of the quick buttons or type your question below.",
  steps: [
    "HANA — memory, replication, backup, delta merge issues",
    "Transport — STMS import failures, RC8/RC12 analysis",
    "Background Jobs — SM37 troubleshooting and scheduling",
    "RFC Connections — SM59 destination failures and gateway issues",
    "TCode Reference — quick lookup for common Basis transactions",
    "Cloud Migration — AWS, Azure, GCP, RISE with SAP guidance",
    "Performance — ST05, ST12, workload analysis and bottlenecks",
  ],
  tcodes: [],
  nextAction: "Type a question or use one of the quick buttons above to get started.",
};

function getAIResponse(input: string): StructuredAIResponse {
  const lower = input.toLowerCase();
  for (const entry of AI_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  return AI_DEFAULT_STRUCTURED;
}

const QUICK_PROMPTS = [
  { label: "HANA issue", q: "How do I troubleshoot a HANA memory or replication issue?" },
  { label: "Transport failure", q: "Transport import failed with return code 8. What do I check?" },
  { label: "Job failure", q: "A background job failed. Walk me through SM37 troubleshooting." },
  { label: "RFC issue", q: "An RFC connection in SM59 is failing. How do I fix it?" },
  { label: "TCode lookup", q: "What are the key TCodes for SAP Basis operations?" },
  { label: "Cloud migration", q: "What should I consider for SAP cloud migration to AWS or Azure?" },
];

function StructuredResponseCard({ r }: { r: StructuredAIResponse }) {
  return (
    <div className="space-y-3 max-w-full overflow-hidden">
      <div>
        <div className="font-bold text-foreground text-sm">{r.title}</div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed break-words">{r.summary}</p>
      </div>
      {r.steps.length > 0 && (
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Diagnostic Steps</div>
          <ol className="space-y-1.5">
            {r.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-foreground leading-relaxed break-words flex-1 min-w-0 max-w-full overflow-x-auto whitespace-pre-wrap">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {r.tcodes.length > 0 && (
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">TCodes / Commands</div>
          <div className="flex flex-wrap gap-1.5">
            {r.tcodes.map((tc, i) => (
              <code key={i} className="text-[11px] font-mono font-semibold bg-[#EBF3FD] text-primary border border-blue-100 px-2 py-0.5 rounded-md break-all">
                {tc}
              </code>
            ))}
          </div>
        </div>
      )}
      {r.nextAction && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">Next Action</div>
          <p className="text-xs text-amber-800 leading-relaxed break-words">{r.nextAction}</p>
        </div>
      )}
    </div>
  );
}

function DashboardAIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", structured: AI_DEFAULT_STRUCTURED },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const response = getAIResponse(q);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: q },
      { role: "assistant", structured: response },
    ]);
    setInput("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <div className="max-w-3xl space-y-5 min-w-0">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #0070F2 100%)" }}>
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">SAP Basis AI Assistant</div>
            <div className="text-white/70 text-sm">Ask about HANA, transports, jobs, RFC, performance, cloud, and more</div>
          </div>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((p) => (
          <button key={p.label} onClick={() => send(p.q)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/30 bg-[#EBF3FD] text-primary hover:bg-primary hover:text-white transition-all">
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col" style={{ height: "520px" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-w-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex max-w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              {msg.role === "user" ? (
                <div className="max-w-[80%] break-words overflow-hidden rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed bg-primary text-white">
                  {msg.text}
                </div>
              ) : (
                <div className="flex-1 min-w-0 max-w-full bg-[#F5F7FA] border border-border rounded-2xl rounded-bl-sm px-4 py-4 overflow-hidden">
                  {msg.structured
                    ? <StructuredResponseCard r={msg.structured} />
                    : <p className="text-sm text-foreground break-words whitespace-pre-wrap">{msg.text}</p>
                  }
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-border p-3 flex gap-2 bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about HANA, transports, performance, TCodes..."
            className="flex-1 min-w-0 text-sm px-4 py-2.5 bg-[#F5F7FA] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [, navigate] = useLocation();
  const [activeId, setActiveId] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Operating Systems": true,
    "Cloud Platforms": true,
    "Databases": true,
    "Resources": true,
    "Applications": true,
    "ALM & Operations": true,
    "Analytics & Cloud": true,
    "Career": true,
    "AI": true,
  });

  const toggleGroup = (group: string) =>
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  const handleNav = (id: string) => {
    setActiveId(id);
    setSidebarOpen(false);
  };

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Live clock
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateStr = now.toLocaleDateString("en-US", { timeZone: tz, weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Dynamic KPIs from real platform data
  const liveModuleCount = Object.keys(moduleRegistry).length;
  const totalTopics = allNavItems.length;
  const kpis = [
    {
      label: "Learning Topics",
      value: String(totalTopics),
      change: "All modules",
      icon: <BookMarked className="w-5 h-5" />,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50", ring: "ring-blue-100", text: "text-blue-600",
    },
    {
      label: "Modules with Content",
      value: String(liveModuleCount),
      change: `of ${totalTopics} live`,
      icon: <Database className="w-5 h-5" />,
      gradient: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50", ring: "ring-indigo-100", text: "text-indigo-600",
    },
    {
      label: "Interview Questions",
      value: String(TOTAL_INTERVIEW_QS),
      change: "20 categories",
      icon: <MessageSquare className="w-5 h-5" />,
      gradient: "from-rose-500 to-orange-500",
      bg: "bg-rose-50", ring: "ring-rose-100", text: "text-rose-600",
    },
    {
      label: "SAP TCodes",
      value: String(TOTAL_TCODES),
      change: "All categories",
      icon: <Terminal className="w-5 h-5" />,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50", ring: "ring-emerald-100", text: "text-emerald-600",
    },
  ];

  const activeLabel =
    activeId === "overview"
      ? "Dashboard Overview"
      : allNavItems.find((i) => i.id === activeId)?.label ?? "Overview";

  // ── Sidebar content (shared between overlay and desktop) ──────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3 flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #0070F2 0%, #1565C0 100%)" }}>
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center ring-1 ring-white/30">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <div>
          <span className="font-bold text-base text-white tracking-tight">BasisPro</span>
          <div className="text-[10px] text-white/60 font-medium">SAP Basis Platform</div>
        </div>
        {/* Mobile close button */}
        <button
          className="ml-auto md:hidden text-white/70 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Overview */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <button
          onClick={() => handleNav("overview")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeId === "overview"
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "text-foreground hover:bg-[#F0F4FF]"
          }`}
        >
          <Home className="w-4 h-4" />
          Overview
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-6 space-y-0.5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.group} className="pt-2">
            <button
              onClick={() => toggleGroup(group.group)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              <span>{group.group}</span>
              {expandedGroups[group.group]
                ? <ChevronDown className="w-3 h-3" />
                : <ChevronRight className="w-3 h-3" />}
            </button>
            {expandedGroups[group.group] && (
              <div className="space-y-0.5 mt-0.5">
                {group.items.map((item) => {
                  const isActive = activeId === item.id;
                  const hasContent = !!moduleRegistry[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                        isActive
                          ? "bg-[#EBF3FD] text-primary font-semibold"
                          : "text-muted-foreground hover:bg-[#F5F7FA] hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {hasContent && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" title="Content available" />
                      )}
                      {item.badge !== undefined && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3 flex-shrink-0 bg-[#FAFBFC]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">SP</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">SAP Professional</div>
          <div className="text-xs text-emerald-600 font-medium">● Premium Member</div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-[#F0F4FF]"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen min-h-0 bg-[#F5F7FA] text-foreground overflow-hidden font-sans">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-border flex flex-col h-screen min-h-0 overflow-hidden
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex-shrink-0
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-border px-4 md:px-6 h-16 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 -ml-1 rounded-xl hover:bg-[#F5F7FA] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-bold text-foreground truncate">{activeLabel}</h1>
              <p className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 tracking-tight">
                <span className="text-foreground font-semibold">{dateStr}</span>
                <span className="opacity-30">·</span>
                <span className="text-foreground font-semibold tabular-nums">{timeStr}</span>
                <span className="text-[11px] font-medium opacity-45">({tz})</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search modules, guides..."
                className="pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-primary/30 w-48 lg:w-60 transition-all"
              />
            </div>
            <button className="relative p-2 rounded-xl hover:bg-[#F5F7FA] text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">SP</span>
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="p-4 md:p-6 space-y-6">

          {/* ── Special views ─────────────────────────── */}
          {activeId === "tcodes" && <TCodeLibrary />}
          {activeId === "roadmap" && <CareerRoadmap />}
          {activeId === "certifications" && <CloudCertifications />}
          {activeId === "interviewPrep" && <InterviewPrep />}
          {activeId === "ai" && <DashboardAIAssistant />}

          {/* ── Module content ─────────────────────────── */}
          {!["tcodes","roadmap","certifications","interviewPrep","overview","ai"].includes(activeId) && (
            moduleRegistry[activeId] ? (
              <ModuleView module={moduleRegistry[activeId]} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#EBF3FD] flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Content Coming Soon</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Expert-level content for this module is being prepared. Check back in the next update.
                </p>
              </div>
            )
          )}

          {/* ── Overview dashboard ──────────────────────── */}
          {activeId === "overview" && (
            <>
              {/* AI Assistant Hero — top of overview */}
              <div
                className="rounded-2xl overflow-hidden shadow-lg"
                style={{ background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #0070F2 100%)" }}
              >
                <div className="px-6 md:px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">AI Assistant — All Modules</div>
                      <div className="text-white/70 text-sm mt-0.5">
                        Ask anything about SAP Basis — HANA, Oracle, Sybase, Cloud ALM, BTP, SolMan, TCodes, and more.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveId("ai")}
                    className="flex-shrink-0 bg-white text-primary font-bold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    Open AI Assistant
                  </button>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                  <div key={i} className={`bg-white rounded-2xl border ring-1 ${kpi.ring} p-4 md:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center text-white shadow-md`}>
                        {kpi.icon}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.bg} ${kpi.text}`}>
                        {kpi.change}
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{kpi.value}</div>
                      <div className="text-xs text-muted-foreground font-medium mt-0.5">{kpi.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Activity area chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-border shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-foreground">Weekly Platform Activity</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Sessions, guide views & AI queries this week</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />Sessions</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />Guides</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />AI</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={activityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0070F2" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#0070F2" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gGuides" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34D399" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gAI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="sessions" stroke="#0070F2" strokeWidth={2} fill="url(#gSessions)" />
                      <Area type="monotone" dataKey="guides" stroke="#34D399" strokeWidth={2} fill="url(#gGuides)" />
                      <Area type="monotone" dataKey="ai" stroke="#A78BFA" strokeWidth={2} fill="url(#gAI)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Module popularity pie */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-5">
                  <h2 className="font-bold text-foreground">Module Popularity</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-3">Content views by module</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={moduleUsageData} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={2} dataKey="value">
                        {moduleUsageData.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {moduleUsageData.map((m, i) => (
                      <div key={m.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                          <span className="text-muted-foreground">{m.name}</span>
                        </div>
                        <span className="font-semibold text-foreground">{m.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DB Module progress */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-foreground">Live Database Modules</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Content nodes loaded per database module</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-100">
                    4 / 4 Complete
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {moduleProgress.map((mod) => {
                    const pct = Math.round((mod.nodes / mod.total) * 100);
                    return (
                      <div key={mod.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{mod.label}</span>
                          <span className="text-xs text-muted-foreground">{mod.nodes} nodes</span>
                        </div>
                        <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: mod.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity + Top content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-foreground">Recent Activity</h2>
                    <button className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                      View all <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs mt-0.5">
                          {item.user.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium truncate">{item.action}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-primary bg-[#EBF3FD] px-1.5 py-0.5 rounded-full font-medium">{item.cat}</span>
                            <span className="text-[11px] text-muted-foreground">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top content */}
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-foreground">Top Viewed Content</h2>
                    <button className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                      View all <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {topContent.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F7FA] transition-colors cursor-pointer group">
                        <div className="w-7 h-7 rounded-lg bg-[#EBF3FD] flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{item.category}</p>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span className="text-xs font-semibold text-emerald-600">{item.trend}</span>
                          <span className="text-[11px] text-muted-foreground">{item.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </>
          )}

        </div>
      </main>
    </div>
  );
}
