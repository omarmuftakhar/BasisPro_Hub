import React, { useState } from "react";
import {
  BookOpen, ChevronDown, ChevronRight, CheckCircle2,
  Activity, Wifi, Server,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuideStep {
  step: string;
  tcode?: string;
  note?: string;
}

interface Guide {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  icon: React.ReactNode;
  summary: string;
  steps: GuideStep[];
}

// ─── Guide Data ───────────────────────────────────────────────────────────────

const GUIDES: Guide[] = [
  {
    id: "bg-job-failure",
    title: "Background Job Failure Handling",
    category: "Job Management",
    categoryColor: "bg-amber-100 text-amber-700",
    icon: <Activity className="w-4 h-4 text-amber-600" />,
    summary: "Diagnose and resolve failed background jobs — from log analysis to root cause identification.",
    steps: [
      {
        step: "Open SM37 and filter for cancelled or failed jobs in the relevant time window.",
        tcode: "SM37",
        note: "Set status filter to 'Cancelled' and date range to when the issue occurred.",
      },
      {
        step: "Select the failed job and click Job Log (Shift+F6) to read the full step-by-step log.",
        note: "Look for the last successful step — the next line usually reveals the root cause.",
      },
      {
        step: "If the log mentions a short dump, open ST22 and search for dumps at the same timestamp.",
        tcode: "ST22",
        note: "ABAP runtime errors (short dumps) are the most common cause of job cancellations.",
      },
      {
        step: "Open SM21 and filter system log entries for the time of the failure.",
        tcode: "SM21",
        note: "Look for database errors, work process terminations, or memory alerts.",
      },
      {
        step: "Identify the root cause (authorization, database, memory, missing variant) and fix it.",
        note: "For auth errors, check SU53 for the job's run-as user. For DB errors, check DBACOCKPIT.",
      },
      {
        step: "Reschedule the job via SM37 → select job → Job → Repeat Scheduling.",
        tcode: "SM37",
        note: "Confirm the fix worked by monitoring the rescheduled run until it completes successfully.",
      },
    ],
  },
  {
    id: "system-down-recovery",
    title: "System Down Basic Recovery",
    category: "System Operations",
    categoryColor: "bg-red-100 text-red-700",
    icon: <Server className="w-4 h-4 text-red-600" />,
    summary: "Structured recovery steps when an SAP instance is unresponsive or users cannot log in.",
    steps: [
      {
        step: "Open SM51 to get an overview of all application servers and their status.",
        tcode: "SM51",
        note: "If SM51 itself is unreachable, the entire dispatcher may be down — proceed to OS level.",
      },
      {
        step: "On the OS level, run sapcontrol -nr <NR> -function GetProcessList to see all SAP processes.",
        note: "On Linux: run as <sid>adm. On Windows: use command prompt with admin rights.",
      },
      {
        step: "Open SM50 to inspect work process states — look for any processes stuck in 'running' for too long.",
        tcode: "SM50",
        note: "A dispatcher with 0 free work processes will reject all new logon attempts.",
      },
      {
        step: "Check SM21 for system log entries in the minutes before the outage started.",
        tcode: "SM21",
        note: "Database connection errors or OOM messages here often explain the root cause.",
      },
      {
        step: "If processes are not recovering on their own, restart the SAP instance.",
        note: "Linux: sapcontrol -nr <NR> -function RestartInstance. Windows: services.msc → restart SAP service.",
      },
      {
        step: "After restart, verify all work processes reach GREEN status and confirm user logon works.",
        tcode: "SM51",
        note: "Monitor for 10–15 minutes after restart to ensure stability before declaring the issue resolved.",
      },
    ],
  },
  {
    id: "rfc-connection-issue",
    title: "RFC Connection Issue",
    category: "Connectivity",
    categoryColor: "bg-blue-100 text-blue-700",
    icon: <Wifi className="w-4 h-4 text-blue-600" />,
    summary: "Diagnose RFC destination failures between SAP systems — connection tests, logs, and network checks.",
    steps: [
      {
        step: "Open SM59 and locate the failing RFC destination (R/3 Connection, HTTP Connection, etc.).",
        tcode: "SM59",
        note: "RFC destinations are grouped by type. R/3 connections (Type 3) are most common between ABAP systems.",
      },
      {
        step: "Click Connection Test and Remote Logon Test — note the exact error message returned.",
        note: "A 'CPIC-CALL: ThSAPOCMINIT' error usually means the target host is unreachable. An auth error means credentials are wrong.",
      },
      {
        step: "Check SM21 on both the calling and the target system for related error entries.",
        tcode: "SM21",
        note: "Target system SM21 often shows the ABAP-level rejection reason even when the caller only sees a generic CPIC error.",
      },
      {
        step: "Validate the network path — ping the target hostname and confirm port is open (3<NR>00 for dispatcher).",
        note: "On Linux: ping + ss -tlnp. On Windows: ping + telnet <host> 32<NR>00. Firewall rules are a frequent culprit.",
      },
      {
        step: "Verify the logon credentials in SM59 are correct — the technical user must exist and not be locked.",
        tcode: "SM59",
        note: "Check SU01 on the target system to confirm the RFC user is active and the password hasn't expired.",
      },
      {
        step: "If using SNC or certificates, verify the PSE is valid in STRUST and the partner system trusts it.",
        tcode: "STRUST",
        note: "Certificate expiry is a common cause of sudden RFC failures in production landscapes.",
      },
    ],
  },
];

// ─── Step Item ────────────────────────────────────────────────────────────────

function StepItem({ index, step }: { index: number; step: GuideStep }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EBF3FD] flex items-center justify-center mt-0.5">
        <span className="text-[10px] font-bold text-[#0070F2]">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-snug">{step.step}</p>
        {step.tcode && (
          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            TCode: {step.tcode}
          </span>
        )}
        {step.note && (
          <p className="mt-1 text-xs text-gray-500 italic leading-snug">{step.note}</p>
        )}
      </div>
    </div>
  );
}

// ─── Guide Card ───────────────────────────────────────────────────────────────

function GuideCard({ guide }: { guide: Guide }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
          {guide.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{guide.title}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${guide.categoryColor}`}>
              {guide.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{guide.summary}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {open
            ? <ChevronDown className="w-4 h-4 text-gray-400" />
            : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 bg-gray-50/40 px-4 py-4 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Step-by-Step Guide — {guide.steps.length} steps
          </div>
          {guide.steps.map((s, i) => (
            <StepItem key={i} index={i} step={s} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ActivityGuides() {
  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen className="w-4 h-4 opacity-80" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">SAP BASIS OPERATIONS</span>
        </div>
        <h1 className="text-xl font-extrabold mb-1">Activity Guides</h1>
        <p className="text-sm opacity-80 leading-snug max-w-xl">
          Structured step-by-step guides for the most frequent SAP Basis operational tasks.
          Each guide includes transaction codes, practical notes, and sequenced actions.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">{GUIDES.length} Guides</span>
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">With TCodes</span>
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">Production-Ready</span>
        </div>
      </div>

      {/* Guide list */}
      <div className="space-y-3">
        {GUIDES.map((g) => (
          <GuideCard key={g.id} guide={g} />
        ))}
      </div>

      {/* Footer note */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
        <strong>More guides coming soon</strong> — Transport Management, Client Copy, Kernel Upgrade, and HANA Backup guides are being prepared.
      </div>
    </div>
  );
}
