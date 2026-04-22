import React, { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, Zap, Shield, Database, Cloud, Settings, Star, Copy, Check, Activity } from "lucide-react";

interface QA {
  id: string;
  q: string;
  a: string;
  follow_ups?: string[];
  level: "junior" | "mid" | "senior";
  tags: string[];
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  questions: QA[];
}

const CATEGORIES: Category[] = [
  {
    id: "system-admin",
    title: "System Administration",
    icon: <Settings className="w-5 h-5" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    questions: [
      {
        id: "sa1",
        q: "What is the difference between RZ10 and RZ11?",
        a: "RZ10 is used to view and maintain SAP profile parameters (default.pfl, instance profiles, start profiles) in a file-based UI — changes require a system restart to take effect. RZ11 is used to display documentation for individual parameters and, for dynamic parameters, change their current value immediately without a restart (using the 'Set Value' function). Always use RZ11 first to check if a parameter is dynamic before scheduling downtime for RZ10 changes.",
        follow_ups: ["Name 5 dynamic parameters you've changed via RZ11", "What is the difference between the default.pfl and an instance profile?"],
        level: "junior",
        tags: ["profiles", "parameters", "RZ10", "RZ11"],
      },
      {
        id: "sa2",
        q: "A user reports they cannot log into SAP. Walk me through your diagnostic process.",
        a: "My diagnostic flow: (1) Check if the user is locked in SU01 — lock icon visible. (2) Check logon group reachability via SMLG and SM59. (3) Verify work processes are available: SM50/SM66. (4) Check SM21 system log for authentication failures or aborts. (5) Verify dialog work processes are not all occupied (SM50 — all WPs in WAITING?). (6) Check if user's password is expired (SU01 — Logon Data tab). (7) If CUA system: check SU01 in CUA central system and SCUL for locked/inactive status. (8) Network: can user reach the SAP message server port (3600+SID)?",
        follow_ups: ["What's the difference between a user being locked vs password-expired?", "How would you mass-unlock users after a failed batch job?"],
        level: "junior",
        tags: ["user", "logon", "troubleshooting", "SU01"],
      },
      {
        id: "sa3",
        q: "How do you perform a client copy in SAP and what are the key risks?",
        a: "Use SCCL for local copy (same system) or SCC9 for remote copy via RFC. Process: (1) Log into target client. (2) Choose copy profile (SAP_ALL includes all data, SAP_CUST for customizing only). (3) Specify source client. (4) Schedule in background — never run interactively for large copies. (5) Monitor in SCC3. Key risks: (1) Copy overwrites all data in target — irreversible. (2) Users in target client are locked during copy. (3) Open transport requests in source are included — close them first. (4) RFC connection stability for SCC9 — interruption can leave target inconsistent. (5) Large copies can take hours — plan for change freeze. Post-copy: run SCC7 for cross-system post-processing.",
        level: "mid",
        tags: ["client", "SCC", "copy", "risk"],
      },
      {
        id: "sa4",
        q: "You notice all dialog work processes are in 'Running' state and no users can log in. What do you do?",
        a: "(1) SM50 immediately — identify which program/user/transaction is consuming all work processes. (2) Look for long-running programs, infinite loops, or DB wait states. (3) SM12 — check for widespread lock entries that could indicate a batch job deadlock. (4) If one process is clearly runaway: SM50 → Cancel with core (last resort) or Cancel (graceful). (5) SM37 → cancel the associated background job if it's a batch process. (6) If all WPs are waiting on DB: ST04/DBACOCKPIT to check DB blocking or lock escalations. (7) Consider increasing dialog WP count temporarily via RZ10 (rdisp/wp_no_dia) — restart needed. (8) Notify business and set SM02 system message.",
        level: "senior",
        tags: ["performance", "work processes", "SM50", "troubleshooting"],
      },
    ],
  },
  {
    id: "transport",
    title: "Transport Management",
    icon: <Activity className="w-5 h-5" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    questions: [
      {
        id: "tr1",
        q: "Explain the SAP transport landscape and how STMS works.",
        a: "The transport landscape defines how changes flow between SAP systems — typically Development → Quality → Production. STMS (SM TMS) manages this: one system acts as the Domain Controller, which centralizes transport route definitions and import queue management for all systems in the domain. Transport requests created in SE09/SE10 are released to the domain controller's import queue. From STMS, Basis imports them into target systems in correct order. Transport routes can be Consolidation Routes (DEV→QAS) or Delivery Routes (QAS→PRD). Virtual systems and transport layers are configured in STMS → Overview → Transport Routes.",
        follow_ups: ["What is a transport domain and why is it important?", "How do you import a single transport to production outside the normal queue?"],
        level: "junior",
        tags: ["STMS", "transport", "domain", "routes"],
      },
      {
        id: "tr2",
        q: "A transport import to Production failed. How do you investigate?",
        a: "In STMS: (1) Go to import queue for production → select the failed transport. (2) Check SLOG (system log) and ALOG (application log) via the Logs button. (3) Common return codes: RC=4 (warning — usually OK), RC=8 (error — investigate), RC=12 (serious error — immediate action). (4) For RC=8/12: open the ALOG, find the step that failed (usually ABAP import, dictionary activation, or post-processing). (5) SE01 in source system — view transport contents to understand what failed. (6) For dictionary errors: run SE14 to activate failed DDIC objects. (7) For ABAP syntax errors: SE38/SE80 — check if code references objects not yet in PRD. (8) Fix the root cause, then re-import or create a correction transport.",
        level: "mid",
        tags: ["STMS", "import", "error", "RC8"],
      },
      {
        id: "tr3",
        q: "What is the difference between SE09 and SE10?",
        a: "SE09 (Workbench Organizer) manages Workbench transport requests — for cross-client objects like ABAP programs, function modules, data dictionary objects, and repository objects. Changes to these are system-wide. SE10 (Customizing Organizer) manages Customizing transport requests — for client-specific Customizing settings (SPRO changes). These are client-dependent. In modern SAP, SE09 shows both types (you can filter by request type). The key distinction is: Workbench = repository/cross-client changes, Customizing = client-specific configuration.",
        level: "junior",
        tags: ["SE09", "SE10", "workbench", "customizing"],
      },
    ],
  },
  {
    id: "hana",
    title: "SAP HANA",
    icon: <Database className="w-5 h-5" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    questions: [
      {
        id: "h1",
        q: "Explain SAP HANA System Replication and its modes.",
        a: "HANA System Replication (HSR) continuously replicates log entries from primary to secondary HANA instance: SYNC: primary waits for secondary acknowledgment before committing — zero RPO, some performance overhead, used for HA in same datacenter/AZ. SYNCMEM: secondary acknowledges write to memory (not disk) — faster than SYNC but secondary restart re-syncs from primary. ASYNC: primary does not wait for secondary — best performance, used for long-distance DR where latency makes SYNC impractical. Setup: hdbnsutil -sr_enable (primary) → hdbnsutil -sr_register (secondary). For HA, SYNC is combined with Pacemaker for automatic failover. Takeover: hdbnsutil -sr_takeover on secondary (in DR scenario) or automated via Pacemaker.",
        follow_ups: ["How do you monitor HSR replication lag?", "What happens to the secondary after a takeover?"],
        level: "mid",
        tags: ["HANA", "HSR", "replication", "HA"],
      },
      {
        id: "h2",
        q: "How do you back up and recover SAP HANA?",
        a: "HANA backup types: (1) Data backup (file or backint): full backup of all data volumes. (2) Log backup: continuous, every few minutes to backup catalog. (3) Delta/Incremental: only changed blocks since last full (HANA 2.0 SPS03+). Backup tools: HANA Studio, HANA Cockpit, hdbsql CLI, or third-party via HANA Backint API (e.g., AWS Backint, commvault). Recovery procedure: stop HANA → restore data backup files to correct location → start HANA in recovery mode → HANA replays log backups to reach recovery point → system online. Point-in-time recovery: restore data backup + replay logs up to desired timestamp. In MDC: system DB backup/recovery is independent from tenant DB — recover system DB first, then tenants.",
        level: "mid",
        tags: ["HANA", "backup", "recovery", "backint"],
      },
      {
        id: "h3",
        q: "What do you check first when HANA performance is degraded?",
        a: "My triage sequence: (1) HANA Cockpit → Overview: check overall system health, CPU, memory, disk. (2) HANA Studio → M_LOAD_HISTORY_SERVICE: look for sudden CPU or memory spike at degradation time. (3) SELECT * FROM SYS.M_CS_TABLES ORDER BY MEMORY_SIZE_IN_MAIN DESC — check for large unload/reload cycles. (4) SELECT * FROM SYS.M_EXPENSIVE_STATEMENTS ORDER BY CPU_TIME DESC — identify slow SQL. (5) ST05 / /SDF/SQLM in S/4HANA — capture SQL trace for the problematic transaction. (6) Check delta merge activity (M_DELTA_MERGE_STATISTICS) — excessive merges can degrade performance. (7) Verify no backup is running concurrently (HANA Cockpit → Job Monitor). (8) Check for lock waits: M_BLOCKED_TRANSACTIONS.",
        level: "senior",
        tags: ["HANA", "performance", "tuning", "SQL"],
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    icon: <Cloud className="w-5 h-5" />,
    color: "text-sky-600",
    bg: "bg-sky-50",
    questions: [
      {
        id: "cl1",
        q: "How does SAP HANA HA work on AWS?",
        a: "On AWS, SAP HANA HA uses HANA System Replication in SYNC mode across two Availability Zones, combined with Pacemaker cluster and an AWS Overlay IP (routing via AWS Transit Gateway). Architecture: Primary HANA (AZ-1) + Secondary HANA (AZ-2, SYNC HSR) + Pacemaker (SAPHana + SAPHanaTopology OCF resource agents) + Overlay IP (virtual IP that moves between AZs on failover). The Overlay IP is a /32 route in the VPC routing table pointing to the active HANA instance's ENI. Pacemaker manages this IP routing via AWS CLI calls in the resource agent. Failover: Pacemaker detects primary failure → performs STONITH fencing of failed node via IPMI/AWS API → promotes secondary → updates Overlay IP routing → application reconnects via virtual hostname. RTO: typically 30–60 seconds.",
        follow_ups: ["How does this differ from Azure HANA HA?", "What is STONITH and why is it critical?"],
        level: "senior",
        tags: ["AWS", "HANA", "HA", "Pacemaker", "Overlay IP"],
      },
      {
        id: "cl2",
        q: "What is SAP Cloud Connector and how does it work?",
        a: "SAP Cloud Connector (SCC) is a reverse-proxy component that creates a secure outbound HTTPS tunnel from the on-premise network to SAP BTP — without requiring any inbound firewall ports to be opened. How it works: SCC initiates an outbound connection (port 443) to the BTP Connectivity Service. BTP services then use this tunnel to call on-premise backends through virtual host mappings defined in SCC. Basis responsibilities: Install SCC on a Linux/Windows host in DMZ; bind to BTP subaccount; define virtual host mappings (e.g., virtual 's4hdev.internal' → real 's4hdev.company.com:443'); add resource paths. HA: Master + Shadow SCC — shadow mirrors master config; auto-failover when master goes down. Certificate: SCC UI certificate expires annually — renew proactively.",
        level: "mid",
        tags: ["Cloud Connector", "BTP", "SCC", "connectivity"],
      },
      {
        id: "cl3",
        q: "What storage types would you choose for SAP HANA on Azure and why?",
        a: "For SAP HANA on Azure: HANA data volume: Azure Premium SSD v2 or Ultra Disk — need minimum 400 MB/s throughput, 15,000 IOPS. Premium SSD v2 allows independent IOPS/throughput configuration. HANA log volume: Azure Ultra Disk — requires consistent sub-millisecond write latency (< 1 ms); Ultra Disk guarantees this. Never enable host caching on HANA data/log volumes — can cause data corruption. HANA shared (/hana/shared + /sapmnt): Azure NetApp Files (ANF) — NFS 4.1 protocol, Ultra service level for production (128 MB/s per TB). ANF supports multi-zone high availability. Backup: Azure Backup plugin for HANA writes backups to Recovery Services Vault. Why Ultra Disk for logs specifically: HANA redo log writes are critical path — any latency here blocks transaction commit.",
        level: "senior",
        tags: ["Azure", "storage", "HANA", "Ultra Disk", "ANF"],
      },
    ],
  },
  {
    id: "security",
    title: "Security & Authorization",
    icon: <Shield className="w-5 h-5" />,
    color: "text-rose-600",
    bg: "bg-rose-50",
    questions: [
      {
        id: "sec1",
        q: "A user has SU53 errors. How do you resolve them?",
        a: "SU53 (run as the affected user, or use SU53 variant to view another user's last check) shows the last failed authorization check: the authorization object, field, and missing value. Resolution steps: (1) Note the authorization object and field value from SU53. (2) Identify which role should grant this access — SUIM → 'Users by Authorization Object' to find existing roles with that object. (3) In PFCG: edit the appropriate role → Authorization tab → find the object → add the missing field value. (4) Generate the role profile (Generate button in PFCG). (5) Run PFUD to synchronize user master records with updated profiles. (6) Test with SU53 again. Important: never give S_TCODE or * to work around SU53 — always resolve at the authorization object level.",
        level: "junior",
        tags: ["SU53", "authorization", "PFCG", "security"],
      },
      {
        id: "sec2",
        q: "What is the significance of the security audit log and how do you configure it?",
        a: "The Security Audit Log (SAL) records critical security events in SAP: failed logins, successful logins, transactions started, changes to user master records, authorization changes, remote function calls, etc. It is mandatory for SOX, ISO 27001, and most security frameworks. Configuration via SM19: activate audit for specific clients and user patterns. Define which events to log (authentication, authorization, RFC, user master changes). Recommended: at least log all events for privileged users (BASIS* accounts) and all authentication failures. Evaluate SAL: SM20. Best practice: configure the SAL to write to an external SIEM (via SM19 → External Integration → syslog/SIEM forwarding) so logs are tamper-proof and retained beyond 7-day default.",
        level: "mid",
        tags: ["SM19", "SM20", "audit", "security", "SOX"],
      },
      {
        id: "sec3",
        q: "How do you manage SSL certificates in SAP and what are the risks of misconfiguration?",
        a: "SSL certificate management in SAP is done via STRUST (Trust Manager): STRUST maintains trust lists for different SSL contexts (SSL Client Anonymous, SSL Client Standard, System PSE). For each context, you import trusted CA certificates and manage the system's own certificate (PKCS12). Common tasks: Import BTP/cloud service SSL certificates for outbound HTTPS connections (e.g., BTP DMS, Cloud ALM). Renew own system certificate before expiry. Import S/4HANA certificate into external systems for mutual TLS. Risks of misconfiguration: (1) Expired system PSE → all outbound HTTPS connections fail silently. (2) Missing CA in trust list → SSL handshake error when connecting to cloud services. (3) Incorrect CN in certificate → hostname mismatch rejection. SMICM → Traces → SSL level 3 for detailed SSL handshake diagnostics.",
        level: "senior",
        tags: ["STRUST", "SSL", "certificates", "SMICM"],
      },
    ],
  },
];

const LEVEL_COLORS = {
  junior: "bg-emerald-100 text-emerald-700",
  mid: "bg-blue-100 text-blue-700",
  senior: "bg-violet-100 text-violet-700",
};

export default function InterviewPrep() {
  const [activeCat, setActiveCat] = useState<string>("system-admin");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const cat = CATEGORIES.find((c) => c.id === activeCat)!;
  const questions =
    levelFilter === "all"
      ? cat.questions
      : cat.questions.filter((q) => q.level === levelFilter);

  function copyAnswer(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Career Development</span>
        </div>
        <h1 className="text-2xl font-extrabold mb-1">SAP Basis Interview Prep</h1>
        <p className="text-sm opacity-80 max-w-lg">
          Expert-level interview questions and model answers for Junior, Mid, and Senior SAP Basis roles. Study, practice, and ace your next interview.
        </p>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level:</span>
        {(["all", "junior", "mid", "senior"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevelFilter(l)}
            className={`text-sm font-medium px-3 py-1 rounded-full border transition-all ${
              levelFilter === l
                ? l === "all" ? "bg-gray-800 text-white border-gray-800"
                  : LEVEL_COLORS[l] + " border-current"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {l === "all" ? "All Levels" : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Category sidebar */}
        <div className="hidden md:flex flex-col gap-1 w-52 flex-shrink-0">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveCat(c.id); setExpanded(null); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all ${
                activeCat === c.id
                  ? "bg-[#0070F2]/10 text-[#0070F2] font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className={activeCat === c.id ? "text-[#0070F2]" : "text-gray-400"}>
                {React.cloneElement(c.icon as React.ReactElement, { className: "w-4 h-4" })}
              </span>
              <span className="flex-1">{c.title}</span>
              <span className="text-xs text-gray-400">{c.questions.length}</span>
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className={`flex items-center gap-2 p-3 rounded-xl ${cat.bg}`}>
            <span className={cat.color}>
              {React.cloneElement(cat.icon as React.ReactElement, { className: "w-5 h-5" })}
            </span>
            <span className={`font-bold text-sm ${cat.color}`}>{cat.title}</span>
            <span className="text-xs text-gray-400 ml-auto">{questions.length} questions</span>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No questions at this level in this category</div>
          ) : (
            questions.map((qa) => {
              const isExpanded = expanded === qa.id;
              return (
                <div key={qa.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-sm transition-shadow">
                  <button
                    className="w-full flex items-start gap-3 p-4 text-left"
                    onClick={() => setExpanded(isExpanded ? null : qa.id)}
                  >
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 leading-snug">{qa.q}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[qa.level]}`}>
                          {qa.level.charAt(0).toUpperCase() + qa.level.slice(1)}
                        </span>
                        {qa.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
                      <div className="relative">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Model Answer</div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{qa.a}</p>
                        <button
                          onClick={() => copyAnswer(qa.id, qa.a)}
                          className="absolute top-0 right-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          {copied === qa.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {qa.follow_ups && (
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Follow-up Questions</div>
                          <ul className="space-y-1">
                            {qa.follow_ups.map((fq) => (
                              <li key={fq} className="flex gap-2 text-xs text-gray-600">
                                <Zap className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                                {fq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
