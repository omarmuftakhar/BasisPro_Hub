import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Server, Database, Cloud, Shield, Activity, RefreshCw,
  BookOpen, FileText, Map, Terminal, LayoutGrid, Plug,
  Settings, BarChart3, Brain, Bell, Search, User,
  ChevronRight, ChevronDown, TrendingUp, Users, BookMarked,
  Cpu, Globe, Bot, LogOut, Home, HardDrive, Layers,
  MonitorDot, Workflow, FolderOpen, Key, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  { name: "S/4 HANA", value: 28 },
  { name: "HANA DB", value: 20 },
  { name: "Cloud ALM", value: 15 },
  { name: "BTP", value: 13 },
  { name: "AWS/Azure", value: 12 },
  { name: "Others", value: 12 },
];

const PIE_COLORS = ["#1565C0", "#1976D2", "#2196F3", "#42A5F5", "#90CAF9", "#BBDEFB"];

const recentActivity = [
  { user: "Rahul M.", action: "Opened HANA Scale-out Blueprint", time: "2 min ago", cat: "HANA Database" },
  { user: "Sarah K.", action: "Completed Linux Runbook: Kernel Params", time: "11 min ago", cat: "Linux" },
  { user: "James T.", action: "Used AI Assistant — BTP Integration query", time: "18 min ago", cat: "AI Assistant" },
  { user: "Priya S.", action: "Viewed SolMan Focused Run Setup Guide", time: "34 min ago", cat: "Solution Manager" },
  { user: "Chen W.", action: "Downloaded SAP S/4 HANA Sizing Blueprint", time: "52 min ago", cat: "SAP on AWS" },
  { user: "Amir N.", action: "Reviewed Cloud ALM Operations Guide", time: "1h ago", cat: "Cloud ALM" },
];

const topContent = [
  { title: "HANA Scale-out Architecture Blueprint", category: "HANA Database", views: 1240, trend: "+12%" },
  { title: "S/4 HANA System Conversion Runbook", category: "Guides", views: 980, trend: "+8%" },
  { title: "SAP on AWS — Instance Sizing Guide", category: "SAP on AWS", views: 872, trend: "+21%" },
  { title: "BTP Cloud Connector Setup", category: "Cloud Connectors", views: 754, trend: "+5%" },
  { title: "Fiori Launchpad Configuration TCodes", category: "SAP Basis TCodes", views: 631, trend: "+3%" },
];

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
      { label: "All Runbooks", icon: <BookOpen className="w-4 h-4" />, id: "runbooks", badge: 47 },
      { label: "Guides", icon: <FileText className="w-4 h-4" />, id: "guides", badge: 120 },
      { label: "Blueprints", icon: <Map className="w-4 h-4" />, id: "blueprints", badge: 38 },
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
    group: "AI",
    items: [
      { label: "AI Assistant", icon: <Bot className="w-4 h-4" />, id: "ai", badge: 3 },
    ],
  },
];

