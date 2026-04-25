import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronRight, MessageSquare, Zap, Shield, Database, Cloud, Settings, Star, Copy, Check, Activity, Server, Layers, BookOpen, Code, Search, X, Target, Brain, Trophy, RotateCcw, ChevronDown, Play, CheckCircle2, XCircle, BookOpen as BookOpenIcon, GraduationCap, ListChecks, Shuffle } from "lucide-react";
import { EXAM_PACK_2026 } from "@/data/examPack2026";

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
        a: "RZ10 maintains SAP profile parameters (default.pfl, instance profiles, start profiles) stored as files — changes require a system restart. RZ11 is for individual parameter documentation and, for dynamic parameters, allows immediate in-memory value changes without restart via 'Set Value'. Rule: always check RZ11 first to determine if a parameter is dynamic before scheduling downtime for RZ10.",
        follow_ups: ["Name 5 dynamic parameters changeable via RZ11", "What is the difference between the default.pfl and instance profile?"],
        level: "junior",
        tags: ["RZ10", "RZ11", "profiles", "parameters"],
      },
      {
        id: "sa2",
        q: "A user cannot log into SAP. Walk me through your diagnostic steps.",
        a: "My triage: (1) SU01 — check if user is locked or password expired. (2) SM50/SM66 — verify dialog work processes are available and not all busy. (3) SM21 — system log for authentication failures. (4) SMLG — check logon groups/message server. (5) SM59 — if CUA/remote, check RFC connectivity. (6) If CUA: check SCUL in central system for user status. (7) Network: confirm user can reach message server port (3600+SID). (8) SM02 — any system message blocking logon? (9) SU53 — if user logs in but immediately gets authorization error.",
        follow_ups: ["What is the difference between user locked by admin vs locked by failed logins?", "How do you mass-unlock users?"],
        level: "junior",
        tags: ["user", "logon", "SU01", "troubleshooting"],
      },
      {
        id: "sa3",
        q: "How do you perform a client copy and what are the key risks?",
        a: "Use SCCL (local copy, same system) or SCC9 (remote copy via RFC). Steps: (1) Log into target client. (2) Select copy profile: SAP_ALL (all objects and data), SAP_CUST (customizing only), SAP_UZER (users only). (3) Lock users in target during copy. (4) Schedule in background — never interactive for large copies. (5) Monitor via SCC3. Risks: target data is completely overwritten (irreversible), open transports in source are included (close them first), RFC instability for SCC9, large copies = hours downtime, post-copy SCC7 processing required.",
        level: "mid",
        tags: ["SCC", "client copy", "SCCL", "risk"],
      },
      {
        id: "sa4",
        q: "All dialog work processes are stuck in 'Running'. What do you do?",
        a: "(1) SM50 — identify which program/user/transaction is consuming WPs. (2) Look for long-running or blocked processes in DB wait state. (3) SM12 — check for widespread enqueue locks causing a deadlock. (4) SM37 — identify and cancel the associated background job. (5) If DB-level blocking: DBACOCKPIT/ST04 — check lock escalations or blocking sessions. (6) SM50 → Cancel process (graceful) or Cancel+Core (last resort). (7) Temporary: increase dialog WP count via RZ10 (rdisp/wp_no_dia) + restart. (8) Inform business via SM02 system message.",
        level: "senior",
        tags: ["SM50", "work processes", "performance", "WP"],
      },
      {
        id: "sa5",
        q: "What is the significance of the ICM (Internet Communication Manager) and how do you monitor it?",
        a: "The ICM handles all HTTP/HTTPS/WS protocols in SAP NetWeaver. It's critical for Fiori, WebDynpro, Web Services, SAP GUI for HTML, and SOAP connections. Monitoring via SMICM: check ICM status, active threads, memory usage, and SSL handshake errors. Key transactions: SMICM (main monitor), SICF (define HTTP services), SM59 (RFC/HTTP destinations). Common issues: ICM crash (restart via SMICM → ICM → Restart), certificate expiry (STRUST), maximum thread saturation (increase icm/max_conn parameter via RZ10). Enable ICM traces via SMICM → Traces for SSL debugging.",
        level: "mid",
        tags: ["ICM", "SMICM", "HTTP", "SICF"],
      },
      {
        id: "sa6",
        q: "Explain the SAP enqueue (lock) architecture.",
        a: "SAP uses application-level optimistic locking via the Enqueue Server (separate process in ABAP stack, or standalone Enqueue Server 2 in S/4HANA). When a user opens a transaction that modifies data, SAP creates an enqueue entry in the Enqueue Server memory. SM12 shows all active locks. Important concepts: ENQUEUE_MAX_LOCKS parameter limits max entries. Lock collisions are handled via application logic (user gets 'Object locked' message). Enqueue replication (REPLICATION=Y in enqueue profile) sends lock table to a replication server for HA — if primary enqueue fails, replica takes over without losing locks. Clean-up: SM12 → delete stale locks left by aborted programs.",
        level: "mid",
        tags: ["SM12", "enqueue", "locks", "HA"],
      },
      {
        id: "sa7",
        q: "What are dispatcher trace files and how do you analyze them?",
        a: "The dispatcher is the central process that routes incoming work to work processes (dialog, background, update, enqueue, spool). Dispatcher traces are written to the SAP work directory (dev_disp). Access via AL11 (SAP file browser) or OS. dev_disp is the main dispatcher log. dev_w{n} files are per-work-process traces. Increase trace level in RZ04 or via SM50 → Trace → Set Level. Useful for diagnosing: work process crashes (short dumps, ABAP runtime errors), dispatcher restart reasons, RFC handler issues. In S/4HANA/HANA environments, dev_icm is critical for HTTP layer issues.",
        level: "senior",
        tags: ["dispatcher", "traces", "dev_disp", "SM50"],
      },
      {
        id: "sa8",
        q: "How do you manage spool requests and output management in SAP?",
        a: "Spool management: SP01 (view/manage spool requests), SP12 (spool server configuration), SPAD (configure output devices and access methods). Key concepts: spool requests are temporary until explicitly deleted or retention period expires. Inconsistent spool (spool in database but missing on OS) — report RSSPOODE or RSPO0041. Spool overflow (too many entries): clean with RSPO1041 (delete old entries). Output devices: local (through SAP spool work process), remote (through SAP or OS), frontend. Access methods: G (spool server → OS), E (external command), U (route to another spool server). Spool consistency check: SPAD → Utilities → Consistency Check.",
        level: "mid",
        tags: ["spool", "SP01", "SPAD", "output"],
      },
      {
        id: "sa9",
        q: "What is the role of the SAP message server and how do you configure logon load balancing?",
        a: "The message server handles: (1) Logon load balancing — distributes logon requests to available application server instances based on configured logon groups. (2) Application server communication — instances register with message server on startup. (3) Lock server communication in older ABAP stack. Configuration: SMLG (create and maintain logon groups, assign server instances, set limits). The message server listens on port 3600+SysNr (internal) and 8100+SysNr (HTTP). SAP Web Dispatcher uses the message server to retrieve application server list dynamically. Monitor: SMGW shows gateway traffic; al11 → dev_ms for message server log.",
        level: "mid",
        tags: ["message server", "SMLG", "load balancing", "logon groups"],
      },
      {
        id: "sa10",
        q: "How do you handle a short dump (runtime error) reported by a user?",
        a: "Triage process: (1) ST22 — find the dump: filter by date, user, program. (2) Analyze dump details: error class (e.g., DBIF_RSQL_INVALID_RSQL = DB error, MEMORY_NO_MORE_PAGING = memory), program name, position in source, active calls. (3) For system-level dumps (memory, DB connection): SM21 for correlated system events at the same time. (4) DB errors: DBACOCKPIT for DB-side analysis. (5) ABAP errors: pass to development team with full dump context. (6) Identify pattern: is it one user, specific transaction, or system-wide? (7) Common Basis-solvable dumps: STORAGE_PARAMETERS_WRONG_SET (heap memory — increase abap/heap_area_total), DBIF_REPO_SQL_ERROR (DB connection). Keep ST22 entries at least 7 days via RSSYST11.",
        level: "mid",
        tags: ["ST22", "short dump", "ABAP", "troubleshooting"],
      },
      {
        id: "sa11",
        q: "What is the SAP Update Work Process and how do you manage update failures?",
        a: "The Update Work Process asynchronously processes database update requests from dialog transactions. When a user executes a transaction, SAP stores update records in the database (USO0x tables); the update WP then processes them asynchronously. SM13 monitors update records. Update failures: SM13 → find records with status ERR — investigate error details. Common cause: database error, lock conflict, data inconsistency. Resolution: (1) Fix the root cause, (2) SM13 → restart the failed update record, or (3) coordinate with functional team to manually correct data if needed. Update record table overflow: rdisp/vbmax = too low — increase via RZ10.",
        level: "mid",
        tags: ["SM13", "update", "WP", "asynchronous"],
      },
      {
        id: "sa12",
        q: "Describe your approach to an SAP system refresh (system copy).",
        a: "System refresh copies production data to a non-production system. High-level steps: (1) Pre-refresh: communicate downtime, backup target system, export target system layout/config (STMS routes, RFC connections, SLD config). (2) Use SAPinst or R3load/MIGMON for homogeneous system copy. (3) Post-processing (crucial!): SCCL to synchronize client settings, SCC4 to adjust client roles, BDLS to convert logical system names, SU01/profile fix for security settings, SM59 to redirect RFC connections to correct targets, STMS to remove target from production transport domain and re-add to test domain, re-enable background jobs selectively, SLD/LMDB registration. (4) Test critical transactions. (5) Communication: confirm system is available. BDLS is the most critical and commonly forgotten step.",
        level: "senior",
        tags: ["system copy", "refresh", "BDLS", "SAPinst"],
      },
      {
        id: "sa13",
        q: "How do you perform and verify support package and kernel upgrades?",
        a: "Support Packages via SPAM: (1) Download stack from SAP Service Marketplace (support.sap.com). (2) Upload queue to SAP system via SPAM → Upload. (3) Create an import queue and confirm. (4) SPAM handles pre-import checks, import, post-processing. (5) Monitor for errors — SPAM shows logs per phase. Kernel upgrade: (1) Download new kernel from Service Marketplace. (2) Backup existing kernel directory. (3) Stop SAP system. (4) Replace kernel files. (5) Start SAP. Verify: SM51 shows new kernel version. Pre-requisites: always check compatibility matrix in SAP note 19466 for kernel vs. database version compatibility. EHP/SPS upgrades additionally need SUM (Software Update Manager) tool.",
        level: "mid",
        tags: ["SPAM", "kernel", "support packages", "upgrade"],
      },
      {
        id: "sa14",
        q: "What is CUA (Central User Administration) and what are the pros and cons?",
        a: "CUA centralizes user master record management from a single 'central' SAP system to multiple 'child' systems via ALE/IDOC technology. Pros: Single point for user creation, password management, and role assignment across the landscape; consistent user IDs. Cons: Single point of failure — CUA outage impacts all user changes across landscape; complex RFC/ALE setup; child system changes (local roles) still go to child; debugging ALE IDOCs is non-trivial. Transactions: SCUA (CUA setup), SCUM (distribution parameters), SUCOMP (company setup), SU01 (users created here distribute to children). Monitor: SU01 → Environments → Distribute User → Check distribution errors. Alternative in modern landscapes: Identity Management or SAP Cloud Identity Services.",
        level: "senior",
        tags: ["CUA", "SCUA", "user management", "ALE"],
      },
      {
        id: "sa15",
        q: "How do you configure and troubleshoot RFC connections?",
        a: "RFC connections configured in SM59. Types: Type 3 (ABAP connection), Type H (HTTP), Type G (HTTP without ABAP application server), Type T (TCP/IP for external programs). Configuration: hostname, system number, logon credentials, load balancing options. Testing: SM59 → select connection → Test → Remote Logon (for Type 3) or Connection Test (for all). Troubleshooting: (1) SM59 → Connection Test fails → check if target system is running (SM51 on target). (2) Network: ping hostname, check firewall for port 33NN (Type 3 gateway). (3) SMGW on both sides — check gateway traces. (4) Credentials: RFC user must have S_RFC authorization object. (5) SNC/SSL: verify certificate if secure RFC configured (STRUST). (6) Load balancing RFC: SMLG on target — ensure logon group exists.",
        level: "mid",
        tags: ["SM59", "RFC", "connectivity", "SMGW"],
      },
      {
        id: "sa16",
        q: "What is a logical system name and why is it important?",
        a: "A logical system name uniquely identifies an SAP client/system in a landscape for ALE/EDI and distribution model purposes. Set in: BD54 (define logical systems), SCC4 (assign to client). Critical rules: logical system names must be unique across the entire landscape. The logical system name is hardcoded into IDoc control records and cross-system distribution models. During system refresh/copy: BDLS must be run to replace the source logical system name with the target's name in all ALE and IDOC-related tables — without BDLS, the refreshed system will try to send IDocs to the wrong system. Naming convention: <SID><CLIENT>, e.g., P01CLNT100 for production system P01 client 100.",
        level: "mid",
        tags: ["BD54", "BDLS", "logical system", "ALE"],
      },
      {
        id: "sa17",
        q: "Explain the SAP system landscape for a typical 3-tier setup.",
        a: "Standard 3-tier landscape: DEV (Development) → QAS (Quality Assurance / Test) → PRD (Production). DEV: ABAP development, customizing changes, transport request creation. QAS: functional testing, user acceptance testing, integration testing. PRD: live production. Transports flow DEV→QAS→PRD via STMS consolidation and delivery routes. Extended landscape for large enterprises: add SBX (sandbox for exploration), TRN (training), PRE (pre-production for performance testing). In RISE with SAP: the landscape is provided by SAP, and customers interact via SAP Activate methodology. Always maintain separate STMS domain controller — ideally a small standalone system (domain controller) to avoid dependency on any production instance.",
        level: "junior",
        tags: ["landscape", "STMS", "3-tier", "DEV QAS PRD"],
      },
      {
        id: "sa18",
        q: "What is the SAP Gateway and how does it relate to Fiori?",
        a: "SAP Gateway provides OData services that expose SAP business data/functions to Fiori apps and other external consumers over HTTP/REST. Architecture: Gateway hub (can be embedded in S/4HANA or standalone) + backend SAP systems. Key transactions: /IWFND/MAINT_SERVICE (activate and maintain OData services on hub), /IWBEP/V4_ADMIN (OData V4 management), /IWFND/ERROR_LOG (Gateway error log), /IWFND/TRACES (Gateway traces). Fiori: Fiori apps are HTML5 UIs that call Gateway OData services. Fiori Launchpad runs on ICF (SICF). Common issues: Gateway service not active (/IWFND/MAINT_SERVICE), missing backend RFC connection (SM59), ICF service not active (SICF → /sap/bc/ui2/flp). For S/4HANA on-prem, SAP Gateway is embedded.",
        level: "mid",
        tags: ["Gateway", "OData", "Fiori", "/IWFND/MAINT_SERVICE"],
      },
      {
        id: "sa19",
        q: "How do you manage system license (USMM and SLAW)?",
        a: "SAP license compliance: USMM (User Master Maintenance) generates the monthly license measurement report showing user classification, engine usage, and CPU usage. Process: (1) USMM → Start Measurement → generates measurement document. (2) Review user types (Professional, Developer, Test, mySAP Limited Professional, etc.). (3) Submit via SLICENSE → Load Measurement → send to SAP. Key concepts: Named User model (per unique user) vs. engine/package licensing. Basis role: ensure user types are correctly assigned in SU01 (parameter tab — user type). Alert before measurement: check USMM preview to avoid surprises. SLAW (License Administration Workbench) in Solution Manager centralizes measurement for the entire landscape. Over-licensing risk: check for departed employees still active in SU01.",
        level: "senior",
        tags: ["USMM", "SLICENSE", "license", "SLAW"],
      },
      {
        id: "sa20",
        q: "What is the SAP Web Dispatcher and when would you use it?",
        a: "SAP Web Dispatcher is a standalone reverse proxy for HTTP/HTTPS traffic to SAP systems. It sits between external clients and SAP application servers, providing: load balancing for HTTP requests (Fiori, SAP GUI for HTML), SSL termination, URL routing and filtering, session stickiness for stateful applications. When to use: external internet-facing access to SAP Fiori, high availability for web access (multiple Web Dispatchers behind a hardware LB), TLS offloading. Configuration: profile parameters in wdisp/system_<n> for each backend system; wdisp/logfile for logging. Monitoring: wdispadm -mon for status. Different from SAP Router: SAP Router proxies SAP GUI protocol (DIAG) for support access; Web Dispatcher handles HTTP/S.",
        level: "senior",
        tags: ["Web Dispatcher", "load balancing", "HTTP", "Fiori"],
      },
      {
        id: "sa21",
        q: "How do you monitor and manage memory in SAP ABAP systems?",
        a: "Memory architecture: Roll memory (extended user memory — em/initial_size_MB), Heap memory (ABAP: abap/heap_area_total, abap/heap_area_dia), Shared memory (shared buffer — SAP buffers). Monitor: SM50 — per-WP memory usage; AL12 (buffer monitor); ST02 (buffer analysis — hit rates, swaps); SM04 (user overview with memory). Common memory issues: STORAGE_PARAMETERS_WRONG_SET dump = heap/roll overflow → increase via RZ10. Buffer quality: ST02 → hit rate < 95% = buffer too small → increase buffer parameters (zcsa/table_buffer_area, rtbb/buffer_length). Extended memory exhaustion: em/initial_size_MB too low. Note: S/4HANA on HANA eliminates most buffering needs as HANA is in-memory.",
        level: "senior",
        tags: ["memory", "ST02", "SM04", "buffers"],
      },
      {
        id: "sa22",
        q: "Explain the difference between synchronous and asynchronous RFC (sRFC vs aRFC).",
        a: "sRFC (Synchronous RFC): calling program waits for the remote function module to complete and return results before continuing. Used when return values are needed immediately. If remote system is unavailable, the call fails immediately with an exception. aRFC (Asynchronous RFC): calling program continues execution without waiting for remote function to complete. No return values back to caller. Used for parallel processing (multiple aRFC calls simultaneously). tRFC (Transactional RFC): guarantees exactly-once execution — stores call in ARFCSSTATE table and retries on failure. Basis monitors: SM58 (tRFC/qRFC monitoring), ARFCSSTATE (transaction RFC status). qRFC (Queued RFC): tRFC in ordered queues — SMQR for inbound queues, SMQS for outbound queues.",
        level: "mid",
        tags: ["RFC", "SM58", "tRFC", "aRFC"],
      },
      {
        id: "sa23",
        q: "What is the purpose of the SAP Router and how is it configured?",
        a: "SAP Router is a program that acts as a proxy/firewall between external networks (SAP support) and internal SAP systems. It allows SAP support engineers to access customer systems via the SAP backbone without opening direct inbound connections. Configuration: saprouttab (route permission table) defines which connections are allowed — format: P <source> <destination> <port>. Start command: saprouter -r -R saprouttab. Connection entry in SNC-secured setups requires certificate exchange. Registration with SAP: register in SAP Service Marketplace (support.sap.com) — Connection Management → SAP Router. Monitoring: sap router log (dev_rout). Basis team must maintain saprouttab to allow connections from SAP support network IPs only.",
        level: "mid",
        tags: ["SAP Router", "support access", "security", "saprouttab"],
      },
      {
        id: "sa24",
        q: "What is SNC and how does it enhance SAP security?",
        a: "SNC (Secure Network Communications) provides encryption and authentication for all SAP DIAG (SAP GUI) and RFC connections using a cryptographic library (SAP Cryptographic Library or third-party GSSAPI provider). Replaces plain-text transmission of all data between SAP GUI and application server. Configuration: snc/enable = 1, snc/gssapi_lib = path to library, snc/identity/as = <SNC identity>. Client configuration: SAP Logon → Properties → Network tab → SNC. PSE (Personal Security Environment) managed via STRUST — system PSE needs to be generated. SNC quality of protection: Authenticate only, Integrity protection, Privacy (encryption). When combined with SSO certificates (SAP Logon tickets or X.509): enables single sign-on. Verify SNC connections: SM59 (Type 3 RFC with SNC) → Test Connection.",
        level: "senior",
        tags: ["SNC", "encryption", "STRUST", "security"],
      },
      {
        id: "sa25",
        q: "How do you approach sizing a new SAP system?",
        a: "SAP Quick Sizer (quicksizer.sap.com) — input business data: number of users per business function, transaction volumes, batch window. Quick Sizer outputs SAPS (SAP Application Performance Standard) — compute sizing metric — plus memory and disk requirements. Key inputs: concurrent users, peak users, business transaction volume per hour, batch job duration requirements. Cross-check with: SAP HANA sizing (for in-memory) — use Quick Sizer for HANA column store data footprint estimate. Hardware certification: use SAP HANA Hardware Directory (hdblibrary.ondemand.com) to select certified hardware. Cloud: equivalent instance types in EC2/Azure/GCP from SAP certified instance lists. Common mistake: undersizing by using average instead of peak transaction volumes. Always add growth buffer (20-30%).",
        level: "senior",
        tags: ["sizing", "Quick Sizer", "SAPS", "HANA"],
      },
      {
        id: "sa26",
        q: "What is the difference between a Basis landscape with embedded vs standalone application servers?",
        a: "Embedded (single-server): All SAP components (message server, enqueue server, dispatcher, work processes) run on one physical/virtual machine. Suitable for smaller systems (development, sandbox). Standalone application servers (ASCS + AS): ASCS (ABAP Central Services) instance hosts the Message Server and Enqueue Server separately from application servers. AS ABAP instances host only dispatchers and work processes. This separation enables HA: ASCS can be clustered (Pacemaker) independently from application servers. In S/4HANA HA architecture: ASCS/ERS (Enqueue Replication Server) pair clusters the enqueue server. DB instance is always separate. The ASCS/ERS pair is critical for Basis HA design.",
        level: "senior",
        tags: ["ASCS", "HA", "landscape", "architecture"],
      },
      {
        id: "sa27",
        q: "How do you install a new SAP application server instance (scale-out)?",
        a: "Process: (1) Verify new host meets hardware requirements (SAPS, memory, disk). (2) Ensure SAP kernel is accessible (shared NFS or local copy). (3) Use SAPinst (SWPM) → SAP NetWeaver → Additional Application Server Instance → AS ABAP Additional Application Server. (4) Provide: SID, instance number, message server host/port, database connection details. (5) SAPinst copies profiles, creates services. (6) Start new instance (sapcontrol). (7) In STMS: TMS domain controller will auto-detect new instance. (8) In SMLG: add new server to logon groups with appropriate capacity. (9) Verify SM51 shows new instance. (10) Update monitoring (RZ20 alert monitors). (11) Update SAP Web Dispatcher/load balancer configuration to include new server. SWPM validates pre-requisites (OS parameters, DB access) before install.",
        level: "senior",
        tags: ["SWPM", "application server", "scale-out", "SM51"],
      },
      {
        id: "sa28",
        q: "What are the most important OS-level parameters you tune for SAP on Linux?",
        a: "Key Linux parameters for SAP: kernel.sem (semaphore limits — SAP Note 1410736): set to '1250 256000 100 8192'. vm.dirty_ratio / vm.dirty_background_ratio: set low (2/1%) to prevent large dirty page flushes impacting HANA. vm.swappiness: 10 or lower — SAP HANA Note 2031375 recommends 0 for HANA. Transparent Huge Pages (THP): disable ('never' in /sys/kernel/mm/transparent_hugepage/enabled) for SAP HANA — SAP Note 2131662. CPU Frequency Scaling: set to 'performance' governor for HANA servers. net.ipv4.tcp_keepalive_time: important for long-lived SAP GUI connections. Max open files (ulimit -n): set to 65536 or higher. /etc/hosts: SAP systems must resolve all instance hostnames locally. sapconf/saptune tool on SUSE and RHEL automates most of these settings.",
        level: "senior",
        tags: ["Linux", "OS tuning", "kernel", "HANA"],
      },
      {
        id: "sa29",
        q: "How do you handle an emergency login when all dialog work processes are occupied?",
        a: "Emergency options: (1) SM50 via a dedicated maintenance connection — use SAP GUI with special parameter (MessageServerService.ini: emergency logon). (2) Use the SAP system emergency user (SAP* or DDIC) which bypasses the logon process and has dedicated reserved work processes (rdisp/wp_no_dia_emergency). (3) telnet/SSH to OS level → brute force kill runaway ABAP processes (kill -9 <pid>) to free WPs. (4) Operating system: sapcontrol -nr <NR> -function RestartService to restart the application server. (5) If using an Operations team: trigger SAP Alert → CCMS emergency escalation. Best practice: configure rdisp/wp_no_dia_emergency = 1 in all production instances to always reserve one WP for admin access.",
        level: "senior",
        tags: ["emergency logon", "work processes", "SAP*", "rdisp"],
      },
      {
        id: "sa30",
        q: "What is the SAP Change and Transport System (CTS) and how does CTS+ differ?",
        a: "CTS is the standard SAP mechanism for transporting ABAP workbench and customizing changes between systems via transport requests (se09/se10/stms). CTS+ extends this to non-ABAP objects: Java components, Adobe forms, configuration files, Portal content (KM), PI/XI objects, and third-party files. CTS+ uses the 'Enhanced Transport Management' with file-based transport containers. For S/4HANA: CTS is used for ABAP, while Git-based transport (using gCTS — Git-enabled CTS) allows ABAP code to be stored in Git repositories and transported via Git branching. gCTS replaces file-based transports with Git operations, enabling CI/CD pipelines for ABAP. Basis role in gCTS: configure repository connections (SCTS_REPW), manage branches, integrate with Git provider (Bitbucket, GitHub, GitLab).",
        level: "senior",
        tags: ["CTS", "CTS+", "gCTS", "transport"],
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
        q: "Explain SAP STMS — domain controller, transport routes, and import queues.",
        a: "STMS (TMS) centralizes transport management. One system is the Domain Controller — stores all transport route configuration and acts as the TMS communication hub. Transport routes: Consolidation Route (DEV→QAS): automatically adds released requests to QAS import queue. Delivery Route (QAS→PRD): manually import from QAS to PRD queue. Import queue (STMS → Import Overview): lists all requests pending import. Import process: select requests → Import → choose target system. Order matters: import in release order or import all. Virtual systems: represent non-SAP targets in the route configuration. STMS → System Landscape → Add System for adding new systems. STMS transport routes must be configured in the domain controller, not individual systems.",
        follow_ups: ["What is a transport domain and why only one domain controller?", "How do you import a single transport to PRD out of the normal queue?"],
        level: "junior",
        tags: ["STMS", "domain controller", "transport routes", "import"],
      },
      {
        id: "tr2",
        q: "A transport import to Production failed with RC=8. How do you investigate?",
        a: "(1) STMS → Import Overview → select PRD → find the failed request. (2) Click the transport → Logs (ALOG/SLOG). (3) RC8 = error during import — look for the step that failed. Common steps: R3trans, tp, dictionary activation, ABAP import. (4) Export the R3trans log for detailed syntax. (5) SE01 in source — check transport contents and objects. (6) Dictionary errors (RC=8 on DDIC activation): SE14 in target to force activate failed objects. (7) RC=12 = critical error (data file missing, import aborted). (8) RC=4 = warning (acceptable in most cases — check if critical objects involved). For RC=8: fix root cause, then either: re-import or create correction transport. Document the analysis and post-import validation.",
        level: "mid",
        tags: ["STMS", "RC8", "import error", "R3trans"],
      },
      {
        id: "tr3",
        q: "What is the difference between SE09 and SE10?",
        a: "SE09 (Workbench Organizer): manages Workbench transport requests for cross-client repository objects — ABAP programs, function modules, data dictionary (DDIC), screens, messages, documentation. Changes are system-wide. SE10 (Customizing Organizer): manages Customizing transport requests for client-specific customizing entries (IMG/SPRO changes). Client-dependent. In modern SAP, SE09 shows both types (filter by request type). Local objects ($TMP package) are never transported. Composite change requests can contain multiple tasks from different developers — only the project lead releases the composite request after all tasks are released. Always check SE01 (full transport organizer) for complete management view.",
        level: "junior",
        tags: ["SE09", "SE10", "workbench", "customizing"],
      },
      {
        id: "tr4",
        q: "How do you transport a request directly to Production (emergency transport)?",
        a: "Emergency transport (never use in normal change process): (1) Release the transport request normally in SE09. (2) In STMS on the domain controller: add the request directly to the PRD import queue (STMS → Import Overview → PRD → Add Requests). (3) Obtain required change approvals (SOX/ITIL change ticket). (4) Import in PRD via STMS. Alternative: tp addtobuffer <request> <target_SID> and tp import <request> <target_SID> on OS level. Best practice: document the emergency, add a change request retroactively, and follow up with a QAS validation. Audit: STMS keeps a full transport log — auditors will see direct-to-PRD transports.",
        level: "senior",
        tags: ["STMS", "emergency transport", "direct production", "tp"],
      },
      {
        id: "tr5",
        q: "Explain the tp command-line tool and common tp operations.",
        a: "tp (transport program) is the command-line tool that R3trans calls for transport operations. Runs on OS as <sidadm>. Common commands: tp addtobuffer <request> <SID> — add to import buffer. tp import <request> <SID> — import specific request. tp import all <SID> — import all queued requests. tp showbuffer <SID> — show what's in import buffer. tp clearold <SID> — clean old processed requests. tp connect <SID> — test database connection. tp export <request> — export transport (unusual, normally done via SE09/SE10). tp checks tp profile (TP_DOMAIN_*.PFL) for transport directory paths and database parameters. Transport files location: /usr/sap/trans/data (data files) and /usr/sap/trans/cofiles (control files).",
        level: "mid",
        tags: ["tp", "transport", "OS", "command line"],
      },
      {
        id: "tr6",
        q: "What is the transport directory and what are the key subdirectories?",
        a: "The SAP transport directory (/usr/sap/trans or configurable) is shared across all systems in the transport domain. Key subdirectories: /data — transport data files (K<request>.<SID>). /cofiles — control files (R<request>.<SID>). /log — tp and R3trans log files (one per transport attempt). /buffer — import buffer files (one per target system). /actlog — activation logs. /olddata — old data files after import. /bin — tp and R3trans executables. Critical: the transport directory must be mounted on all systems in the domain — typically NFS shared from a dedicated transport host. Access issues: if /usr/sap/trans is not accessible, all transports fail. Security: only <sidadm> and sapadm should have write access.",
        level: "mid",
        tags: ["transport directory", "NFS", "cofiles", "data"],
      },
      {
        id: "tr7",
        q: "How do you handle transport conflicts (when multiple developers change the same object)?",
        a: "Transport conflicts occur when two transport requests contain the same object. Detection: SE09 → request → display contents → check for collision warnings. Also: STMS → Import Overview → quality check shows conflicting requests. Resolution strategies: (1) Last-writer-wins: import in correct chronological order — later request overwrites earlier. (2) Merge: developer combines both changes into a single request. (3) For customizing conflicts (SE10): use SCMP (Customizing Cross-System Viewer) to compare. Preventive measures: (1) Enforce single ownership per development object. (2) Use ChaRM (Solution Manager) or similar ITSM tool to serialize changes. (3) Regular transport to QAS reduces queue buildup. In urgent conflicts on critical objects: involve project lead + business sign-off.",
        level: "senior",
        tags: ["transport conflict", "SE09", "SCMP", "object collision"],
      },
      {
        id: "tr8",
        q: "What is R3trans and how does it relate to tp?",
        a: "R3trans is the low-level transport tool that actually reads/writes data and repository objects to/from the database. tp is the high-level orchestration tool that calls R3trans for each transport step. R3trans processes: export (reads objects from database to transport file), import (writes objects from transport file to database), dictionary activation (activates DDIC after import), ABAP generation. R3trans is the one writing R3trans*.LOG files in /usr/sap/trans/log — these are the authoritative error logs to check when a transport fails. Common R3trans errors in logs: 'column not found', 'object already exists', 'conversion error'. Run R3trans manually (as <sidadm>): R3trans -x (test DB connection), R3trans -w <logfile> <controlfile> (execute a specific control file).",
        level: "senior",
        tags: ["R3trans", "tp", "transport", "import error"],
      },
      {
        id: "tr9",
        q: "How do you configure a transport route for a new system added to the landscape?",
        a: "Steps in STMS on domain controller: (1) STMS → Overview → Systems → check new system appears (auto-registers on first start). (2) STMS → Overview → Transport Routes → display/change. (3) Graphical editor: drag new system into landscape and connect with routes. (4) Create Consolidation Route from DEV to QAS (if new system is a quality system) or Delivery Route from QAS to new system. (5) Assign transport layers (e.g., SAP standard layer Z for custom objects). (6) Distribute and activate configuration: STMS → Overview → Transport Routes → Extras → Distribute and Activate. (7) Verify: STMS → Import Overview → new system should appear. (8) Check /usr/sap/trans/buffer/<new_SID> file is created. Domain controller must be reachable from new system during registration (RFC connection from new system to domain controller).",
        level: "mid",
        tags: ["STMS", "transport route", "landscape", "new system"],
      },
      {
        id: "tr10",
        q: "What is the difference between a transport request, task, and project?",
        a: "Transport Request (SE09/SE10): the container that is actually transported between systems. Released by the owner/project lead. Contains one or more tasks. Task: individual developer's work area within a request. Each developer gets their own task. Developer releases their task first; project lead then releases the whole request. Objects are locked (task-level) while unreleased — other users cannot include the same objects in other requests. Project (CTS Project or SolMan Project): optional grouping of multiple transport requests for a business project. A single project may contain many requests released over time. In ChaRM: Change Request → Change Document → Task List → Transport Requests hierarchy. The key rule: always release tasks before releasing the request; always release requests before importing.",
        level: "junior",
        tags: ["transport request", "task", "SE09", "project"],
      },
      {
        id: "tr11",
        q: "How do you check and clean the transport buffer?",
        a: "Transport buffer contains requests pending import for each target system. File: /usr/sap/trans/buffer/<SID>. Commands: tp showbuffer <SID> — lists all pending requests with their status. tp cleanbuffer <SID> — removes successfully imported requests (RC <= 4). Manual cleanup needed when: buffer is corrupted, requests are in wrong order, imported requests are not cleaned up. STMS GUI equivalent: STMS → Import Overview → <SID> → Queue. To remove a specific request: tp removefromtobuffer <request> <SID> (caution!). Buffer file syntax: each line = request + flag (I=imported, U=unprocessed). Disk space: /usr/sap/trans must have adequate space — monitor with df -h. Buffer overflow symptoms: tp errors 'cannot write to buffer', imports stop.",
        level: "mid",
        tags: ["transport buffer", "tp", "buffer cleanup", "STMS"],
      },
      {
        id: "tr12",
        q: "What is the import all option versus selective import in STMS?",
        a: "Import All: imports all requests in the queue in the correct sequence (sorted by release date). Recommended for QAS (import everything available). Issues: a failed request can block subsequent imports if 'Stop on Error' is set. Selective Import: import specific requests out of sequence. Risks: (1) Prerequisite requests may not be imported yet — causing object inconsistencies (e.g., program calls function that doesn't exist yet). (2) Bypasses change control procedures. (3) Dictionary inconsistencies if DDIC dependencies are not respected. Best practice: Import All in sequential order; for production, import only tested/approved requests (selected but still in order). In ChaRM: import packages ensure requests are imported atomically as a group.",
        level: "mid",
        tags: ["STMS", "import all", "selective import", "sequence"],
      },
      {
        id: "tr13",
        q: "What is gCTS (Git-enabled CTS) and how does it change transport management?",
        a: "gCTS replaces file-based ABAP transport (.cofile/.data) with Git repository storage. ABAP source code is stored as Git objects in a configured Git provider (GitHub, Bitbucket, GitLab, Gerrit). Transport between systems = Git clone/pull operations on the target system. Advantages: version control with full Git history, branching for feature development, pull request workflows, CI/CD pipelines for ABAP. Key transactions: SCTS_REPW (repository management), /UI5/TREX_REPMAN (repository), SE80 with Git integration. Migration: existing transport-based development can be migrated to gCTS via report. Basis setup: configure repository connection (HTTPS/SSH to Git provider), assign packages to repositories, configure TLS certificates in STRUST. Coexistence: gCTS and traditional CTS can run side-by-side during migration.",
        level: "senior",
        tags: ["gCTS", "Git", "ABAP", "CI/CD"],
      },
      {
        id: "tr14",
        q: "How do you handle a failed import at the dictionary activation phase?",
        a: "Dictionary activation failure (RC=8 on DDIC step): (1) Check R3trans log in /usr/sap/trans/log for specific activation error. (2) SE14 (ABAP Dictionary: Database Utility) in target system → find the failing object → Activate. (3) Common causes: database inconsistency (table exists in DB but not in ABAP DDIC or vice versa), conversion error (data type change for existing table with data), missing prerequisite table/domain. (4) For conversion errors: SE14 → Adjust Database → can force physical table adjustment. (5) If type change causes data loss: coordinate with functional team first. (6) After manual activation in SE14: re-import the transport — should pass DDIC phase. (7) For mass DDIC issues after a support package: report RSUD0001 (DDIC inconsistency analysis).",
        level: "senior",
        tags: ["SE14", "DDIC", "dictionary activation", "RC8"],
      },
      {
        id: "tr15",
        q: "What is QA approval in STMS and how does it support SOX compliance?",
        a: "QA approval in STMS is an optional workflow step where designated QA approvers must explicitly approve transport requests before they can be imported into production. Configured in: STMS → Overview → Systems → select PRD → 'QA' settings tab → enable QA approval. When enabled: imported requests in QAS get a QA flag; designated approvers (QA team, project lead) must approve via STMS before they appear in PRD queue. SOX compliance: provides documented evidence that functional testing was completed and approved before production import. Mandatory in many regulated industries. Approval history is retained in STMS transport logs. Integration with ChaRM: ChaRM's approval workflow is more sophisticated — includes authorization matrix, mandatory testers, sign-off documentation — all audit-traceable.",
        level: "senior",
        tags: ["STMS", "QA approval", "SOX", "compliance"],
      },
    ],
  },
  {
    id: "hana",
    title: "SAP HANA Database",
    icon: <Database className="w-5 h-5" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    questions: [
      {
        id: "h1",
        q: "Explain SAP HANA System Replication modes (SYNC, SYNCMEM, ASYNC).",
        a: "SYNC: primary waits for secondary to persist log to disk before committing. Zero RPO, minimal data loss risk, ~1ms latency overhead. Use within same datacenter/AZ. SYNCMEM: primary waits for secondary to receive log in memory (not disk). Faster than SYNC, still near-zero RPO for typical failures. If secondary crashes, data in memory is lost — primary resumes. ASYNC: primary does not wait for secondary at all. Best performance, but RPO > 0 (potential data loss equal to replication lag). Used for long-distance geo-redundant DR where network latency makes SYNC impractical. Setup: hdbnsutil -sr_enable on primary → hdbnsutil -sr_register on secondary. Monitor: hdbnsutil -sr_state (current replication status), M_SERVICE_REPLICATION view. Failover: automated via Pacemaker (HA) or manual via hdbnsutil -sr_takeover (DR).",
        follow_ups: ["How do you monitor replication lag?", "What happens to secondary after takeover?"],
        level: "mid",
        tags: ["HANA", "HSR", "replication", "SYNC", "ASYNC"],
      },
      {
        id: "h2",
        q: "Walk me through SAP HANA backup and recovery.",
        a: "Backup types: (1) Data backup (full): complete snapshot of all data volumes — file-based or Backint (third-party, e.g., AWS S3, Azure Backup). (2) Log backup: continuous, every X minutes (configurable), written to log backup location. (3) Incremental/Delta backup (HANA 2.0 SPS03+): only changed pages since last backup. Recovery procedure: (1) Stop HANA. (2) Use HANA Studio/Cockpit or hdbbackupcheck for pre-check. (3) Restore data backup to correct location. (4) Start HANA in recovery mode: hdbadm → HDB start --recover-until '<timestamp>'. (5) HANA replays log backups automatically to reach point-in-time. MDC: recover system DB first (contains shared catalog), then tenant DBs. Backup catalog: M_BACKUP_CATALOG and M_BACKUP_CATALOG_FILES views. Always test recovery regularly — untested backups are not real backups.",
        level: "mid",
        tags: ["HANA", "backup", "recovery", "Backint", "MDC"],
      },
      {
        id: "h3",
        q: "What are the key HANA monitoring views you check first for performance issues?",
        a: "Triage sequence: (1) M_LOAD_HISTORY_SERVICE — CPU/memory/network history by service: identify spike timing. (2) M_CS_TABLES ORDER BY MEMORY_SIZE_IN_MAIN DESC — largest column store tables consuming memory. (3) M_EXPENSIVE_STATEMENTS ORDER BY CPU_TIME DESC — top SQL by CPU, duration, memory. (4) M_BLOCKED_TRANSACTIONS — current blocking sessions. (5) M_DELTA_MERGE_STATISTICS — excessive delta merges degrading performance. (6) M_GARBAGE_COLLECTION_STATISTICS — MVCC garbage cleanup activity. (7) M_BACKUP_PROGRESS — check if backup is running concurrently. (8) M_SERVICES — all HANA services (nameserver, indexserver, etc.) with status. Practical tool: HANA Cockpit → Performance Monitor for visual history. HANA Studio → Administration → Performance tab.",
        level: "senior",
        tags: ["HANA", "performance", "monitoring views", "SQL"],
      },
      {
        id: "h4",
        q: "What is HANA Multi-tenant Database Container (MDC) and how does it work?",
        a: "MDC allows multiple tenant databases within a single HANA installation, each isolated from others with separate catalog, data volumes, and connections. Architecture: System DB (system database) — manages the overall HANA instance, tenant creation, resource allocation. Tenant DBs — each has its own schema, users, and data volumes. Access: system DB on port 3NN13, tenant DBs on ports 3NN15+. Management: HANA Cockpit → Manage Tenant Databases. SQL: 'ALTER SYSTEM CREATE DATABASE <name>'. Memory isolation: SET 'global_allocation_limit' per tenant to prevent one tenant consuming all memory. Backup: system DB and each tenant DB backed up independently. SAP systems use one HANA tenant per SAP SID by convention. When S/4HANA is installed on an MDC system: one tenant per S/4 client.",
        level: "mid",
        tags: ["HANA", "MDC", "multi-tenant", "tenant"],
      },
      {
        id: "h5",
        q: "How do you investigate and resolve HANA out-of-memory (OOM) situations?",
        a: "(1) HANA Cockpit → Memory Overview: total allocation vs limit. (2) M_LOAD_HISTORY_SERVICE: find when memory crossed threshold. (3) SELECT * FROM SYS.M_CS_TABLES ORDER BY MEMORY_SIZE_IN_MAIN DESC LIMIT 20: which tables are largest. (4) M_HEAP_MEMORY ORDER BY EXCLUSIVE_SIZE_IN_USE DESC: non-column-store heap consumers. (5) Check global allocation limit: SELECT KEY, VALUE FROM SYS.M_CONFIGURATION_PARAMETER_VALUES WHERE KEY='global_allocation_limit'. (6) If MDC: check per-tenant allocation limits. Resolution: (1) Increase global_allocation_limit (ALTER SYSTEM ALTER CONFIGURATION ... SET ('memorymanager','global_allocation_limit')). (2) Free up memory: unload large rarely-used tables (ALTER TABLE <name> UNLOAD). (3) Investigate runaway queries via M_EXPENSIVE_STATEMENTS. (4) Check for memory leaks in custom ABAP using HANA row store.",
        level: "senior",
        tags: ["HANA", "OOM", "memory", "troubleshooting"],
      },
      {
        id: "h6",
        q: "Explain HANA Column Store vs Row Store — when is each used?",
        a: "Column Store: SAP HANA's default storage. Data stored by column rather than row. Optimized for analytical queries (GROUP BY, aggregate, sum across millions of rows). High compression ratios (10:1 typical). Used for all SAP ABAP transparent tables (business data). Delta store: small write-optimized buffer (row-oriented) + main store (column-oriented). Delta merge moves data from delta to main. Row Store: Traditional row-oriented storage. Used for system catalog tables (metadata), internal HANA metadata, and tables explicitly created as row store. Faster for single-row reads by primary key. Smaller, frequently updated metadata tables benefit from row store. Config table: M_CS_TABLES (column store statistics), M_RS_TABLES (row store). Consideration: ABAP transparent tables imported via HANA DDL are automatically column store unless specified otherwise.",
        level: "mid",
        tags: ["HANA", "column store", "row store", "architecture"],
      },
      {
        id: "h7",
        q: "How do you upgrade SAP HANA to a new SPS?",
        a: "HANA Revision/SPS upgrade process: (1) Check SAP Product Availability Matrix (PAM) for kernel/OS compatibility with new SPS. (2) Download HANA install package (SAR file) from support.sap.com. (3) In MDC: upgrade system DB first, then tenants. (4) Use HANA Database Lifecycle Manager (HDBLCM) — web-based or CLI: hdblcm --action=update --components=server --path=<package_path>. (5) HDBLCM checks prerequisites automatically. (6) HANA is stopped and restarted automatically. (7) Post-upgrade: verify all services start (M_SERVICES), run application connectivity tests. (8) Update HANA Studio and SAP Cockpit to match new version. HA environment: upgrade secondary first (temporarily in async), failover, upgrade original primary, re-establish replication. This achieves near-zero downtime upgrade.",
        level: "senior",
        tags: ["HANA", "upgrade", "HDBLCM", "SPS"],
      },
      {
        id: "h8",
        q: "What is HANA scale-out and when is it required?",
        a: "HANA Scale-Out (distributed) spreads data across multiple HANA hosts (nodes). Required when: single server cannot provide enough memory for the entire database (SAP has certified single VMs up to ~24TB RAM — scale-out exceeds this). Architecture: one master indexserver + multiple worker indexservers + optional standby node. Data is distributed by table partitioning rules. Network: requires high-speed low-latency interconnect (InfiniBand or 100GbE EFA on AWS). Storage: shared NFS for /hana/shared and /hana/log is mandatory. Basis responsibilities: configure storage.ini correctly for each host's data and log volumes, configure topology via landscapeHostConfiguration.ini. M_LANDSCAPE_HOST_CONFIGURATION view shows host roles. Failover: if a worker node fails, standby takes over — nameserver initiates host failover automatically. Increasingly replaced by scale-up on very large instances (M-series, X9000 series).",
        level: "senior",
        tags: ["HANA", "scale-out", "distributed", "architecture"],
      },
      {
        id: "h9",
        q: "How do you create and manage HANA users and roles?",
        a: "HANA users and roles via HANA Cockpit, HANA Studio, or SQL: Create user: CREATE USER <name> PASSWORD <pw> NO FORCE_FIRST_PASSWORD_CHANGE. Grant privileges: GRANT SELECT ON SCHEMA <schema> TO <user>. GRANT EXECUTE ON PROCEDURE <proc> TO <user>. Role management: CREATE ROLE <role_name>. GRANT SELECT ON <view> TO ROLE <role_name>. GRANT <role_name> TO <user>. Types of privileges: System privileges (BACKUP ADMIN, CATALOG READ, etc.), Object privileges (SELECT, INSERT, DELETE on specific objects), Analytic privileges (row-level security for Calculation Views), Package privileges (for BW/HANA application packages). Monitor: M_GRANTED_ROLES, M_GRANTED_PRIVILEGES. HANA security best practice: use technical roles, avoid direct user grants, separate DBA role from application user. Auditing: HANA Audit Policy (CREATE AUDIT POLICY) — essential for compliance.",
        level: "mid",
        tags: ["HANA", "users", "roles", "security"],
      },
      {
        id: "h10",
        q: "What is SAP HANA Cockpit and what can you do with it?",
        a: "SAP HANA Cockpit is a web-based administration UI for HANA (replaces HANA Studio for most admin tasks). Key capabilities: database overview (memory, CPU, disk, services), backup and recovery management, user and role administration, performance monitoring (expensive statements, lock monitoring, memory analysis), system configuration (edit .ini files), alert monitoring, tenant management (MDC). Access: https://<hana_host>:43XX (default). Authentication: HANA users with CATALOG READ or specific cockpit roles. HANA Studio is still needed for: development features, advanced SQL console, graphical execution plans. HANA Cockpit is SAP's recommended admin tool going forward. In cloud deployments: accessible via browser without SAP GUI dependency — critical for operational agility. Requires Java-based SAP Web Dispatcher or XSA platform installation.",
        level: "mid",
        tags: ["HANA Cockpit", "administration", "web", "monitoring"],
      },
      {
        id: "h11",
        q: "How does HANA handle delta merges and why are they important?",
        a: "HANA column store has two parts: delta store (write-optimized, small, row-based) and main store (read-optimized, column-based, compressed). Delta merge moves data from delta to main, sorting and compressing it. Types: smart merge (automatic), forced merge (manual: MERGE DELTA OF <table>). Too-frequent merges: degrade write performance, consume CPU. Too-infrequent merges: delta store grows large, slowing reads. Monitor: M_DELTA_MERGE_STATISTICS — merge count, duration, error. Alert: large delta (M_CS_TABLES → DELTA_MERGE_COUNT low while ROW_COUNT_DELTA high) indicates merge may be stuck. Common issue: delta merge fails due to OOM — increase memory or reduce table size. Manual trigger: ALTER TABLE <name> DELTA MERGE. Configuration: 'auto_merge_decision_func' parameter controls merge triggers.",
        level: "senior",
        tags: ["HANA", "delta merge", "column store", "performance"],
      },
      {
        id: "h12",
        q: "What is HANA Persistent Memory (PMEM) and how is it configured?",
        a: "HANA Persistent Memory (PMEM/NVDIMM) uses Intel Optane DC Persistent Memory (PMem) as a third tier between DRAM and SSD, providing large memory capacity with persistence and near-DRAM speed. Benefits: dramatically increases usable memory per node at lower cost than DRAM, data survives crashes without needing replay from disk. Configuration: SAP HANA global.ini → [memorymanager] → persistent_memory_global_allocation_limit. Assign persistence to specific tables: ALTER TABLE <name> WITH PARAMETERS ('persistent_memory' = 'ON'). Hardware requirement: specific Intel PMem DIMMs in App Direct mode, configured at OS level. Monitor: M_PERSISTENT_MEMORY_VOLUMES, M_PMEM_SEGMENTS. Limitation: PMem write endurance is limited — use primarily for cold/warm data, not hot write-intensive tables. Available on Azure (Mv2 series), specific AWS instances, and on-premise certified hardware.",
        level: "senior",
        tags: ["HANA", "PMEM", "persistent memory", "performance"],
      },
      {
        id: "h13",
        q: "How do you perform a HANA tenant database rename or move?",
        a: "Tenant rename: ALTER SYSTEM RENAME DATABASE <old_name> TO <new_name> (system DB session). Check: SELECT DATABASE_NAME FROM SYS_DATABASES.M_DATABASES. Tenant move between HANA systems: Use backup + restore: (1) backup tenant on source: BACKUP DATA FOR <tenant> USING FILE ... (2) On target HANA: RECOVER DATABASE FOR <new_tenant_name> FROM ... (3) Alternatively, use HANA System Replication for tenant database migration. Considerations: after rename/move, update SAP instance profile (r3trans, sm59 connections) with new tenant name. In ABAP: DB connection in DEFAULT.PFL must point to new tenant. Verify post-move: SM59 → test connection to HANA. For S/4HANA, use SAPinst/SWPM for supported database migration procedures — do not manually rename production tenants without SAP guidance.",
        level: "senior",
        tags: ["HANA", "tenant", "rename", "migration"],
      },
      {
        id: "h14",
        q: "What is the HANA alert framework and how do you configure alerts?",
        a: "HANA has a built-in alert framework that monitors thresholds and generates alerts. Access via: HANA Cockpit → Alerts tab, or SQL: SELECT * FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS. Alerts are defined as statistics server checks that run periodically. Configuration: ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('statistics_server', 'active') = 'true'. Threshold tuning: HANA Cockpit → Alerts → Edit thresholds for each check (memory, disk, replication lag, etc.). Alert categories: Availability (services down), Performance (CPU, memory, response time), HANA System Replication (lag, disconnected), Backup (overdue backups). Integration with SAP CCMS/Solution Manager: HANA alerts can be forwarded to RZ20 alert monitor via HANA provider configuration (ST-PI). For S/4HANA: DBACOCKPIT → DBA Cockpit → Alerts also shows HANA alerts in the ABAP layer.",
        level: "mid",
        tags: ["HANA", "alerts", "monitoring", "thresholds"],
      },
      {
        id: "h15",
        q: "Explain HANA encryption (data-at-rest and in-transit).",
        a: "Data at Rest encryption: HANA uses AES-256 to encrypt data volumes, log volumes, and backup files. Configuration: global.ini → [persistence] → encrypt = on. Data Volume encryption (DVE): ALTER SYSTEM ENCRYPTION PASSWORD <pw>. Key management via HANA Secure Store in File System (SSFS) or external key management (SAP KMS, AWS KMS, Azure Key Vault). Encrypt backup: BACKUP DATA ... ENCRYPTED WITH KEY <key_name>. Data in Transit: TLS/SSL for all HANA SQL connections. Configure via openssl_conf parameter pointing to HANA certificate files (HANA Cockpit → Certificates). HANA Communication layer encryption: gRPC for internal HANA service-to-service communication (scale-out). Compliance: Encryption at rest is required by GDPR, HIPAA, PCI-DSS. Verify: SELECT ENCRYPTION_ACTIVE FROM M_DATA_VOLUME_ENCRYPTION_STATUS.",
        level: "senior",
        tags: ["HANA", "encryption", "security", "TLS"],
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
        a: "Architecture: HANA HSR SYNC across two AZs + Pacemaker + AWS Overlay IP (virtual IP routing). Overlay IP is a /32 route in the VPC routing table pointing to the active HANA ENI — moved by Pacemaker via AWS CLI calls in the SAPHana OCF resource agent during failover. Pacemaker manages: SAPHana resource (HANA takeover), SAPHanaTopology resource (topology detection), and the IP resource (Overlay IP). STONITH fencing via AWS API (fence_aws) or IPMI. Failover flow: Pacemaker detects primary failure → STONITH fences failed node → promotes secondary (hdbnsutil -sr_takeover) → updates Overlay IP routing → application reconnects. RTO ~30-60 sec. SAP note 1999880 + 3035775 for AWS HA configuration.",
        follow_ups: ["How does this differ from Azure HA?", "What is STONITH and why is it mandatory?"],
        level: "senior",
        tags: ["AWS", "HANA HA", "Pacemaker", "Overlay IP"],
      },
      {
        id: "cl2",
        q: "What storage types are used for SAP HANA on Azure and why?",
        a: "HANA data volume: Azure Premium SSD v2 — configurable IOPS and throughput independently. Minimum 400 MB/s, 15,000 IOPS per SAP certification. HANA log volume: Azure Ultra Disk — <1ms write latency requirement for HANA redo logs, which are critical path for transaction performance. Never use host read caching on data/log — can cause corruption. HANA shared and /sapmnt: Azure NetApp Files (ANF) — NFS 4.1, Ultra service level (128 MB/s/TB guaranteed). Supports cross-zone replication for DR. Backup: Azure Backup for SAP HANA writes to Recovery Services Vault. Why Ultra Disk for logs: HANA redo log is written synchronously on every transaction commit — high latency here blocks business operations. ANF: SAP recommends ANF over Azure Files or standard NFS for production HANA due to guaranteed throughput SLAs.",
        level: "senior",
        tags: ["Azure", "storage", "ANF", "Ultra Disk"],
      },
      {
        id: "cl3",
        q: "Explain the SAP Cloud Connector architecture and its role in BTP integration.",
        a: "SCC (Cloud Connector) creates an outbound HTTPS tunnel from on-premise to SAP BTP Connectivity Service — no inbound firewall ports needed. Components: (1) SCC installation on customer host (Linux/Windows, 4GB RAM min). (2) Subaccount binding: SCC binds to a BTP subaccount — one binding per subaccount. (3) Virtual host mapping: internal hostname mapped to real on-premise host — BTP never knows actual internal hostnames. (4) Resource paths: explicitly whitelist which URL paths or RFC destinations are accessible. (5) Principal propagation: user identity forwarded from BTP to on-premise (requires certificate/SAML setup). HA: Master + Shadow SCC pair — shadow mirrors master config, auto-failover. Monitoring: SCC administration UI (port 8443), SCC logs in /opt/sap/scc/log. Certificate renewal: SCC's own TLS certificate expires annually — add to calendar.",
        level: "mid",
        tags: ["SCC", "Cloud Connector", "BTP", "tunnel"],
      },
      {
        id: "cl4",
        q: "What is RISE with SAP and what are the Basis team's responsibilities in a RISE deployment?",
        a: "RISE with SAP is a bundled offering where SAP manages the entire technical landscape (S/4HANA, infrastructure, OS, DB, Basis operations) as a cloud service. What SAP manages: hardware, OS patching, HANA DB, SAP kernel upgrades, backups, monitoring, HA/DR. Customer Basis team responsibilities in RISE: Transport management (STMS/CTS still customer-managed), SAP authorization design (customer users/roles), Fiori configuration, BTP subaccount management, Cloud Connector configuration, SolMan/Cloud ALM configuration (customer-managed tenant), custom code and transport pipeline, SAP GRC/Access Control (if licensed), integration middleware configuration. Key shift: traditional infrastructure Basis tasks disappear; role moves toward architecture, integration, security, and change management. SAP provides a collaborative service center for incidents requiring infrastructure access.",
        level: "senior",
        tags: ["RISE", "SAP", "cloud", "responsibilities"],
      },
      {
        id: "cl5",
        q: "How does HA work for SAP HANA on Azure with Pacemaker?",
        a: "Azure HANA HA uses HSR SYNC + Pacemaker + Azure Standard ILB (Internal Load Balancer) as virtual IP. Unlike AWS Overlay IP, Azure uses an ILB with a health probe: Pacemaker updates the health probe endpoint, and the ILB routes traffic to the active HANA node. Pacemaker components: SAPHana resource (HANA promotion/demotion), SAPHanaTopology, IPaddr2 (virtual IP), socat+haproxy for the ILB health probe. STONITH: Azure fence agent (fence_azure_arm) uses Azure API to fence failed node. Proximity Placement Group (PPG): both HA nodes should be in the same PPG to minimize inter-node network latency. ASCS/ERS: ASCS and ERS instances also clustered with Pacemaker using a separate resource group — Azure ILB serves as virtual IP for ASCS. Azure Center for SAP Solutions (ACSS) can automate the entire HA deployment.",
        level: "senior",
        tags: ["Azure", "HANA HA", "Pacemaker", "ILB"],
      },
      {
        id: "cl6",
        q: "What is ACSS (Azure Center for SAP Solutions) and how does it help Basis teams?",
        a: "ACSS (Azure Center for SAP Solutions) is an Azure service that automates SAP deployment, monitoring, and management on Azure. Capabilities: (1) Deployment Automation: guided deployment of S/4HANA HA landscapes (ASCS/ERS cluster, HANA HA, application servers, Web Dispatcher) from Azure portal. (2) SAP system registration: ACSS discovers existing SAP systems and registers them for unified monitoring. (3) Azure Monitor for SAP Solutions integration: collects SAP-specific metrics (HANA, ABAP, Pacemaker) in Azure Monitor. (4) Quality Insights: analysis of SAP configuration vs. Azure best practices. (5) Operations workbook: centralized view of SAP landscape health. Basis benefit: reduces deployment time from weeks to hours, ensures best-practice configurations, provides single-pane monitoring. Requires: SAP system registered in ACSS, SAP Host Agent configured, appropriate Azure RBAC roles.",
        level: "senior",
        tags: ["ACSS", "Azure", "deployment", "monitoring"],
      },
      {
        id: "cl7",
        q: "How do you configure SAP backup using AWS Backint?",
        a: "Backint for SAP HANA on AWS writes HANA backups directly to S3 without staging to local disk. Setup: (1) Download AWS Backint for SAP HANA agent from AWS. (2) Install on HANA hosts: rpm -ivh aws-backint-agent.rpm. (3) Configure /opt/aws/backint-agent/aws-backint-agent-config.yaml: S3 bucket name, KMS key (optional), EC2 instance type, chunk size. (4) Configure HANA: ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM') SET ('backup','data_backup_parameter_file') = '/opt/aws/backint-agent/params.txt'. (5) Test: BACKUP DATA USING BACKINT. Monitor: AWS Systems Manager for SAP → Backup Schedule. IAM: HANA EC2 instances need S3 PutObject/GetObject/ListBucket permissions (instance role preferred over access keys). Recovery: restore from S3 using Backint RECOVER DATABASE command.",
        level: "senior",
        tags: ["AWS", "Backint", "S3", "HANA backup"],
      },
      {
        id: "cl8",
        q: "What GCP storage options would you choose for SAP HANA and why?",
        a: "HANA data volume: Hyperdisk Extreme or Persistent Disk SSD Extreme — provides 120,000 IOPS and 2,400 MB/s per disk for HANA data. HANA log volume: Hyperdisk Extreme — critical sub-millisecond write latency, consistent IOPS regardless of disk fullness. HANA shared (/hana/shared, /sapmnt): Filestore Enterprise — NFS v4.1, 16 TB capacity, regional availability (synchronous replication). Regional Persistent Disk for /hana/data and /hana/log in HA setups — synchronous block replication across zones. Backup: Google Cloud Storage using HANA Backint for GCS agent. Why Filestore Enterprise: Filestore Basic doesn't offer regional HA; Enterprise provides 99.99% availability SLA with cross-zone replication — critical for SAP landscapes requiring HA NFS.",
        level: "senior",
        tags: ["GCP", "storage", "Hyperdisk", "Filestore"],
      },
      {
        id: "cl9",
        q: "What is SAP BTP and how does it relate to on-premise SAP Basis?",
        a: "SAP BTP (Business Technology Platform) is SAP's cloud platform for building, integrating, and extending SAP and third-party solutions. Key services relevant to Basis: Integration Suite (formerly HCI) — middleware for system integration; API Management — central API gateway; Cloud ALM — centralized monitoring; Cloud Connector — secure on-premise connectivity; Work Zone — Fiori portal in cloud; AI Core/AI Launchpad — AI services. Basis responsibilities for BTP: subaccount setup and management, service instance provisioning, Cloud Connector binding, principal propagation configuration, IAS/IDP integration, BTP role collections, entitlement management. Key concepts: Global Account → Sub-account → Spaces → Services. BTP runs on hyperscaler infrastructure (AWS, Azure, GCP, Alibaba). Basis team must understand both on-premise SAP and cloud-native BTP services.",
        level: "mid",
        tags: ["BTP", "SAP", "cloud", "Integration Suite"],
      },
      {
        id: "cl10",
        q: "Explain the Disaster Recovery (DR) strategy for SAP on AWS.",
        a: "DR strategies for SAP on AWS (by RTO/RPO): (1) Backup and Restore (RTO hours, RPO hours): AMI snapshots + HANA backups to S3. Cheapest. (2) Pilot Light (RTO 30-60 min, RPO minutes): minimal infrastructure in DR region always running (HANA secondary in ASYNC HSR + S3 backups). SAP app servers launched from AMIs on failover. (3) Warm Standby (RTO < 15 min, RPO near-zero): reduced-capacity running infrastructure in DR region — HSR ASYNC replication, app servers running. Scale up on failover. (4) Multi-site Active-Active (RTO near-zero, RPO zero): full capacity in multiple regions/AZs. Most expensive. AWS DRS (Elastic Disaster Recovery) for non-HANA components: agent-based replication of OS/app servers. HANA always uses native HSR for data replication. Pacemaker in DR region for automated failover. RTO/RPO must be agreed with business and documented in BCP.",
        level: "senior",
        tags: ["AWS", "DR", "disaster recovery", "RTO", "RPO"],
      },
      {
        id: "cl11",
        q: "What is SAP LaMa (Landscape Management) and how does it integrate with cloud?",
        a: "SAP LaMa (Landscape Management) automates SAP system operations: system copy, system refresh, system move, cloning, start/stop sequences. Cloud integration (LaMa Cloud Extension): connects to hyperscaler APIs (AWS, Azure, GCP) to provision/deprovision infrastructure as part of LaMa operations. Example: LaMa system copy creates target infrastructure on AWS, copies HANA data, performs post-processing — fully automated. Key features: adaptive operations (scale app server instances on demand), system isolation (suspend/resume for cost management in non-prod). Configuration: LaMa uses SAP Host Agent on all managed systems + cloud provider adapters. For SAP Basis: LaMa significantly reduces manual effort for system copy/refresh. On-premise: LaMa requires its own application server. Cloud-native alternative: AWS Launch Wizard for SAP, Azure Center for SAP Solutions.",
        level: "senior",
        tags: ["LaMa", "automation", "cloud", "system copy"],
      },
      {
        id: "cl12",
        q: "How do you configure Azure Monitor for SAP Solutions (AMS)?",
        a: "Azure Monitor for SAP Solutions collects metrics from SAP HANA, ABAP, Pacemaker, NetWeaver, and DB2 using provider-based architecture. Setup: (1) Create AMS resource in Azure Portal: resource group, SAP system registration. (2) Add providers: HANA provider (HANA DB credentials + host), ABAP Central Services provider (SAP system credentials), Pacemaker provider (API endpoint), OS provider (Linux VM metrics). (3) AMS provisions managed infrastructure in a separate VNet + VNet peering to SAP VNet. (4) Data flows to Azure Monitor Workspace (Log Analytics). (5) Create dashboards in Azure Workbooks for visual monitoring. (6) Configure alerts: Alert rules on specific KQL queries (e.g., HANA memory >90%). Metrics collected: HANA CPU/memory/replication, ABAP response times, dialog/background WP usage, Pacemaker cluster state, OS CPU/disk metrics. No agents needed in SAP systems — uses SQL/API-based collection.",
        level: "senior",
        tags: ["Azure", "AMS", "monitoring", "SAP"],
      },
      {
        id: "cl13",
        q: "What is the AWS Systems Manager for SAP and what does it provide?",
        a: "AWS Systems Manager (SSM) for SAP is a set of SAP-aware capabilities within AWS SSM that simplifies SAP operations on AWS. Key features: SAP system discovery and inventory (SSM discovers SAP systems, instances, HANA nodes automatically via SAP Host Agent), patch management (integrate SAP support package installation with SSM Patch Manager), backup scheduling (HANA backup jobs via SSM), instance management (stop/start SAP instances via SSM automation runbooks). Setup: SAP Host Agent must be installed, Systems Manager Agent (SSM Agent) on EC2 instances, IAM roles with ssm:* permissions. Data provider: AWS Data Provider for SAP installed on HANA host — provides cloud metadata to SAP (instance type, AZ, SAP CCMS integration). SAP Note 1656250 covers AWS Data Provider setup. Benefits: reduces scripting work, native AWS operational tooling for SAP teams new to cloud.",
        level: "senior",
        tags: ["AWS", "SSM", "Systems Manager", "automation"],
      },
      {
        id: "cl14",
        q: "How do you estimate and optimize cloud costs for SAP workloads?",
        a: "Cost estimation: AWS Pricing Calculator / Azure Pricing Calculator / GCP Pricing Calculator — input instance types, storage types, volumes, backup storage, network egress. Key cost drivers for SAP on cloud: (1) Compute: M-series VMs/instances are expensive — right-size using Quick Sizer + cloud-specific SAP certified instance lists. (2) Storage: HANA data/log volumes are expensive (Ultra Disk, io2) — provision only what's needed with buffer. (3) Backup: S3/Azure Blob/GCS storage lifecycle policies — move old backups to cheaper tiers. (4) Network egress: minimize cross-region/cross-AZ data transfer. Optimization strategies: Reserved Instances/Savings Plans (up to 60% discount for 1-3 year commitment). Stop non-production systems on weekends/nights. Use AWS Compute Optimizer/Azure Advisor for right-sizing recommendations. Spot instances for batch/non-critical SAP work. Decommission unused sandbox systems. Target: 30-40% savings vs. on-demand pricing with reserved instance planning.",
        level: "senior",
        tags: ["cloud cost", "optimization", "reserved instances", "sizing"],
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
        q: "A user has SU53 authorization errors. How do you resolve them?",
        a: "Process: (1) Run SU53 as the affected user (or use 'Display last failed check for other users' in SU53). (2) Note the authorization object, field, and value that is missing. (3) SUIM → 'Roles containing authorization object' → find which role should grant this access. (4) PFCG → edit role → Authorization tab → find/add the missing object and field value. (5) Generate the profile (F5 or Generate button). (6) PFUD or SU10 → sync user masters with updated profiles. (7) Test with SU53 again. Common mistake: adding S_TCODE alone without the actual object — always resolve at authorization object level. For complex cases: use SU24 (check indicator maintenance) to verify the transaction's default checks. If object is missing from SU24: contact developer/functional team.",
        level: "junior",
        tags: ["SU53", "PFCG", "authorization", "security"],
      },
      {
        id: "sec2",
        q: "What is the Security Audit Log and how do you configure it?",
        a: "SAL records critical security events: failed/successful logins, transactions started, RFC calls, user master changes, authorization failures. Mandatory for SOX, ISO 27001, PCI-DSS. Configuration (SM19): (1) Create audit classes — define event categories to log (authentication, authorization, system events). (2) Define filters — which users, clients, event types to log. Best practice: log ALL events for privileged users (BASIS*), ALL failed authentications. (3) Enable SAL: SM19 → Active. View in SM20. Best practice: forward to external SIEM (QRadar, Splunk) via SM19 External Integration or syslog — ensures tamper-proof, long-term retention. Maximum log size: configure log file size + rotation in SM19. Complementary: STAD (workload monitor), SM20 (SAL display), DSWP (SolMan security monitoring).",
        level: "mid",
        tags: ["SM19", "SM20", "audit log", "SOX"],
      },
      {
        id: "sec3",
        q: "How do you manage SSL certificates in SAP?",
        a: "STRUST (Trust Manager): central SAP certificate management. PSE contexts: SSL Client Anonymous, SSL Client Standard, SSL Server Standard, System PSE (for SNC). Tasks: (1) Import trusted CA certificates for outbound HTTPS connections (BTP, Cloud ALM, etc.) — Import Certificate in STRUST. (2) Create own system certificate — STRUST → System PSE → Create Certificate. (3) Renew expiring certificates — proactive renewal 30 days before expiry (SM21 logs show SSL errors when expired). (4) Export/import for mutual TLS setups. Troubleshooting: SMICM → Traces → SSL (level 3) for detailed handshake diagnostics. SITSPMON for display of SSL contexts and expiry dates. Common failures: expired CA cert → outbound HTTPS fails silently; wrong CN → hostname mismatch; self-signed cert not imported → handshake failure.",
        level: "senior",
        tags: ["STRUST", "SSL", "certificates", "SMICM"],
      },
      {
        id: "sec4",
        q: "Explain SAP role types and when to use each.",
        a: "Single Role (PFCG): contains authorizations for a specific set of transactions/reports. Assigned directly to users. Composite Role: groups multiple single roles — simplifies user assignment. Assigning a composite role gives all contained single roles. Best practice: assign composite roles to users, not individual single roles. Derived Role (Organizational Role): inherits authorization objects from a parent single role but has different organizational level values (e.g., company code, plant). Used when same role structure applies across different organizational units — change parent once, all derived roles inherit. Template roles: SAP-delivered roles (SAP_BC_* prefix) for standard Basis tasks — copy before modifying (never change SAP-delivered roles). In CDS (Cloud Identity Services) / IAS landscape: roles are mapped to cloud role collections.",
        level: "mid",
        tags: ["PFCG", "roles", "composite", "derived"],
      },
      {
        id: "sec5",
        q: "What is SAP GRC Access Control and how does it work?",
        a: "SAP GRC (Governance, Risk, Compliance) Access Control automates Segregation of Duties (SoD) analysis and user provisioning. Components: (1) Access Risk Analysis (ARA) — defines SoD risks (e.g., Create Vendor + Approve Payment = fraud risk), runs batch/real-time analysis against user master data. (2) Business Role Management (BRM) — centralized role lifecycle management. (3) Access Request Management (ARM) — self-service user access requests with workflow approval, SoD simulation before granting. (4) Emergency Access Management (EAM/Firefighter) — controlled elevated access for break-glass scenarios with full audit logging. Basis responsibilities: GRC connector configuration (RFC connections from GRC to all managed systems), sync of user/role data, NWBC/Fiori configuration for GRC UI. SoD violation remediation: PFCG role restructure to separate conflicting transactions.",
        level: "senior",
        tags: ["GRC", "SoD", "access control", "compliance"],
      },
      {
        id: "sec6",
        q: "What is SAP Single Sign-On (SSO) and how do you implement it?",
        a: "SAP SSO options: (1) SAP Logon Tickets (Cookie-based): user authenticates once on SAP portal; ticket stored in cookie; other SAP systems accept ticket without re-authentication. Configuration: SSF/SSO2 + trust settings between systems. (2) Kerberos/SPNEGO (Windows domain SSO): Windows login flows to SAP GUI via Kerberos token. Configure: snc/enable + Kerberos library. (3) SAML 2.0: modern standard for cloud/hybrid SSO. SAP system acts as SAML Service Provider (SP); corporate IdP (ADFS, Okta, Azure AD/Entra) is Identity Provider. Configuration: SAML2 transaction — create SP metadata, import IdP metadata, configure user mapping (email/NameID). (4) SAP IAS (Identity Authentication Service): cloud IdP from SAP — acts as proxy between corporate IdP and SAP cloud/on-premise systems. Best practice for new implementations: SAML 2.0 with IAS as proxy — provides consistent SSO across cloud and on-premise.",
        level: "senior",
        tags: ["SSO", "SAML", "SAP Logon Ticket", "IAS"],
      },
      {
        id: "sec7",
        q: "What are the most critical security notes you apply to an SAP system?",
        a: "Priority security notes: (1) SAP Security Patch Day notes (every 2nd Tuesday of the month) — Critical/Hot News rated notes must be applied immediately. (2) CVSS ≥ 9.0 notes — apply within 30 days (or faster per security policy). Key vulnerability areas: ABAP Report Injection (CVSS 10 — apply immediately), ICF service unauthorized access, Basis platform vulnerabilities. Tools: RSECNOTE (Security Note Analysis — shows open critical notes), SNOTE (Note Assistant — apply notes from SAP Service Marketplace). Process: download note → SNOTE import → check prerequisites → apply → manual post-steps if any. Security patch management should be integrated into quarterly or monthly maintenance windows. SAP Early Watch Alert (EWA) from Solution Manager also highlights open security notes.",
        level: "mid",
        tags: ["security notes", "SNOTE", "RSECNOTE", "patching"],
      },
      {
        id: "sec8",
        q: "How do you harden an SAP system against common attack vectors?",
        a: "Key hardening measures: (1) Default users: lock SAP* and DDIC in all clients except client 000. Set strong passwords. Remove EarlyWatch client 066 or remove EARLYWATCH user. (2) Default passwords: check report RSUSR003 — flag all default passwords. (3) RFC: remove wildcard RFC destinations (SM59), audit trusted RFC connections (SE97), remove DEST=* in authorization. (4) Gateway: restrict external RFC access via gateway ACL files (reginfo, secinfo — see gw/acl_mode parameter). (5) ICF: deactivate unused ICF services (SICF — deactivate all /sap/bc/* services not in use). (6) Network: restrict SAP GUI ports (33NN) to corporate network only via firewall. (7) Profile parameters: login/min_password_lng ≥ 8, login/password_max_idle_productive ≤ 180, login/fails_to_user_lock = 5. (8) SAP Security Baseline: apply SAP Security Baseline Template recommendations. Audit: run SN note RSECNOTE for open security vulnerabilities.",
        level: "senior",
        tags: ["hardening", "SAP*", "RFC security", "gateway"],
      },
      {
        id: "sec9",
        q: "What is the SAP profile parameter 'login/no_automatic_user_sapstar' and why is it important?",
        a: "SAP* is a hardcoded emergency user in the SAP kernel that can log in with a default password if the user record is deleted from the database. The parameter login/no_automatic_user_sapstar = 1 disables this fallback behavior — preventing an attacker who has deleted the SAP* record from using the hardcoded credentials. Why critical: if this parameter is not set (default = 0 on older releases), deleting SAP* from SU01 and then logging in with the hardcoded password 'PASS' gives unrestricted access to the system — the original SAP* has SAP_ALL effectively. Security checklist: (1) Set login/no_automatic_user_sapstar = 1. (2) Recreate SAP* as a regular user with a strong custom password in all clients. (3) Lock SAP* in all non-emergency situations. (4) RSUSR003 to check default SAP* and DDIC passwords.",
        level: "senior",
        tags: ["SAP*", "security parameter", "login", "hardening"],
      },
      {
        id: "sec10",
        q: "How do you configure SAP to use an external Identity Provider (IdP) for authentication?",
        a: "SAML 2.0 with external IdP (e.g., Azure AD/Entra, Okta, ADFS): (1) Transaction SAML2 on SAP system — create Service Provider (SP) metadata. (2) Download SP metadata XML (Entity ID, ACS URL, certificate). (3) Register SP in IdP admin console — upload SAP SP metadata. (4) Download IdP metadata from IdP console. (5) SAML2 on SAP → Import IdP metadata. (6) Configure user mapping: NameID format → SAP user field mapping (e.g., email → e-mail field in SU01). (7) Test: SAML2 → Test → select IdP → should redirect to corporate login page → successful authentication. (8) Set up logon ticket issuance for system-to-system propagation if needed. For cloud systems: SAP IAS acts as proxy IdP — configure IAS to trust corporate IdP, and SAP BTP/S4HANA to trust IAS. This centralizes IdP management through IAS.",
        level: "senior",
        tags: ["SAML2", "IdP", "Azure AD", "IAS"],
      },
      {
        id: "sec11",
        q: "What is SAP Secure Login Server and how does it fit into the security architecture?",
        a: "SAP Secure Login Server (SLS) — previously SAP Single Sign-On Server — is an on-premise server that issues X.509 certificates for SAP systems and users. Capabilities: (1) Certificate issuance for SNC encryption of SAP GUI connections. (2) Short-lived user certificates for SSO (replaces passwords for SAP GUI logon). (3) Integration with Kerberos/Active Directory for Windows domain SSO. (4) Certificate lifecycle management (issuance, renewal, revocation). How it works: SLS acts as a Certificate Authority for SAP landscapes. Users install SAP Secure Login Client on workstations — authenticates via Kerberos and receives a short-lived X.509 certificate. SAP system verifies certificate via SNC (configured in STRUST). Modern alternative: For new deployments, SAP recommends SAML2/IAS over SLS. SLS is still relevant for on-premise-only environments needing SNC encryption without a cloud IdP.",
        level: "senior",
        tags: ["SLS", "SNC", "X.509", "certificate"],
      },
      {
        id: "sec12",
        q: "How do you audit and analyze user authorizations with SUIM?",
        a: "SUIM (User Information System) is the central reporting tool for authorization analysis. Key reports: (1) Users → Users by Authorization Object: find all users with a specific authorization (e.g., who has S_TCODE for SE38 = dangerous ABAP editor access). (2) Users → Users with Critical Authorizations: use SAP pre-defined critical authorization profile. (3) Roles → Roles Containing Authorization Object: find which roles grant a specific object/value. (4) Comparisons → Compare User Authorizations: compare two users — find discrepancies. (5) Where-Used List → where a specific transaction is authorized. Use cases: SoD analysis (manually without GRC), quarterly access reviews, post-breach investigation. For large landscapes: use SAP GRC Access Control (ARA module) for automated SoD analysis. SUIM is the Basis first-line tool — GRC is for enterprise-scale governance.",
        level: "mid",
        tags: ["SUIM", "authorization", "audit", "reporting"],
      },
    ],
  },
  {
    id: "performance",
    title: "Performance & Monitoring",
    icon: <Activity className="w-5 h-5" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    questions: [
      {
        id: "perf1",
        q: "What tools do you use for SAP performance analysis and in what order?",
        a: "Triage sequence: (1) SM66 (Global Work Process Overview) — system-wide WP view for active/waiting processes. (2) SM50 — per-instance WP details. (3) ST05 (SQL trace) — capture DB queries for slow transactions. (4) SE30 (ABAP trace/Runtime Analysis) — find expensive ABAP operations. (5) ST12 (combined ABAP + DB trace) — newer single tool for both. (6) SM21 (System Log) — application-level errors around the performance event. (7) DBACOCKPIT — database performance (locks, expensive SQL, DB statistics). (8) ST04 (DB Performance Monitor for older DBs), AL11 (OS files). (9) EWA (Early Watch Alert) — periodic automated performance report. (10) ST/SDF/SQLM — S/4HANA SQL monitor. First: scope the issue (is it one user/transaction or system-wide?), then apply targeted tool.",
        level: "mid",
        tags: ["performance", "SM66", "ST05", "monitoring"],
      },
      {
        id: "perf2",
        q: "How do you use CCMS (RZ20) for proactive monitoring?",
        a: "CCMS (Computing Center Management System) provides centralized monitoring via the Alert Monitor (RZ20). Monitoring architecture: agents report to CCMS infrastructure, data stored in CCMS MTE (Monitoring Tree Elements). RZ20 shows current alert status (red/yellow/green) for all monitored KPIs. Key monitors: ABAP Exceptions, Work Process Monitoring, Background Job Monitoring, Database Monitor, OS Monitor, HANA Monitor (via HANA-specific MTE classes). Alert configuration (RZ21): set thresholds for each monitor class — email/paging when thresholds breached. Auto-reaction methods: configure auto-responses for specific alerts (restart service, send page). Integration with Solution Manager Technical Monitoring: CCMS data forwarded to Solution Manager for cross-landscape monitoring, stored in SolMan's monitoring infrastructure. In modern setups: CCMS is complemented by Cloud ALM Operations Monitoring or SAP Focused Run.",
        level: "mid",
        tags: ["CCMS", "RZ20", "RZ21", "monitoring"],
      },
      {
        id: "perf3",
        q: "How do you analyze a slow SAP transaction reported by users?",
        a: "Step-by-step: (1) SM66 — is the user's WP in CPU, DB wait, or blocked state? (2) ST05 (or SE30/ST12 in background): start trace → user executes slow transaction → stop trace → analyze. SQL trace shows every DB call: focus on CALLS (frequency) and TIME (duration). (3) Identify problem pattern: 1000 SELECT * from large table (missing index?), repeated small selects in loop (ABAP programming pattern), single very long query. (4) DBACOCKPIT → SQL Monitor → find same SQL in DB's slow query log. (5) SE11: check if table index exists for common WHERE clauses. (6) Escalation path: Basis fixes DB-level issues (add indexes, run statistics), ABAP development team fixes code-level issues. (7) Verify fix: before/after comparison via STAD (Statistical Records — retrospective performance analysis per user/transaction). STAD is invaluable for documenting baseline before and after optimization.",
        level: "senior",
        tags: ["ST05", "DBACOCKPIT", "performance", "slow transaction"],
      },
      {
        id: "perf4",
        q: "What are SAP buffers and how do you tune them?",
        a: "SAP application buffers cache frequently accessed repository objects in application server memory to reduce DB reads. Monitor: ST02 (Tune Summary). Key buffers: (1) Program buffer (ABAP programs): zcsa/prog_buffer_size — if hit rate < 95% or many swaps, increase. (2) Table buffer (CUA, nametab): zcsa/table_buffer_area for fully/single buffered tables. (3) Field buffer (field definitions): rsdb/ntab/entrycount. (4) Screen buffer: zwb/buffkey. (5) Repository buffer: zcsa/db_max_buftab. Tuning process: ST02 → check 'Swaps' and 'DB Accesses' for each buffer. High swaps = buffer too small → increase size via RZ10 → restart instance. Note: SAP HANA-based systems (S/4HANA) benefit much less from ABAP buffers because HANA is in-memory — most buffer tuning is relevant only for older non-HANA systems or AnyDB environments.",
        level: "senior",
        tags: ["buffers", "ST02", "tuning", "performance"],
      },
      {
        id: "perf5",
        q: "What is the Early Watch Alert (EWA) report and how do you use it?",
        a: "EWA is a periodic automated performance health report generated by SAP Solution Manager (or SAP using data from connected systems). Contains: system performance overview, memory and CPU utilization trends, buffer quality, top users, expensive SQL, background job analysis, security note compliance, HANA alerts, system log error analysis. Schedule: typically weekly or monthly. Access: DSWP in SolMan → Service Processing → Early Watch Alert. Interpretation: EWA uses traffic lights (red/yellow/green). Basis actions from EWA: (1) Red/yellow buffer indicators → tune buffers. (2) Open critical security notes → apply via SPAM. (3) Expensive SQL top 10 → investigate DBACOCKPIT. (4) Background job failures → SM37. (5) High response times → SM66/ST05. EWA is the KPI document for service review meetings with management and SAP support. Modern equivalent for cloud: Cloud ALM Analytics or SAP Focused Run.",
        level: "mid",
        tags: ["EWA", "SolMan", "performance report", "health check"],
      },
      {
        id: "perf6",
        q: "What is ABAP memory and how do you diagnose memory-related short dumps?",
        a: "ABAP memory areas: (1) Roll area: user context (per dialog WP). (2) Extended Memory (EM): shared between all WPs via SHM (System-level Shared Memory). Size: em/initial_size_MB. (3) Heap memory: private WP memory for very large requests. Size: abap/heap_area_dia (dialog), abap/heap_area_btc (background). Memory hierarchy: WP uses roll → extends to EM → overflows to heap. Memory-related dumps: TSV_TNEW_PAGE_ALLOC_FAILED (heap exhausted), STORAGE_PARAMETERS_WRONG_SET (roll/EM too small), MEMORY_NO_MORE_PAGING (OS swap exhausted). Diagnosis: SM04 (user sessions with memory usage), SM50 (WP memory per process), OS-level: free -m shows swap. Resolution: increase em/initial_size_MB (most common), check for ABAP memory leaks (using SE38 ABAP trace). S/4HANA on HANA: most memory parameters less critical — HANA handles data layer.",
        level: "senior",
        tags: ["memory", "ABAP", "dump", "EM"],
      },
      {
        id: "perf7",
        q: "How do you use STAD for retrospective performance analysis?",
        a: "STAD (Statistical Records / Workload Monitor) stores performance data for every dialog and RFC request processed by SAP. Access: STAD → filter by user, transaction, program, time range. Key metrics per request: Response time, CPU time, DB time, DB calls count, bytes transferred. Use cases: (1) Prove a transaction was slow at a specific time. (2) Compare response times before/after tuning. (3) Identify which users/transactions are heaviest DB consumers. (4) Find batch jobs with unexpectedly high DB access. (5) Root cause analysis for reported slowness 2 hours ago — check STAD for that time window. Complementary: STO5 + STAD combination — ST05 for real-time detailed SQL trace; STAD for historical aggregate. Retention: STAD data kept 24-48 hours by default (configurable). SM19 + RSSTATISTIC2 report for longer-term statistics storage.",
        level: "mid",
        tags: ["STAD", "performance", "statistics", "analysis"],
      },
      {
        id: "perf8",
        q: "What do you do when a background job runs much longer than expected?",
        a: "(1) SM37 — find the job, check status (running/cancelled). (2) SM66 — find the background WP running the job — is it in CPU, DB wait, or PRIV state? PRIV = using heap memory (possible memory leak). (3) SM50 → job's WP → trace toggle on to capture active ABAP code. (4) ST05 background: in SM50 → select the WP → SQL trace on. (5) DB analysis: DBACOCKPIT → SQL Monitor → find the job's SQL in top expensive queries. (6) Common causes: missing table index (suddenly processing more records), new data volume growth (job processing 10x more records than last month), ABAP loop over large table. (7) Short-term fix: cancel and reschedule with reduced dataset if possible. (8) Long-term fix: add index (SE11), optimize ABAP, increase background WP timeout (rdisp/btctime). (9) Document SLA breach and root cause.",
        level: "mid",
        tags: ["SM37", "background job", "performance", "SM66"],
      },
      {
        id: "perf9",
        q: "What is SQL Plan Stability in SAP HANA and when is it needed?",
        a: "HANA SQL Plan Stability (SAP Plan Cache): when HANA's query optimizer generates a suboptimal execution plan for a specific SQL statement, plan stability allows pinning ('capturing') a known-good plan so the optimizer uses it consistently. When needed: after HANA upgrade when optimizer behavior changes and causes plan regression; for complex queries with unstable execution plans. How to use: (1) Identify the statement hash from M_EXPENSIVE_STATEMENTS. (2) HANA Cockpit → SQL Plan Cache → find statement → 'Pin Plan'. Or SQL: CREATE PLAN GUIDE <name> FOR <sql_text> ... (3) Monitor: M_SQL_PLAN_CACHE_PARAMETERS. ABAP-side equivalent: /SDF/SQLMON in S/4HANA for SQL monitoring, SAP Note 1514966 for ABAP statement optimization. HANA adaptive query processing: HANA 2.0 SPS04+ has improved automatic plan selection — reduces need for manual plan stability.",
        level: "senior",
        tags: ["HANA", "SQL plan", "query optimization", "performance"],
      },
      {
        id: "perf10",
        q: "How do you analyze and resolve database lock contention in SAP?",
        a: "Detection: (1) SM12 — SAP application-level enqueue locks. Long-held locks = open LUW not committed. (2) DBACOCKPIT → Locks tab — DB-level lock waits. For HANA: M_BLOCKED_TRANSACTIONS view. (3) SM66 — WPs in 'ROLL-IN' or waiting with long DB times. Analysis steps: (1) Identify blocking session: in DBACOCKPIT/M_BLOCKED_TRANSACTIONS — find the blocking SQL/session. (2) Check if it's a valid long-running legitimate transaction or a stuck/abandoned session. (3) SM12 for SAP-level: delete stale enqueue entries (after confirming transaction is no longer active). (4) DB-level: kill blocking session via DBACOCKPIT or DBA tools (hdbsql 'ALTER SYSTEM CANCEL SESSION'). (5) Root cause: ABAP opens long transactions without committing (coding issue) — pass to development. (6) Preventive: proper COMMIT WORK in ABAP, timeouts on long-running SELECT FOR UPDATE.",
        level: "senior",
        tags: ["SM12", "locks", "DBACOCKPIT", "contention"],
      },
    ],
  },
  {
    id: "jobs",
    title: "Background Jobs & Scheduling",
    icon: <Server className="w-5 h-5" />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    questions: [
      {
        id: "j1",
        q: "What is the difference between SM36 and SM37?",
        a: "SM36 (Define Background Job): create new background jobs — define job name, class (A/B/C), schedule (immediate, specific time, periodic), steps (ABAP program, external command, variant). SM37 (Background Job Monitor): view, manage, and analyze existing jobs — filter by job name, status (running, completed, cancelled, ready, released), user, date/time range. SM37 can cancel, restart, copy, and display job logs. Job classes: A (highest priority — dedicated WPs), B (normal), C (lowest). Periodic scheduling: SM36 → After Event or period settings (every X hours/days). Event-based scheduling: SM36 → After Event → define event name. Job dependencies: job2 starts after job1 completes via event framework (BP_EVENT_RAISE / BTCEVPOST). JOBREPORT: SM37 → Full Screen → extensive filtering. SM37C: advanced job monitor with more powerful selection screen.",
        level: "junior",
        tags: ["SM36", "SM37", "background job", "scheduling"],
      },
      {
        id: "j2",
        q: "How do you investigate a background job that cancelled?",
        a: "(1) SM37 → find the cancelled job → Job Log (Shift+F6) — read the error messages in detail. (2) Expand each step log — typically the ABAP report log shows the actual error. (3) ST22 — check for short dump generated at the same time as the cancellation. (4) SM21 — system log at that time for related messages. (5) SM50/SM66 at the time (retrospective: not possible directly) — but check if concurrent resource exhaustion was happening. (6) Common causes: authorization error (SU53), database error (ST04), memory overflow (heap too small), timeout (rdisp/btctime exceeded), missing variant or changed selection screen. (7) To rerun: SM37 → select job → Job → Repeat Scheduling. (8) If authorization error: check the job's run-as user (SM36 → Exec User field) in SU53.",
        level: "junior",
        tags: ["SM37", "job log", "cancellation", "troubleshooting"],
      },
      {
        id: "j3",
        q: "What are the SAP standard background jobs that must always be scheduled?",
        a: "Critical standard jobs (SM36): (1) SAP_REORG_JOBS (SM37 housekeeping — delete old job logs). (2) SAP_REORG_SPOOL (SP01 spool cleanup — prevent spool overflow). (3) SAP_REORG_ABAPDUMPS (ST22 cleanup — prevent dump table overflow). (4) RSSNAPDL or SAP_REORG_ABAPDUMPS (short dump cleanup). (5) RSBTCDEL2 (background job log cleanup). (6) RSCOLL00 (CCMS data collection — populates RZ20 monitoring). (7) SAP_COLLECTOR_FOR_PERFMONITOR (workload statistics for EWA). (8) RSBPCOLL (business process monitoring). (9) RSLGCOLL (system log collector for Solution Manager). (10) RSM13000 (TemSe/spool consistency check). Missing these leads to: disk space exhaustion (spool/dumps tables), degraded monitoring data quality. Run RSUSR406 to check system-wide job schedule completeness.",
        level: "mid",
        tags: ["standard jobs", "housekeeping", "SM37", "RSCOLL00"],
      },
      {
        id: "j4",
        q: "How do you manage background work process (WP) allocation?",
        a: "Background WP allocation: rdisp/wp_no_btc in instance profile (via RZ10). Separate for batch: ideally dedicate an application server instance exclusively for batch processing to avoid competing with dialog users. Configuration considerations: peak batch windows (end-of-month) vs. peak dialog hours — adjust allocation dynamically or maintain dedicated batch instances. Prioritization: Job class A gets dedicated WPs (CLASS_A_WP_COUNT or reserved via rdisp/wp_no_btc_a). Monitoring: SM50 (active background WPs), SM66 (global view). Problem: all background WPs full → new jobs stay in READY status waiting for free WP. Solution: reduce max parallel jobs per user (SM36 → max parallel procs), reschedule non-critical jobs to off-peak, increase btc WP count (requires restart). In cloud: dynamic application server scaling allows launching additional batch instances during batch peaks.",
        level: "mid",
        tags: ["background WP", "rdisp", "batch", "SM50"],
      },
      {
        id: "j5",
        q: "What is event-based job scheduling and how do you implement it?",
        a: "Event-based scheduling triggers jobs when a named event is raised rather than at a specific time. Useful for: triggering downstream jobs after data feeds arrive, chaining dependent jobs. Implementation: (1) Define event: SM64 → create event name (up to 64 chars). (2) Schedule waiting job: SM36 → After Event → enter event name and optional parameter. Job stays in READY until event is raised. (3) Trigger event: from ABAP code: CALL FUNCTION 'BP_EVENT_RAISE' EXPORTING eventid = '<event_name>'. From command line: evtsend/btcevpost utilities. From STMS transport import: built-in event after import. Monitoring: SM62 (event history and current state). Example: EDI IDoc posting triggers event 'IDOC_POSTED' → downstream processing job starts. More sophisticated: use SAP Process Chains (BW), SAP Intelligent Robotic Process Automation, or external schedulers (UC4/Automic, Control-M) for complex dependencies.",
        level: "senior",
        tags: ["SM64", "event", "job scheduling", "SM62"],
      },
      {
        id: "j6",
        q: "How do you use BTCAUX jobs and parallel processing in background workloads?",
        a: "SAP provides parallel processing frameworks for batch jobs: (1) CALL FUNCTION ... STARTING NEW TASK: parallel RFC calls from batch job — spawns parallel work. Job itself needs to manage parallel tasks and collect results. (2) Parallel Cursor: ABAP enhancement using FOR ALL ENTRIES + OPEN CURSOR for batch data processing. (3) Background task framework (BTF): ABAP 7.4+ — SUBMIT <report> WITH ... AND RETURN in parallel via parallel task pools. (4) SAP aRFC parallel processing: ABAP calls multiple aRFC functions simultaneously. SM66: monitor all parallel tasks running for a batch job. BTCAUX: auxiliary background tasks spawned by a main job — appear in SM37 under same job group. Configuration: max_BTCAUX_tasks per main job can be adjusted. In HANA context: ABAP Managed Database Procedures (AMDP) and CDS push logic to HANA layer — reducing need for multiple parallel batch processes.",
        level: "senior",
        tags: ["parallel processing", "background", "BTF", "aRFC"],
      },
      {
        id: "j7",
        q: "What is the job interceptor and how is it used for job governance?",
        a: "The Job Interceptor (available via ABAP Enhancement Framework or SolMan BPC — Business Process Monitoring) allows policy-based job governance: intercept job scheduling attempts and enforce standards. Use cases: prevent users from scheduling jobs during production batch windows, enforce naming conventions, require a minimum job priority, block certain users from scheduling intensive programs without approval. Implementation: via BADI BTCH_JOB_SCHEDULE (Enhancement Point SAPLBTCH_BADI_SCHEDULE) — customer code executed each time a job is scheduled. Example logic: IF sy-uname NOT IN authorized_users AND CONTAINS(job_name, 'Z*') THEN RAISE EXCEPTION TYPE cx_btch_not_authorized. In Solution Manager: BPC provides graphical batch job scheduling with built-in governance workflows — preferred enterprise approach. SolMan also provides conflict analysis across the batch job schedule.",
        level: "senior",
        tags: ["job interceptor", "governance", "BAdI", "SolMan"],
      },
      {
        id: "j8",
        q: "How do you migrate batch jobs after a system refresh?",
        a: "Post-refresh batch job handling — critical and often forgotten: (1) Before refresh: export job list via SM37 → report RSBPSTDE (Background Job Documentation) — exports all job definitions to a file. (2) After refresh: target system has source system's jobs — potentially pointing to wrong users, wrong RFC destinations, or scheduled to run immediately. (3) SM37 → mass operations: delete all migrated jobs or put on hold. (4) Review essential jobs (standard SAP jobs + critical business batch jobs). (5) Re-schedule selectively: re-import job definitions and adjust as needed. (6) Update job step users — if source production has different user IDs than target. (7) Cancel any jobs in ACTIVE/READY state from the source data immediately on system start. (8) Verify RSCOLL00, SAP_REORG_* jobs are scheduled per the standard job list. Automate this as part of the post-refresh runbook.",
        level: "mid",
        tags: ["batch jobs", "system refresh", "SM37", "migration"],
      },
    ],
  },
  {
    id: "solman",
    title: "Solution Manager & ALM",
    icon: <Layers className="w-5 h-5" />,
    color: "text-violet-600",
    bg: "bg-violet-50",
    questions: [
      {
        id: "sol1",
        q: "What is SAP Solution Manager and what are its main use cases for a Basis team?",
        a: "SAP Solution Manager 7.2 is SAP's on-premise ALM platform. Key Basis use cases: (1) Technical Monitoring: centralized monitoring across all SAP systems — collects metrics from CCMS, HANA, OS. Replaces individual RZ20 monitoring per system. (2) System Landscape Management (LMDB): authoritative register of all SAP systems, products, instances, and infrastructure. (3) Change Request Management (ChaRM): ITIL-based change process — Normal, Urgent, Defect change types, full workflow with approvals, transport assignment, CQR. (4) IT Service Management (ITSM): incident and problem management (can replace ServiceNow for SAP-focused teams). (5) Early Watch Alert (EWA): automated health reports. (6) Maintenance Planner: plan support package stacks before upgrade. (7) MOPZ: maintenance optimizer for SWPM inputs. (8) Business Process Monitoring: KPI-based business process health. Basis maintains: SOLMAN_SETUP, LMDB managed systems, SolMan certificates, Data Supplier (ST-PI) on all satellite systems.",
        level: "mid",
        tags: ["SolMan", "Solution Manager", "ALM", "monitoring"],
      },
      {
        id: "sol2",
        q: "How do you perform initial SolMan setup?",
        a: "SOLMAN_SETUP is the guided wizard for all SolMan configuration. Steps: (1) System Preparation: OS/DB pre-requisites, required SAP Notes. (2) Database setup. (3) SAP Solution Manager system setup (NW parameters, ICF services). (4) Basic configuration: system landscape setup, LMDB connectivity check. (5) Managed systems: activate ST-PI on satellite systems, establish SMD Agent (SolMan Diagnostics Agent) connections. (6) Service desk (if used). (7) Change Management (ChaRM) setup. (8) Technical Monitoring setup: create monitoring templates, assign to systems. Key technical component: SMD Agent (sapstartsrv-based) must be installed on all managed systems — connects back to SolMan over HTTPS. SMD Agent collects performance data, OS metrics, and forwards CCMS data. Validate: LMDB → all systems show as 'Technical System' with full data. DSWP (Work Center) is the main SolMan launchpad.",
        level: "senior",
        tags: ["SOLMAN_SETUP", "SolMan", "SMD Agent", "LMDB"],
      },
      {
        id: "sol3",
        q: "What is ChaRM (Change Request Management) and how does the change process work?",
        a: "ChaRM implements ITIL change management within Solution Manager. Change types: (1) Normal Change: planned changes — Risk assessment, approval by CAB (Change Advisory Board), development on DEV, transport to QAS, testing, QA approval, production import. (2) Urgent Correction: emergency production fix — accelerated workflow, reduced approvals, developer works directly on specific system. (3) Defect Correction: bug fix in change project. Process flow: Service Request → Change Request (RFC) → Change Document (Normal/Urgent) → Task → Transport Requests assigned → Status transitions: Created → In Development → In Test → Approved → In Production → Closed. Key feature: ChaRM controls STMS — only approved, ChaRM-tracked transports can be imported to production (locked import queue). Basis role: configure ChaRM, maintain project systems, manage STMS integration, support developers with transport issues.",
        level: "senior",
        tags: ["ChaRM", "change management", "SolMan", "ITSM"],
      },
      {
        id: "sol4",
        q: "What is SAP Cloud ALM and how does it differ from Solution Manager?",
        a: "Cloud ALM is SAP's cloud-native ALM platform (SAP BTP-based), intended as the long-term successor to on-premise Solution Manager. Key capabilities: Business Process Operations (monitoring via managed system data), Implementation (project and task management for S/4HANA implementations — replaces SolMan ASAP), Change and Deploy (cloud-native change management), Analytics (cross-system KPIs). Differences from SolMan: Cloud ALM is cloud-hosted (no installation/maintenance), simpler setup, native BTP integration, designed for SAP cloud and hybrid landscapes. What Cloud ALM does NOT cover yet (still requires SolMan or alternatives): full ChaRM equivalent, LMDB depth for legacy systems, ABAP-level monitoring depth. Onboarding: /SDF/ALM_SETUP on each SAP system creates the Cloud ALM service user and connects data to Cloud ALM via SAPtransor. Coexistence: SAP recommends keeping SolMan for ChaRM until Cloud ALM change management is mature.",
        level: "senior",
        tags: ["Cloud ALM", "SolMan", "BTP", "ALM"],
      },
      {
        id: "sol5",
        q: "How do you configure Technical Monitoring in Solution Manager?",
        a: "Technical Monitoring setup in SOLMAN_SETUP → Technical Monitoring: (1) Deploy SMD Agents on all target systems (agent version must match SolMan SP level). (2) Create managed system connections: LMDB assigns systems to monitoring infrastructure. (3) Configure monitoring templates: select KPIs (CPU threshold, memory %, dialog response time, HANA metrics, DB space) per system type (ABAP, Java, HANA). (4) Assign templates to systems. (5) Configure alert routing: CCMS → SolMan alert inbox, email notifications, ITSM auto-incident creation. (6) Verify collection: DSWP → Technical Monitoring → check data freshness per system. (7) E2E Trace: configure end-to-end workload analysis for cross-system performance tracing. JAVA systems: additional JMON/JVM monitoring via SMD diagnostics framework. HANA systems: install HANA monitoring provider (solutionmanager.hanamonitoring plugin). Alert management: DSWP → Alert Inbox shows all unprocessed alerts across landscape.",
        level: "senior",
        tags: ["Technical Monitoring", "SolMan", "SMD", "DSWP"],
      },
      {
        id: "sol6",
        q: "What is LMDB and why is keeping it accurate important?",
        a: "LMDB (Landscape Management Database) in SolMan is the authoritative system-of-record for all technical systems in the SAP landscape: software components/versions, instances, hosts, product systems, technical scenarios. Used by: Maintenance Planner (calculates correct support package stacks), EWA reporting, Technical Monitoring (system classification), ChaRM (project systems). Keeping it accurate: (1) SMD Agent auto-updates technical data (kernel version, system type, DB version) — ensures currency. (2) Manual update required for new systems added to landscape. (3) Data quality issue: outdated LMDB data causes Maintenance Planner to generate wrong support package stacks — critical for upgrade planning. (4) LMDB feeds SAP SUPPORT PORTAL (SAP ME tool) for official SAP system inventory. Verify: LMDB → check all systems show correct product version, DB version, OS version. Run LMDB consistency check periodically.",
        level: "mid",
        tags: ["LMDB", "SolMan", "landscape", "Maintenance Planner"],
      },
    ],
  },
  {
    id: "btp",
    title: "BTP & Integration",
    icon: <Code className="w-5 h-5" />,
    color: "text-pink-600",
    bg: "bg-pink-50",
    questions: [
      {
        id: "btp1",
        q: "How do you configure SAP Integration Suite (formerly HCI/CPI)?",
        a: "Integration Suite provisioning: (1) BTP Cockpit → Global Account → Subaccount → Service Marketplace → Integration Suite → Create instance. (2) Assign role collections to admin users: Integration_Provisioner, IntegrationDeveloper. (3) Activate capabilities: Cloud Integration (iFlow runtime), API Management, Event Mesh, Open Connectors as needed. (4) Configure Cloud Integration: set up keystore (TLS certificates for HTTPS adapters), create iFlows in Integration Suite Web IDE. (5) Connect on-premise: create Cloud Connector binding to subaccount, expose on-premise host/port in SCC. (6) Create HTTP destinations in BTP Connectivity service pointing to on-premise via SCC tunnel. (7) Monitor: Integration Suite → Monitor → Manage Integration Content (deployed artifacts), Message Processing Logs (active messages, errors). Key Basis knowledge: certificate management in Integration Suite keystore, connectivity setup (SCC, Destinations), OAuth2 client credentials setup for S/4HANA OData connections.",
        level: "senior",
        tags: ["Integration Suite", "CPI", "BTP", "iFlow"],
      },
      {
        id: "btp2",
        q: "What is SAP Identity Authentication Service (IAS) and how is it used?",
        a: "IAS (Identity Authentication Service) is SAP's cloud identity provider (IdP) / authentication proxy. Key roles: (1) Corporate IdP proxy: IAS sits between SAP applications (BTP, S/4HANA Cloud, SAP cloud solutions) and corporate IdP (Azure AD, ADFS, Okta). Simplifies federation — connect corporate IdP once to IAS, then IAS handles all SAP app authentication. (2) Standalone IdP: for customers without corporate IdP — IAS manages users and authentication natively. (3) MFA (Multi-Factor Authentication): IAS adds TOTP/SMS MFA to all SAP app logins. Configuration: IAS admin console (accounts.sap.com/admin) → Applications → create application for each SAP system → SAML2 trust. Map attributes (nameID, email) to SAP user fields. Integration with IPS (Identity Provisioning Service): IPS synchronizes users from HR/Azure AD to SAP systems automatically. Security: IAS is BTP-hosted, highly available, and SAP-managed — no infrastructure to maintain.",
        level: "senior",
        tags: ["IAS", "identity", "SSO", "BTP"],
      },
      {
        id: "btp3",
        q: "How do you configure principal propagation from BTP to on-premise SAP?",
        a: "Principal propagation forwards the authenticated cloud user's identity through Cloud Connector to the on-premise SAP system — enabling SSO end-to-end without storing credentials in SCC. Architecture: BTP user authenticates via IAS → BTP issues a short-lived X.509 certificate with user's identity → SCC uses this certificate when calling on-premise → on-premise ABAP system validates certificate via STRUST (trust established to BTP subaccount CA). Setup steps: (1) In SCC: On-Premise → Principal Propagation → enable. (2) Import BTP's signing CA into SCC trust store. (3) In on-premise ABAP: STRUST → SSL Anonymous PSE → import BTP CA certificate. (4) Map certificate subject to SAP user: CERTRULE or usercertmap.xml (SN-to-user mapping). (5) In BTP Connectivity service: Create HTTP destination with authentication = 'PrincipalPropagation'. Test: call OData service from BTP → on-premise ABAP should log the actual end-user, not a technical RFC user.",
        level: "senior",
        tags: ["principal propagation", "SCC", "BTP", "SSO"],
      },
      {
        id: "btp4",
        q: "What is SAP Event Mesh and when would you recommend it over SAP Integration Suite?",
        a: "Event Mesh is SAP BTP's managed enterprise messaging service (based on AMQP protocol). It provides asynchronous, decoupled event-driven communication between applications. When to use Event Mesh: loose coupling between publisher and subscriber; high throughput asynchronous events; publish-subscribe fan-out scenarios (one event → multiple consumers); resilient integration where consumer downtime should not block publisher. Examples: S/4HANA publishes a BusinessPartner Changed event → multiple cloud apps (CRM, Logistics) independently consume. When to use Integration Suite instead: request-reply patterns where a response is needed, data transformation/mapping complexity, orchestration of multiple systems in a single flow, legacy system protocols (IDOC, RFC, FTP). Integration: SAP's Advanced Event Mesh connects to hyperscaler event services (AWS EventBridge, Azure Event Grid). Basis role: provision Event Mesh service instance in BTP, configure namespace/queues/topics, manage credentials.",
        level: "senior",
        tags: ["Event Mesh", "BTP", "messaging", "integration"],
      },
      {
        id: "btp5",
        q: "How do you troubleshoot a Cloud Connector connectivity issue?",
        a: "Troubleshooting SCC: (1) SCC Admin UI → Connectivity Test: test if SCC can reach the on-premise backend host/port. (2) Check SCC ↔ BTP tunnel: SCC Admin UI → Home → Tunnel status should show 'Connected' for each subaccount. If disconnected: check outbound internet access from SCC host (port 443), proxy settings. (3) If tunnel is up but calls fail: SCC → Audit Log shows each access request — check for 'NOT_ALLOWED' (resource path not whitelisted). (4) On-premise: SM59 → HTTPS connection → check if ABAP can reach SCC on its HTTP port (8042 by default). (5) Certificate issues: STRUST → SSL Client Standard — ensure BTP trust anchor is imported (common cause of silent failures). (6) SCC log file: /opt/sap/scc/log/ljs_trace.log — detailed connection logs. (7) If principal propagation fails: check CERTRULE mapping, STRUST trust setup, and SCC's own certificate validity (SCC admin → Certificates section). Escalation: SAP BTP Connectivity support via BCP ticket.",
        level: "mid",
        tags: ["SCC", "troubleshooting", "connectivity", "BTP"],
      },
      {
        id: "btp6",
        q: "What is SAP BTP Subaccount strategy and how does it relate to Basis operations?",
        a: "BTP Global Account → Sub-accounts → Spaces. Sub-account strategy aligns with SAP system landscape: separate sub-accounts per environment (DEV, QAS, PRD) to isolate entitlements, users, and data. Each sub-account: independent entitlement allocation (memory, service instances), separate trust configuration (own IdP/IAS mapping), separate Cloud Connector binding, independent role collections. Basis operational considerations: (1) Entitlement management: request additional quota from Global Account admin when services are needed. (2) Cloud Connector per sub-account: dev SCC points to dev SAP systems; prod SCC points to prod SAP systems — traffic isolation. (3) Destinations: each sub-account has its own Connectivity destinations — manage per environment. (4) Booster patterns: use BTP Boosters for guided setup of common configurations (SAP Integration Suite, Cloud ALM). (5) Cost management: subaccount consumption reports. Governance: Global Account admin approval required for subaccount creation in large enterprises.",
        level: "senior",
        tags: ["BTP", "subaccount", "strategy", "governance"],
      },
      {
        id: "btp7",
        q: "What is SAP Build Work Zone and how is it deployed?",
        a: "SAP Build Work Zone (formerly SAP Launchpad Service) is the cloud-hosted Fiori Launchpad for SAP cloud and hybrid applications. Standard edition: simple Fiunchpad for SAP apps in BTP. Advanced edition: digital workplace with collaboration (MS Teams integration), knowledge management, workflow. Deployment: (1) BTP Cockpit → Subaccount → Service Marketplace → SAP Build Work Zone → Subscribe. (2) Assign role collections: Launchpad_Admin to administrators. (3) Configure content channel: connect to SAP S/4HANA, SAP SuccessFactors, and other content providers. (4) Federated content: Fiori tiles from on-premise S/4HANA can appear in cloud Launchpad via content federation — configure in S/4HANA /UI2/CDUX_SPACE and publish to Work Zone. (5) Custom apps: upload HTML5 apps to BTP HTML5 Repository, add as tiles. Basis relevance: configure content federation from on-premise S/4HANA to Work Zone — requires ABAP service instance in BTP and S/4HANA content activation. SAP Fiori Launchpad Configuration (ABAP) remains for on-premise users; Work Zone serves cloud/hybrid scenarios.",
        level: "senior",
        tags: ["Work Zone", "BTP", "Fiori", "Launchpad"],
      },
      {
        id: "btp8",
        q: "How do you configure HANA Cloud (BTP) as a database service?",
        a: "SAP HANA Cloud is a fully managed HANA DBaaS on BTP. Provisioning: (1) BTP Cockpit → Subaccount → Service Marketplace → SAP HANA Cloud → Create instance. Select: size (memory in GB), availability zone, auto-scaling settings. (2) HANA Cloud Central: management UI for HANA Cloud instances — backup, users, monitoring. (3) Connection: HANA Cloud exposes JDBC/ODBC/HANA SQL endpoint (host:443). Certificates: only secure (TLS) connections allowed — HANA Cloud uses BTP-issued certificates. (4) CAP (Cloud Application Programming Model): cloud-native SAP development framework uses HANA Cloud as DB tier. (5) BTP ABAP Environment: can connect to HANA Cloud as an external HANA system. User management: HANA Cloud instance users are managed separately from BTP subaccount users. Administration: HANA Cloud Central (hanacloud.ondemand.com). Updates: SAP manages OS and HANA upgrades automatically (transparent to customers). Backup: automated daily backups, point-in-time recovery up to 14 days. Cost model: memory-based ($/GB/hour). SAP HANA Cloud is distinct from SAP HANA (on-premise) — different administration model.",
        level: "senior",
        tags: ["HANA Cloud", "BTP", "DBaaS", "provisioning"],
      },
      {
        id: "btp9",
        q: "What is SAP Build Process Automation and how does it relate to Basis?",
        a: "SAP Build Process Automation (formerly SAP Intelligent RPA + SAP Workflow Management) is a BTP service for building workflow automations and robotic process automations. Basis relevance: (1) Provisioning: BTP Cockpit → subscribe to SAP Build Process Automation, assign role collections (ProcessAutomationAdmin). (2) Backend connectivity: automations connecting to on-premise SAP systems need Cloud Connector + Destination setup. (3) Agent management: for attended/unattended RPA robots running on desktops, the RPA agent installer is deployed to client machines by IT/Basis. (4) Integration with SAP workflows: SAP S/4HANA approval workflows can be extended with BTP-based Process Automation. (5) Monitoring: SAP Build Process Automation → Monitor → shows process instances, errors, agent status. Not deep ABAP involvement — but Basis sets up the infrastructure and connectivity. For ABAP workflow (classical SAP Workflow in SWI5/SWIA): this is on-premise and fully managed by Basis + functional teams, not BTP-based.",
        level: "mid",
        tags: ["Build Process Automation", "RPA", "BTP", "workflow"],
      },
      {
        id: "btp10",
        q: "What is the SAP BTP ABAP Environment and how does it differ from on-premise ABAP?",
        a: "BTP ABAP Environment (also called 'Steampunk') is a managed ABAP runtime in SAP BTP where customers write and run ABAP code without owning the infrastructure. Key differences from on-premise ABAP: (1) Restricted ABAP: only clean ABAP OO syntax — no legacy ABAP (no CALL FUNCTION 'FM', no direct table access via SELECT ... FROM). Only released APIs (BAPIs, CDS Views, business services). (2) No SAP basis operations: no RZ10, SM50, SPAM — SAP manages OS, DB, kernel, support packages. (3) HANA Cloud as DB: always HANA Cloud. (4) Git-based development: code versioned in Git, deployed via abapgit or Eclipse-based tools. (5) No file system access, no OS commands. (6) Connectivity: only via BTP services (Connectivity, Destinations, Event Mesh). Basis responsibilities: provision BTP ABAP instance (BTP Cockpit → SAP BTP ABAP Environment → Create), assign user roles (Developer, Administrator), configure communications (Communication Arrangements — equivalent of SM59/ICF), manage subscription and cost. For extensions of S/4HANA: ABAP Environment is the 'side-by-side extension' platform — keeps on-premise system clean.",
        level: "senior",
        tags: ["BTP ABAP", "Steampunk", "clean core", "cloud"],
      },
      {
        id: "btp11",
        q: "How do you manage BTP service entitlements and why is this important?",
        a: "BTP entitlements define what services and capacities a subaccount can consume from the Global Account's purchased quota. Why important: without entitlements, subaccounts cannot create service instances — a common blocker for project teams. Management: (1) BTP Cockpit → Global Account → Entitlements → Service Assignments: assign quotas to subaccounts. (2) Subaccount → Entitlements: view assigned entitlements and current consumption. (3) Booster: some SAP BTP Boosters auto-assign entitlements as part of guided setup. Types of entitlements: (a) Quota-based: number of instances, memory, connections (e.g., SAP HANA Cloud — X GB memory). (b) Feature-based: on/off entitlement (e.g., Cloud Connector — free). (c) Subscription-based: SaaS applications (e.g., SAP Build Work Zone — number of active users). Common issue: 'Quota exceeded' error when creating service instance — check entitlement assignment. Governance: in large enterprises, entitlement management requires coordination between project teams and the BTP Global Account owner (usually IT Architecture or Cloud CoE).",
        level: "mid",
        tags: ["BTP", "entitlements", "quota", "governance"],
      },
      {
        id: "btp12",
        q: "What is the SAP API Business Hub and how is it used by SAP Basis teams?",
        a: "SAP Business Accelerator Hub (formerly SAP API Business Hub — api.sap.com) is SAP's central catalog of APIs, events, BAdIs, CDS views, and integration packages published by SAP for S/4HANA, BTP services, and other SAP products. Basis team usage: (1) API discovery: find released APIs for S/4HANA that development teams should use (Clean Core mandate — use only released APIs). (2) CDS View exploration: browse released CDS Views for reporting and integration without custom code. (3) Integration Package download: pre-built Integration Suite (iFlow) packages for common integration scenarios (S/4HANA → Salesforce, SAP SuccessFactors, etc.) — import directly into Integration Suite tenant. (4) Event catalog: browse events published by S/4HANA (BusinessPartner.Changed, SalesOrder.Created) for Event Mesh routing setup. (5) OData service documentation: correct endpoint and entity documentation for Fiori app activation. API Hub sandbox: test APIs against SAP demo systems before implementing. Relevant for Basis: when teams ask which API to use for an integration, API Hub is the authoritative source.",
        level: "mid",
        tags: ["API Hub", "BTP", "Integration Suite", "APIs"],
      },
      {
        id: "btp13",
        q: "What is the SAP Connectivity Service and how does it enable hybrid integrations?",
        a: "SAP Connectivity Service is a BTP platform service that provides a secure tunnel between BTP cloud applications and on-premise systems — the backend of the SAP Cloud Connector. Architecture: BTP app → Connectivity Service → Cloud Connector tunnel → on-premise network. Features: (1) On-premise HTTP access via RFC or HTTP protocols. (2) Mail service connectivity (SMTP relay from BTP apps). (3) LDAP: access on-premise LDAP/Active Directory from BTP. (4) TCP connectivity (advanced — for non-HTTP protocols). Configuration: (a) BTP app binds to Connectivity Service instance (creates credentials). (b) App uses Connectivity Service endpoint as HTTP proxy with headers for virtual host resolution. (c) SCC maps virtual host to real on-premise host. (d) Destination Service provides connection parameters; Connectivity Service provides the tunnel. Security: all traffic is TLS-encrypted through the tunnel. Authentication: SCC authenticates to BTP using BTP client certificate (rotated automatically). Monitoring: BTP Cockpit → Connectivity → Cloud Connectors shows all connected SCCs and their virtual mappings.",
        level: "senior",
        tags: ["Connectivity Service", "BTP", "SCC", "hybrid"],
      },
    ],
  },
  {
    id: "s4hana",
    title: "S/4HANA Specifics",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-teal-600",
    bg: "bg-teal-50",
    questions: [
      {
        id: "s41",
        q: "What are the key differences in Basis administration for S/4HANA vs older SAP releases?",
        a: "Key S/4HANA Basis differences: (1) Database: only SAP HANA supported — no Oracle, DB2, MaxDB, Sybase. Basis must be HANA DBA competent. (2) Memory management: HANA is in-memory — traditional SAP buffer tuning (ST02) less relevant. Focus shifts to HANA memory/performance tuning. (3) Fiori as primary UI: Fiori Launchpad replaces SAP GUI for business users — ICF, Fiori Catalog, Space/Page/Tile management become critical Basis tasks. (4) ABAP stack enhancements: CDS Views, AMDP, new ABAP SQL syntax — impacting debugging and transport content. (5) Embedded deployment: HANA is co-deployed on same server as ASCS in some configurations (not recommended for production HA). (6) gCTS: Git-based transport option available for modern ABAP. (7) Upgrade: SUM + HANA migration tools. (8) New monitoring: DBACOCKPIT is the primary HANA monitoring integration point within ABAP — replaces DBA Cockpit's DB2/Oracle tabs.",
        level: "mid",
        tags: ["S/4HANA", "HANA", "Fiori", "differences"],
      },
      {
        id: "s42",
        q: "How do you perform an SAP S/4HANA system conversion (Brownfield)?",
        a: "System Conversion (Brownfield) converts an existing SAP ECC/ERP system to S/4HANA in-place. Main tool: SUM (Software Update Manager) with DMO (Database Migration Option) for combined software upgrade + DB migration in one step if moving to HANA. Steps: (1) Maintenance Planner: generate stack file for S/4HANA target version. (2) Simplification Item Check (SIMPL_CHECK or Readiness Check): identifies ABAP incompatibilities, deprecated features, custom code modifications. (3) Custom code adaptation: SAP ATC (ABAP Test Cockpit) for mass custom code analysis — fix ABAP syntax, deprecated function modules. (4) SUM preparation phase: run SUM pre-checks, download downtime minimization options. (5) SUM main run: upgrade phases (toolbox, extraction, shadow phase, PREPARE, MAIN). (6) Post-conversion: Fiori catalog setup, user re-classification, new organizational model setup, test cycles. Role of Basis: own SUM execution, HANA migration (if DMO), coordinate downtime window, post-conversion system health validation.",
        level: "senior",
        tags: ["S/4HANA", "conversion", "SUM", "migration"],
      },
      {
        id: "s43",
        q: "What is the Fiori Launchpad and what are the Basis team's responsibilities?",
        a: "Fiori Launchpad is the browser-based HTML5 shell for SAP Fiori apps in S/4HANA. Basis responsibilities: (1) Activation: SICF → /sap/bc/ui5_ui5/sap/fiorilaunchpad — activate service. (2) Fiori Catalog/Group/Space/Page setup: /UI2/FLP_CUS (customizing) → add Tiles from catalog to groups/spaces. (3) OData service activation: /IWFND/MAINT_SERVICE — activate required OData services for Fiori apps. (4) Gateway configuration: SPRO → SAP NetWeaver → Gateway → activate. (5) Security: Fiori catalog authorization objects (SAP_F4_FIORI_RES_CATALOG), business role assignment, PFCG roles for Fiori apps. (6) Performance: activate ABAP push channels (WebSocket), load balancing for Fiori requests via SAP Web Dispatcher. (7) Cache maintenance: /UI2/CACHE to clear Fiori tile cache. (8) Troubleshooting: /IWFND/ERROR_LOG (OData errors), SMICM (ICF layer), SICF (service activation). Functional team: configures business content tiles. Basis: technical activation, security, performance, monitoring.",
        level: "mid",
        tags: ["Fiori", "Launchpad", "S/4HANA", "OData"],
      },
      {
        id: "s44",
        q: "What is SUM (Software Update Manager) and how is it used?",
        a: "SUM is the mandatory SAP tool for system upgrades, SPS updates, system conversions, and database migrations. It runs as a standalone Java application on the SAP host. Key features: Downtime Minimization (DMO): perform most upgrade work while system is still running — only short downtime for final cutover. Near-Zero Downtime Maintenance (NZDM) for SPS upgrades. Database Migration Option (DMO): combined software upgrade + DB migration in single SUM run. Operation: download from SAP support portal, extract, start SUM UI (HTTPS browser interface). Phases: Initialization, Prerequisites, Download, Toolbox extraction, Shadow Instance preparation, Main import, Post-processing. Monitor: SUM dashboard shows phase progress, errors. Logs: /sapmnt/<SID>/SUM/... directory. Common issues: prerequisite violations (check SAP notes for specific error codes), disk space insufficient (SUM needs 3x system size in staging area), JVM heap size (increase for SUM itself via start parameters). Integration with Maintenance Planner: always use Maintenance Planner to generate the stack file input for SUM — ensures correct components are included.",
        level: "senior",
        tags: ["SUM", "upgrade", "migration", "DMO"],
      },
      {
        id: "s45",
        q: "What is the S/4HANA Simplification List and why does it matter for Basis?",
        a: "The Simplification List is a document (released per S/4HANA version) listing all functional and technical simplifications compared to SAP ECC — i.e., what no longer exists, was restructured, or works differently in S/4HANA. Examples: SAP ECC general ledger replaced by SAP S/4HANA Universal Journal; many old aggregate tables (FAGLFLEXT, BSEG-split) replaced with ACDOCA; MM/SD data model changed. Basis relevance: (1) Simplification Items may require custom ABAP code changes (deprecated FMs, changed DB structures). (2) Pre-migration: Readiness Check (transaction SIMPL_CHECK or maintenance planner readiness check) automatically scans for simplification items affecting the system. (3) Custom code: SCI/ATC (ABAP Code Inspector/Test Cockpit) runs against custom ABAP to flag deprecated APIs. (4) Transport implications: custom programs calling deprecated function modules must be fixed and transported before conversion. Basis role: coordinate the readiness check, track custom code remediation progress, ensure all items are addressed before SUM execution.",
        level: "senior",
        tags: ["S/4HANA", "simplification", "migration", "custom code"],
      },
      {
        id: "s46",
        q: "How does SWPM (SAPinst) differ from older installation methods?",
        a: "SWPM (Software Provisioning Manager) is the unified SAP installation and provisioning tool, replacing the older SAPinst scripts and DDIC-based installation. Runs as a Java web application accessible via browser. Key capabilities: New installations (primary and additional application server instances), system copy (homogeneous and heterogeneous), database migration (in combination with SUM/DMO), system rename (system copy to new SID), Java system installation. SWPM collects all inputs via a guided wizard UI, validates prerequisites (disk, OS parameters, DB availability), and executes installation phases. SWPM generates detailed logs in the working directory. How it differs: (1) Browser-based UI vs. command-line. (2) Integrated prerequisite check. (3) Supports HANA as database natively. (4) Generates instance profiles automatically. (5) Handles both SAP ABAP and Java stacks. Common Basis use: system copy for refreshing QAS from PRD, installing new application server instances, post-copy system rename.",
        level: "mid",
        tags: ["SWPM", "SAPinst", "installation", "system copy"],
      },
      {
        id: "s47",
        q: "What is the SAP ABAP Test Cockpit (ATC) and how is it used in S/4HANA projects?",
        a: "ATC (ABAP Test Cockpit) is SAP's integrated code quality and compliance analysis framework. Replaces/extends SCI (Code Inspector). Key checks: (1) Syntax and runtime errors (SLIN). (2) Performance anti-patterns (expensive SELECT *, missing indexes). (3) S/4HANA readiness: checks for deprecated APIs, compatibility with S/4HANA restrictions (e.g., no direct access to compatibility views). (4) Security: SQL injection, hardcoded passwords. (5) ABAP Unit tests integration. Configuration (ATC): transaction ATC → create check variants, run on specified packages. Central ATC (CATCs): in Solution Manager or Cloud ALM — central check runs across all development systems, results aggregated in one place. For S/4HANA migration: ATC + SAP Readiness Check identifies ALL custom objects needing remediation. Basis role: configure ATC in CI/CD pipeline (via gCTS + Jenkins), ensure check runs block transport releases for critical findings, provide report to management on custom code compliance status.",
        level: "senior",
        tags: ["ATC", "code quality", "S/4HANA", "ABAP"],
      },
    ],
  },
  {
    id: "client",
    title: "Client Administration",
    icon: <Layers className="w-5 h-5" />,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    questions: [
      {
        id: "ca1",
        q: "What are SAP client roles and how do they differ?",
        a: "SCC4 defines client role: (1) Production: no client-independent customizing allowed, no CATT/eCATT, data changes restricted. (2) Customizing: allows customizing changes but no repository (ABAP) changes. (3) Test: allows all testing changes. (4) Training: training-only, not for development. (5) SAP Reference: SAP-delivered reference client (e.g., 000). Role impacts: SCC4 'Changes and Transports for Client-Specific Objects' — Automatic recording (creates transport requests automatically), No automatic recording, No changes allowed. Client protection level: 'Protection Level 0' (no protection) to 'Level 3' (only system changes). In production client: set to 'No changes allowed' + 'No transports' to prevent accidental direct changes. Key restriction: client-independent changes (SE11, SE38) are controlled by the system change option (SE06/SCC4 system level), not just the client setting.",
        level: "mid",
        tags: ["SCC4", "client role", "client settings", "customizing"],
      },
      {
        id: "ca2",
        q: "How do you delete a client in SAP?",
        a: "Client deletion: (1) SCC5 — Delete Client. Requires: target client login, client not the current logon client, not client 000/001 (SAP standard clients — should never be deleted). (2) SCC5 → specify target client → Execute. Runs RSDELCLI in background — this report deletes all client-specific data (application data, customizing, users) for the specified client. (3) Monitor via SM37. (4) After deletion: update SCC4 to remove the client configuration. Important: SCC5 only deletes client-dependent data. The client entry in SCC4 still exists until manually removed. Caution: irreversible — no recycle bin. Always take a full system backup before deleting any client. Never delete PRD client by mistake — validate the client number twice. In practice, decommissioned clients are locked and retained for audit purposes rather than deleted.",
        level: "mid",
        tags: ["SCC5", "client deletion", "SCC4", "data"],
      },
      {
        id: "ca3",
        q: "What is a local client copy and how does it differ from a remote copy?",
        a: "Local Client Copy (SCCL): copies data within the same SAP system from a source client to a target client. Fast (no network). Run from the target client. Target data is overwritten. Profiles: SAP_ALL (everything), SAP_CUST (customizing only), SAP_UZER (user master data only). Remote Copy (SCC9): copies from a source client in a remote SAP system to the current local client. Uses an RFC connection (SM59). Slower due to network, but allows copy from another system. Pre-requisites for remote copy: RFC connection with BGRFC queue configured, target client prepared (locked during copy). Monitoring: SCC3 (copy logs for both local and remote). Post-processing: SCC7 finishes the copy (copies large tables deferred during the main run). Best practice: run during off-peak hours, notify users, schedule as background job. Use SCCL for sandbox/training refresh; use SCC9 for cross-system copies (e.g., refreshing a test client from production).",
        follow_ups: ["What is SCCL profile SAP_CUST used for?", "How do you monitor a running client copy?"],
        level: "junior",
        tags: ["SCCL", "SCC9", "client copy", "remote"],
      },
      {
        id: "ca4",
        q: "How do you reset a client to SAP standard settings after a bad customizing change?",
        a: "Options for reverting client customizing: (1) Transport route: identify the transport request that introduced the bad change (SE10) and reverse-engineer it — harder without a transport. (2) SCC1 (Copy Transport Request to Client): re-import a previous known-good transport request into the same client to overwrite the bad customizing. (3) SCMP (Customizing Cross-System Viewer): compare the current client's customizing table entries with a reference client — identify delta, then manually revert. (4) Table-level revert: SE16N (with admin access) — directly modify the affected customizing table to restore previous values. Requires deep knowledge of the table structure. (5) Restore from backup: last resort — restore the client from a recent system backup (client export/import via SCC8/SCC7). For production: always follow the change management process — use a transport to apply the corrective customizing. Direct table changes in production are audit risks.",
        level: "senior",
        tags: ["SCC1", "SCMP", "customizing", "revert"],
      },
      {
        id: "ca5",
        q: "What is client export/import and when is it used?",
        a: "Client Export (SCC8): exports a client to the transport directory as a series of transport files. Profiles as with SCCL. Creates a transport request in STMS. Client Import (SCC7): imports a previously exported client from the transport directory. Use cases: moving a client to a completely different SAP system (different system ID), disaster recovery (re-import a previously exported client after system corruption), migrating training clients between systems. Process: (1) SCC8 in source client → select profile → runs export as background job → creates transport files in /usr/sap/trans. (2) Copy transport files to destination system's /usr/sap/trans. (3) STMS in destination: add transport to queue → import with SCC7 (not standard STMS import — use SCC7 specifically for client imports). Limitation: client export/import is slower than SAP system copy (SAPinst) for large clients. For large production data copies, use SAPinst/SAPtransor instead.",
        level: "mid",
        tags: ["SCC8", "SCC7", "client export", "import"],
      },
      {
        id: "ca6",
        q: "What is the SAP client concept and why is multi-client architecture used?",
        a: "A client is a logically independent business entity within a single SAP system installation. Clients share the same ABAP repository (programs, DDIC) and database installation but have separate: application data (business documents, master data), customizing (company-specific configuration), user masters. The client concept allows: multiple companies or business units on a single SAP system (reducing total cost of ownership), separate DEV/QAS/PRD environments without separate systems for small organizations, training clients isolated from production data. Table field MANDT (client field) is the first primary key field in all client-dependent database tables — SELECT * FROM MARA WHERE MANDT = '100' is the implicit client filter in all ABAP OPEN SQL queries. Cross-client access: requires CLIENT SPECIFIED addition in ABAP and special authorizations (S_TABU_CLI). In S/4HANA HANA MDC: one HANA tenant per S/4HANA client grouping is the recommended approach.",
        level: "junior",
        tags: ["client", "MANDT", "architecture", "multi-client"],
      },
      {
        id: "ca7",
        q: "How do you transfer users between clients?",
        a: "User transfer options: (1) SCCL with profile SAP_UZER: copies all user master records from source to target client within the same system. Overwrites existing users in target. (2) SU10 mass user maintenance: export users to file, import in target client (less common). (3) SU01 individual copy: in target client, create user and use 'Copy from' referencing source client user via remote system. (4) CUA (Central User Administration): if CUA is set up, user distribution from central to child clients is automatic and bidirectional (role changes, password resets). (5) For S/4HANA Cloud: IPS (Identity Provisioning Service) syncs users from IAS to all systems automatically. Key consideration: user passwords are client-specific (hashed) — SCCL with SAP_UZER copies the user record but may require users to reset passwords in the new client depending on profile settings. Initial passwords must comply with target client's password policy.",
        level: "mid",
        tags: ["SU10", "SCCL", "user transfer", "CUA"],
      },
      {
        id: "ca8",
        q: "What is the system change option and how does it interact with client settings?",
        a: "System Change Option (SE06 or SCCL → Settings): controls whether repository objects (ABAP, DDIC — cross-client) can be modified. Options: Modifiable (allows ABAP development — DEV systems), Not Modifiable (prevents any repository change — PRD and QAS). Interaction with SCC4 client settings: even if client is set to allow customizing changes, repository objects (DDIC, programs) require the system change option to be 'Modifiable' at the system level. In production: system change option should be 'Not Modifiable' AND client change option should be 'No changes allowed'. This two-layer protection prevents both accidental ABAP changes (system level) and customizing changes (client level). SE06 → Current settings shows both levels. Transports bypass the system change option — objects can be imported even when system is 'Not Modifiable', which is the correct mechanism for deploying approved changes.",
        level: "mid",
        tags: ["SE06", "system change option", "SCC4", "protection"],
      },
      {
        id: "ca9",
        q: "How do you set up a client copy profile and what do the different profiles contain?",
        a: "SCCL profiles determine what data is copied: SAP_ALL: complete client copy — all client-dependent customizing + application data + user data. Longest runtime (hours to days for large clients). SAP_CUST: customizing data only (IMG settings) without application data. Faster — used for refreshing config from one client to another. SAP_UZER: user master data only (SU01 records, user parameters, roles). SAP_SMSY: Solution Manager-specific copy including landscape data. Custom profiles: SCC4 → Maintain Copy Profiles — create own profiles selecting specific table categories and table names to include or exclude. Example use: SAP_CUST is ideal for refreshing a development client's customizing from production without copying sensitive application data. Application data copy requires more planning (data privacy, size, cleanup). After SAP_ALL copy: always run SCC7 to complete deferred large-table copies.",
        level: "mid",
        tags: ["SCCL", "SAP_ALL", "SAP_CUST", "profiles"],
      },
      {
        id: "ca10",
        q: "What are the post-processing steps after a client copy?",
        a: "Critical post-copy steps: (1) SCC7 (post-processing): run in the target client to import deferred large data tables that were skipped in the main copy run for performance reasons. (2) Check SCC3 log: verify copy completed successfully (status: Completed without errors). (3) Background jobs: review and reschedule — copied jobs may have wrong schedules or reference wrong systems. (4) RFC destinations: BDLS may be needed if copying across systems (replace logical system names). (5) User passwords: reset if needed, check locked users. (6) Spool: clear old spool requests (RSPO1041). (7) Application-specific post-steps: FI year-end closing settings, MM number ranges (reset!). (8) Client protection: update SCC4 to set appropriate client role and change option for the new client. (9) Notify users of the new client's availability. (10) Regression test key transactions. Number ranges are particularly critical — after a client copy, number range counters in the target may be lower than the highest document number, causing duplicate document number errors.",
        level: "mid",
        tags: ["SCC3", "SCC7", "post-processing", "client copy"],
      },
      {
        id: "ca11",
        q: "What is client 000 used for and why is it important?",
        a: "Client 000 is SAP's master reference client — it is the source of SAP standard configuration, Customizing content, and development objects. Key purposes: (1) Source for client copies (SCCL from 000 to new client resets a client to SAP standard). (2) Some SAP corrections (support packages) apply directly to client 000. (3) New SAP clients are initialized from 000 (SCC4 → New Entries → copy from 000). (4) Some ABAP programs and technical tables are only fully populated in 000. (5) Transport domain controller functions related to STMS use client 000 data structures. Rules: never delete 000. Do not use 000 as a working production client. Keep the DDIC and SAP* users in 000 with secure passwords. Apply support packages via SPAM — they update client 000. Client 001 is another SAP-delivered client typically used for demos. Client 066 (EarlyWatch/RemoteService) should be locked or have its EARLYWATCH user removed for security.",
        level: "junior",
        tags: ["client 000", "reference client", "SAP standard", "security"],
      },
      {
        id: "ca12",
        q: "How do you handle a client that was accidentally copied over?",
        a: "Recovery from accidental client overwrite: (1) Immediately assess: when was the last backup? What data has been lost? Is the source client still intact? (2) If another client on the same system has the correct data: SCCL to re-copy immediately. (3) If backup is the only option: restore the client from a recent client export (SCC8 export file from /usr/sap/trans) using SCC7. Or restore the entire system from a database backup and re-run subsequent changes. (4) Incident management: raise P1 incident, involve business users to assess data loss impact, involve SAP support if needed. (5) Post-recovery: document root cause — was it a wrong client number in SCCL? (6) Preventive measures: add confirmation dialog to SCCL scripts, require dual authorization for SCCL in production (S_SCC_ADM authorization object), schedule regular client exports (SCC8) for non-production clients so recovery point is recent. Lesson: before any SCCL run, triple-check target client number and system.",
        level: "senior",
        tags: ["SCCL", "accidental copy", "recovery", "SCC8"],
      },
      {
        id: "ca13",
        q: "What is the BDLS transaction and when must it be run?",
        a: "BDLS (Convert Logical System Names) replaces all occurrences of a logical system name in client-specific ALE/EDI configuration tables with a new name. Must be run after: (1) System copy or client copy that brings source system data into a target system — the source's logical system name appears in all ALE distribution models, partner profiles, and IDOC control records. Without BDLS, the target system will attempt to route IDOCs and RFC calls to the source system. (2) System rename (change of SID). (3) Client copy to a different client with a different logical system name. BDLS inputs: source logical system name (old) → target logical system name (new). Runtime: can be very long for large systems with many IDOCs. Run in background. Monitor: SM37. After BDLS: verify BD54 shows new logical system, WE20 partner profiles have new system, ALE distribution models (BD64) show new name. Test by checking if IDOCs route correctly in BD87.",
        level: "mid",
        tags: ["BDLS", "logical system", "ALE", "client copy"],
      },
      {
        id: "ca14",
        q: "How do you copy number range intervals from one client to another?",
        a: "Number ranges are client-specific and are NOT automatically included in all copy profiles — they require explicit attention. Options: (1) SCCL with SAP_ALL: number ranges are included. (2) For selective copy: use transaction SNRO (Number Range Objects) → Intervals → Transport — this transports number range interval objects to the transport request. Or SNUM (old transaction for number ranges). (3) Functional team task: after a client copy, functional consultants must verify number ranges in FI (FBN1), CO, MM (MMNR/OMRN), SD (VN01/SNRO) etc. match expected values. (4) Critical risk: after a client copy from a system with higher document numbers, the target may have number ranges set too low — generating duplicate document number errors. Resolution: SNRO or business-area-specific number range transactions → manually advance the current number. This is a frequent post-client-copy issue that Basis teams must document in their refresh runbook.",
        level: "mid",
        tags: ["SNRO", "number ranges", "client copy", "FI"],
      },
      {
        id: "ca15",
        q: "What is the SCC4 client role 'Test' vs 'Training' and what are the practical differences?",
        a: "SCC4 client roles (conceptual only — SAP does not enforce strict functional differences between Test and Training): Test client: intended for functional testing, system integration testing, user acceptance testing. Typically receives transports from DEV via QAS route. May contain production-like data volume. Training client: for end-user training purposes. Often a copy of production with masked sensitive data. Not typically in the transport route (standalone, refreshed from production periodically). Practical difference for Basis: the roles are advisory labels — the actual behavior depends on: (1) Whether transport routes are configured to import here (STMS). (2) The SCC4 change protection setting. (3) RFC connection targets. Key point: a client labeled 'Production' does not automatically prevent damage — you must configure protection settings (SCC4 → 'No changes allowed') AND system change option (SE06 → 'Not Modifiable') to enforce non-modifiability. Labels alone mean nothing without the settings.",
        level: "junior",
        tags: ["SCC4", "client role", "test", "training"],
      },
      {
        id: "ca16",
        q: "How do you manage client-specific CCMS (RZ20) monitoring for different clients?",
        a: "CCMS monitoring in SAP is primarily system-wide — not strictly client-specific. The monitoring infrastructure (RZ20, RZ21) is accessed from client 000 or a designated monitoring client. Configuration best practice: designate one client (often 000) as the monitoring client — all CCMS data collection, RSCOLL00, and alert configuration done here. If multiple clients exist on one system: CCMS MTE (Monitoring Tree Elements) for application-level KPIs (user sessions, background jobs) are client-aware — filter by client in RZ20 if multiple clients are active. Alert configuration: CCMS auto-reaction methods (RZ21) can be defined per client or system-wide. SolMan Technical Monitoring: SolMan does not distinguish clients — it monitors the system as a whole. For multi-client monitoring requirements (e.g., separate alert routing per client/team): use BPC (Business Process Monitoring) in SolMan which can define alerts per business process context that maps to specific clients.",
        level: "senior",
        tags: ["CCMS", "RZ20", "client", "monitoring"],
      },
      {
        id: "ca17",
        q: "What is the client-independent vs client-dependent data distinction?",
        a: "Client-dependent data: stored in tables with MANDT as the first primary key. Examples: application tables (MARA, VBAK, BKPF), customizing tables (T001 — company codes, T005 — countries), user master data. Visible only within the specific client. Changed via customizing transactions within that client. Client-independent data: no MANDT primary key. Examples: ABAP repository (programs SE38, DDIC objects SE11), system configuration tables, transport objects. Visible and shared across all clients. Changed only via ABAP Workbench (SE80) and transported system-wide. Basis relevance: (1) SE11 changes (DDIC — dictionary) are cross-client — one change affects all clients immediately. (2) Support packages change repository data — impacts all clients simultaneously. (3) Transports carry both: workbench transports = client-independent, customizing transports = client-specific to the source client. When transporting customizing from client 100 of DEV: it only moves that client's data. Cross-client data inconsistencies are a common QAS/PRD mismatch root cause.",
        level: "junior",
        tags: ["MANDT", "client-dependent", "repository", "DDIC"],
      },
      {
        id: "ca18",
        q: "How do you document and control client copy activities for audit compliance?",
        a: "Audit compliance for client copies: (1) Change request: raise a formal change request (ITSM/ChaRM) before any client copy in non-development systems. Include business justification, data privacy assessment (does production data enter non-production systems?). (2) GDPR/data privacy: if copying production client, conduct a Data Privacy Impact Assessment — production data may contain PII (personal data). Masking/anonymization may be required (SAP Test Data Migration Server or manual data masking scripts). (3) Approval: obtain sign-off from system owner and data privacy officer before production-to-non-production copies. (4) SCC3 log retention: SCC3 copy logs are audit evidence — retain them. (5) Post-copy: document what was copied, to where, who authorized it, what data masking was applied. (6) Regulatory: in HIPAA/SOX environments, production data copies to non-production require documented evidence of data protection measures. Regular 'copy' activities in training environments should follow the same process if they involve real customer/employee data.",
        level: "senior",
        tags: ["compliance", "GDPR", "SCC3", "data privacy"],
      },
      {
        id: "ca19",
        q: "What is SCC1 and how is it used?",
        a: "SCC1 (Copy Transport Request): copies a specific customizing transport request's objects and data to the current client without going through the standard STMS import process. Use case: apply a specific customizing change to a different client on the same system — e.g., copy customizing from client 100 to client 200 without a full client copy. Process: SCC1 → enter transport request number → execute → the customizing entries from that request are applied to the current client. The transport request itself is not moved (no files created) — it's a client-level copy of the table entries. Important: SCC1 does not check transport dependencies — if the request depends on other requests being present, SCC1 may apply an incomplete change. Monitor: check application log for errors after SCC1. Use cases: emergency repair of specific customizing in a parallel client, applying the same customizing to multiple clients on the same system without re-importing via STMS.",
        level: "mid",
        tags: ["SCC1", "customizing", "client copy", "transport"],
      },
      {
        id: "ca20",
        q: "How do you handle data archiving from a client administration perspective?",
        a: "Data archiving removes application data from the database to an archive file while maintaining accessibility for reporting. SAP Data Archiving transactions: SARA (Archive Administration — entry point), SARI (Archive Information System — access archived data). Basis role: (1) Configure archive file paths (AL11 or SARA → Customizing → File Paths). (2) Schedule archiving jobs: SARA → select archiving object (e.g., FI_DOCUMNT for FI docs) → Write phase (creates archive files) → Delete phase (removes data from DB after successful write). (3) Monitor: SARA → Job → Display Log. (4) File management: archive files go to file system — configure move to NAS/tape/cloud (Hierarchical Storage Management via ArchiveLink or OpenText). (5) OpenText/SAP ILM (Information Lifecycle Management): enterprise solution for legal hold, archive storage, and compliance. Client impact: archiving is client-specific (operates on MANDT-keyed data). Run archiving regularly to maintain manageable database size and improve performance — HANA is in-memory, so large tables still impact memory.",
        level: "senior",
        tags: ["SARA", "archiving", "data management", "ILM"],
      },
    ],
  },
  {
    id: "rfc-gw",
    title: "RFC & Gateway",
    icon: <Activity className="w-5 h-5" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    questions: [
      {
        id: "rfc1",
        q: "What is an SAP Gateway and what security risks does it pose?",
        a: "The SAP Gateway (SMGW) is the communication interface that handles RFC connections (ABAP and external programs) and hosts the Gateway Server process. Security risks: (1) External RFC access — without proper gateway ACL (reginfo/secinfo files), external programs can register on the gateway and receive RFC calls. (2) Backdoor access — malicious programs registering as RFC server programs (e.g., SAPXPG — allows OS command execution). (3) Network exposure — gateway port (33NN) should be firewalled from public internet. Security hardening: gw/acl_mode = 1 (activate ACL checking). Configure reginfo (registration rules — which programs may register on the gateway) and secinfo (start rules — which programs may be started by the gateway). Files located in DIR_DATA (usually /usr/sap/<SID>/SYS/global/). Critical SAP note: 1408081 — SAP Gateway security hardening. SMGW → View → Registered Programs shows current registered server programs — audit this regularly.",
        level: "senior",
        tags: ["SMGW", "gateway", "security", "ACL"],
      },
      {
        id: "rfc2",
        q: "What is a trusted RFC connection and what are the risks?",
        a: "Trusted RFC connections (SM59 Type 3 with Trust = Trusted) allow the calling system to pass its own user context to the target system without supplying a password — the target trusts the calling system's authentication. Configuration: calling system must be defined as a 'trusted system' in SPRO → SAP NetWeaver → Security → Maintain Trusted System Relationship. Risk: if the calling system is compromised, an attacker can use the trusted RFC to access the target with any user's identity — even privileged users. The calling system's S_RFCACL authorization object controls which users can use trusted RFC. Security audit: SE97 (Trusted RFC security check) — shows all trusted RFC configurations. Recommendation: (1) Restrict S_RFCACL authorization to required users only. (2) Regularly review trusted RFC relationships and remove stale ones. (3) Avoid trusting production systems from development systems. Trusted RFC is commonly used for CUA (user distribution) and ALE — ensure principle of least privilege.",
        level: "senior",
        tags: ["trusted RFC", "SM59", "SE97", "security"],
      },
      {
        id: "rfc3",
        q: "How do you troubleshoot a tRFC/qRFC failure?",
        a: "Transactional RFC (tRFC) and Queued RFC (qRFC) failures: (1) SM58 — tRFC monitoring: shows failed tRFC entries with error details. Can manually resend or delete. (2) SMQR — inbound qRFC queue monitor. SMQS — outbound qRFC queue monitor. (3) Check error class in SM58: Connection refused (target down), Authorization error (RFC user missing auth), Program error (function module failed). (4) For qRFC queue stuck: SMQS/SMQR → select queue → activate or check for locked queues. (5) SM21 — system log at the time of failure for correlated messages. (6) ARFCSSTATE table: stores tRFC state (raw SQL or SE16). Status: EXECUTE (initial), EXECUTED (done), ERROR (failed). (7) Automatic retry: tRFC automatically retries on connection failures — if target was down and comes back up, pending entries in SM58 will be retried by RSARFCEX (scheduled job). Schedule RSARFCSE to periodically clean successfully-executed entries from SM58.",
        level: "mid",
        tags: ["SM58", "tRFC", "qRFC", "SMQR"],
      },
      {
        id: "rfc4",
        q: "What is the RFC load balancing and how does it work with logon groups?",
        a: "RFC load balancing distributes RFC calls across multiple application server instances using logon groups. SM59 Type 3 RFC with load balancing: specify message server host, system number, and logon group name (from SMLG). How it works: when an RFC call is made, the RFC library contacts the message server, which selects the least-loaded application server from the logon group and returns its hostname and instance number. The RFC then connects directly to that instance. Benefits: distributes RFC-heavy batch jobs across servers. Limitation: once an RFC dialog is established, it's pinned to that server (no mid-connection migration). Monitor: SMLG → select group → current load shows session counts per server. Configuration tip: dedicate a separate RFC logon group for internal RFCs (e.g., ALE, batch jobs) separate from the user dialog logon group — prevents RFC-heavy batch jobs from consuming dialog work processes intended for users.",
        level: "mid",
        tags: ["RFC", "load balancing", "SMLG", "SM59"],
      },
      {
        id: "rfc5",
        q: "How do you secure RFC connections in SAP?",
        a: "RFC security best practices: (1) Technical RFC users: create dedicated technical users for each RFC connection — type System (not Dialog). Assign minimum required authorizations (S_RFC object with specific function group/module). (2) Never use privileged users (SAP*, BASIS team members) as RFC technical users. (3) SM59 password storage: use the 'Logon & Security' tab — activate SNC for RFC encryption where possible. (4) Regularly rotate RFC passwords: use password management tools or vaults (CyberArk, HashiCorp) rather than storing in SM59. (5) SUIM → RFC Users → find all users in SM59 connections — audit quarterly. (6) Remove unused RFC connections: SM59 → Connection Test regularly — delete connections with persistent failures. (7) gw/acl_mode = 1 + secinfo/reginfo: prevent external RFC abuse at gateway level. (8) Audit S_RFC authorization on users — who can call which function groups via RFC? SUIM → Authorization Object → S_RFC.",
        level: "senior",
        tags: ["RFC security", "SM59", "S_RFC", "technical user"],
      },
      {
        id: "rfc6",
        q: "What is SAP NWRFC (NetWeaver RFC SDK) and how does it differ from classic RFC?",
        a: "SAP NW RFC SDK (librfc32.dll / libsaprfc.so replacement) is the modern RFC library for external RFC connections (non-ABAP clients — Java, Python, .NET, Node.js). Classic RFC (RFC library / librfc32): older, uses RFC1/2/3 protocol, still works for legacy connections. NW RFC SDK: uses CPIC protocol with improved features: (1) Load balancing support. (2) Unicode and multi-byte character set support. (3) Better connection pooling. (4) Supports both function module calls and BAPI-style interfaces. Integration: SAP Java Connector (JCo 3.x) uses NW RFC SDK internally. PyRFC Python library uses NW RFC SDK. Node.js node-rfc also uses it. Basis responsibility: provide correct librfc paths and parameters to application teams. RFC trace in SMGW: SMGW → View → RFC Connections shows active connections from external programs — useful for debugging external RFC applications. SAP Note 1230932 covers NW RFC SDK installation.",
        level: "senior",
        tags: ["NW RFC", "SDK", "JCo", "external RFC"],
      },
      {
        id: "rfc7",
        q: "How do you configure and use SNC for RFC connections?",
        a: "SNC (Secure Network Communications) encrypts and authenticates RFC connections. Configuration: (1) snc/enable = 1 in instance profile (RZ10). (2) snc/gssapi_lib = path to cryptographic library (SAP Cryptographic Library: sapcrypto.dll/libsapcrypto.so). (3) snc/identity/as = <SNC name of application server> (e.g., p:CN=S4H_AS, O=Company, C=DE). (4) Both sides must have their SNC identities configured and trusted. (5) SM59 Type 3 with SNC: enter target SNC partner name in the 'Logon & Security' tab. (6) STRUST: generate System PSE and create SNC PSE — import partner certificates for mutual authentication. Test: SM59 → Connection Test → should show 'SNC Active'. Quality: SNC Quality 3 (Privacy — encryption) is recommended for all RFC connections carrying sensitive data. SNC for RFC doesn't require SAP Secure Login Server — it uses GSSAPI directly. For Kerberos-based SNC: configure with Windows AD Kerberos library.",
        level: "senior",
        tags: ["SNC", "RFC", "encryption", "STRUST"],
      },
      {
        id: "rfc8",
        q: "What is the ICF (Internet Communication Framework) and how do you manage it?",
        a: "ICF (SICF) provides SAP's HTTP service infrastructure — all web services, Fiori, Web Dynpro, REST/SOAP services, and the OData gateway run as ICF services. SICF: tree of service nodes (/sap/bc/... hierarchy). Each node can be active or inactive. Security: by default, almost all SAP services are inactive — they must be explicitly activated. This is a security feature. Management: (1) SICF → navigate to service path → right-click → Activate Service. (2) Error handler: configure custom error pages per service. (3) Logon procedure: per service — basic auth, SSO tickets, certificates. (4) Service protection: require specific roles or IP restrictions. (5) Performance: service-level parameters for session timeout, keep-alive. Deactivate unused services: for hardening, deactivate all /sap/bc/* services that are not needed. Common services to activate: /sap/bc/ui5_ui5 (Fiori), /sap/bc/webdynpro (Web Dynpro), /sap/opu/odata (OData/Gateway). ICF service activation is a common Fiori troubleshooting step.",
        level: "mid",
        tags: ["ICF", "SICF", "HTTP", "Fiori"],
      },
      {
        id: "rfc9",
        q: "What is the difference between ABAP messaging server (SMGW) and the message server (SM51)?",
        a: "Message Server (SM51 / msmon): handles application server registration in the system landscape and logon load balancing. Runs as a single process per system (msserver). Port: 3600+SysNr (internal), 8100+SysNr (HTTP). SAP Web Dispatcher, SAP GUI, and RFC library contact the message server for application server list. Gateway Server (SMGW / gwrd): handles RFC protocol communication. Each application server instance has its own gateway process. Port: 33NN (RFC protocol). Handles: incoming RFC calls, tRFC state machine, registration of external RFC server programs, monitoring of gateway traffic. They are separate processes and serve different functions: message server is for routing/load balancing; gateway is for RFC communication. When users cannot log in (load balancing fails): check message server. When RFC connections fail: check gateway. Both must be running for a fully functional SAP system. In S/4HANA ABAP Central Services (ASCS): message server and enqueue server are in ASCS; gateway is on each application server instance.",
        level: "mid",
        tags: ["SMGW", "message server", "SM51", "gateway"],
      },
      {
        id: "rfc10",
        q: "How do you diagnose and fix an RFC connection that returns SYSTEM_FAILURE?",
        a: "SYSTEM_FAILURE exception from RFC call indicates the remote system could not process the request — distinct from COMMUNICATION_FAILURE (network/connection error). Diagnosis: (1) SM21 on target system at the time of failure — look for system errors, work process crashes, database errors. (2) ST22 on target — was there a short dump generated during the RFC? (3) SM66 on target — was a work process busy or in an error state during the RFC call? (4) RFC log on target: SMGW → View → RFC Connections → trace level 3 for the connection — captures exact error. (5) SM59 on calling system → Test Connection → check if basic connectivity works, then Remote Logon to verify the RFC user can log in manually. (6) RFC user authorizations: SU53 on target logged as RFC user — was there an authorization failure? (7) Function module: SE37 → test the called function module directly on target — does it work standalone? SYSTEM_FAILURE often points to: authorization error in RFC user, database error in called FM, or unavailable resource on target.",
        level: "senior",
        tags: ["RFC", "SYSTEM_FAILURE", "SM21", "troubleshooting"],
      },
      {
        id: "rfc11",
        q: "What is bgRFC and how does it improve on tRFC?",
        a: "bgRFC (Background RFC) is the modern replacement for tRFC and qRFC, introduced with SAP NetWeaver 7.0 EHP1. Improvements over tRFC/qRFC: (1) Unified protocol: replaces both tRFC and qRFC with a single framework. (2) Enhanced monitoring: SBGRFCMON (bgRFC Monitor) with improved visibility and retry controls. (3) Better error handling: distinguish transient errors (retry) from permanent errors (no retry). (4) Multiple queue types: unit queues (like qRFC outbound), daemon queues, and noSessionQueue. (5) Administration: supervisors (SBGRFCCONF) manage unit processing. (6) Performance: parallel processing of units in the same queue. Migration: SAP recommends migrating existing tRFC/qRFC implementations to bgRFC for new development. Monitor: SBGRFCMON replaces SM58/SMQR/SMQS as the central monitor. Basis action: configure bgRFC supervisors (SBGRFCCONF) on application server instances to control unit processing capacity.",
        level: "senior",
        tags: ["bgRFC", "tRFC", "SBGRFCMON", "qRFC"],
      },
      {
        id: "rfc12",
        q: "How do you create and manage Service Users for RFC in SAP?",
        a: "Service Users for RFC (SU01 → User type: System or Service): (1) User Type System: used for technical RFC connections — cannot log on interactively (no dialog logon allowed). Password expires but system-type users are never automatically locked. Ideal for RFC destinations (SM59). (2) User Type Service: similar to System but intended for shared service scenarios — shared password known to multiple applications. Can be used for anonymous ICF access. (3) Never use Dialog users as RFC users: dialog users can log in interactively (security risk), are subject to logon restrictions and concurrent session limits, and can be accidentally locked. Setup process: SU01 → Create System user → assign only specific function-group level S_RFC authorization (not SAP_ALL). Naming convention: RFC_<TARGET_SYSTEM>_<PURPOSE> (e.g., RFC_S4H_ALE_USER). Password management: integrate with a vault (CyberArk) for automated rotation. Document all RFC users in a service account registry for audit purposes.",
        level: "mid",
        tags: ["SU01", "system user", "RFC user", "service user"],
      },
      {
        id: "rfc13",
        q: "What is the Gateway Monitor (SMGW) and what can you do in it?",
        a: "SMGW (Gateway Monitor) provides real-time visibility into the SAP Gateway process. Key functions: (1) View registered server programs: SMGW → View → Registered Programs — shows all external programs registered (security audit: should be minimal and all known). (2) View active RFC connections: SMGW → View → RFC Connections — shows all open RFC sessions. (3) Trace management: SMGW → Traces → Increase/Decrease — set trace level 1-3 for RFC debugging. Level 3 is very verbose. (4) Delete registered programs: remove unknown/malicious registrations. (5) Reset statistic counters. (6) View gateway work table: active and queued RFC tasks. (7) Logs: dev_rdisp and dev_gw in /usr/sap/<SID>/<INSTANCE>/work — analyze for RFC protocol errors. (8) SMGW → Gateway Log → view or clear gateway log file. Key security use: check for unauthorized registered programs — attackers sometimes register malicious programs via gateway that receive RFC calls with elevated privileges.",
        level: "mid",
        tags: ["SMGW", "gateway", "RFC", "security"],
      },
      {
        id: "rfc14",
        q: "What is the SAP Message Server HTTP port and why must it be secured?",
        a: "The Message Server has two ports: internal port 3600+SysNr (for SAP GUI and internal SAP communication — should only be accessible from SAP systems and client workstations) and HTTP port 8100+SysNr (for web-based logon load balancing — used by SAP Web Dispatcher and HTTP clients). Security risk: the HTTP port of the message server exposes a list of all application server instances. If accessible from internet: attackers can enumerate all instances, trigger connections. SAP note 1421005: restrict message server access. Configuration: ms/acl_info file (access control list for message server) or network firewall. ms/server_port_<n> parameter controls the HTTP port. SAP Web Dispatcher: restrict msg server HTTP access to SAP Web Dispatcher IP only (not all internet). Best practice: put message server behind firewall, allow only from SAP Web Dispatcher and admin networks. SMMS transaction (Message Server Monitor) — view connections, active application servers. Audit: check ms/acl_info file for correct restrictions.",
        level: "senior",
        tags: ["message server", "HTTP", "security", "SMMS"],
      },
      {
        id: "rfc15",
        q: "How do you configure RFC connections for a 3-system landscape?",
        a: "In a DEV-QAS-PRD landscape, RFC connections serve: ALE/IDocs, batch RFC jobs, CUA user distribution, Solution Manager monitoring, STMS transport. Configuration steps: (1) SM59 in each system: create Type 3 connections to all other systems in the landscape. Naming convention: <TARGET_SID>_RFC or <SOURCE>_TO_<TARGET>. (2) Create dedicated technical user in each target system for RFC (System type, minimum S_RFC authorization). (3) For STMS: transport domain controller uses RFC to all systems — domain controller RFC user must have S_TRANSPRT authorization. (4) For CUA: central system needs RFC to all child systems; child systems need RFC back to central (bidirectional). (5) SolMan: each satellite needs RFC to SolMan (TRUSTED RFC recommended for diagnostic agents). (6) Test each connection: SM59 → Connection Test and Remote Logon. (7) Document all RFC connections in a connection matrix (source, target, purpose, technical user, authorization required). Review quarterly — decommission unused connections immediately (RFC connections are attack vectors).",
        level: "mid",
        tags: ["SM59", "landscape", "RFC", "configuration"],
      },
      {
        id: "rfc16",
        q: "What is the CPIC protocol and how does it relate to RFC?",
        a: "CPI-C (Common Programming Interface — Communication) is the underlying communication protocol used by SAP RFC. RFC is built on top of CPI-C/TCP-IP. CPI-C handles: connection establishment, session management, flow control, error handling between SAP processes. Modern context: RFC Protocol 3 (RFC3) is the current version used in SAP — provides improved error handling, unicode support, and connection multiplexing over CPI-C. gRPC: SAP HANA internal communication (between nameserver, indexserver) uses gRPC, not CPI-C. JCo (Java Connector): uses NW RFC SDK which uses RFC3/CPI-C underneath. Trace: SMGW → Traces → set to level 3 captures CPI-C level communication details. SM59 Connection Test verifies the full CPI-C stack from source to target. Network prerequisites: CPI-C requires port 33NN (where NN is system number) to be open between systems. Multiple application servers: each has its own gateway on 33NN+instance number offset (e.g., instance 00 = 3300, instance 01 = 3301).",
        level: "senior",
        tags: ["CPIC", "RFC", "protocol", "network"],
      },
      {
        id: "rfc17",
        q: "What are the key authorization objects for RFC in SAP and how are they configured?",
        a: "RFC authorization objects: (1) S_RFC: controls which RFC function modules/groups a user can call via RFC. Fields: RFC_TYPE (FUGR=function group, FUNC=specific function), RFC_NAME (name of the function group or module), ACTVT (16=execute). Best practice: restrict to specific function groups needed — not * wildcard. (2) S_RFCACL: controls which users can use trusted RFC connections (pass identity without password). Fields: RFC_SYSID, RFC_CLIENT, RFC_USER, RFC_EQUSER, RFCTRUSTL. Restrict to minimum required user list and source systems. (3) S_TCODE for transactions that use RFC behind the scenes. (4) Authorization audit for RFC: SUIM → Authorization Object → S_RFC → find all users with execute on * (wildcard). All wildcards on S_RFC are security risks — attackers exploiting RFC can call any function module if S_RFC has *. Hardening: implement individual function group lists in S_RFC for all non-privileged users. Use SCI security check to find programs with unrestricted RFC calls.",
        level: "senior",
        tags: ["S_RFC", "S_RFCACL", "authorization", "security"],
      },
      {
        id: "rfc18",
        q: "How does HTTP RFC (Type H) work in SAP?",
        a: "Type H RFC (HTTP Connection to ABAP System): uses HTTP/HTTPS to call ABAP function modules on remote systems, as opposed to Type 3 (native RFC protocol/DIAG). Configuration in SM59: (1) Connection Type H. (2) Target host (FQDN or IP), port (usually ICM HTTP port — 80NN). (3) Path prefix: /sap/bc/soap/rfc (SOAP/RFC gateway) or /sap/hana/... (for HANA XSA). (4) Logon tab: basic auth credentials or client certificate. (5) SSL: activate SSL for HTTPS, configure SSL application and certificate in STRUST. Use cases: calling SAP ABAP function modules from external Java/ABAP systems via HTTP (no DIAG port 33NN needed — useful for cloud or DMZ scenarios). OData: Type H connections also used for HTTP outbound (REST/OData) to external services, not just SAP-to-SAP. Testing: SM59 → Connection Test (ping) and Remote Logon (opens browser). ABAP-to-ABAP: Type 3 is faster; use Type H only when DIAG ports are not available (security zone restrictions).",
        level: "mid",
        tags: ["SM59", "HTTP RFC", "Type H", "HTTPS"],
      },
      {
        id: "rfc19",
        q: "What is the SAP Destination Service in BTP and how does it relate to SM59?",
        a: "SAP BTP Destination Service is the BTP equivalent of SM59 — centralized connection configuration for all outbound connections from BTP applications. Key differences from SM59: (1) BTP Destination Service stores connection params in JSON (URL, auth type, user/password or certificate) in a BTP subaccount. (2) Applications read destinations at runtime via Destination Service API or SAP BTP SDK — no manual SM59 configuration in ABAP. (3) Authentication options: BasicAuthentication, OAuth2ClientCredentials, OAuth2SAMLBearerAssertion (for user propagation), PrincipalPropagation (via SCC). (4) On-premise connections: require Cloud Connector binding in the same subaccount — the Cloud Connector proxies the request. Configuration: BTP Cockpit → Connectivity → Destinations. Integration with ABAP: if an on-premise ABAP system calls BTP services, SM59 (Type H) still used. If BTP app calls on-premise: Destination Service + SCC. The Destination Service is the architectural replacement for SM59 in cloud-native SAP applications.",
        level: "senior",
        tags: ["BTP", "Destination Service", "SM59", "connectivity"],
      },
      {
        id: "rfc20",
        q: "What is IDOC (Intermediate Document) and how does it use RFC?",
        a: "IDoc is SAP's standard electronic data interchange format for business document exchange between SAP systems (ALE) and external partners (EDI). IDoc and RFC relationship: IDocs are sent between systems via tRFC — each IDoc dispatch is a tRFC call that guarantees exactly-once delivery. WE19 (IDoc test tool), BD87 (IDoc monitor and reprocessing), WE02 (IDoc display). Key components: (1) Partner Profile (WE20): defines communication parameters for each trading partner — message type, IDoc type, direction. (2) Port definition (WE21): tRFC port or file port for outbound IDocs. (3) Distribution Model (BD64): defines which message types are sent from which logical system to which target. Monitoring: BD87 → shows IDocs with status (green=OK, red=error). Basis diagnosis of IDoc failures: (1) BD87 → filter errors → view technical details. (2) SM58 — tRFC entries for IDoc dispatch. (3) SM21 — system log at time of failure. Reprocessing: BD87 → select failed IDoc → Reprocess. Most IDoc errors are either authorization failures in the receiver or data content issues passed to the functional team.",
        level: "mid",
        tags: ["IDOC", "ALE", "BD87", "tRFC"],
      },
    ],
  },
  {
    id: "os-kernel",
    title: "OS & Kernel Management",
    icon: <Server className="w-5 h-5" />,
    color: "text-gray-700",
    bg: "bg-gray-50",
    questions: [
      {
        id: "os1",
        q: "What is the SAP Host Agent and what are its key functions?",
        a: "SAP Host Agent (sapstartsrv) is a lightweight process running on every SAP host that provides OS-independent management and monitoring capabilities. Key functions: (1) SOAP/HTTP interface: exposes start/stop/monitoring operations — used by sapcontrol, SAP LaMa, Solution Manager SMD. (2) Instance control: start/stop SAP instances (sapcontrol -nr <NN> -function Start/Stop/RestartService). (3) Resource monitoring: CPU, memory, disk metrics — forwarded to CCMS and SolMan. (4) Data provider: system metadata (OS type, SAP version, instance role) for SolMan LMDB. (5) Certificate management: hosts the instance PSE for HTTPS communication. Start/stop: startsap/stopsap scripts invoke sapcontrol via Host Agent. Port: 1128 (HTTP), 1129 (HTTPS) on each host. Update: separate update procedure from SAP kernel — download new Host Agent from SAP Service Marketplace. SAP Note 1907566 covers Host Agent update procedure. Essential: Host Agent must be running before SAP instances can be started via standard tools.",
        level: "mid",
        tags: ["Host Agent", "sapstartsrv", "sapcontrol", "SolMan"],
      },
      {
        id: "os2",
        q: "Describe the SAP directory structure and key paths on Linux.",
        a: "Critical SAP directories on Linux: /usr/sap/<SID>: system-level directory — profiles, work directory per instance, exe kernel. /usr/sap/<SID>/<INSTANCE>/work: work process log files (dev_disp, dev_w*, dev_icm, dev_ms), dumps. /usr/sap/<SID>/<INSTANCE>/log: instance log files. /usr/sap/<SID>/SYS/global: system-global files (security files, gateway ACL, ABAP dump archive). /usr/sap/<SID>/SYS/profile: SAP profiles (default.pfl, instance profiles). /usr/sap/<SID>/SYS/exe/uc/linuxx86_64: kernel executables (disp+work, ABAP, R3trans). /usr/sap/trans: shared transport directory (must be accessible from all instances). /hana/data, /hana/log, /hana/shared: HANA-specific data/log/shared volumes (on HANA systems). /home/<sidadm>: home directory for <sidadm> OS user — .profile, environment variables. Key: the SID administrator user is <sysid>adm (lowercase) — e.g., s4hadm. This user owns all SAP files. Switch user: su - s4hadm; then run standard SAP commands.",
        level: "junior",
        tags: ["Linux", "directory structure", "SAP paths", "OS"],
      },
      {
        id: "os3",
        q: "What SAP kernel files are critical and how do you verify the current kernel version?",
        a: "SAP kernel components: disp+work (main ABAP dispatcher process), icman (ICM — HTTP), gwrd (gateway), msserv (message server), R3trans (transport tool), tp (transport program), sapstartsrv (Host Agent). Verify current version: (1) SM51 → select instance → Release Notes — shows kernel version. (2) OS level: /usr/sap/<SID>/SYS/exe/uc/linuxx86_64/disp+work -v. (3) AL11 → browse kernel directory. Important version info: kernel patch level (e.g., 7.77 PL 1000), Unicode support (UC), 64-bit. Kernel compatibility: check SAP Note 19466 (Product Availability Matrix) — kernel version must be compatible with database version and OS version. Upgrade path: download new kernel SAR file from support.sap.com → decompress → replace kernel binaries (as <sidadm>): (1) Stop SAP instance. (2) Back up old kernel. (3) sapcar -xvf <KERNEL.SAR> -R <kernel_dir>. (4) Start SAP. (5) SM51 to verify new version.",
        level: "junior",
        tags: ["kernel", "SM51", "version", "upgrade"],
      },
      {
        id: "os4",
        q: "How do you perform a kernel upgrade with minimal downtime?",
        a: "Kernel upgrade procedure: (1) Download: support.sap.com → SAP Support Packages & Patches → SAP Kernel → correct kernel version for your SAP release and OS. Download DB-independent + DB-specific kernel files + IGSHELPER. (2) Pre-check: verify disk space in kernel directory (~500MB needed). Backup current kernel: cp -rp <kernel_dir> <kernel_dir>.backup. (3) Stop SAP: stopsap <SID>. (4) Extract new kernel: sapcar -xvf SAPEXE_<version>.SAR -R <kernel_dir>. sapcar -xvf SAPEXEDB_<version>.SAR -R <kernel_dir>. sapcar -xvf igshelper_<version>.sar -R <kernel_dir>. (5) Set permissions: ensure <sidadm> owns all files, set executable bit if needed. (6) Start SAP: startsap <SID>. (7) Verify: SM51 → release info shows new kernel version. Note: on UNIX, kernel files are NOT SAP-installed but owned by the OS <sidadm> user — do not use rpm/dpkg. Kernel upgrade does not require a database change. Downtime = SAP instance restart time (~5 min). In scale-out environments: upgrade rolling (one instance at a time) to minimize user impact.",
        level: "mid",
        tags: ["kernel upgrade", "sapcar", "downtime", "SAPEXE"],
      },
      {
        id: "os5",
        q: "What is SAPHOSTAGENT and how is it kept current?",
        a: "SAPHOSTAGENT (SAP Host Agent) is installed separately from SAP instances and must be kept updated. Check current version: saphostexec -version. Update procedure: (1) Download new SAPHOSTAGENT.SAR from SAP Service Marketplace (SAP Support Packages → Host Agent). (2) sapcar -xvf SAPHOSTAGENT.SAR. (3) Run: ./saphostexec -upgrade. This updates the Host Agent without SAP instance restart. Update frequency: SAP recommends quarterly Host Agent updates to ensure compatibility with new SAP functionality (SolMan SMD, LaMa, cloud extensions). Separate from kernel: Host Agent updates are independent — do not require stopping SAP instances. Monitor: LMDB in SolMan shows Host Agent version per system — flag outdated agents. Common issue: SolMan SMD connectivity fails after SolMan upgrade if satellite Host Agent version is too old. Resolution: update Host Agent on satellite to compatible version per SAP Matrix note.",
        level: "mid",
        tags: ["SAPHOSTAGENT", "sapstartsrv", "version", "update"],
      },
      {
        id: "os6",
        q: "How do you use sapcontrol to manage SAP instances?",
        a: "sapcontrol is the command-line tool for managing SAP instances via the SOAP interface to Host Agent. Common commands: sapcontrol -nr <NN> -function Start: start SAP instance. sapcontrol -nr <NN> -function Stop: graceful stop. sapcontrol -nr <NN> -function RestartService: restart Host Agent process for this instance. sapcontrol -nr <NN> -function StopService: stop Host Agent for this instance. sapcontrol -nr <NN> -function GetSystemInstanceList: list all instances registered in the system. sapcontrol -nr <NN> -function GetProcessList: show all process (disp+work, gwrd, etc.) status. sapcontrol -nr <NN> -function ABAPGetWPTable: show work process table (like SM50). sapcontrol -nr <NN> -function GetAlertTree: show current CCMS alerts. Authentication: sapcontrol uses username/password (-user <user> -password <pw>) for secure mode. OS automation: sapcontrol is used in start/stop scripts, monitoring scripts, and automation tools (Ansible, SolMan, LaMa).",
        level: "mid",
        tags: ["sapcontrol", "Host Agent", "start stop", "automation"],
      },
      {
        id: "os7",
        q: "What operating system checks do you perform before an SAP upgrade?",
        a: "Pre-upgrade OS checks: (1) Disk space: /usr/sap (for staging kernel/SP files), /tmp (SUM needs temp space), /hana/data and /hana/log (for HANA upgrades). Rule: ensure at least 150% of current usage is free for upgrade staging. (2) OS version compatibility: SAP PAM (Product Availability Matrix) → confirm OS version is certified for target SAP/kernel version. (3) Package dependencies: for RHEL/SUSE — run SUM prerequisite check, which validates required OS packages (compat-sap, glibc versions). (4) Kernel parameters: verify vm.swappiness, huge pages, semaphores are still correctly set per latest SAP notes. (5) User/group: confirm sidadm user has correct UID/GID and home directory. (6) sapconf/saptune status: verify SAP OS tuning tool is active and applied (saptune solution status). (7) Time sync: NTP is critical — all SAP systems in landscape must be in sync. (8) Backup: full system backup completed and tested before upgrade. Tools: SUM automatically validates many of these in its prerequisite phase.",
        level: "senior",
        tags: ["OS checks", "pre-upgrade", "SUM", "disk space"],
      },
      {
        id: "os8",
        q: "Explain SAP's multi-process architecture on Linux — what processes run per instance?",
        a: "Per SAP ABAP instance on Linux, the following processes run: disp+work: the combined dispatcher + work processes executable — starts multiple work process children. gwrd (Gateway Reader): RFC communication handler. icman (ICM — Internet Communication Manager): HTTP/HTTPS handler. msserv (Message Server — only on ASCS instance): logon load balancing and inter-instance messaging. enserver (Enqueue Server — on ASCS): application lock server. ers (Enqueue Replication Server — on ERS instance): HA lock replication. sapstartsrv (Host Agent): management daemon for this instance. jcontrol (only for Java Add-In or Java engine instances). Check processes: sapcontrol -nr <NN> -function GetProcessList. On OS: ps -ef | grep <SID> shows all processes. The PID file location: /usr/sap/<SID>/<INSTANCE>/work/<process>.pid. Dispatcher crash recovery: disp+work restarts automatically if a work process crashes (within restart limits defined by rdisp/max_restart_count). Beyond that limit, the entire instance stops.",
        level: "mid",
        tags: ["process", "disp+work", "gwrd", "Linux"],
      },
      {
        id: "os9",
        q: "What is the significance of the SAP start/stop script and how are they managed?",
        a: "Start scripts: startsap (on UNIX/Linux) calls sapcontrol to start SAP instances in the correct order: message server + enqueue first (ASCS), then application servers, then HANA (or DB first in older sequences). Stop scripts: stopsap — gracefully stops all instances. Location: /usr/sap/<SID>/SYS/exe/uc/<platform>/ (shipped with kernel). Or system-specific: /usr/sap/<SID>/<SID>_start, /usr/sap/<SID>/<SID>_stop. Systemd integration (modern Linux): sapstartsrv registers SAP services with systemd — instances start/stop automatically on OS boot/shutdown. Configuration: /usr/sap/sapservices file lists all instances to autostart. SAP Note 1763593 covers Linux systemd integration. In clustered HA environments: never use startsap/stopsap directly — use cluster management tools (pcs/crm) to start/stop SAP resources, otherwise Pacemaker will immediately restart what you manually stopped (stonith fence).",
        level: "mid",
        tags: ["startsap", "stopsap", "systemd", "HA"],
      },
      {
        id: "os10",
        q: "How do you configure and monitor swap space for SAP?",
        a: "Swap space configuration for SAP: General rule: SAP recommends 2x RAM for swap, capped at 40-50GB maximum (additional swap beyond 40GB rarely used — large RAM servers should have most of it as real memory). Configure: mkswap /dev/sdb1 → swapon /dev/sdb1. Persistent: /etc/fstab entry. Monitor: free -m (swap total/used/free), vmstat 5 (shows swap in/out activity), SM50 (PRIV work processes using heap — sign of memory pressure). For SAP HANA: swap should be minimized (vm.swappiness = 0 per SAP Note 2031375). HANA MUST NOT swap — if HANA memory exceeds physical RAM, HANA's OOM killer terminates processes, not swaps. For classic SAP ABAP systems: adequate swap prevents OOM kills during peak memory usage. Alert: high swap usage = system running out of real memory — immediate attention needed (increase instance memory, reduce load, optimize memory parameters). Monitoring: CCMS RZ20 OS monitor includes swap space alert.",
        level: "mid",
        tags: ["swap", "memory", "Linux", "HANA"],
      },
      {
        id: "os11",
        q: "What are SAP environment variables and how are they set?",
        a: "Critical SAP environment variables set by the <sidadm> user's profile (.profile or .bash_profile): SAPSYSTEMNAME or SAPSYSTEM: SAP SID (e.g., S4H). SAPGLOBALHOST: message server hostname. INSTANCE_NAME: instance name (DVEBMGS00, D01, etc.). DIR_INSTANCE: path to instance directory (/usr/sap/<SID>/<INSTANCE>). DIR_GLOBAL: path to global directory. DBMS_TYPE: database type (HDB for HANA). Set by: SAP login scripts in /etc/profile.d/ or /usr/sap/<SID>/<INSTANCE>/env. Also set via sidenv (SAP provided script). Important: running SAP commands without proper environment → 'disp+work: command not found'. Always switch to <sidadm> first (su - <sidadm>) to load the environment. For HANA: additional variables like PATH, LD_LIBRARY_PATH, JAVA_HOME, HDB_VERSION. HANA instance: hdblcm and hdbsql require hdbadm user environment.",
        level: "junior",
        tags: ["environment variables", "sidadm", "SAPSYSTEMNAME", "Linux"],
      },
      {
        id: "os12",
        q: "How do you analyze core dump files from SAP work processes?",
        a: "Core dumps (dev_w*, dev_disp with ABAP dump or OS core): (1) Location: /usr/sap/<SID>/<INSTANCE>/work/ directory. dev_w{n} files contain ABAP trace + OS-level dump info. Core files: core or core.<pid> in /usr/sap/<SID>/<INSTANCE>/work/ or /tmp (depends on /proc/sys/kernel/core_pattern). (2) First check: SM50 → Work Process → select process → Trace → Open — reads dev_w{n} file. (3) ABAP dump: ST22 — if a work process crash generated a short dump. (4) For binary analysis: gdb (GNU Debugger) with SAP symbol files. Run: gdb /usr/sap/<SID>/SYS/exe/uc/linuxx86_64/disp+work core.<pid>. (5) Provide to SAP Support: SAP often requests: core file, dev_w{n} file, kernel version, ABAP dump, SM21 system log at crash time. (6) Prevent core dump disk exhaustion: configure core size limit (ulimit -c in /etc/security/limits.conf). Common cause: SIGSEGV in ABAP runtime due to memory corruption or kernel bug — typically requires SAP kernel patch.",
        level: "senior",
        tags: ["core dump", "dev_w", "gdb", "crash analysis"],
      },
      {
        id: "os13",
        q: "What is saptune and sapconf and how do they optimize Linux for SAP?",
        a: "sapconf (older, SUSE-only) and saptune (modern, SUSE and RHEL) automatically configure Linux kernel parameters and OS settings to meet SAP requirements. saptune solutions: saptune solution apply NETWEAVER (for ABAP NetWeaver), saptune solution apply HANA (for SAP HANA), saptune solution apply S4HANA (for S/4HANA — combines HANA + NetWeaver). What saptune configures: (1) vm.swappiness = 0 (HANA), (2) THP disabled, (3) kernel semaphores (kernel.sem), (4) I/O scheduler (none or mq-deadline for NVMe), (5) CPU frequency scaling (performance governor), (6) Network parameters (tcp keepalive), (7) Limits (ulimit for max open files, max processes). Verify: saptune solution verify HANA → shows compliant/non-compliant. Status: saptune service enable; saptune daemon start — ensures settings are reapplied on reboot. Critical: without proper saptune/sapconf settings, HANA performance and stability are degraded. SAP Note 2684254 (saptune 3.x) and 1980196 (HANA OS settings).",
        level: "mid",
        tags: ["saptune", "sapconf", "Linux", "OS tuning"],
      },
      {
        id: "os14",
        q: "How do you perform an OS-level SAP system start/stop in a Pacemaker cluster?",
        a: "In a Pacemaker-managed HA cluster, never use sapcontrol or startsap directly — Pacemaker monitors and manages SAP resource states. Correct procedure: (1) Planned maintenance: pcs node standby <node> — moves cluster resources to the other node gracefully. (2) Stop cluster on both nodes: pcs cluster stop (planned maintenance window). Start: pcs cluster start. (3) Move resource: pcs resource move <resource> <node> — manually moves a specific resource to a target node. (4) Disable resource: pcs resource disable <resource> — stops the resource and prevents restart (for maintenance). (5) Enable resource: pcs resource enable <resource>. (6) Cluster status: pcs status — shows all resources and their states. (7) STONITH fence manually: pcs stonith fence <node>. Risk: manually stopping SAP with stopsap while Pacemaker manages it → Pacemaker sees resource failure → STONITH fencing of the node — potentially causing data loss or unnecessary failover. Always coordinate OS-level SAP operations with Pacemaker cluster management.",
        level: "senior",
        tags: ["Pacemaker", "HA", "pcs", "cluster"],
      },
      {
        id: "os15",
        q: "What logs do you check first when an SAP instance fails to start?",
        a: "Startup failure investigation: (1) sapcontrol -nr <NN> -function GetProcessList — see which processes are running or failed. (2) dev_disp (dispatcher log): /usr/sap/<SID>/<INSTANCE>/work/dev_disp — first 50 lines usually show the failure reason. Common: 'Database not available', 'Profile parameter invalid', 'Port already in use'. (3) dev_ms (message server log): check if message server started successfully and registered. (4) dev_w0 (first work process log): shows ABAP initialization errors. (5) start_dvebmgs<NN>.log: the startup log created by sapcontrol/startsap — shows each step and exit code. (6) HANA trace: /usr/sap/<SID>/HDB<NN>/nameserver*.log — if HANA didn't start. (7) OS system log: /var/log/messages or journalctl -u SAP<SID>_<NN> — OS-level errors (out of memory, file system full, SELinux block). (8) File system check: df -h — disk full causes many startup failures. Checklist mnemonic: Dev logs → disk space → port conflicts → DB availability.",
        level: "junior",
        tags: ["startup", "dev_disp", "sapcontrol", "troubleshooting"],
      },
      {
        id: "os16",
        q: "How do you manage SAP system parameters dynamically without restart?",
        a: "Dynamic parameter change (no restart required): (1) RZ11 → display parameter → check 'Dynamic' attribute — if Yes, value can be changed at runtime. (2) RZ11 → 'Set Value' → enter new value → apply. This changes the in-memory parameter for all running work processes immediately. (3) AL11 or ABAP: verify parameter via GET_PARAMETER_VALUE function module. Dynamic parameters examples: rdisp/wp_no_dia (dialog WP count — add WPs without restart), login/fails_to_user_lock, icm/max_conn, abap/heap_area_dia. Static parameters require restart: em/initial_size_MB, snc/enable, database connection parameters, spool parameters. Best practice: always also update the profile file (RZ10) after a dynamic change to make it persistent across restarts — an RZ11 dynamic change is lost on next restart if the profile is not updated. Use RZ11 for emergency adjustments; RZ10 for permanent changes.",
        level: "mid",
        tags: ["RZ11", "dynamic parameter", "no restart", "RZ10"],
      },
      {
        id: "os17",
        q: "Describe the CCMS OS monitoring setup and key OS metrics monitored.",
        a: "CCMS OS monitoring via RSCOLL00 (collector job): CCMS agent collects OS metrics and stores in shared memory for RZ20 display. Key OS metrics: CPU utilization (%), swap usage (%), file system utilization per mount point, available physical memory, number of processes. Configure alerts: RZ21 → OS Monitor → CPU alert threshold (typically 90%). RZ20 → Hardware → Operating System → shows real-time and historical CPU/memory. Detailed OS monitoring: AL12 (OS-level buffer information — also shows OS statistics), OS02 (OS-level process monitor — similar to `top`). Advanced monitoring: SMD Agent on each host forwards OS metrics to SolMan Technical Monitoring — enables cross-system dashboard. For cloud: native cloud monitoring (CloudWatch, Azure Monitor) provides more granular OS metrics than CCMS — use both. Alert forwarding: CCMS alerts can trigger RFC calls to send notifications to ticketing systems via auto-reaction methods (RZ21 → Define Method).",
        level: "mid",
        tags: ["CCMS", "OS monitoring", "RSCOLL00", "RZ20"],
      },
    ],
  },
  {
    id: "abap-wb",
    title: "ABAP Workbench",
    icon: <Code className="w-5 h-5" />,
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-50",
    questions: [
      {
        id: "wb1",
        q: "What is the ABAP Dictionary (SE11) and why is it important for Basis?",
        a: "SE11 (ABAP Dictionary / DDIC) is the central repository for all data definitions in SAP: transparent tables, views, data elements, domains, structures, search helps, lock objects. Basis importance: (1) Transport content: most customizing and development transports include DDIC objects — understanding them helps debug transport failures. (2) SE14 (DB Utility): when a DDIC object changes (new field, changed data type), SE14 converts the physical database table to match the new dictionary definition. (3) Table buffering: SE11 → Technical Settings defines if a table is fully/single/generic buffered — incorrect buffering causes performance issues. (4) Index management: SE11 → Indexes — add custom database indexes to improve SQL performance. (5) Activation: changed DDIC objects must be activated (SE11 → Activate) before they're effective. Inactive DDIC objects can cause runtime errors. (6) DDIC consistency: SAP Note 159467 describes how to repair DDIC inconsistencies. Basis must know SE11/SE14 for support package failures and post-system-copy database adjustments.",
        level: "mid",
        tags: ["SE11", "DDIC", "dictionary", "SE14"],
      },
      {
        id: "wb2",
        q: "What is the difference between SE38, SE80, and SE37?",
        a: "SE38 (ABAP Editor): write, edit, and execute ABAP programs directly. For quick edits or small programs. Also used to run reports interactively. SE80 (Object Navigator/Workbench): integrated development environment — access all workbench objects (programs, function groups, classes, packages, includes) in one tree. Recommended for full development. SE37 (Function Builder): create, test, and maintain function modules and function groups. Central tool for RFC-capable function modules. Basis relevance: (1) SE37: test RFC function modules to diagnose RFC issues — enter import parameters and execute. (2) SE38: run reports manually (RSDELCLI for client delete, RSUSR003 for user password check, RSCOLL00 for CCMS). (3) SE80: explore package/transport assignment of objects. Security concern: SE38 allows arbitrary ABAP code execution — restrict authorization (S_DEVELOP object + S_PROGRAM). Never give SE38/SE80 access to non-developers in production. Authorization object for ABAP development: S_DEVELOP (DEVCLASS, OBJTYPE, OBJNAME, P_GROUP, ACTVT).",
        level: "junior",
        tags: ["SE38", "SE80", "SE37", "ABAP"],
      },
      {
        id: "wb3",
        q: "What is a package in ABAP and how does it relate to transport?",
        a: "ABAP packages organize repository objects (programs, function modules, classes, etc.) into logical units and control transport behavior. Key package types: (1) $TMP (local package): objects assigned here are NEVER transported. Developer workbench/sandbox-only objects. (2) Development packages (custom Z* or Y*): objects assigned to development packages are transportable and belong to a transport layer. (3) SAP packages (no $ prefix — delivered objects): SAP-delivered standard objects — should not be modified directly (use modification framework). Package assignment: SE80 → right-click object → Properties → Package. Transport layer: packages are assigned to a transport layer (STMS) which determines the target route. Package hierarchy: packages can have sub-packages (nesting). ABAP package check: SE21 → Package Check → verifies that inter-package usage matches the defined package interface model. Key rule: ALL custom development must be in a Z/Y package with a proper transport layer — objects in $TMP cannot be moved to production.",
        level: "mid",
        tags: ["packages", "$TMP", "transport", "SE80"],
      },
      {
        id: "wb4",
        q: "How do you debug an ABAP program as a Basis administrator?",
        a: "Basis debugging scenarios: (1) SE38 → enter program → Execute → /h in command field to activate debug mode. Or add /h before running any SAP transaction (system command /h toggles debug). (2) SE80 → right-click on program → Test → External Breakpoints. (3) Debugging another user's session: SM50 → select active WP → Option → ABAP Debugger (administrator debug — breaks into running session). Careful: this interrupts the user's work. (4) For RFC debugging: SM59 → select connection → Options → RFC Debug. (5) ABAP Debugger features (SA38 with /h): variable display, breakpoints, watchpoints, step-by-step execution, field modification. (6) Dynamic log points (SE80 → Debugger Log): non-intrusive — logs variable values without stopping execution. Basis use cases: diagnose failed background jobs, investigate RFC call failures, understand why a post-processing step in SCCL or transport is failing. Never leave breakpoints active in production — they halt work processes.",
        level: "mid",
        tags: ["ABAP debugger", "SE38", "SM50", "debugging"],
      },
      {
        id: "wb5",
        q: "What is the modification concept in SAP and why must modifications be recorded?",
        a: "SAP standard code (repository objects in SAP packages) should not be directly modified — any change is a 'modification'. Why dangerous: SAP delivers support packages and upgrades that overwrite standard code; your modification is lost unless tracked and re-applied. Modification management: (1) SE03 → Modification Browser: shows all modifications to SAP standard objects. (2) Modification Assistant (SE03/SE38): records changes to SAP standard objects, making re-synchronization with future SP upgrades possible. (3) SPDD/SPAU: run during support package import. SPDD: Dictionary object conflicts between SP changes and customer modifications — resolve by adjusting customer modifications. SPAU: repository object conflicts — same resolution for ABAP code. Alternatives to modifications: (1) BAdI (Business Add-Ins): SAP-defined enhancement points — implement without modifying SAP code. (2) Enhancement Framework: user exits, substitutions, enhancements. (3) Implicit/Explicit enhancement points. Best practice: NEVER modify SAP standard without exhausting enhancement options. Every modification increases total cost of ownership.",
        level: "senior",
        tags: ["modifications", "SE03", "SPDD", "SPAU"],
      },
      {
        id: "wb6",
        q: "What is the SAP Code Inspector (SCI) and how does Basis use it?",
        a: "SCI (Code Inspector — transaction SCI or SE38 → Checks) analyzes ABAP source code for: performance issues (SELECT * without WHERE, nested loops on DB), syntax errors, security vulnerabilities (SQL injection, hard-coded passwords), naming convention violations, S/4HANA compatibility issues. Basis involvement: (1) Pre-upgrade: run SCI/ATC on all custom code to identify issues before system conversion. (2) Transport gate: configure ATC (ABAP Test Cockpit) to check code automatically when a transport is released (fails release if critical findings). (3) Security audit: SCI security checks find hardcoded passwords, unrestricted authority-checks. (4) ABAP profiling: SCI performance checks identify inefficient patterns that cause performance issues. (5) Mass analysis: SE38 → SCI → mass run across entire custom code namespace (Z*/Y*). Reports: SCI_RPT_RESULTS_DETAILED. Integration: in Cloud ALM or SolMan → central ATC server runs SCI checks across all connected systems and aggregates results in one dashboard.",
        level: "senior",
        tags: ["SCI", "ATC", "code quality", "ABAP"],
      },
      {
        id: "wb7",
        q: "What are BAdIs and Enhancement Points and why are they better than modifications?",
        a: "BAdI (Business Add-In): SAP-defined extension point in standard code. Customer creates an implementation class. SAP code calls the BAdI at a specific point. Upgrades do NOT overwrite customer implementations — SAP only changes the calling point, not customer code. Types: Classic BAdI (older): SE18 (find/display BAdI definition), SE19 (create implementation). New BAdI (ABAP OO, recommended for S/4HANA): uses enhancement spots. Enhancement Spots (SE18): grouping of enhancement points. Explicit Enhancement Points: SAP explicitly marked a code location for enhancement. Implicit Enhancement Points: at beginning/end of every function module, method, form routine — available without SAP explicitly marking them. User Exits (older mechanism): function module-based exits (EXIT_* naming). Customer Exits: SE18 SMOD/CMOD. BADI vs Modification: BAdI implementations are never lost during upgrades. Modifications require SPAU reprocessing after every SP/upgrade. Basis role: document all BAdIs and enhancements in the landscape for post-upgrade validation. SPAU only shows modifications — BAdIs survive upgrades without appearing in SPAU.",
        level: "mid",
        tags: ["BAdI", "enhancement", "SE18", "SE19"],
      },
      {
        id: "wb8",
        q: "What is the ABAP Workbench Organizer and how do you resolve object locks?",
        a: "Workbench Organizer (SE09 → Extras → Object Locks): an ABAP object that has been included in an unreleased transport request is locked — other developers cannot include it in a different request. Object lock issues: (1) Developer A has object locked in request A. Developer B tries to include same object in request B → 'Object locked by user A in request DEVK9XXXXX'. (2) SE03 → Unlock Objects (requires admin authorization) — releases the lock from the request, allowing the object to be included elsewhere. (3) SE01 → display request — check who holds the lock and what objects are locked. Resolution process: (1) Contact Developer A — should they release their request or merge the needed changes into one request? (2) If request was abandoned/developer left: SE03 → Unlock Objects. (3) In gCTS: concurrent edits to the same object are handled via Git conflict resolution — the developer must resolve the conflict in their branch. Lock management authorization: S_TRANSPRT object with values for unlock. Admin unlock should be an exception, not routine — suggests process issues.",
        level: "mid",
        tags: ["SE09", "object lock", "SE03", "workbench"],
      },
      {
        id: "wb9",
        q: "What is the ABAP runtime analysis (SE30 / ST12) and how do you use it?",
        a: "SE30 (ABAP Runtime Analysis — Runtime Measurement): traces CPU time, DB calls, and memory usage per ABAP statement for a specific program execution. Process: SE30 → Settings → select trace options (time measurement, SQL calls) → Start Measurement → execute program → Evaluate. Results: ranked by total CPU time — identifies which ABAP form routine or method consumes the most time. ST12 (ABAP Trace): modern combined ABAP + SQL trace tool. Provides call stack, table-level SQL breakdown, and graphical flame chart. ST12 is preferred for comprehensive analysis. When to use: user reports a specific transaction is slow → SE30/ST12 to pinpoint the exact ABAP routine/SQL. Complement to ST05 (SQL trace only) — ST12 also captures ABAP overhead. Key metrics: Net time (time excluding called routines) vs Gross time (total including called). High DB time = SQL optimization needed. High ABAP CPU without DB = ABAP algorithm issue (loops, sorting). For S/4HANA: /SDF/SMON and /SDF/SQLM provide push-down optimization analysis for HANA-specific bottlenecks.",
        level: "mid",
        tags: ["SE30", "ST12", "ABAP trace", "performance"],
      },
      {
        id: "wb10",
        q: "What is ABAP Object-Oriented development and why is it important for modern Basis tasks?",
        a: "ABAP OO (Object-Oriented ABAP) uses classes (SE24), interfaces, and inheritance. Relevance for Basis: (1) New BAdI framework: S/4HANA BAdIs use OO class-based implementations (not older procedure-based). Basis must understand OO to navigate implementations and assess transport contents. (2) ABAP Unit Tests: test classes created with ABAP Unit Framework — Basis should configure ATC to run these tests in the CI/CD pipeline. (3) Exception classes: modern ABAP raises exceptions (CX_* classes) instead of return codes — relevant for debugging RFC failures (exceptions not caught appear in SM21). (4) Shared Memory Objects: OO-based shared memory access (classes AS_*). (5) Cloud ABAP (BTP ABAP Environment): tier-1 restricted ABAP — only OO, no direct database access, no legacy syntax. Basis for BTP ABAP: configure ABAP Environment service in BTP, manage repository connections, monitor via administration UI. SE24: class builder transaction. SFW5: switch framework that controls which BAdI implementations are active based on business function switches.",
        level: "senior",
        tags: ["ABAP OO", "SE24", "BAdI", "BTP"],
      },
      {
        id: "wb11",
        q: "How do you find which transport contains a specific ABAP object?",
        a: "Finding transports for a specific object: (1) SE03 → Search for Objects in Requests/Tasks → enter object type (PROG, FUGR, DTEL, etc.) and name → search across all transport requests. (2) SOBJ (old SAP object catalog). (3) SE09/SE10 → filter by object name. (4) OS command: grep -r '<object_name>' /usr/sap/trans/data/ — searches transport data files (very broad, use cautiously). (5) STMS → Transport → Find Object in Queue — checks current import queues for the object. Why important: (1) Determine which transport introduced a bug. (2) Find transport that changed a critical program before a production issue. (3) Identify circular dependencies between transport requests. (4) Confirm a specific customizing change is included in a request before importing to production. In gCTS: git log --all -- <path_to_object> shows complete Git history for a specific object including all branches and commits — far more powerful than STMS-based search.",
        level: "mid",
        tags: ["SE03", "transport", "object search", "STMS"],
      },
      {
        id: "wb12",
        q: "What is the SAP Package Interface (SE21) concept and why does it matter?",
        a: "SAP Package Interface (SE21 — Workbench: Package Builder) enforces modular architecture: a package must explicitly export its objects through a package interface for other packages to use them. Without a package interface, objects are package-private. Why it matters for Basis: (1) Transport layering: package interfaces define allowed usage between development components — violating interfaces generates ATC findings (package check violations). (2) Upgrade quality: tightly-coupled packages (using private objects of other packages) break when SAP restructures internal architecture during upgrades. (3) S/4HANA compatibility: SAP's Clean Core initiative requires that all custom code access SAP functionality only through released APIs (BAPIs, CDS Views, BAdIs) — not through internal packages. (4) Clean Core assessment: ABAP Cloud development in BTP ABAP Environment enforces package interfaces strictly — only released APIs can be called. Basis role: ensure ATC package check variant is enabled, report violations to development team, track remediation progress before system conversion.",
        level: "senior",
        tags: ["SE21", "package interface", "clean core", "S/4HANA"],
      },
    ],
  },
];


