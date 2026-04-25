import React, { useState, useEffect } from "react";
import {
  GitBranch, ChevronRight, RotateCcw, CheckCircle2,
  AlertTriangle, Activity, Wifi,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TreeNode {
  id: string;
  question?: string;
  resolution?: string;
  tcode?: string;
  note?: string;
  yes?: string;
  no?: string;
  yesLabel?: string;
  noLabel?: string;
}

interface Tree {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  icon: React.ReactNode;
  rootId: string;
  nodes: Record<string, TreeNode>;
  stepMap?: Record<string, string>;
}

// ─── Tree Data ────────────────────────────────────────────────────────────────

const TREES: Tree[] = [
  {
    id: "system-down",
    title: "System Down",
    category: "System Recovery",
    categoryColor: "bg-red-100 text-red-700",
    icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
    rootId: "q1",
    nodes: {
      q1: {
        id: "q1",
        question: "Can users access SAP GUI and log in?",
        yes: "q2",
        no: "q3",
        yesLabel: "Yes — GUI responds",
        noLabel: "No — GUI unreachable",
      },
      q2: {
        id: "q2",
        question: "Are work processes available? (Check SM50 — are any FREE or WAITING?)",
        tcode: "SM50",
        yes: "r1",
        no: "q4",
        yesLabel: "Yes — work processes available",
        noLabel: "No — all WPs are occupied",
      },
      q3: {
        id: "q3",
        question: "Is the SAP service / dispatcher process running on the OS?",
        note: "Linux: run 'sapcontrol -nr <NR> -function GetProcessList'. Windows: check services.msc.",
        yes: "q5",
        no: "r2",
        yesLabel: "Yes — process is running",
        noLabel: "No — process is stopped",
      },
      q4: {
        id: "q4",
        question: "Do SM21 system logs show database errors or OOM messages?",
        tcode: "SM21",
        yes: "r3",
        no: "r4",
        yesLabel: "Yes — DB or memory errors found",
        noLabel: "No — logs are clean",
      },
      q5: {
        id: "q5",
        question: "Can you ping the SAP hostname and reach dispatcher port 32<NR>00?",
        note: "Linux: ping + ss -tlnp. Windows: ping + telnet <host> 32<NR>00.",
        yes: "r5",
        no: "r6",
        yesLabel: "Yes — port is reachable",
        noLabel: "No — host or port unreachable",
      },
      r1: {
        id: "r1",
        resolution: "Work processes are available — the issue may be intermittent or resolved. Monitor SM50 and ask the affected users to retry.",
        tcode: "SM50",
      },
      r2: {
        id: "r2",
        resolution: "Start the SAP instance. Linux: sapcontrol -nr <NR> -function Start (run as <sid>adm). Windows: net start SAP<SID>_<NR> or use services.msc. After start, verify all processes reach GREEN in SM51.",
        tcode: "SM51",
      },
      r3: {
        id: "r3",
        resolution: "Database or memory issue detected. Check DBACOCKPIT for DB connectivity and SM21 for the specific error. Restart the DB service if stopped. For OOM, check /hana/shared (HANA) or SQL Server logs (Windows). Then restart SAP instance.",
        tcode: "DBACOCKPIT",
      },
      r4: {
        id: "r4",
        resolution: "All WPs occupied but no obvious root cause. Run SM50 → identify the longest-running process → attempt graceful cancel. If unresponsive, use sapcontrol RestartInstance to recycle the instance.",
        tcode: "SM50",
      },
      r5: {
        id: "r5",
        resolution: "Network is reachable but users still cannot log in. Check SMICM → check ICM status. Also check STRUST for expired certificates. Review SM21 for ICM or logon-related errors.",
        tcode: "SMICM",
      },
      r6: {
        id: "r6",
        resolution: "Network issue. Verify DNS resolution (nslookup), check firewall rules for port 32<NR>00, and confirm the server is reachable. Escalate to network/infrastructure team if the host itself is unreachable.",
      },
    },
    stepMap: {
      "check-services":  "q3",
      "check-processes": "q2",
      "check-logs":      "q4",
    },
  },
  {
    id: "bg-job-failure",
    title: "Background Job Failure",
    category: "Job Management",
    categoryColor: "bg-amber-100 text-amber-700",
    icon: <Activity className="w-4 h-4 text-amber-600" />,
    rootId: "q1",
    nodes: {
      q1: {
        id: "q1",
        question: "Does SM37 show the job status as 'Cancelled'?",
        tcode: "SM37",
        yes: "q2",
        no: "r1",
        yesLabel: "Yes — status is Cancelled",
        noLabel: "No — job shows different status",
      },
      q2: {
        id: "q2",
        question: "Does the Job Log (Shift+F6 in SM37) contain a clear error message?",
        tcode: "SM37",
        yes: "q3",
        no: "q4",
        yesLabel: "Yes — error is visible in log",
        noLabel: "No — log is empty or unclear",
      },
      q3: {
        id: "q3",
        question: "Does the error mention an ABAP short dump (runtime error)?",
        yes: "r2",
        no: "q5",
        yesLabel: "Yes — dump is referenced",
        noLabel: "No — different error type",
      },
      q4: {
        id: "q4",
        question: "Does ST22 show a short dump at the same time the job cancelled?",
        tcode: "ST22",
        yes: "r2",
        no: "r3",
        yesLabel: "Yes — dump found in ST22",
        noLabel: "No — no dump found",
      },
      q5: {
        id: "q5",
        question: "Does the error indicate an authorization failure? (look for 'not authorized' or check SU53)",
        tcode: "SU53",
        yes: "r4",
        no: "r5",
        yesLabel: "Yes — authorization error",
        noLabel: "No — different error",
      },
      r1: {
        id: "r1",
        resolution: "Check the actual job status: 'Active' means still running, 'Finished' means completed successfully, 'Scheduled' means not yet started. Only 'Cancelled' indicates a failure. Filter SM37 by the correct time window and verify the correct job name.",
        tcode: "SM37",
      },
      r2: {
        id: "r2",
        resolution: "Open ST22, find the dump at the same timestamp, and read the short text and ABAP call stack. The dump describes the exact runtime error. Fix the underlying ABAP issue (missing object, syntax error, etc.) and reschedule the job.",
        tcode: "ST22",
      },
      r3: {
        id: "r3",
        resolution: "Check SM21 system log at the time of cancellation — look for database, memory, or work process termination messages. Also check DBACOCKPIT for DB errors. If the work process was killed by the OS, check OS-level logs (/var/log/messages on Linux).",
        tcode: "SM21",
      },
      r4: {
        id: "r4",
        resolution: "The job's run-as user is missing an authorization object. Open SU53 logged in as that user, or check the SM37 job log for the missing object. Add the missing authorization via role assignment in PFCG and reschedule.",
        tcode: "PFCG",
      },
      r5: {
        id: "r5",
        resolution: "Check the specific error text in the job log carefully. Common causes: missing selection variant (check report defaults), locked table (SM12), database error (DBACOCKPIT), or exceeded runtime limit (rdisp/btctime parameter). Address the specific cause and reschedule.",
        tcode: "SM12",
      },
    },
  },
  {
    id: "rfc-issue",
    title: "RFC Connection Issue",
    category: "Connectivity",
    categoryColor: "bg-blue-100 text-blue-700",
    icon: <Wifi className="w-4 h-4 text-blue-600" />,
    rootId: "q1",
    nodes: {
      q1: {
        id: "q1",
        question: "Does the SM59 Connection Test fail with an error?",
        tcode: "SM59",
        yes: "q2",
        no: "r1",
        yesLabel: "Yes — connection test fails",
        noLabel: "No — test passes but app fails",
      },
      q2: {
        id: "q2",
        question: "Is the error a network/host error (CPIC, host unreachable, timeout)?",
        yes: "q3",
        no: "q4",
        yesLabel: "Yes — network or CPIC error",
        noLabel: "No — application-level error",
      },
      q3: {
        id: "q3",
        question: "Can you ping the target hostname and reach its dispatcher port?",
        note: "ping <hostname> and telnet <hostname> 32<NR>00 (or ss -tlnp on Linux target).",
        yes: "r2",
        no: "r3",
        yesLabel: "Yes — host and port reachable",
        noLabel: "No — host or port unreachable",
      },
      q4: {
        id: "q4",
        question: "Does the error say 'not authorized' or does Remote Logon Test fail?",
        yes: "r4",
        no: "q5",
        yesLabel: "Yes — authorization failure",
        noLabel: "No — different error",
      },
      q5: {
        id: "q5",
        question: "Is this an SNC or certificate-based RFC destination?",
        yes: "r5",
        no: "r6",
        yesLabel: "Yes — SNC / certificate",
        noLabel: "No — plain user/password",
      },
      r1: {
        id: "r1",
        resolution: "Connection test passes but application logic fails. Check SM21 on the target system for errors at call time. The issue is likely in the called function module — check its authorization, input parameters, or the target system's application state.",
        tcode: "SM21",
      },
      r2: {
        id: "r2",
        resolution: "Network is reachable but CPIC still fails. Check SMICM on the target system. If using SNC, verify STRUST certificates. Check SM21 on the target for rejected logon attempts. Also verify the RFC destination's instance number matches the target system.",
        tcode: "SMICM",
      },
      r3: {
        id: "r3",
        resolution: "Network path is broken. Verify DNS (nslookup <hostname>), check firewall rules for dispatcher port 32<NR>00, and confirm the target SAP instance is running. Escalate to network team if the host itself is unreachable.",
      },
      r4: {
        id: "r4",
        resolution: "RFC user credentials are wrong or the user is locked/expired. Open SU01 on the target system, check the technical user's status. Reset the password if expired, unlock if locked, then update the SM59 destination with correct credentials.",
        tcode: "SU01",
      },
      r5: {
        id: "r5",
        resolution: "SNC certificate issue. Open STRUST on both systems and verify the partner's certificate is present and not expired. Re-export and re-import certificates if needed. Check SM21 for 'SNC' error messages for more detail.",
        tcode: "STRUST",
      },
      r6: {
        id: "r6",
        resolution: "Check the exact error message in SM21 on both source and target systems. Common causes: gateway not running, instance restarted recently, or connection type mismatch (e.g., R/3 type used for HTTP endpoint). Verify all SM59 settings match the target system's actual configuration.",
        tcode: "SM21",
      },
    },
    stepMap: {
      "test-connection":    "q1",
      "check-authorization": "q4",
    },
  },
];

// ─── Tree Runner ──────────────────────────────────────────────────────────────

function TreeRunner({ tree, startNodeId }: { tree: Tree; startNodeId?: string }) {
  const [currentId, setCurrentId] = useState<string>(startNodeId ?? tree.rootId);
  const [history, setHistory] = useState<{ nodeId: string; choice: string }[]>([]);
  const [isTargeted, setIsTargeted] = useState<boolean>(!!startNodeId);

  const node = tree.nodes[currentId] ?? tree.nodes[tree.rootId];
  const isResolution = !node.question;

  function choose(nextId: string, label: string) {
    setIsTargeted(false);
    setHistory((h) => [...h, { nodeId: currentId, choice: label }]);
    setCurrentId(nextId);
  }

  function reset() {
    setIsTargeted(false);
    setCurrentId(tree.rootId);
    setHistory([]);
  }

  return (
    <div className="p-4 space-y-4">
      {/* Breadcrumb trail */}
      {history.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
          {history.map((h, i) => (
            <React.Fragment key={i}>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 max-w-[140px] truncate" title={h.choice}>
                {h.choice}
              </span>
              {i < history.length - 1 && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Current node */}
      {isResolution ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Recommended Action
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">{node.resolution}</p>
          {node.tcode && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Start with: {node.tcode}
            </span>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors mt-1"
          >
            <RotateCcw className="w-3 h-3" />
            Start over
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-xl p-4 space-y-2 transition-all ${isTargeted ? "border-2 border-[#0070F2]/30 bg-[#EBF3FD]/60 ring-1 ring-[#0070F2]/20" : "border border-blue-100 bg-[#F5F9FF]"}`}>
            {isTargeted && (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#0070F2] uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0070F2] inline-block" />
                Suggested starting point
              </div>
            )}
            <p className="text-sm font-semibold text-gray-900 leading-snug">{node.question}</p>
            {node.tcode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#0070F2] bg-[#EBF3FD] px-2 py-0.5 rounded">
                Check: {node.tcode}
              </span>
            )}
            {node.note && (
              <p className="text-xs text-gray-500 italic leading-snug">{node.note}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => choose(node.yes!, node.yesLabel ?? "Yes")}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {node.yesLabel ?? "Yes"}
            </button>
            <button
              onClick={() => choose(node.no!, node.noLabel ?? "No")}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {node.noLabel ?? "No"}
            </button>
          </div>
          {history.length > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Start over
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tree Card ────────────────────────────────────────────────────────────────

function TreeCard({ tree, targeted, targetStepId }: { tree: Tree; targeted: boolean; targetStepId?: string | null }) {
  const [open, setOpen] = useState(false);

  const startNodeId = targeted && targetStepId && tree.stepMap?.[targetStepId]
    ? tree.stepMap[targetStepId]
    : undefined;

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
          {tree.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{tree.title}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tree.categoryColor}`}>
              {tree.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Interactive diagnostic tree — answer questions to reach a resolution
          </p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {open
            ? <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 bg-white">
          <TreeRunner tree={tree} startNodeId={startNodeId} />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TroubleshootTrees() {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetStepId, setTargetStepId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("basisproTargetTree");
    const stepId = localStorage.getItem("basisproTargetTreeStep");
    if (id) {
      setTargetId(id);
      localStorage.removeItem("basisproTargetTree");
    }
    if (stepId) {
      setTargetStepId(stepId);
      localStorage.removeItem("basisproTargetTreeStep");
    }
  }, []);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <GitBranch className="w-4 h-4 opacity-80" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">SAP BASIS DIAGNOSTICS</span>
        </div>
        <h1 className="text-xl font-extrabold mb-1">Troubleshoot Trees</h1>
        <p className="text-sm opacity-80 leading-snug max-w-xl">
          Interactive diagnostic trees for common SAP Basis incidents.
          Answer each question to navigate to a targeted resolution — no guessing required.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">{TREES.length} Trees</span>
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">Interactive</span>
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">With TCodes</span>
        </div>
      </div>

      {/* Trees */}
      <div className="space-y-3">
        {TREES.map((t) => (
          <TreeCard
            key={t.id}
            tree={t}
            targeted={targetId === t.id}
            targetStepId={targetId === t.id ? targetStepId : null}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <strong>More trees coming soon</strong> — Transport Import Failure, HANA Memory Pressure, and User Logon Issue trees are being prepared.
      </div>
    </div>
  );
}
