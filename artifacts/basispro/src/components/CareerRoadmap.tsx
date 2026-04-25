import React, { useState, useMemo } from "react";
import {
  CheckCircle2, Circle, ChevronRight, Settings, Database, Cloud, Shield, Code,
  BookOpen, TrendingUp, Zap, Award, Server, AlertTriangle, Wifi, Monitor,
  Activity, Target, BarChart2, Layers, ArrowRight, Info, GitMerge, Cpu,
  FileText, MapPin, RefreshCw, Globe,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SAPCert { code: string; title: string; level: string; }
interface CloudCert { vendor: "AWS" | "Azure" | "GCP"; code: string; title: string; }
interface ChecklistItem { id: string; label: string; }

interface LearningNode {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: "done" | "active" | "upcoming" | "optional";
  overview: string;
  skills: string[];
  tools: string[];
  realTasks: string[];
  sapCerts: SAPCert[];
  cloudCerts: CloudCert[];
  relatedGuides: string[];
  relatedTroubleshoot: string[];
  nextAction: string;
  checklist: ChecklistItem[];
}

interface IncidentNode {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  icon: React.ReactNode;
  description: string;
  steps: string[];
  tools: string[];
  tips: string[];
  relatedSAPCerts: string[];
  checklist: ChecklistItem[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const LEARNING_NODES: LearningNode[] = [
  {
    id: "foundation",
    title: "Foundation",
    subtitle: "0–1 year",
    icon: <BookOpen className="w-4 h-4" />,
    status: "done",
    overview: "Core SAP architecture, Basis toolset, and daily operational tasks. The baseline every SAP professional must command.",
    skills: ["SAP NetWeaver architecture (ABAP/Java stack)", "Transport management (STMS / SE09 / SE10)", "Background job administration (SM36 / SM37)", "User & role administration (SU01 / PFCG)", "System log analysis (SM21 / ST22)", "Spool & output management (SP01 / SPAD)", "Profile parameters (RZ10 / RZ11)"],
    tools: ["SAP GUI", "STMS", "SM36/SM37", "SU01/PFCG", "SM21/ST22", "SP01/SPAD", "RZ10/RZ11"],
    realTasks: ["Manage daily transport orders across DEV/QAS/PRD", "Monitor and restart failed background jobs", "Create and lock user accounts, assign roles", "Investigate ABAP short dumps (ST22) and system errors", "Adjust profile parameters and restart instances"],
    sapCerts: [{ code: "C_TADM_22", title: "SAP Certified Associate – System Administration (SAP S/4HANA)", level: "Associate" }],
    cloudCerts: [],
    relatedGuides: ["SAP NetWeaver Architecture", "Transport Management with STMS", "Background Job Administration"],
    relatedTroubleshoot: ["System Login Issues", "Transport Errors", "Background Job Failures"],
    nextAction: "Complete C_TADM_22 prep and begin HANA Administration learning path",
    checklist: [
      { id: "f1", label: "Can explain ABAP/Java stack architecture" },
      { id: "f2", label: "Can manage transport orders end-to-end with STMS" },
      { id: "f3", label: "Can schedule and monitor background jobs via SM36/SM37" },
      { id: "f4", label: "Can create users and assign roles using SU01/PFCG" },
      { id: "f5", label: "Can analyze ABAP short dumps in ST22" },
      { id: "f6", label: "Can adjust instance profile parameters with RZ10" },
    ],
  },
  {
    id: "core-basis",
    title: "Core Basis Administration",
    subtitle: "1–3 years",
    icon: <Settings className="w-4 h-4" />,
    status: "active",
    overview: "Expand operational depth. Own the workprocess landscape, CCMS monitoring, support packages, and connectivity stack.",
    skills: ["Client administration (SCC4 / SCCL / SCC3)", "Work process management (SM50 / SM66)", "CCMS monitoring framework (RZ20 / AL01)", "Support package & add-on management (SPAM / SAINT)", "RFC / SM59 connectivity management", "SICF HTTP service management", "SMICM / ICM troubleshooting", "STRUST SSL certificate management"],
    tools: ["SM50/SM66", "RZ20/AL01", "SPAM/SAINT", "SM59", "SICF", "SMICM", "STRUST", "DBACOCKPIT", "ST04/ST06"],
    realTasks: ["Apply support packages and EHP upgrades in test landscape", "Monitor work process saturation and tune during peak load", "Configure RFC destinations and troubleshoot connectivity failures", "Set up CCMS auto-reactions for threshold breaches", "Manage SSL certificates and maintain ICM configuration"],
    sapCerts: [{ code: "C_TADM_22", title: "SAP Certified Associate – System Administration (SAP S/4HANA)", level: "Associate" }],
    cloudCerts: [],
    relatedGuides: ["CCMS Monitoring Setup", "Support Package Administration", "RFC & Connectivity Management"],
    relatedTroubleshoot: ["RFC Connection Failures", "Work Process Shortages", "ICM / SICF Service Issues"],
    nextAction: "Begin HANA DBA study and target C_DBADM_2601 certification",
    checklist: [
      { id: "cb1", label: "Can monitor SM50/SM66 work processes during incidents" },
      { id: "cb2", label: "Can apply support packages with SPAM/SAINT" },
      { id: "cb3", label: "Can configure and troubleshoot RFC destinations (SM59)" },
      { id: "cb4", label: "Can set up CCMS threshold monitoring (RZ20/AL01)" },
      { id: "cb5", label: "Can manage HTTP services with SICF and SMICM" },
      { id: "cb6", label: "Can maintain SSL certificates in STRUST" },
    ],
  },
  {
    id: "database",
    title: "Database Administration",
    subtitle: "2–4 years",
    icon: <Database className="w-4 h-4" />,
    status: "upcoming",
    overview: "Deep expertise in SAP HANA and at least one AnyDB platform. Own backup/recovery, replication, and performance tuning.",
    skills: ["SAP HANA architecture (index server, name server, services)", "HANA System Replication (HSR — SYNC / ASYNC / SYNCMEM)", "HANA backup & recovery (HANA Studio / hdbsql / Backint)", "HANA tenant DB management (MDC)", "Oracle brbackup / brrestore / BRTOOLS", "Database performance analysis (ST04 / DBACOCKPIT)", "HANA memory management & OOM incident handling", "MaxDB administration basics"],
    tools: ["HANA Studio", "SAP HANA Cockpit", "hdbsql", "DBACOCKPIT", "brbackup/brrestore", "ST04", "hdbnsutil"],
    realTasks: ["Configure and test HANA System Replication (HSR)", "Perform HANA backups and practice restore procedures", "Analyze HANA memory allocation and identify expensive statements", "Manage HANA tenant databases in MDC configuration", "Handle HANA OOM events and diagnose index server crashes"],
    sapCerts: [{ code: "C_DBADM_2601", title: "SAP Certified Associate – Database Administrator (HANA)", level: "Associate" }],
    cloudCerts: [],
    relatedGuides: ["HANA Administration", "HANA Backup & Recovery", "HANA System Replication"],
    relatedTroubleshoot: ["HANA Performance Issues", "HANA OOM Events", "Database Connectivity Failures"],
    nextAction: "Schedule C_DBADM_2601 exam (system-based assessment, 4 attempts/12 months)",
    checklist: [
      { id: "db1", label: "Can explain HANA architecture (index server, name server, XSEngine)" },
      { id: "db2", label: "Can configure HANA System Replication (HSR)" },
      { id: "db3", label: "Can perform and restore HANA backups using hdbsql / HANA Studio" },
      { id: "db4", label: "Can analyze HANA memory usage and identify expensive SQL statements" },
      { id: "db5", label: "Can manage HANA MDC tenant databases" },
      { id: "db6", label: "Can use DBACOCKPIT for Oracle / HANA performance monitoring" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Hyperscaler",
    subtitle: "3–5 years",
    icon: <Cloud className="w-4 h-4" />,
    status: "upcoming",
    overview: "Run SAP workloads on AWS, Azure, and GCP. Understand RISE with SAP, certified cloud infrastructure, and IaC tooling.",
    skills: ["SAP on AWS (EC2 instance sizing, EBS, ENI, HSR HA over Overlay IP)", "SAP on Azure (M-series VMs, ANF, ACSS, Azure Load Balancer for HA)", "SAP on GCP (M3 VMs, Filestore, SCC, GKE for BTP)", "RISE with SAP architecture & ECS", "Cloud Connector setup and HA configuration", "IaC for SAP (Terraform / AWS Launch Wizard / Azure Center for SAP)", "Cloud cost optimization for SAP landscapes"],
    tools: ["AWS Console / CLI", "Azure Portal / az CLI", "GCP Console / gcloud", "SAP BTP Cockpit", "Cloud Connector", "Terraform"],
    realTasks: ["Size and deploy SAP HANA on AWS/Azure using certified instance types", "Configure HA for SAP using Pacemaker on cloud VMs", "Set up Cloud Connector with HA pair for BTP integration", "Estimate and optimize SAP cloud infrastructure costs", "Migrate an SAP landscape to RISE with SAP model"],
    sapCerts: [],
    cloudCerts: [
      { vendor: "AWS", code: "AWS-SAA-C03", title: "AWS Certified Solutions Architect – Associate" },
      { vendor: "AWS", code: "AWS-SAP-C02", title: "AWS Certified Solutions Architect – SAP on AWS Specialty" },
      { vendor: "Azure", code: "AZ-104", title: "Microsoft Azure Administrator" },
      { vendor: "Azure", code: "AZ-120", title: "Microsoft Azure for SAP Workloads" },
      { vendor: "GCP", code: "GCP-ACE", title: "Google Cloud Associate Cloud Engineer" },
    ],
    relatedGuides: ["SAP on AWS Architecture", "SAP on Azure Architecture", "Cloud Connector Configuration", "RISE with SAP Overview"],
    relatedTroubleshoot: ["Cloud Connector Issues", "SAP HA on Cloud", "Network Connectivity to BTP"],
    nextAction: "Obtain one hyperscaler foundation cert (AWS-SAA or AZ-104) then target SAP specialty track",
    checklist: [
      { id: "cl1", label: "Can explain RISE with SAP and ECS architecture" },
      { id: "cl2", label: "Can size SAP HANA instances on AWS/Azure (certified types)" },
      { id: "cl3", label: "Can configure Cloud Connector HA pair" },
      { id: "cl4", label: "Can explain SAP HA architecture on cloud (Overlay IP / Azure ILB)" },
      { id: "cl5", label: "Can estimate cloud resource costs for SAP landscape" },
      { id: "cl6", label: "Can deploy Cloud Connector and verify BTP connectivity" },
    ],
  },
  {
    id: "ha-dr",
    title: "HA/DR & Security",
    subtitle: "3–5 years",
    icon: <Shield className="w-4 h-4" />,
    status: "upcoming",
    overview: "Design and operate enterprise-grade HA/DR solutions and harden SAP security posture.",
    skills: ["Pacemaker / corosync cluster configuration for SAP", "HANA HSR SYNC / ASYNC / SYNCMEM replication modes", "Azure ILB / AWS Overlay IP HA patterns", "SAP license management (SLICENSE / USMM / SLAW)", "Security audit log (SM19 / SM20 / SM20N)", "SSL/TLS certificate lifecycle (STRUST)", "SAP Cryptographic Library configuration", "Penetration testing readiness: privilege escalation, RFC abuse"],
    tools: ["Pacemaker/corosync", "STRUST", "SM19/SM20", "SLICENSE/USMM", "SAPCAR", "sapssl"],
    realTasks: ["Build and test Pacemaker cluster for SAP ASCS/ERS failover", "Configure and test HANA HSR takeover", "Harden SAP system against RFC privilege escalation", "Set up security audit log and define alert policies", "Perform SAP license measurement and reconcile USMM results"],
    sapCerts: [{ code: "C_SECAUTH_20", title: "SAP Certified Associate – SAP System Security Architect", level: "Associate" }],
    cloudCerts: [
      { vendor: "Azure", code: "AZ-500", title: "Microsoft Azure Security Engineer" },
      { vendor: "AWS", code: "AWS-SCS-C02", title: "AWS Certified Security – Specialty" },
    ],
    relatedGuides: ["HA/DR Architecture Guide", "SAP Security Hardening", "Pacemaker for SAP HANA"],
    relatedTroubleshoot: ["HANA HSR Failover Issues", "Cluster Resource Failures", "Certificate Expiry Issues"],
    nextAction: "Build Pacemaker lab environment and practice HANA HSR takeover procedures",
    checklist: [
      { id: "ha1", label: "Can configure Pacemaker cluster for SAP ASCS/ERS" },
      { id: "ha2", label: "Can configure and test HANA HSR failover" },
      { id: "ha3", label: "Can explain HA/DR RTO and RPO targets for SAP landscapes" },
      { id: "ha4", label: "Can set up and review SAP Security Audit Log (SM19/SM20)" },
      { id: "ha5", label: "Can manage SSL certificates lifecycle with STRUST" },
      { id: "ha6", label: "Can perform SAP license measurement (USMM/SLAW)" },
    ],
  },
  {
    id: "alm",
    title: "ALM & Change Management",
    subtitle: "4–6 years",
    icon: <Code className="w-4 h-4" />,
    status: "upcoming",
    overview: "Own the ALM toolchain end-to-end — Solution Manager, Cloud ALM, structured change processes, and BTP integrations.",
    skills: ["Solution Manager 7.2 setup (LMDB / DSWP / SOLMAN_SETUP)", "ChaRM – Change Request Management workflow", "Cloud ALM onboarding (/SDF/ALM_SETUP / CALM Launchpad)", "Cloud ALM monitoring: Business Services, Infrastructure & Operations", "SAP BTP integration basics (subaccounts, service bindings)", "Cloud Connector HA configuration", "Content Server DMS (OAC0 / BTP Document Management)", "SAC live connection setup for BW/HANA"],
    tools: ["SOLMAN_SETUP", "LMDB", "DSWP", "/SDF/ALM_SETUP", "Cloud ALM Launchpad", "BTP Cockpit", "OAC0"],
    realTasks: ["Configure Cloud ALM and onboard managed systems", "Set up ChaRM workflow and manage a change cycle end-to-end", "Integrate BTP subaccounts with corporate identity provider", "Configure Cloud ALM Infrastructure Monitoring for SAP S/4HANA", "Set up Content Server for DMS and connect to SAP system"],
    sapCerts: [{ code: "C_SM100_7210", title: "SAP Certified Technology Consultant – SAP Solution Manager", level: "Associate" }],
    cloudCerts: [],
    relatedGuides: ["Cloud ALM Configuration", "Solution Manager Setup", "ChaRM Workflow Guide"],
    relatedTroubleshoot: ["Cloud ALM Monitoring Gaps", "ChaRM Workflow Errors", "BTP Connectivity Issues"],
    nextAction: "Set up a Cloud ALM trial and complete the onboarding for a managed system",
    checklist: [
      { id: "al1", label: "Can configure Cloud ALM and onboard managed systems" },
      { id: "al2", label: "Can manage ChaRM change workflow end-to-end" },
      { id: "al3", label: "Can set up Cloud ALM Infrastructure Monitoring" },
      { id: "al4", label: "Can configure BTP subaccount and service bindings" },
      { id: "al5", label: "Can explain LMDB and system landscape management in SolMan" },
      { id: "al6", label: "Can set up Content Server DMS (OAC0)" },
    ],
  },
];

const INCIDENT_NODES: IncidentNode[] = [
  {
    id: "system-down",
    title: "System Down",
    severity: "critical",
    icon: <Server className="w-4 h-4" />,
    description: "SAP application server or HANA database is unreachable. Business-critical situation requiring immediate diagnosis and resolution.",
    steps: ["Check OS-level: SSH to host, verify CPU/memory/disk via top/free/df", "Verify SAP services: sapcontrol -nr <NR> -function GetProcessList", "Check application server logs: /usr/sap/<SID>/D<NR>/work/dev_w0, dev_disp", "Check HANA status: HDB info / systemctl status SAP*", "Review HANA alerts in HANA Cockpit: indexserver crashes, OOM events", "Check network: ping, traceroute, nslookup for SAP host resolution", "Engage OS/Cloud team if kernel panic or VM-level issue suspected", "Execute SAP restart if root cause is confirmed: startsap / stopsap", "Document recovery steps and open SAP support ticket if needed"],
    tools: ["sapcontrol", "HDB info/start/stop", "startsap/stopsap", "SM21", "ST22", "HANA Cockpit", "OS monitoring tools"],
    tips: ["Always capture dev_w0 and dev_disp logs before restarting — they disappear after restart", "Check /var/log/messages and cloud audit logs if running on AWS/Azure/GCP", "For HANA OOM: check hdbdaemon traces in /hana/shared/<SID>/HDB<NR>/trace"],
    relatedSAPCerts: ["C_TADM_22", "C_DBADM_2601"],
    checklist: [
      { id: "sd1", label: "Can verify SAP service status using sapcontrol" },
      { id: "sd2", label: "Can read dev_w0 and dev_disp logs for root cause" },
      { id: "sd3", label: "Can check HANA indexserver status and trace files" },
      { id: "sd4", label: "Can perform controlled restart of SAP instance" },
    ],
  },
  {
    id: "job-failure",
    title: "Background Job Failure",
    severity: "high",
    icon: <RefreshCw className="w-4 h-4" />,
    description: "Scheduled background jobs have failed, been canceled, or are stuck in running state. May impact month-end close, interfaces, and batch processes.",
    steps: ["Open SM37 — filter by status: Canceled / Active (long-running)", "Identify the job name, ABAP program, and start time", "Check job logs in SM37: detailed reason for failure (ST22 dump, authority check, lock wait)", "For stuck jobs: check SM50/SM66 — identify blocking work process", "Check application locks: SM12 — release stale locks if safe", "For authority failures: SU53 → identify missing authorization object, assign via PFCG", "For ABAP dump: ST22 → analyze runtime error, engage ABAP team if needed", "Reschedule job after fix, monitor next execution", "Document pattern — recurring failures may need CCMS auto-alert setup"],
    tools: ["SM37", "SM50/SM66", "SM12", "SM21", "ST22", "SU53", "AL11 (job logs)"],
    tips: ["Long-running jobs often cause enqueue server overload — check SM12 for mass locks", "Periodic job failures around period-end are often lock conflicts with online users", "Use SM37 'Extended' view to compare current vs. historical runtimes"],
    relatedSAPCerts: ["C_TADM_22"],
    checklist: [
      { id: "jf1", label: "Can analyze failed jobs in SM37 and identify root cause" },
      { id: "jf2", label: "Can identify blocking work processes via SM50/SM66" },
      { id: "jf3", label: "Can release application locks in SM12 safely" },
      { id: "jf4", label: "Can correlate ST22 dumps to job failures" },
    ],
  },
  {
    id: "transport-issue",
    title: "Transport Issue",
    severity: "high",
    icon: <GitMerge className="w-4 h-4" />,
    description: "Transport orders failing to import, stuck in queue, or causing post-import errors in target system.",
    steps: ["Open STMS in target system — check import queue status", "Identify transport request: check return code (8 = warning, 12 = error)", "Review transport log: STMS → Logs tab → find TP/R3trans log for root cause", "Common causes: object lock conflicts, missing prerequisites, table structure mismatch", "For prerequisite errors: import predecessor transports first, re-import", "For object conflicts: SE03 → check object ownership, resolve in development", "For R3trans errors: check /usr/sap/trans/log/<SIDLOG> files", "Emergency: use STMS emergency fix import flag with change manager approval", "Post-import: validate impacted objects in target — run function module tests"],
    tools: ["STMS", "SE03", "SE09/SE10", "tp", "R3trans", "SCC1 (client copy for emergency)"],
    tips: ["Always import transports in sequence — re-ordering causes dependency failures", "R3trans return code 8 is often just informational — review log for actual errors", "For mass transport failures, check SAP kernel version compatibility between systems"],
    relatedSAPCerts: ["C_TADM_22"],
    checklist: [
      { id: "tr1", label: "Can read STMS transport logs and interpret return codes" },
      { id: "tr2", label: "Can identify and resolve transport prerequisite errors" },
      { id: "tr3", label: "Can use SE03 to check object ownership in transport system" },
      { id: "tr4", label: "Can check /usr/sap/trans/log for detailed TP/R3trans errors" },
    ],
  },
  {
    id: "rfc-interface",
    title: "RFC / Interface Issue",
    severity: "medium",
    icon: <Wifi className="w-4 h-4" />,
    description: "RFC connections failing, interfaces not processing, or third-party integrations timing out.",
    steps: ["Open SM59 — identify failing RFC destination, check connection type (TCP/IP, ABAP)", "Test connection: SM59 → Connection Test / Authorization Test", "For timeout errors: check target system availability, network routing", "Check SM58 (transactional RFC) for stuck tRFC calls — verify target system is up", "For Idoc interface: WE02/WE05 — check Idoc status codes, retry processing", "For HTTP/REST: SMICM → check ICM statistics, trace, and error queue", "For qRFC: SMQ1 / SMQ2 — check queued RFC inbound/outbound status", "Capture network trace: SMICM → Trace Level 3 for HTTP issues", "Engage middleware/PI team for complex mapping errors"],
    tools: ["SM59", "SM58", "SMQ1/SMQ2", "WE02/WE05", "SMICM", "SICF", "SXI_MONITOR (PI)"],
    tips: ["Always check authorization test in SM59 separately from connection test", "tRFC stuck calls in SM58 need manual restart after target system recovery", "For HTTPS issues: verify certificate chain in STRUST matches target system"],
    relatedSAPCerts: ["C_TADM_22"],
    checklist: [
      { id: "ri1", label: "Can test and troubleshoot RFC destinations in SM59" },
      { id: "ri2", label: "Can monitor transactional RFC queues in SM58/SMQ1/SMQ2" },
      { id: "ri3", label: "Can analyze Idoc errors in WE02/WE05" },
      { id: "ri4", label: "Can use SMICM to diagnose HTTP interface issues" },
    ],
  },
  {
    id: "fiori-gateway",
    title: "Fiori / Gateway Issue",
    severity: "medium",
    icon: <Monitor className="w-4 h-4" />,
    description: "SAP Fiori apps not loading, OData service errors, or Gateway configuration failures.",
    steps: ["Check SICF — verify Fiori services are active under /sap/bc/ui5_ui5 and /sap/opu/odata", "Run /IWFND/MAINT_SERVICE — verify OData service registration and metadata", "Test OData service endpoint: /IWFND/GW_CLIENT or browser URL", "Check Gateway error log: /IWFND/ERROR_LOG — identify root service error", "Verify backend RFC destination in /IWFND/MAINT_SERVICE → system aliases → SM59", "For UI5 loading issues: check ICM configuration, browser cache, CORS headers", "Check user authorization: SU53 for missing Fiori auth objects (/UI2/SERV, /UI5/APP_CTRL)", "Review Launchpad configuration: /UI2/FLPD_CONF — tile and catalog assignment", "Clear Fiori cache: /UI2/INVALIDATE_CLIENT_CACHES"],
    tools: ["/IWFND/MAINT_SERVICE", "/IWFND/ERROR_LOG", "SICF", "/IWFND/GW_CLIENT", "SM59", "/UI2/FLPD_CONF", "SU53"],
    tips: ["Most Fiori issues are one of three things: SICF not active, missing authorization, or RFC destination misconfigured", "Use /IWFND/ERROR_LOG as first stop — it captures backend and gateway layer errors", "Browser F12 Network tab shows OData call details — compare with /IWFND/GW_CLIENT response"],
    relatedSAPCerts: ["C_TADM_22"],
    checklist: [
      { id: "fg1", label: "Can activate and check SICF services for Fiori" },
      { id: "fg2", label: "Can register and test OData services in /IWFND/MAINT_SERVICE" },
      { id: "fg3", label: "Can analyze Gateway error log (/IWFND/ERROR_LOG)" },
      { id: "fg4", label: "Can verify Fiori authorizations using SU53" },
    ],
  },
  {
    id: "hana-performance",
    title: "HANA Performance Issue",
    severity: "high",
    icon: <Activity className="w-4 h-4" />,
    description: "SAP system slow or unresponsive due to HANA-layer bottlenecks — memory pressure, expensive SQL, or replication lag.",
    steps: ["Check HANA Cockpit: Memory Overview — identify column store, row store, heap usage", "HANA Studio / HANA Cockpit: Performance → Expensive Statements → identify top SQL", "ST04 / DBACOCKPIT: check SAP-side expensive statement trace", "hdbsql query: SELECT TOP 20 * FROM SYS.M_EXPENSIVE_STATEMENTS ORDER BY DURATION_MICROSEC DESC", "Check HANA System Replication lag: hdbnsutil -sr_state / M_SERVICE_REPLICATION", "Identify column store table fragmentation: M_CS_TABLES → ROW_COUNT vs ESTIMATED_MAX_MEMORY_SIZE", "Run delta merge if fragmentation high: MERGE DELTA OF <schema>.<table>", "Check HANA save points: M_SAVEPOINTS — frequent long savepoints indicate write pressure", "Engage HANA expert if OOM imminent: identify unload candidates vs. loaded tables"],
    tools: ["HANA Studio", "SAP HANA Cockpit", "DBACOCKPIT/ST04", "hdbsql", "hdbnsutil", "M_EXPENSIVE_STATEMENTS", "M_CS_TABLES"],
    tips: ["HANA is an in-memory DB — memory saturation is the #1 cause of performance degradation", "High delta store row counts (>2M in a single partition) indicate merge backlog", "Always correlate HANA memory spikes with background jobs or BW loads running at that time"],
    relatedSAPCerts: ["C_DBADM_2601"],
    checklist: [
      { id: "hp1", label: "Can identify expensive SQL statements via HANA Cockpit / ST04" },
      { id: "hp2", label: "Can analyze HANA memory usage (column store, row store, heap)" },
      { id: "hp3", label: "Can check HSR replication lag using hdbnsutil" },
      { id: "hp4", label: "Can trigger and monitor delta merge operations" },
    ],
  },
  {
    id: "cloud-alm-monitoring",
    title: "Cloud ALM Monitoring Issue",
    severity: "medium",
    icon: <BarChart2 className="w-4 h-4" />,
    description: "Cloud ALM not receiving metrics, monitoring gaps, or alert configuration not triggering on managed systems.",
    steps: ["Verify managed system onboarding: Cloud ALM → Settings → Landscape Management → System Status", "Check CALM data collection agent: on-premise, verify /SDF/ALM_SETUP transaction completed", "Verify Cloud Connector connectivity: Cloud ALM → Settings → System Landscape → test connection", "Check ABAP diagnostic agent: SM59 → CALM_* RFC destinations are available and tested", "Review alert threshold configuration: Cloud ALM → Monitoring → Alerting → verify scope", "For missing metrics: check collection job in managed system — program /SDF/CALM_PUSH_MONITORING", "Verify BTP destination in managed system trust configuration: STRUST → SSL client certificates", "Check Cloud ALM operation log for ingestion errors in the CALM analytics launchpad", "Escalate to SAP support with Cloud ALM telemetry data if agent-side is healthy"],
    tools: ["/SDF/ALM_SETUP", "Cloud ALM Launchpad", "SM59 (CALM_* destinations)", "STRUST", "Cloud Connector Admin UI"],
    tips: ["Most Cloud ALM gaps are caused by Cloud Connector outages or certificate expiry", "The /SDF/CALM_PUSH_MONITORING job must run every 5 min — check SM37 for it", "BTP tenant assignments can drift after license changes — re-verify system assignments in Cloud ALM"],
    relatedSAPCerts: ["C_SM100_7210"],
    checklist: [
      { id: "ca1", label: "Can verify managed system onboarding status in Cloud ALM" },
      { id: "ca2", label: "Can check Cloud ALM data collection job in managed system (SM37)" },
      { id: "ca3", label: "Can verify Cloud Connector availability for CALM connectivity" },
      { id: "ca4", label: "Can troubleshoot missing monitoring metrics via /SDF/ALM_SETUP" },
    ],
  },
];

// ─── Derived/Utility ──────────────────────────────────────────────────────────

const STATUS_STYLES = {
  done: { dot: "bg-emerald-500", card: "border-emerald-200 bg-emerald-50/30", badge: "bg-emerald-100 text-emerald-700", label: "Completed" },
  active: { dot: "bg-[#0070F2] animate-pulse", card: "border-[#0070F2] bg-blue-50/30 ring-1 ring-[#0070F2]/20", badge: "bg-blue-100 text-blue-700", label: "In Progress" },
  upcoming: { dot: "bg-gray-300", card: "border-gray-200 bg-white", badge: "bg-gray-100 text-gray-500", label: "Upcoming" },
  optional: { dot: "bg-amber-400", card: "border-amber-100 bg-amber-50/20", badge: "bg-amber-100 text-amber-700", label: "Optional" },
};

const SEVERITY_STYLES = {
  critical: { bar: "bg-red-500", badge: "bg-red-100 text-red-700 border-red-200", card: "border-red-200 bg-red-50/20", label: "Critical" },
  high: { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700 border-amber-200", card: "border-amber-200 bg-amber-50/20", label: "High" },
  medium: { bar: "bg-[#0070F2]", badge: "bg-blue-100 text-blue-700 border-blue-200", card: "border-gray-200 bg-white", label: "Medium" },
};

const VENDOR_COLORS: Record<string, string> = {
  AWS: "bg-orange-100 text-orange-700 border-orange-200",
  Azure: "bg-blue-100 text-blue-700 border-blue-200",
  GCP: "bg-green-100 text-green-700 border-green-200",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CareerRoadmap() {
  const [mode, setMode] = useState<"learning" | "incident">("learning");
  const [selectedId, setSelectedId] = useState<string>("core-basis");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try { return new Set<string>(JSON.parse(localStorage.getItem("bp_roadmap_checks") || "[]")); } catch { return new Set<string>(); }
  });

  function toggleCheck(itemId: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
      try { localStorage.setItem("bp_roadmap_checks", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  const allChecklistItems = useMemo(() =>
    [...LEARNING_NODES, ...INCIDENT_NODES].flatMap((n) => n.checklist), []);
  const totalItems = allChecklistItems.length;
  const checkedCount = allChecklistItems.filter((i) => checkedItems.has(i.id)).length;
  const readinessPct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const currentLearningNode = LEARNING_NODES.find((n) => n.id === selectedId);
  const currentIncidentNode = INCIDENT_NODES.find((n) => n.id === selectedId);

  function selectNode(id: string) {
    setSelectedId(id);
  }

  function switchMode(m: "learning" | "incident") {
    setMode(m);
    if (m === "learning") setSelectedId("core-basis");
    else setSelectedId("system-down");
  }

  const activeNode = mode === "learning" ? currentLearningNode : currentIncidentNode;

  // Compute readiness level label
  const readinessLabel = readinessPct >= 75 ? "Senior Basis Ready" : readinessPct >= 50 ? "Basis Consultant" : readinessPct >= 25 ? "Core Basis" : "Foundation";
  const nextTarget = readinessPct >= 75 ? "Basis Architect" : readinessPct >= 50 ? "Senior Basis" : readinessPct >= 25 ? "Basis Consultant" : "Core Basis";
  const recommendedFocus = readinessPct < 30 ? "Core Administration & HANA Basics" : readinessPct < 55 ? "HANA DBA & Cloud Fundamentals" : readinessPct < 75 ? "HA/DR Architecture & ALM Toolchain" : "Enterprise Architecture & Consulting";

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0070F2] to-violet-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp className="w-4 h-4 opacity-80" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">SAP Basis Career Intelligence</span>
        </div>
        <h1 className="text-xl font-extrabold mb-1">Career Roadmap</h1>
        <p className="text-xs opacity-75 max-w-xl">Your structured path from Junior Basis to Enterprise Architect — skills, tools, certifications, and real operational scenarios at every stage.</p>
      </div>

      {/* Summary Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Current Level", value: readinessLabel, icon: <MapPin className="w-4 h-4 text-[#0070F2]" />, sub: null },
          { label: "Next Target Role", value: nextTarget, icon: <Target className="w-4 h-4 text-violet-500" />, sub: null },
          { label: "Readiness", value: `${readinessPct}%`, icon: <BarChart2 className="w-4 h-4 text-emerald-500" />, sub: `${checkedCount}/${totalItems} checks` },
          { label: "Recommended Focus", value: recommendedFocus, icon: <Zap className="w-4 h-4 text-amber-500" />, sub: null },
        ].map((item) => (
          <div key={item.label} className="border border-gray-200 rounded-2xl bg-white p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              {item.icon}
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
            </div>
            <div className="text-sm font-bold text-gray-900 leading-tight">{item.value}</div>
            {item.sub && <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>}
          </div>
        ))}
      </div>

      {/* Readiness progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0070F2] to-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${readinessPct}%` }}
        />
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => switchMode("learning")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "learning" ? "bg-white text-[#0070F2] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <BookOpen className="w-4 h-4" /> Learning Path
          </button>
          <button
            onClick={() => switchMode("incident")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "incident" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <AlertTriangle className="w-4 h-4" /> Real Incident Path
          </button>
        </div>
        <span className="text-xs text-gray-400 ml-1">
          {mode === "learning" ? "Skills, tools, certifications per career stage" : "Real SAP operational incident playbooks"}
        </span>
      </div>

      {/* Two-Column Layout */}
      <div className="flex gap-4 items-start">

        {/* Left Column — Node List */}
        <div className="w-64 flex-shrink-0 space-y-1.5">
          {mode === "learning" && LEARNING_NODES.map((node) => {
            const s = STATUS_STYLES[node.status];
            const isSelected = selectedId === node.id;
            const nodeChecked = node.checklist.filter((c) => checkedItems.has(c.id)).length;
            const nodePct = Math.round((nodeChecked / node.checklist.length) * 100);
            return (
              <button
                key={node.id}
                onClick={() => selectNode(node.id)}
                className={`w-full text-left border rounded-xl p-3 transition-all ${
                  isSelected ? "border-[#0070F2] bg-blue-50/40 ring-1 ring-[#0070F2]/20" : `${s.card} hover:border-gray-300`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-gray-900 truncate">{node.title}</div>
                    <div className="text-xs text-gray-400">{node.subtitle}</div>
                  </div>
                  <div className="text-xs font-bold text-gray-400">{nodePct}%</div>
                </div>
                {/* Mini progress bar */}
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0070F2]/40 rounded-full transition-all" style={{ width: `${nodePct}%` }} />
                </div>
              </button>
            );
          })}

          {mode === "incident" && INCIDENT_NODES.map((node) => {
            const sev = SEVERITY_STYLES[node.severity];
            const isSelected = selectedId === node.id;
            const nodeChecked = node.checklist.filter((c) => checkedItems.has(c.id)).length;
            return (
              <button
                key={node.id}
                onClick={() => selectNode(node.id)}
                className={`w-full text-left border rounded-xl overflow-hidden transition-all ${
                  isSelected ? "border-[#0070F2] ring-1 ring-[#0070F2]/20" : `${sev.card} hover:border-gray-300`
                }`}
              >
                <div className={`h-0.5 ${sev.bar}`} />
                <div className="p-3 flex items-center gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-gray-900 truncate">{node.title}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${sev.badge}`}>{sev.label}</span>
                      <span className="text-xs text-gray-400">{nodeChecked}/{node.checklist.length} ✓</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column — Detail Panel */}
        <div className="flex-1 min-w-0">
          {mode === "learning" && currentLearningNode && (
            <LearningDetailPanel node={currentLearningNode} checkedItems={checkedItems} onToggle={toggleCheck} />
          )}
          {mode === "incident" && currentIncidentNode && (
            <IncidentDetailPanel node={currentIncidentNode} checkedItems={checkedItems} onToggle={toggleCheck} />
          )}
          {!activeNode && (
            <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              <Info className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <div className="text-sm">Select a {mode === "learning" ? "stage" : "scenario"} from the left to view details</div>
            </div>
          )}
        </div>
      </div>

      {/* SAP Career Certifications Section (Learning Path only) */}
      {mode === "learning" && (
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[#0070F2]" />
            <span className="text-sm font-bold text-gray-900">SAP Career Certifications</span>
            <span className="text-xs text-gray-400 font-normal">— earn these alongside your career stages</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {LEARNING_NODES.flatMap((n) => n.sapCerts).filter((cert, i, arr) => arr.findIndex(c => c.code === cert.code) === i).map((cert) => (
              <div key={cert.code} className="flex gap-2.5 p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="w-8 h-8 rounded-lg bg-[#0070F2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-4 h-4 text-[#0070F2]" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-[#0070F2]">{cert.code}</div>
                  <div className="text-xs font-semibold text-gray-800 leading-tight">{cert.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{cert.level}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Cloud hyperscaler certifications (AWS, Azure, GCP) are shown within each stage and on the Cloud Certifications page.
          </div>
        </div>
      )}

      {/* Bottom tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-amber-800 mb-1">Career Intelligence Tip</div>
          <p className="text-xs text-amber-700 leading-relaxed">
            The fastest path to Senior Basis is hands-on cloud experience (AWS or Azure) combined with SAP HANA DBA skills.
            Pair your Basis background with AWS-SAA or AZ-104, then target the SAP specialty tracks (AZ-120 / AWS SAP on AWS) 
            to unlock a 40–60% salary uplift within 2–3 years.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Learning Detail Panel ────────────────────────────────────────────────────

function LearningDetailPanel({
  node, checkedItems, onToggle,
}: { node: LearningNode; checkedItems: Set<string>; onToggle: (id: string) => void; }) {
  const s = STATUS_STYLES[node.status];
  const nodeChecked = node.checklist.filter((c) => checkedItems.has(c.id)).length;
  const nodePct = Math.round((nodeChecked / node.checklist.length) * 100);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-gray-900">{node.title}</span>
              <span className="text-xs text-gray-400">{node.subtitle}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{node.overview}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-extrabold text-[#0070F2]">{nodePct}%</div>
            <div className="text-xs text-gray-400">stage ready</div>
          </div>
        </div>
      </div>

      <div className="p-4 grid sm:grid-cols-2 gap-5">
        {/* Skills */}
        <div>
          <SectionLabel icon={<Layers className="w-3.5 h-3.5" />} label="What to Master" />
          <ul className="space-y-1">
            {node.skills.map((s) => (
              <li key={s} className="flex gap-1.5 text-xs text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Real Tasks */}
        <div>
          <SectionLabel icon={<Target className="w-3.5 h-3.5" />} label="Real Tasks You Should Handle" />
          <ul className="space-y-1">
            {node.realTasks.map((t) => (
              <li key={t} className="flex gap-1.5 text-xs text-gray-700">
                <ArrowRight className="w-3 h-3 text-[#0070F2] flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div>
          <SectionLabel icon={<Cpu className="w-3.5 h-3.5" />} label="Key TCodes / Tools" />
          <div className="flex flex-wrap gap-1.5">
            {node.tools.map((t) => (
              <span key={t} className="text-xs font-mono px-2 py-0.5 bg-[#0070F2]/10 text-[#0070F2] rounded-md">{t}</span>
            ))}
          </div>
        </div>

        {/* Readiness Checklist */}
        <div>
          <SectionLabel icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Readiness Checklist" />
          <ul className="space-y-1.5">
            {node.checklist.map((item) => {
              const done = checkedItems.has(item.id);
              return (
                <li key={item.id}
                  className="flex items-start gap-2 cursor-pointer group"
                  onClick={() => onToggle(item.id)}
                >
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-px" />
                    : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-px group-hover:text-gray-400" />
                  }
                  <span className={`text-xs leading-snug ${done ? "line-through text-gray-400" : "text-gray-700"}`}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Related Guides */}
        {node.relatedGuides.length > 0 && (
          <div>
            <SectionLabel icon={<BookOpen className="w-3.5 h-3.5" />} label="Related Guides" />
            <ul className="space-y-1">
              {node.relatedGuides.map((g) => (
                <li key={g} className="flex gap-1.5 text-xs text-gray-600">
                  <FileText className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />{g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Troubleshoot */}
        {node.relatedTroubleshoot.length > 0 && (
          <div>
            <SectionLabel icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Related Troubleshoot Trees" />
            <ul className="space-y-1">
              {node.relatedTroubleshoot.map((t) => (
                <li key={t} className="flex gap-1.5 text-xs text-gray-600">
                  <GitMerge className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />{t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SAP Certifications */}
        {node.sapCerts.length > 0 && (
          <div>
            <SectionLabel icon={<Award className="w-3.5 h-3.5" />} label="SAP Career Certifications" />
            <div className="space-y-1.5">
              {node.sapCerts.map((c) => (
                <div key={c.code} className="flex items-start gap-2 p-2 bg-[#0070F2]/5 border border-[#0070F2]/15 rounded-xl">
                  <Award className="w-3.5 h-3.5 text-[#0070F2] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-xs font-bold text-[#0070F2]">{c.code}</div>
                    <div className="text-xs text-gray-700 leading-tight">{c.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cloud Certifications */}
        {node.cloudCerts.length > 0 && (
          <div>
            <SectionLabel icon={<Globe className="w-3.5 h-3.5" />} label="Relevant Cloud Certifications" />
            <div className="space-y-1.5">
              {node.cloudCerts.map((c) => (
                <div key={c.code} className="flex items-start gap-2 p-2 border border-gray-100 rounded-xl bg-gray-50/50">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${VENDOR_COLORS[c.vendor]}`}>{c.vendor}</span>
                  <div>
                    <div className="font-mono text-xs font-bold text-gray-600">{c.code}</div>
                    <div className="text-xs text-gray-600 leading-tight">{c.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Best Action */}
      <div className="border-t border-gray-100 p-4 flex gap-3 items-start bg-gray-50/40">
        <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold text-gray-700 mb-0.5">Next Best Action</div>
          <div className="text-xs text-gray-600">{node.nextAction}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Incident Detail Panel ────────────────────────────────────────────────────

function IncidentDetailPanel({
  node, checkedItems, onToggle,
}: { node: IncidentNode; checkedItems: Set<string>; onToggle: (id: string) => void; }) {
  const sev = SEVERITY_STYLES[node.severity];

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      <div className={`h-1 ${sev.bar}`} />

      {/* Panel Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${sev.badge}`}>
            {node.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-gray-900">{node.title}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${sev.badge}`}>{sev.label}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{node.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 grid sm:grid-cols-2 gap-5">
        {/* Resolution Steps */}
        <div className="sm:col-span-2">
          <SectionLabel icon={<ArrowRight className="w-3.5 h-3.5" />} label="Resolution Steps" />
          <ol className="space-y-1.5">
            {node.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0070F2]/10 text-[#0070F2] font-bold text-xs flex items-center justify-center mt-px">{i + 1}</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tools */}
        <div>
          <SectionLabel icon={<Cpu className="w-3.5 h-3.5" />} label="Key TCodes / Tools" />
          <div className="flex flex-wrap gap-1.5">
            {node.tools.map((t) => (
              <span key={t} className="text-xs font-mono px-2 py-0.5 bg-[#0070F2]/10 text-[#0070F2] rounded-md">{t}</span>
            ))}
          </div>
        </div>

        {/* Readiness Checklist */}
        <div>
          <SectionLabel icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Readiness Checklist" />
          <ul className="space-y-1.5">
            {node.checklist.map((item) => {
              const done = checkedItems.has(item.id);
              return (
                <li key={item.id}
                  className="flex items-start gap-2 cursor-pointer group"
                  onClick={() => onToggle(item.id)}
                >
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-px" />
                    : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-px group-hover:text-gray-400" />
                  }
                  <span className={`text-xs leading-snug ${done ? "line-through text-gray-400" : "text-gray-700"}`}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tips */}
        <div>
          <SectionLabel icon={<Zap className="w-3.5 h-3.5" />} label="Pro Tips" />
          <ul className="space-y-1.5">
            {node.tips.map((t) => (
              <li key={t} className="flex gap-1.5 text-xs text-amber-800">
                <Zap className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Related SAP Certs */}
        {node.relatedSAPCerts.length > 0 && (
          <div>
            <SectionLabel icon={<Award className="w-3.5 h-3.5" />} label="Relevant SAP Certifications" />
            <div className="flex flex-wrap gap-1.5">
              {node.relatedSAPCerts.map((c) => (
                <span key={c} className="text-xs font-mono px-2 py-0.5 bg-[#0070F2]/10 text-[#0070F2] border border-[#0070F2]/20 rounded-md">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared Section Label ─────────────────────────────────────────────────────

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}
