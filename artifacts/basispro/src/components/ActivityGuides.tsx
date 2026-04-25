import React, { useState, useEffect } from "react";
import {
  BookOpen, ChevronDown, ChevronRight, CheckCircle2,
  Activity, Wifi, Server, AlertCircle, Zap, Target, GitBranch,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuideStep {
  step: string;
  tcode?: string;
  note?: string;
}

interface QuickCheck {
  condition: string;
  action: string;
}

interface Guide {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  icon: React.ReactNode;
  summary: string;
  whenToUse: string[];
  quickChecks: QuickCheck[];
  steps: GuideStep[];
  expectedOutcome: string[];
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
    whenToUse: [
      "A background job shows status \"Cancelled\" in SM37",
      "A business user reports a scheduled report did not run or produce output",
      "A batch process that normally completes overnight is missing",
      "You receive a monitoring alert (RZ20 / CCMS) for a failed job",
    ],
    quickChecks: [
      { condition: "Job status is \"Finished\" in SM37", action: "Job ran OK — issue is data or report logic, not Basis" },
      { condition: "Job status is \"Cancelled\"", action: "Start from Step 1 — open SM37 and read the job log" },
      { condition: "Short dump visible in ST22 at same time", action: "Jump directly to Step 3 — read the dump first" },
      { condition: "Job log is empty / no steps logged", action: "Jump to Step 4 — check SM21 for work process errors" },
      { condition: "Error says \"not authorized\"", action: "Jump to Step 5 — check SU53 for the job's run-as user" },
    ],
    steps: [
      {
        step: "Open SM37 and filter for cancelled or failed jobs in the relevant time window.",
        tcode: "SM37",
        note: "Set status filter to 'Cancelled' and date range to when the issue occurred. Note the exact job name and start time.",
      },
      {
        step: "Select the failed job and click Job Log (Shift+F6) to read the full step-by-step log.",
        note: "Look for the last successful step — the line immediately after it usually reveals the root cause. Copy the exact error message.",
      },
      {
        step: "If the log mentions a short dump, open ST22 and search for dumps at the same timestamp.",
        tcode: "ST22",
        note: "ABAP runtime errors (short dumps) are the most common cause of job cancellations. Read the short text and ABAP call stack in detail.",
      },
      {
        step: "Open SM21 and filter system log entries for the time of the failure.",
        tcode: "SM21",
        note: "Look for database errors, work process terminations, or memory alerts. The root cause often appears in SM21 even when the job log is vague.",
      },
      {
        step: "Identify the root cause and fix it before rescheduling.",
        note: "Auth error: check SU53 for the job's run-as user and add missing objects via PFCG. DB error: check DBACOCKPIT. Missing variant: recreate it for the report. Memory: check em/initial_size or OS-level OOM events.",
      },
      {
        step: "Reschedule the job via SM37 → select job → Job → Repeat Scheduling.",
        tcode: "SM37",
        note: "Confirm the fix worked by monitoring the rescheduled run until it completes with status 'Finished'. Check ST22 again after — no new dump should appear.",
      },
    ],
    expectedOutcome: [
      "Root cause identified (authorization, DB error, missing variant, or ABAP dump)",
      "Job rescheduled and completes with status \"Finished\" in SM37",
      "No new short dumps in ST22 after the fix",
      "No related errors in SM21 during the rescheduled run",
    ],
  },
  {
    id: "system-down-recovery",
    title: "System Down Basic Recovery",
    category: "System Operations",
    categoryColor: "bg-red-100 text-red-700",
    icon: <Server className="w-4 h-4 text-red-600" />,
    summary: "Structured recovery steps when an SAP instance is unresponsive or users cannot log in.",
    whenToUse: [
      "Users report they cannot log into SAP GUI at all",
      "SAP GUI shows \"connection refused\" or \"no route to host\"",
      "A monitoring alert fires for instance down or all work processes occupied",
      "sapcontrol GetProcessList returns RED status or no processes",
      "SM51 is unreachable or shows an application server as inactive",
    ],
    quickChecks: [
      { condition: "SM51 is accessible", action: "Dispatcher is up — skip to Step 3 (SM50 work process check)" },
      { condition: "SM51 is completely unreachable", action: "Dispatcher is down — go to OS level immediately (Step 2)" },
      { condition: "SM21 shows DB connection errors", action: "Database issue — focus on DBACOCKPIT before attempting restart" },
      { condition: "SM50 shows all WPs occupied / running", action: "Work process saturation — cancel stuck processes before restart" },
      { condition: "sapcontrol shows some processes RED", action: "Partial failure — try RestartInstance before full stop/start" },
    ],
    steps: [
      {
        step: "Open SM51 to get an overview of all application servers and their status.",
        tcode: "SM51",
        note: "If SM51 itself is unreachable, the entire dispatcher may be down — proceed directly to OS-level check in Step 2.",
      },
      {
        step: "On the OS level, run sapcontrol -nr <NR> -function GetProcessList to check all SAP process states.",
        note: "On Linux: run as <sid>adm. On Windows: open command prompt with admin rights. RED or missing processes confirm the instance is partially or fully down.",
      },
      {
        step: "Open SM50 to inspect work process states — look for any processes stuck in 'running' for too long.",
        tcode: "SM50",
        note: "A dispatcher with 0 free work processes will reject all new logon attempts. Check for PRIV mode (a work process in private mode blocks a slot permanently until released).",
      },
      {
        step: "Check SM21 for system log entries in the minutes immediately before the outage started.",
        tcode: "SM21",
        note: "Database connection errors, OOM messages, or work process terminations in SM21 often explain the root cause. Fix the underlying cause before restarting.",
      },
      {
        step: "Check DBACOCKPIT to confirm the database is up and the SAP-to-DB connection is healthy.",
        tcode: "DBACOCKPIT",
        note: "A database that went down will always bring the SAP instance with it. Restart the DB first if it is stopped, then proceed with SAP.",
      },
      {
        step: "If processes are not recovering on their own, restart the SAP instance.",
        note: "Linux: sapcontrol -nr <NR> -function RestartInstance (graceful) or Stop + Start. Windows: services.msc → restart SAP<SID>_<NR> service. Allow 2–3 minutes for all processes to stabilize.",
      },
      {
        step: "After restart, verify all work processes reach GREEN status and confirm user logon works end-to-end.",
        tcode: "SM51",
        note: "Monitor SM50 and SM51 for 10–15 minutes after restart. Notify the business only after you have confirmed stable operation — not as soon as the instance starts.",
      },
    ],
    expectedOutcome: [
      "All SAP processes show GREEN in SM51 and via sapcontrol GetProcessList",
      "Users can log in successfully via SAP GUI",
      "SM50 shows free work processes available",
      "No recurring errors in SM21 after restart",
      "DBACOCKPIT confirms healthy database connection",
    ],
  },
  {
    id: "rfc-connection-issue",
    title: "RFC Connection Issue",
    category: "Connectivity",
    categoryColor: "bg-blue-100 text-blue-700",
    icon: <Wifi className="w-4 h-4 text-blue-600" />,
    summary: "Diagnose RFC destination failures between SAP systems — connection tests, SM21 logs, network checks, credentials, and SNC certificates.",
    whenToUse: [
      "SM59 Connection Test returns a red error result",
      "A cross-system function call (BAPI, RFC, iDoc) fails with CPIC or communication error",
      "An interface or integration that worked before suddenly stops working",
      "Users report that a linked system (PI/PO, BTP, EWM, SAP Router) is not reachable",
      "An automated process fails with \"SYSTEM_FAILURE\" or \"COMMUNICATION_FAILURE\" in SM21",
    ],
    quickChecks: [
      { condition: "Connection Test fails with \"host unreachable\" or CPIC error", action: "Jump to Step 5 — network/port check before anything else" },
      { condition: "Connection Test fails with \"not authorized\" or logon failure", action: "Jump to Step 6 — verify RFC user credentials and SU01 status" },
      { condition: "Connection Test passes but the app still fails", action: "Jump to Step 4 — check SM21 on the target system for the rejection reason" },
      { condition: "RFC uses SNC or PSE certificate", action: "Jump to Step 8 — STRUST certificate check is the priority" },
      { condition: "Issue started after a system password change or certificate renewal", action: "Start at Step 6 — credentials or cert most likely cause" },
    ],
    steps: [
      {
        step: "Open SM59 and locate the failing RFC destination by name or type (R/3 Connection = Type 3, HTTP = Type G, etc.).",
        tcode: "SM59",
        note: "RFC destinations are organised by connection type. R/3 connections (Type 3) are the most common between ABAP systems. HTTP connections (Type G) are used for REST/SOAP and BTP integrations.",
      },
      {
        step: "Run the Connection Test — note the exact error code and message displayed.",
        note: "CPIC-CALL: ThSAPOCMINIT → target host is unreachable or dispatcher is down. Error 'RFC_ERROR_SYSTEM_FAILURE' → target system has an internal error. Timeout → network is reachable but the response never arrives (firewall drop).",
      },
      {
        step: "Run the Remote Logon Test — this separately tests whether the credentials in the destination are accepted by the target system.",
        note: "If Connection Test passes but Remote Logon fails, the issue is purely the RFC user credentials — not network. This narrows the problem significantly.",
      },
      {
        step: "Check SM21 on the calling system for RFC-related error entries at the time of the failure.",
        tcode: "SM21",
        note: "Filter by message class 'RFC' or 'CPIC'. The calling side SM21 shows what the dispatcher attempted and what error it received back.",
      },
      {
        step: "Check SM21 on the target system (if accessible) for the corresponding rejection or error entries.",
        tcode: "SM21",
        note: "The target system SM21 often shows the real ABAP-level reason — 'logon failed', 'user locked', 'not authorized' — even when the caller only sees a generic CPIC failure.",
      },
      {
        step: "Validate the network path — ping the target hostname and test if the dispatcher port is open.",
        note: "Linux: ping <hostname> and ss -tlnp | grep 32<NR>00. Windows: ping <hostname> and telnet <hostname> 32<NR>00. If the port is closed, check firewall rules — this is the most common cause of sudden RFC failures in multi-zone landscapes.",
      },
      {
        step: "Check SMICM on the target system — verify the ICM (Internet Communication Manager) is running and not in error state.",
        tcode: "SMICM",
        note: "For HTTP-type RFC destinations, SMICM issues are the most frequent cause. Goto → Services and confirm the relevant HTTP/HTTPS port shows status 'Active'.",
      },
      {
        step: "Verify logon credentials in SM59 — confirm the technical RFC user exists, is not locked, and the password has not expired.",
        tcode: "SM59",
        note: "Open SU01 on the target system for the RFC user. Check: user is not locked, password is not expired, user type is 'System' (not Dialog). Update the password in SM59 if it has changed.",
      },
      {
        step: "If using SNC, verify the PSE certificate is valid in STRUST on both systems and the partner's certificate is trusted.",
        tcode: "STRUST",
        note: "Certificate expiry is a frequent cause of sudden RFC failures in production. Check the validity date in STRUST → SSL Client → partner entries. Re-import the partner certificate if expired or missing.",
      },
      {
        step: "Re-run the Connection Test and Remote Logon Test in SM59 to confirm the fix. Monitor SM21 on both sides for a clean run.",
        tcode: "SM59",
        note: "After a successful test, trigger the actual interface or integration that was failing to confirm end-to-end recovery. Inform the application team that connectivity is restored.",
      },
    ],
    expectedOutcome: [
      "SM59 Connection Test returns green on the first attempt",
      "SM59 Remote Logon Test completes successfully",
      "Interface or integration calls resume without CPIC or RFC errors",
      "No RFC-related error entries in SM21 on either system",
      "SMICM services show Active status (for HTTP-type destinations)",
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {icon}
      {label}
    </div>
  );
}

function WhenToUse({ items }: { items: string[] }) {
  return (
    <div className="space-y-1.5">
      <SectionLabel icon={<AlertCircle className="w-3.5 h-3.5" />} label="When to Use This Guide" />
      <ul className="space-y-1 pl-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickCheckList({ items }: { items: QuickCheck[] }) {
  return (
    <div className="space-y-1.5">
      <SectionLabel icon={<Zap className="w-3.5 h-3.5" />} label="Quick Check" />
      <div className="rounded-lg border border-amber-100 bg-amber-50 divide-y divide-amber-100">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 px-3 py-2">
            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 whitespace-nowrap">IF</span>
            <span className="text-xs text-gray-700 flex-1">{item.condition}</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 whitespace-nowrap">→</span>
            <span className="text-xs text-gray-600 flex-1 italic">{item.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function ExpectedOutcome({ items }: { items: string[] }) {
  return (
    <div className="space-y-1.5">
      <SectionLabel icon={<Target className="w-3.5 h-3.5" />} label="Expected Outcome" />
      <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5 space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-emerald-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Guide Card ───────────────────────────────────────────────────────────────

function GuideCard({ guide, targeted }: { guide: Guide; targeted: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (targeted) setOpen(true);
  }, [targeted]);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${targeted ? "border-[#0070F2]/40 ring-2 ring-[#0070F2]/20" : "border-gray-200"}`}>
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
        <div className="border-t border-gray-100 bg-gray-50/40 px-4 py-4 space-y-5">
          <WhenToUse items={guide.whenToUse} />
          <QuickCheckList items={guide.quickChecks} />
          <div className="space-y-4">
            <SectionLabel icon={<CheckCircle2 className="w-3.5 h-3.5" />} label={`Step-by-Step — ${guide.steps.length} steps`} />
            {guide.steps.map((s, i) => (
              <StepItem key={i} index={i} step={s} />
            ))}
          </div>
          <ExpectedOutcome items={guide.expectedOutcome} />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ActivityGuides() {
  const [targetId, setTargetId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("basisproTargetGuide");
    if (id) {
      setTargetId(id);
      localStorage.removeItem("basisproTargetGuide");
    }
  }, []);

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

      {/* Troubleshoot Trees hint */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-start gap-2.5">
        <GitBranch className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600">
          <strong className="text-slate-700">Not sure where to start?</strong>{" "}
          Use <strong>Troubleshoot Trees</strong> to answer guided questions and reach a targeted resolution — then return here for the full step-by-step guide.
        </p>
      </div>

      {/* Guide list */}
      <div className="space-y-3">
        {GUIDES.map((g) => (
          <GuideCard key={g.id} guide={g} targeted={targetId === g.id} />
        ))}
      </div>

      {/* Footer note */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
        <strong>More guides coming soon</strong> — Transport Management, Client Copy, Kernel Upgrade, and HANA Backup guides are being prepared.
      </div>
    </div>
  );
}