const kpis = [
  { label: "Active Users", value: "1,284", change: "+14%", icon: <Users className="w-5 h-5 text-primary" />, color: "bg-blue-50 border-blue-100" },
  { label: "Modules Covered", value: "22", change: "All live", icon: <Zap className="w-5 h-5 text-indigo-500" />, color: "bg-indigo-50 border-indigo-100" },
  { label: "Guides & Runbooks", value: "205", change: "+8 this week", icon: <BookMarked className="w-5 h-5 text-green-600" />, color: "bg-green-50 border-green-100" },
  { label: "AI Sessions Today", value: "342", change: "+28%", icon: <Brain className="w-5 h-5 text-purple-600" />, color: "bg-purple-50 border-purple-100" },
];

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [activeId, setActiveId] = useState("overview");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Operating Systems": true,
    "Cloud Platforms": true,
    "Databases": true,
    "Resources": true,
    "Applications": true,
    "ALM & Operations": true,
    "Analytics & Cloud": true,
    "AI": true,
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-foreground overflow-hidden font-sans">

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-border flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">BasisPro</span>
        </div>

        {/* Overview link */}
        <div className="px-3 pt-3 pb-1 flex-shrink-0">
          <button
            onClick={() => setActiveId("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${activeId === "overview" ? "bg-primary text-white" : "text-foreground hover:bg-[#F0F4FF]"}`}
          >
            <Home className="w-4 h-4" />
            Overview
          </button>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-1 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.group} className="pt-1">
              <button
                onClick={() => toggleGroup(group.group)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              >
                <span>{group.group}</span>
                {expandedGroups[group.group]
                  ? <ChevronDown className="w-3 h-3" />
                  : <ChevronRight className="w-3 h-3" />}
              </button>
              {expandedGroups[group.group] && (
                <div className="space-y-0.5 mt-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeId === item.id
                          ? "bg-[#EBF3FD] text-primary font-semibold"
                          : "text-muted-foreground hover:bg-[#F0F4FF] hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">SAP Professional</div>
            <div className="text-xs text-muted-foreground">Premium Member</div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-8 h-16 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {activeId === "overview"
                ? "Dashboard Overview"
                : navGroups.flatMap((g) => g.items).find((i) => i.id === activeId)?.label ?? "Overview"}
            </h1>
            <p className="text-xs text-muted-foreground">Monday, April 21, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search modules, guides..."
                className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-primary/30 w-60"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-[#F5F7FA] text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">SP</span>
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="p-8 space-y-8">

          {/* KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {kpis.map((kpi, i) => (
              <div key={i} className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 shadow-sm ${kpi.color}`}>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    {kpi.icon}
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{kpi.change}</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Activity chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-base">Weekly Platform Activity</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Sessions, guide views & AI queries this week</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />Sessions
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-300 inline-block" />Guides
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />AI
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1565C0" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1565C0" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gGuides" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#90CAF9" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#90CAF9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AB47BC" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#AB47BC" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FF" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    labelStyle={{ fontWeight: 700, color: "#1e293b" }}
                  />
                  <Area type="monotone" dataKey="sessions" stroke="#1565C0" strokeWidth={2} fill="url(#gSessions)" />
                  <Area type="monotone" dataKey="guides" stroke="#90CAF9" strokeWidth={2} fill="url(#gGuides)" />
                  <Area type="monotone" dataKey="ai" stroke="#AB47BC" strokeWidth={2} fill="url(#gAi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Module usage pie */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="font-bold text-foreground text-base">Module Popularity</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Content views by module</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={moduleUsageData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {moduleUsageData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {moduleUsageData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-base">Recent Activity</h3>
                  <p className="text-xs text-muted-foreground">Live feed across all members</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary text-xs font-semibold hover:bg-accent">
                  View all
                </Button>
              </div>
              <div className="divide-y divide-border">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-[#F9FBFF] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">{item.user.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">{item.user}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-accent text-accent-foreground rounded-full">{item.cat}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{item.action}</div>
                    </div>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0 mt-0.5">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Content */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-base">Top Content This Week</h3>
                  <p className="text-xs text-muted-foreground">Most viewed guides & blueprints</p>
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="divide-y divide-border">
                {topContent.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#F9FBFF] transition-colors cursor-pointer group">
                    <div className="w-7 h-7 rounded-lg bg-[#F0F4FF] flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.category} · {item.views.toLocaleString()} views</div>
                    </div>
                    <span className="text-xs font-bold text-green-600 flex-shrink-0">{item.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Status Bar */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground text-base">Your Learning Progress</h3>
                <p className="text-xs text-muted-foreground">Modules explored across the platform</p>
              </div>
              <span className="text-xs font-semibold text-primary bg-accent px-3 py-1 rounded-full">Premium Plan</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Guides Read", val: 28, max: 120, color: "#1565C0" },
                { label: "Blueprints Saved", val: 9, max: 38, color: "#7B1FA2" },
                { label: "Runbooks Completed", val: 14, max: 47, color: "#2E7D32" },
                { label: "AI Sessions Used", val: 52, max: 100, color: "#E65100" },
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-muted-foreground">{bar.label}</span>
                    <span className="font-bold text-foreground">{bar.val}/{bar.max}</span>
                  </div>
                  <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(bar.val / bar.max) * 100}%`, background: bar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Banner */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1565C0, #0D47A1)" }}>
            <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">AI Assistant — All Modules</div>
                  <div className="text-white/70 text-sm mt-0.5">Ask anything about SAP Basis — HANA, Cloud ALM, BTP, SolMan, migrations, TCodes, and more.</div>
                </div>
              </div>
              <button
                onClick={() => setActiveId("ai")}
                className="flex-shrink-0 bg-white text-primary font-bold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm"
              >
                Open AI Assistant
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
