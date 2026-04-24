import React, { useState } from "react";
import {
  ExternalLink, ChevronRight, ChevronDown, AlertTriangle,
  Lightbulb, BookOpen, Link2, Hash, CheckCircle2, Star,
  Database, Server, Cloud, Activity, Archive, Settings,
  Users, Monitor, Package, Power, TrendingUp, HelpCircle,
  GraduationCap, GitFork, GitBranch, Shuffle, ArrowUpCircle,
  Wrench, Shield, Layers, BarChart3, RefreshCw, RotateCcw,
  HardDrive, Bell, Zap, Globe,
} from "lucide-react";
import type { ModuleData, ContentNode, ModuleSection } from "@/data/moduleContent";

const ICON_MAP: Record<string, React.ReactNode> = {
  Database: <Database className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Cloud: <Cloud className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Archive: <Archive className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Power: <Power className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  GitFork: <GitFork className="w-5 h-5" />,
  GitBranch: <GitBranch className="w-5 h-5" />,
  Shuffle: <Shuffle className="w-5 h-5" />,
  ArrowUpCircle: <ArrowUpCircle className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  RotateCcw: <RotateCcw className="w-5 h-5" />,
  HardDrive: <HardDrive className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
};

const isValidExternalUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

function NodeCard({ node, color }: { node: ContentNode; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const icon = ICON_MAP[node.icon] ?? <Database className="w-5 h-5" />;

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card header */}
      <button
        className="w-full text-left px-6 py-4 flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-foreground text-base">{node.title}</h3>
            {node.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
                {node.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{node.summary}</p>
        </div>
        <div className="flex-shrink-0 mt-1 text-muted-foreground">
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border px-6 py-5 space-y-5 bg-[#FAFBFF]">

          {/* Warning */}
          {node.warning && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-red-700 mb-1">Important Warning</div>
                <p className="text-sm text-red-600">{node.warning}</p>
              </div>
            </div>
          )}

          {/* Tip */}
          {node.tip && (
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-amber-700 mb-1">Consultant Tip</div>
                <p className="text-sm text-amber-700">{node.tip}</p>
              </div>
            </div>
          )}

          {/* Step-by-step */}
          {node.steps && node.steps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: color }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">Step-by-Step Procedure</h4>
              </div>
              <ol className="space-y-2">
                {node.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white mt-0.5"
                      style={{ background: color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-relaxed font-mono text-xs bg-[#F0F4FF] px-3 py-1.5 rounded-lg flex-1 border border-blue-100">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Key points */}
          {node.keyPoints && node.keyPoints.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4" style={{ color }} />
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">Key Points</h4>
              </div>
              <ul className="space-y-2">
                {node.keyPoints.map((kp, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
                    <span className="leading-relaxed">{kp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TCodes */}
          {node.tcodes && node.tcodes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">TCodes / Commands</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {node.tcodes.map((tc, i) => (
                  <code key={i} className="text-xs font-mono bg-[#F0F4FF] text-primary border border-blue-100 px-2.5 py-1 rounded-md font-semibold">
                    {tc}
                  </code>
                ))}
              </div>
            </div>
          )}

          {/* SAP Notes */}
          {node.sapNotes && node.sapNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">Relevant SAP Notes</h4>
              </div>
              <div className="space-y-1.5">
                {node.sapNotes.map((n, i) => (
                  <a
                    key={i}
                    href={`https://me.sap.com/notes/${n.note}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 bg-white border border-border rounded-lg hover:border-primary/40 hover:bg-accent transition-colors group"
                  >
                    <span className="text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded font-mono">
                      {n.note}
                    </span>
                    <span className="text-sm text-foreground flex-1">{n.desc}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {node.links && node.links.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">Official Documentation</h4>
              </div>
              <div className="space-y-1.5">
                {node.links.map((link, i) => {
                  const valid = isValidExternalUrl(link.url);
                  if (!valid) {
                    if (import.meta.env.DEV) console.warn("[BasisPro] Invalid module link", link);
                    return (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-border rounded-lg opacity-60 cursor-not-allowed">
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                        <span className="text-sm text-muted-foreground flex-1">{link.label}</span>
                        <span className="text-xs text-gray-400 italic">Link pending</span>
                      </div>
                    );
                  }
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 bg-white border border-border rounded-lg hover:border-primary/40 hover:bg-accent transition-colors group"
                    >
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                      <span className="text-sm text-foreground flex-1">{link.label}</span>
                      {link.note && <span className="text-xs text-muted-foreground">{link.note}</span>}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionAccordion({ section, color }: { section: ModuleSection; color: string }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 mb-3 group"
      >
        <div className="w-1 h-5 rounded-full" style={{ background: color }} />
        <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{section.title}</h2>
        <span className="text-xs text-muted-foreground bg-[#F0F4FF] px-2 py-0.5 rounded-full ml-1">
          {section.nodes.length} {section.nodes.length === 1 ? "topic" : "topics"}
        </span>
        <div className="flex-1 h-px bg-border" />
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="grid gap-4 mb-8">
          {section.nodes.map((node) => (
            <NodeCard key={node.id} node={node} color={color} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModuleView({ module }: { module: ModuleData }) {
  return (
    <div>
      {/* Module Header */}
      <div className="rounded-2xl mb-8 p-6 text-white" style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)` }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Database Module</div>
            <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
            {module.version && (
              <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {module.version}
              </div>
            )}
            <p className="text-white/80 text-sm leading-relaxed max-w-3xl">{module.overview}</p>
          </div>
          {module.sourceUrl && (
            <a
              href={module.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              SAP Help Portal
            </a>
          )}
        </div>

        {/* Quick stats */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sections", value: module.sections.length },
            { label: "Topics", value: module.sections.reduce((acc, s) => acc + s.nodes.length, 0) },
            { label: "SAP Notes", value: module.sections.reduce((acc, s) => acc + s.nodes.reduce((a, n) => a + (n.sapNotes?.length ?? 0), 0), 0) },
            { label: "Docs Linked", value: module.sections.reduce((acc, s) => acc + s.nodes.reduce((a, n) => a + (n.links?.length ?? 0), 0), 0) },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-white/70 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {module.sections.map((section) => (
          <SectionAccordion key={section.id} section={section} color={module.color} />
        ))}
      </div>
    </div>
  );
}