const LEVEL_COLORS: Record<string, string> = {
  junior: "bg-emerald-100 text-emerald-700",
  mid: "bg-blue-100 text-blue-700",
  senior: "bg-violet-100 text-violet-700",
};

const LEVEL_BORDER: Record<string, string> = {
  junior: "#22c55e",
  mid: "#f59e0b",
  senior: "#ef4444",
};

const ALL_CATEGORIES = [...CATEGORIES, ...EXAM_PACK_2026];

type Mode = "study" | "config" | "quiz" | "results";

export default function InterviewPrep() {
  const [mode, setMode] = useState<Mode>("study");

  // study mode
  const [activeCat, setActiveCat] = useState<string>("system-admin");
  const [panelQ, setPanelQ] = useState<{ qa: QA; catTitle: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // exam config
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [examCount, setExamCount] = useState<number>(20);
  const [examDiff, setExamDiff] = useState<string>("all");

  // exam state
  const [examQuestions, setExamQuestions] = useState<QA[]>([]);
  const [examIdx, setExamIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [grades, setGrades] = useState<Record<string, "got" | "review">>({});
  const [mcOpts, setMcOpts] = useState<Record<string, Array<{ text: string; correct: boolean }>>>({});
  const [mcSelected, setMcSelected] = useState<Record<string, number>>({});

  // progress tracking (persisted)
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("bp_interview_completed");
      return saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  const totalQuestions = useMemo(() => ALL_CATEGORIES.reduce((a, c) => a + c.questions.length, 0), []);
  const studyCat = ALL_CATEGORIES.find((c) => c.id === activeCat)!;

  const studyQuestions = useMemo(() => {
    let qs = studyCat.questions;
    if (levelFilter !== "all") qs = qs.filter((q) => q.level === levelFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      qs = qs.filter((item) => item.q.toLowerCase().includes(s) || item.a.toLowerCase().includes(s) || item.tags.some((t) => t.includes(s)));
    }
    return qs;
  }, [activeCat, studyCat, levelFilter, search]);

  function toggleCompleted(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("bp_interview_completed", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  function copyAnswer(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });
  }

  function toggleCat(id: string) {
    setSelectedCats((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function truncateForMC(text: string, maxLen = 140): string {
    const dot = text.indexOf('. ');
    const cut = dot > 30 && dot < maxLen ? dot + 1 : Math.min(text.length, maxLen);
    return text.length <= cut ? text : text.slice(0, cut) + (cut < text.length ? "…" : "");
  }

  function startExam() {
    let pool = ALL_CATEGORIES.filter((c) => selectedCats.includes(c.id)).flatMap((c) => c.questions);
    if (examDiff !== "all") pool = pool.filter((q) => q.level === examDiff);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = examCount === 0 ? shuffled : shuffled.slice(0, examCount);

    const optionsMap: Record<string, Array<{ text: string; correct: boolean }>> = {};
    selected.forEach((q, i) => {
      const others = selected.filter((_, j) => j !== i);
      const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
      optionsMap[q.id] = [
        { text: truncateForMC(q.a), correct: true },
        ...distractors.map((d) => ({ text: truncateForMC(d.a), correct: false })),
      ].sort(() => Math.random() - 0.5);
    });

    setExamQuestions(selected);
    setMcOpts(optionsMap);
    setMcSelected({});
    setExamIdx(0);
    setRevealed(false);
    setGrades({});
    setMode("quiz");
  }

  function selectMcOption(optionIdx: number) {
    const q = examQuestions[examIdx];
    if (!q || mcSelected[q.id] !== undefined) return;
    const opt = (mcOpts[q.id] || [])[optionIdx];
    if (!opt) return;
    setMcSelected((prev) => ({ ...prev, [q.id]: optionIdx }));
    setGrades((prev) => ({ ...prev, [q.id]: opt.correct ? "got" : "review" }));
  }

  function advanceQuestion() {
    const next = examIdx + 1;
    if (next >= examQuestions.length) { setMode("results"); return; }
    setExamIdx(next);
    setRevealed(false);
  }

  const gradeQuestion = useCallback((grade: "got" | "review") => {
    setGrades((prev) => {
      const qa = examQuestions[examIdx];
      return { ...prev, [qa.id]: grade };
    });
    setExamIdx((idx) => {
      if (idx + 1 >= examQuestions.length) { setMode("results"); return idx; }
      setRevealed(false);
      return idx + 1;
    });
  }, [examIdx, examQuestions]);

  const gotCount = Object.values(grades).filter((v) => v === "got").length;
  const reviewCount = Object.values(grades).filter((v) => v === "review").length;
  const score = examQuestions.length > 0 ? Math.round((gotCount / examQuestions.length) * 100) : 0;
  const currentQ = examQuestions[examIdx];

  // STUDY MODE
  if (mode === "study") return (
    <>
    <div className="space-y-5 max-w-5xl">
      <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <GraduationCap className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Interview Prep 2026</span>
            </div>
            <h1 className="text-2xl font-extrabold">SAP Basis Interview Mastery</h1>
            <p className="text-sm opacity-80 mt-1">{totalQuestions}+ expert Q&As across {ALL_CATEGORIES.length} categories — including 2026 Scenario Pack and Killer Q&As</p>
          </div>
          <button
            onClick={() => { setSelectedCats([]); setMode("config"); }}
            className="flex-shrink-0 flex items-center gap-2 bg-white text-rose-600 font-bold px-5 py-2.5 rounded-xl hover:bg-rose-50 transition-all shadow-lg text-sm">
            <Play className="w-4 h-4" />
            Start Exam Mode
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Total Questions", value: String(totalQuestions) + "+", icon: <ListChecks className="w-4 h-4" /> },
            { label: "Categories", value: String(ALL_CATEGORIES.length), icon: <BookOpen className="w-4 h-4" /> },
            { label: "2026 Pack", value: "103 New", icon: <Zap className="w-4 h-4" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <span className="opacity-70">{s.icon}</span>
              <div>
                <div className="text-sm font-extrabold">{s.value}</div>
                <div className="text-[10px] opacity-70">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm font-semibold mb-1.5" style={{ opacity: 0.9 }}>
            <span>Your Progress: {completed.size} / {totalQuestions} completed</span>
            <span style={{ opacity: 0.7 }}>{totalQuestions > 0 ? Math.round((completed.size / totalQuestions) * 100) : 0}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${totalQuestions > 0 ? (completed.size / totalQuestions) * 100 : 0}%`, background: "rgba(255,255,255,0.9)" }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level:</span>
        {(["all", "junior", "mid", "senior"] as const).map((l) => (
          <button key={l} onClick={() => setLevelFilter(l)}
            className={`text-sm font-medium px-3 py-1 rounded-full border transition-all ${levelFilter === l ? (l === "all" ? "bg-gray-800 text-white border-gray-800" : LEVEL_COLORS[l] + " border-current") : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
            {l === "all" ? "All Levels" : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..."
            className="w-full pl-8 pr-7 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="hidden md:flex flex-col gap-0.5 w-52 flex-shrink-0">
          {ALL_CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setPanelQ(null); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all ${activeCat === c.id ? "bg-[#0070F2]/10 text-[#0070F2] font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>
              <span className={activeCat === c.id ? "text-[#0070F2]" : "text-gray-400"}>
                {React.cloneElement(c.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
              </span>
              <span className="flex-1 truncate text-xs">{c.title}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{c.questions.length}</span>
            </button>
          ))}
          <div className="mt-2 px-3 py-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="text-xs font-bold text-gray-400">Total</div>
            <div className="text-2xl font-extrabold text-[#0070F2]">{totalQuestions}</div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className={`flex items-center gap-2 p-3 rounded-xl ${studyCat.bg}`}>
            <span className={studyCat.color}>{React.cloneElement(studyCat.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}</span>
            <span className={`font-bold text-sm ${studyCat.color}`}>{studyCat.title}</span>
            <span className="text-xs text-gray-400 ml-auto">{studyQuestions.length}{studyQuestions.length !== studyCat.questions.length ? ` of ${studyCat.questions.length}` : ""} questions</span>
          </div>
          {studyQuestions.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No questions match your filters</div>
          ) : studyQuestions.map((qa) => {
            const isDone = completed.has(qa.id);
            return (
              <div
                key={qa.id}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-colors"
                style={{ borderLeft: `4px solid ${LEVEL_BORDER[qa.level] || "#e5e7eb"}`, background: isDone ? "#f0fdf4" : undefined, cursor: "pointer" }}
                onMouseEnter={(e) => { if (!isDone) (e.currentTarget as HTMLDivElement).style.background = "#eff6ff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = isDone ? "#f0fdf4" : ""; }}
              >
                <div className="w-full flex items-start gap-3 p-4 text-left">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleCompleted(qa.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer accent-blue-600"
                    title={isDone ? "Mark as incomplete" : "Mark as completed"}
                  />
                  <button className="flex-1 flex items-start gap-3 text-left" onClick={() => setPanelQ({ qa, catTitle: studyCat.title })}>
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className={`text-sm font-semibold leading-snug ${isDone ? "text-gray-400 line-through" : "text-gray-900"}`}>{qa.q}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[qa.level] || "bg-gray-100 text-gray-600"}`}>
                          {qa.level.charAt(0).toUpperCase() + qa.level.slice(1)}
                        </span>
                        {qa.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Slide-out question panel */}
    {panelQ && (
      <div
        className="fixed inset-0 z-50 flex"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={() => setPanelQ(null)}
      >
        <div className="flex-1" />
        <div
          className="bg-white shadow-2xl flex flex-col h-full"
          style={{ width: "100%", maxWidth: "460px", minWidth: "320px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-100 gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-snug">{panelQ.qa.q}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[panelQ.qa.level] || "bg-gray-100 text-gray-600"}`}>
                  {panelQ.qa.level.charAt(0).toUpperCase() + panelQ.qa.level.slice(1)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{panelQ.catTitle}</span>
              </div>
            </div>
            <button
              onClick={() => setPanelQ(null)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tags */}
          {panelQ.qa.tags.length > 0 && (
            <div className="px-5 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
              {panelQ.qa.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{tag}</span>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Expert Answer</div>
              <p className="text-sm text-gray-700 leading-relaxed" style={{ whiteSpace: "pre-line" }}>{panelQ.qa.a}</p>
            </div>
            {panelQ.qa.follow_ups && panelQ.qa.follow_ups.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Follow-up Questions</div>
                <ul className="space-y-2">
                  {panelQ.qa.follow_ups.map((fq) => (
                    <li key={fq} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                      <Zap className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />{fq}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={() => { toggleCompleted(panelQ.qa.id); setPanelQ(null); }}
              className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: completed.has(panelQ.qa.id) ? "#f0fdf4" : "#059669",
                color: completed.has(panelQ.qa.id) ? "#047857" : "#ffffff",
                border: completed.has(panelQ.qa.id) ? "2px solid #a7f3d0" : "2px solid transparent",
              }}
            >
              <Check className="w-4 h-4" />
              {completed.has(panelQ.qa.id) ? "Marked as Complete ✓" : "Mark as Complete"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );

  // EXAM CONFIG
  if (mode === "config") return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setMode("study")} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
        <div>
          <h2 className="font-extrabold text-xl text-gray-900">Configure Your Exam</h2>
          <p className="text-sm text-gray-500">Select categories, question count, and difficulty</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-rose-500" /> Select Categories
          <button onClick={() => setSelectedCats(ALL_CATEGORIES.map(c => c.id))} className="ml-auto text-xs text-blue-600 hover:underline">Select All</button>
          <button onClick={() => setSelectedCats([])} className="text-xs text-gray-400 hover:underline">Clear</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ALL_CATEGORIES.map((c) => {
            const sel = selectedCats.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggleCat(c.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all text-left ${sel ? "border-[#0070F2] bg-[#0070F2]/5 text-[#0070F2] font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${sel ? "bg-[#0070F2] border-[#0070F2]" : "border-gray-300"}`}>
                  {sel && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="flex-1 truncate text-xs">{c.title}</span>
                <span className="text-xs text-gray-400">{c.questions.length}</span>
              </button>
            );
          })}
        </div>
        {selectedCats.length === 0 && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
            Select at least one category above to enable the Start Exam button.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="font-semibold text-sm text-gray-700 flex items-center gap-2"><Shuffle className="w-4 h-4 text-purple-500" /> Questions</div>
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 30, 50, 75, 0].map((n) => (
              <button key={n} onClick={() => setExamCount(n)}
                className={`py-2 rounded-xl text-sm font-semibold border transition-all ${examCount === n ? "bg-purple-600 text-white border-purple-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {n === 0 ? "All" : n}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="font-semibold text-sm text-gray-700 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Difficulty</div>
          <div className="space-y-1.5">
            {["all", "junior", "mid", "senior"].map((d) => (
              <button key={d} onClick={() => setExamDiff(d)}
                className={`w-full py-2 rounded-xl text-sm font-semibold border transition-all ${examDiff === d ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {d === "all" ? "All Levels" : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={startExam} disabled={selectedCats.length === 0}
        className="w-full py-3.5 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: selectedCats.length === 0 ? "#d1d5db" : "linear-gradient(135deg, #DC2626 0%, #EA580C 100%)" }}>
        <Play className="w-5 h-5" />
        Start Exam ({selectedCats.reduce((a, id) => { const c = ALL_CATEGORIES.find(x => x.id === id); return a + (c?.questions.length || 0); }, 0)} questions available)
      </button>
    </div>
  );

  // EXAM QUIZ
  if (mode === "quiz" && currentQ) {
    const progress = (examIdx / examQuestions.length) * 100;
    const qCat = ALL_CATEGORIES.find((c) => c.questions.some((q) => q.id === currentQ.id));
    const opts = mcOpts[currentQ.id] || [];
    const selIdx = mcSelected[currentQ.id] !== undefined ? mcSelected[currentQ.id] : -1;
    const hasAnsweredMC = selIdx >= 0;
    const LABELS = ["A", "B", "C", "D"];

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium">Question <span className="font-extrabold text-gray-900">{examIdx + 1}</span> / {examQuestions.length}</div>
          <button onClick={() => setMode("study")} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><X className="w-3.5 h-3.5" />Exit</button>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-rose-500 to-orange-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {qCat && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${qCat.bg} ${qCat.color}`}>{qCat.title}</span>}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLORS[currentQ.level] || "bg-gray-100 text-gray-600"}`}>
              {currentQ.level.charAt(0).toUpperCase() + currentQ.level.slice(1)}
            </span>
            {currentQ.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{t}</span>
            ))}
          </div>

          <div className="text-base font-bold text-gray-900 leading-snug">{currentQ.q}</div>

          {revealed ? (
            /* Reveal path — full answer + manual grading */
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Expert Answer</div>
                <p className="text-sm text-gray-800 leading-relaxed">{currentQ.a}</p>
              </div>
              {!grades[currentQ.id] ? (
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">How did you do?</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => gradeQuestion("got")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow">
                      <CheckCircle2 className="w-5 h-5" /> Got It!
                    </button>
                    <button onClick={() => gradeQuestion("review")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow">
                      <XCircle className="w-5 h-5" /> Need Review
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            /* Multiple choice path */
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Choose the best answer</div>
              <div className="space-y-2">
                {opts.map((opt, i) => {
                  let bg = "bg-white border-gray-200 hover:border-gray-300 hover:bg-[#f8faff] text-gray-700";
                  if (hasAnsweredMC) {
                    if (opt.correct) bg = "bg-emerald-50 border-emerald-400 text-emerald-800";
                    else if (i === selIdx) bg = "bg-rose-50 border-rose-400 text-rose-800";
                    else bg = "bg-gray-50 border-gray-200 text-gray-400";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => selectMcOption(i)}
                      disabled={hasAnsweredMC}
                      className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all ${bg} disabled:cursor-default`}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        hasAnsweredMC && opt.correct ? "bg-emerald-500 text-white" :
                        hasAnsweredMC && i === selIdx && !opt.correct ? "bg-rose-500 text-white" :
                        "bg-gray-100 text-gray-600"
                      }`}>{LABELS[i]}</span>
                      <span className="flex-1 leading-snug">{opt.text}</span>
                      {hasAnsweredMC && opt.correct && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                      {hasAnsweredMC && i === selIdx && !opt.correct && <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {hasAnsweredMC && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${opts[selIdx]?.correct ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                  {opts[selIdx]?.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {opts[selIdx]?.correct ? "Correct! Well done." : "Incorrect — the correct answer is highlighted in green above."}
                </div>
              )}

              {!hasAnsweredMC && (
                <div className="text-center pt-1">
                  <button
                    onClick={() => setRevealed(true)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
                  >
                    Or, reveal the full expert answer instead
                  </button>
                </div>
              )}

              {hasAnsweredMC && (
                <button
                  onClick={advanceQuestion}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md"
                  style={{ background: "linear-gradient(135deg,#DC2626,#EA580C)" }}
                >
                  {examIdx + 1 >= examQuestions.length ? "View Results" : "Next Question →"}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-1 flex-wrap">
          {examQuestions.map((q, i) => {
            const g = grades[q.id];
            return <div key={i} className={`h-2 rounded-full flex-shrink-0 transition-colors ${i < examIdx ? (g === "got" ? "bg-emerald-400" : "bg-rose-400") : i === examIdx ? "bg-blue-500" : "bg-gray-200"}`} style={{ width: Math.max(8, Math.min(24, Math.floor(240 / examQuestions.length))) + "px" }} />;
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              const prev = Math.max(0, examIdx - 1);
              setExamIdx(prev);
              setRevealed(!!grades[examQuestions[prev]?.id]);
            }}
            disabled={examIdx === 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              const next = Math.min(examQuestions.length - 1, examIdx + 1);
              setExamIdx(next);
              setRevealed(!!grades[examQuestions[next]?.id]);
            }}
            disabled={examIdx === examQuestions.length - 1}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  // RESULTS
  if (mode === "results") {
    const missed = examQuestions.filter((q) => grades[q.id] === "review");
    const gradeBg = score >= 80 ? "from-emerald-500 to-teal-500" : score >= 60 ? "from-amber-500 to-orange-500" : "from-rose-500 to-red-600";
    const gradeLabel = score >= 80 ? "Excellent Work!" : score >= 60 ? "Good Progress" : "Keep Practicing";
    const gradeColor = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-rose-600";
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className={`bg-gradient-to-r ${gradeBg} rounded-2xl p-6 text-white text-center`}>
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <div className="text-5xl font-extrabold">{score}%</div>
          <div className="text-lg font-bold mt-1 opacity-90">{gradeLabel}</div>
          <p className="text-sm opacity-75 mt-1">{gotCount} correct out of {examQuestions.length} questions</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Correct", value: String(gotCount), color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Review", value: String(reviewCount), color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
            { label: "Score", value: score + "%", color: gradeColor, bg: "bg-gray-50", border: "border-gray-200" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {missed.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <div className="font-bold text-gray-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" /> Questions to Review ({missed.length})
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {missed.map((q) => (
                <div key={q.id} className="border border-rose-100 bg-rose-50/50 rounded-xl p-3 space-y-1.5">
                  <div className="text-sm font-semibold text-gray-900">{q.q}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{q.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => startExam()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all shadow"
            style={{ background: "linear-gradient(135deg,#DC2626,#EA580C)" }}>
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
          <button onClick={() => setMode("config")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-gray-300">
            <Settings className="w-4 h-4" /> New Config
          </button>
          <button onClick={() => setMode("study")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-gray-300">
            <BookOpen className="w-4 h-4" /> Study Mode
          </button>
        </div>
      </div>
    );
  }

  return null;
}
