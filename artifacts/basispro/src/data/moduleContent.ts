export type ContentLink = {
  label: string;
  url: string;
  note?: string;
};

export type ContentNode = {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  summary: string;
  steps?: string[];
  keyPoints?: string[];
  tcodes?: string[];
  sapNotes?: { note: string; desc: string }[];
  links?: ContentLink[];
  warning?: string;
  tip?: string;
};

export type ModuleSection = {
  id: string;
  title: string;
  nodes: ContentNode[];
};

export type ModuleData = {
  id: string;
  title: string;
  subtitle: string;
  version?: string;
  sourceUrl?: string;
  overview: string;
  color: string;
  sections: ModuleSection[];
};

// ─────────────────────────────────────────────
// SAP HANA Database
// ─────────────────────────────────────────────
export const hanaModule: ModuleData = {
  id: "hana",
  title: "SAP HANA Database",
  subtitle: "SAP HANA Platform Administration",
  version: "SAP HANA 2.0 SPS 07+",
  sourceUrl: "https://help.sap.com/docs/SAP_HANA_PLATFORM/b3ee5778bc2e4a089d3299b82ec762a7/9165807e2ded490ea06f46035c3e58b1.html",
  overview:
    "SAP HANA is an in-memory, column-oriented, relational database management system. As a Senior Basis Consultant, your HANA responsibilities span architecture, installation, backup/recovery, high availability, disaster recovery, performance tuning, and upgrades across production landscapes.",
  color: "#0070F2",
  sections: [
    {
      id: "create",
      title: "Create Database",
      nodes: [
        {
          id: "hana-create-tenant",
          title: "Create Tenant Database (MDC)",
          icon: "Database",
          badge: "Core",
          summary:
            "SAP HANA Multi-tenant Database Containers (MDC) allow multiple isolated tenant databases to run in one HANA system, sharing memory and CPU. The System Database orchestrates all tenants.",
          steps: [
            "Log into HANA Cockpit or connect via HDBSQL as SYSTEM user on the System DB (port 3xx13)",
            "Run: CREATE DATABASE <tenant_name> SYSTEM USER PASSWORD '<password>'",
            "Verify tenant is visible: SELECT DATABASE_NAME, ACTIVE_STATUS FROM SYS_DATABASES.M_DATABASES",
            "Start the tenant if not auto-started: ALTER SYSTEM START DATABASE <tenant_name>",
            "Configure tenant-specific parameters via SAP HANA Studio or Cockpit",
            "Assign a tenant-specific SQL port: 3<instance>41 (first tenant), 3<instance>42 (second), etc.",
          ],
          keyPoints: [
            "System DB port: 3xx13 (SQL), 4xx13 (HTTPS — Cockpit)",
            "Tenant DB SQL port: 3xx41, 3xx42 … (auto-assigned)",
            "System DB user (SYSTEM) ≠ Tenant DB user — separate credentials",
            "All backup/recovery metadata is centrally managed in System DB",
            "Tenant isolation: each tenant has its own schema, users, and volume",
          ],
          tcodes: ["DBACOCKPIT", "HANA Cockpit URL: https://<host>:4<instance>12"],
          sapNotes: [
            { note: "2101244", desc: "FAQ: SAP HANA Database Multitenant" },
            { note: "2036111", desc: "How-To: SAP HANA MDC Admin User Recovery" },
          ],
          links: [
            { label: "HANA MDC Administration Guide", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/b3ee5778bc2e4a089d3299b82ec762a7/9165807e2ded490ea06f46035c3e58b1.html" },
            { label: "Creating Tenant Databases", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/7ef2f87ea02d46cdbfad11eb3b39f6f4.html" },
          ],
          tip: "Always create a dedicated OS-level tenant admin (e.g., <sid>adm) and keep System DB credentials in a secure vault. Never use SYSTEM user for application connectivity.",
        },
        {
          id: "hana-initial-config",
          title: "Initial Database Configuration",
          icon: "Settings",
          summary:
            "After installation, configure HANA global parameters, memory settings, network, and log mode before connecting SAP application servers.",
          steps: [
            "Open global.ini → [memorymanager] → set global_allocation_limit (typically 90% of total RAM)",
            "Configure log mode: ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM') SET ('persistence','log_mode') = 'normal'",
            "Set up backup destination: ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM') SET ('backup','catalog_backup_using_backint') = 'false'",
            "Configure alert thresholds in HANA Cockpit → Administration → Alerts",
            "Enable statement memory limit to prevent runaway queries",
            "Register HANA system in SAP LMDB / SLD for landscape management",
          ],
          keyPoints: [
            "global_allocation_limit must never exceed physical RAM minus OS/swap reservation",
            "Log mode 'normal' required for point-in-time recovery",
            "Default HANA installation sets heap allocator limits — review before go-live",
            "Always validate SAP kernel patch level matches HANA SPS requirement",
          ],
          tcodes: ["SMGW", "RZ10", "DBACOCKPIT"],
          links: [
            { label: "HANA Configuration Parameters Reference", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/009e68bc5f3c440cb31823a3ec4bb95b/4b4d88980622427ab2d6ca8c05448166.html" },
          ],
        },
      ],
    },
    {
      id: "manage",
      title: "Manage Database",
      nodes: [
        {
          id: "hana-start-stop",
          title: "Start / Stop HANA Database",
          icon: "Power",
          badge: "Daily Ops",
          summary:
            "Controlled start and stop of HANA system or individual tenants is a fundamental operational task. Always follow the prescribed order when stopping SAP application layer first.",
          steps: [
            "Stop order: SAP Application Servers → SAP Message Server → HANA Database",
            "As <sid>adm on DB host: HDB stop (stops entire HANA instance including all tenants)",
            "Stop single tenant only: ALTER SYSTEM STOP DATABASE <tenant> in System DB",
            "Start: HDB start (from OS) or ALTER SYSTEM START DATABASE <tenant> (from System DB)",
            "Check status: HDB info  or  SELECT * FROM SYS_DATABASES.M_DATABASES",
            "Verify all services running: SELECT SERVICE_NAME, ACTIVE_STATUS FROM M_SERVICES",
          ],
          keyPoints: [
            "HDB stop sends SIGTERM — waits for graceful shutdown of all services",
            "HDB kill -9 is emergency only — can cause data inconsistency",
            "Tenant stop does NOT stop System DB — other tenants remain live",
            "Log savepoint is triggered automatically on graceful shutdown",
          ],
          sapNotes: [
            { note: "1916066", desc: "SAP HANA: Starting and stopping HANA system" },
          ],
          links: [
            { label: "HANA Administration Guide — Start/Stop", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/f2c433523c4449868fcdaaf57a0de447.html" },
          ],
          warning: "Never kill HANA processes individually unless directed by SAP Support. Always use HDB stop or ALTER SYSTEM STOP DATABASE to ensure savepoints complete correctly.",
        },
        {
          id: "hana-user-management",
          title: "User & Role Management",
          icon: "Users",
          summary:
            "HANA has its own user store and authorization concept. Restrict privileges using roles and never use SYSTEM user for application connections.",
          steps: [
            "Create DB user: CREATE USER <username> PASSWORD '<pwd>' NO FORCE_FIRST_PASSWORD_CHANGE",
            "Create role: CREATE ROLE <rolename>",
            "Grant privilege: GRANT SELECT ON SCHEMA <schema> TO <rolename>",
            "Assign role: GRANT <rolename> TO <username>",
            "For ABAP app connectivity: grant MONITORING, DATA ADMIN to <SAP_schema_user>",
            "Disable unused users: ALTER USER <username> DEACTIVATE USER NOW",
            "Audit policy: CREATE AUDIT POLICY <name> AUDITING SUCCESSFUL CONNECT ON USERS <user>",
          ],
          keyPoints: [
            "SYSTEM user has all privileges — change password immediately after install",
            "Application users should only have the minimum privileges needed",
            "Technical users (e.g., SAPABAP1) need: EXECUTE on SYS.REPOSITORY_REST_SERVICES, SELECT on SAP tables",
            "Password policy can be set globally or per user",
            "User store (hdbuserstore) stores encrypted credentials for hdbsql connections",
          ],
          tcodes: ["SU01", "SU10", "SUIM", "PFCG"],
          sapNotes: [
            { note: "2081828", desc: "SAP HANA security guide overview" },
            { note: "1969700", desc: "SQL queries to monitor authorizations" },
          ],
          links: [
            { label: "HANA Security Guide", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/b3ee5778bc2e4a089d3299b82ec762a7/c3d9889e297d4d1fb9f56d7d5b6cb2a9.html" },
          ],
        },
        {
          id: "hana-backup",
          title: "Backup & Recovery",
          icon: "Archive",
          badge: "Critical",
          summary:
            "HANA backup strategy is central to any production landscape. Supports file-based, backint (third-party), and Snapshot backups. Recovery requires both data backup + log backups.",
          steps: [
            "File-based full backup (hdbsql): BACKUP DATA USING FILE ('prefix')",
            "Schedule incremental: BACKUP DATA INCREMENTAL USING FILE ('prefix')",
            "Verify catalog: SELECT * FROM SYS.M_BACKUP_CATALOG ORDER BY UTC_START_TIME DESC",
            "Recovery (Point-in-Time): Use HANA Studio → Recovery Wizard or HDBSQL RECOVER DATABASE UNTIL TIMESTAMP",
            "After recovery validation: VALIDATE BACKUP CATALOG ALL",
            "Backup monitoring in HANA Cockpit: Administration → Backup → Backup Catalog",
          ],
          keyPoints: [
            "HANA requires: 1 full backup + all subsequent log backups for complete recovery",
            "Log backup interval: set log_backup_interval_mode in global.ini",
            "Recommended: daily full + continuous log backup to separate storage",
            "Backint: integrate NetWorker, Commvault, Veeam, or Azure Backup",
            "Snapshot backups: freeze DB → OS/storage snapshot → unfreeze (faster, point-in-time)",
            "Backup retention policy: follow RPO/RTO agreed with business",
          ],
          tcodes: ["DBACOCKPIT → Backup"],
          sapNotes: [
            { note: "1642148", desc: "FAQ: SAP HANA Database Backup & Recovery" },
            { note: "2283847", desc: "How-to: SAP HANA backup using backint" },
          ],
          links: [
            { label: "HANA Backup and Recovery Guide", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/7cc33be53e8546c8bd4ac9d70dc0b7d3.html" },
          ],
          warning: "Always verify backup completion and test restore procedures regularly in a non-production environment. A backup you have never tested is not a backup.",
        },
      ],
    },
    {
      id: "upgrade",
      title: "Upgrade & New Version",
      nodes: [
        {
          id: "hana-upgrade-sps",
          title: "HANA SPS / Revision Upgrade",
          icon: "ArrowUpCircle",
          badge: "Planned",
          summary:
            "SAP HANA follows a Support Package Stack (SPS) + Revision model. Upgrades are performed using HANA Database Lifecycle Manager (HDBLCM) — a command-line or web-based tool.",
          steps: [
            "Download target HANA revision from SAP Software Download Center (SWDC)",
            "Pre-upgrade: run hdbupd --check (dry run without applying changes)",
            "Check compatibility matrix: SAP kernel, SAP application version vs HANA SPS",
            "Create full backup before starting upgrade",
            "As root: ./hdblcm --action=update --components=all --batch",
            "Monitor upgrade log: /hana/shared/<SID>/hdblcm/hdblcm.log",
            "Post-upgrade: verify all services in M_SERVICES, run SAP Note checks",
            "Update ABAP clients: re-logon, clear shared memory (icm/restart_sem_commands)",
          ],
          keyPoints: [
            "HDBLCM: /hana/shared/<SID>/hdblcm/hdblcm",
            "HANA SPS upgrades can be done online (tenant stays up on System DB upgrade) in MDC",
            "Always verify SAP Kernel patch level before upgrading HANA",
            "Revision numbers: 2.00.0<xx>.<yyyyy> — check SAP Note 2021789 for latest SPS",
            "Downgrade is NOT supported — test in QAS before PRD",
            "Plan maintenance window: typically 30–90 min for online upgrade",
          ],
          sapNotes: [
            { note: "2021789", desc: "SAP HANA 2.0 revision and maintenance strategy" },
            { note: "2380229", desc: "SAP HANA 2.0 upgrade guide" },
            { note: "2372899", desc: "Pre-upgrade checklist for SAP HANA" },
          ],
          links: [
            { label: "HDBLCM Upgrade Documentation", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/2c1988d620e04272aa5f96e2b28f5f38/f4a92f4041d24bd3a39e78c0acfadb99.html" },
            { label: "HANA Upgrade Best Practices", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/2380229ff5474a9082ddfb5eaa24143e.html" },
          ],
          tip: "Run upgrades first on DEV → QAS → PRD. Document exact revision before upgrade (SELECT VERSION FROM M_DATABASE). Always have rollback plan ready (restore from backup).",
        },
      ],
    },
    {
      id: "replication",
      title: "System Replication",
      nodes: [
        {
          id: "hana-sr-setup",
          title: "HANA System Replication — Setup",
          icon: "GitFork",
          badge: "HA/DR",
          summary:
            "SAP HANA System Replication (HSR) continuously ships redo log and data to a secondary system. It is the foundation for both HA (same-site failover) and DR (cross-site failover) scenarios.",
          steps: [
            "On primary: hdbnsutil -sr_enable --name=<primary_site_name>",
            "Take a data backup on primary (mandatory before enabling replication)",
            "On secondary (as <sid>adm): hdbnsutil -sr_register --remoteHost=<primary_host> --remoteInstance=<NN> --replicationMode=sync --name=<secondary_site_name>",
            "Start HANA on secondary: HDB start",
            "Check status: hdbnsutil -sr_state (on either host)",
            "Monitor replication lag: SELECT * FROM M_SYSTEM_REPLICATION",
            "Register with Pacemaker / HA cluster if using automated failover",
          ],
          keyPoints: [
            "Replication Modes: sync (zero data loss), syncmem (log in memory only), async (minimal perf impact)",
            "sync mode: PRD commit confirmed only after secondary acknowledges — suitable for <1ms latency links",
            "async mode: DR only — PRD commits without waiting for secondary",
            "Logreplay mode: secondary replays logs (available for read queries if active/active configured)",
            "Active/Active: secondary can serve read queries while replication is running",
            "Tier replication: Primary → Secondary → Tertiary (multi-tier DR chain)",
          ],
          tcodes: ["DBACOCKPIT → HANA Studio → System Replication"],
          sapNotes: [
            { note: "1999880", desc: "FAQ: SAP HANA System Replication" },
            { note: "2063657", desc: "Supported failover/takeover scenarios" },
          ],
          links: [
            { label: "HANA System Replication Guide", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/e86dc05c5b8041b698b08a29e51fbd17.html" },
          ],
          warning: "Never run hdbnsutil -sr_takeover manually on the secondary without consulting your HA cluster (Pacemaker) — this can cause split-brain if the primary is still live.",
        },
        {
          id: "hana-sr-takeover",
          title: "System Replication — Failover & Takeover",
          icon: "Shuffle",
          summary:
            "Failover (automated via Pacemaker) and takeover (manual) procedures for when the primary HANA node fails or maintenance is required.",
          steps: [
            "Automated failover: if Pacemaker is configured, it detects primary failure and promotes secondary automatically",
            "Manual takeover: On secondary host as <sid>adm: hdbnsutil -sr_takeover",
            "After takeover: verify secondary is now primary: hdbnsutil -sr_state",
            "Register old primary as new secondary: hdbnsutil -sr_register --remoteHost=<new_primary> --remoteInstance=<NN> --replicationMode=sync --name=<old_primary_site>",
            "Re-enable replication on new secondary: HDB start",
            "Verify replication resync: SELECT SECONDARY_FULLY_SYNCED FROM M_SYSTEM_REPLICATION",
            "Update SAP logon groups / message server to point to new primary",
          ],
          keyPoints: [
            "sr_takeover is irreversible immediately — the old primary loses primary status",
            "After takeover, the delta resync begins automatically — can take minutes to hours",
            "Planned takeover (for maintenance): hdbnsutil -sr_takeover --suspendPrimary (cleaner)",
            "Always update /etc/hosts or DNS if hostname changes after failover",
          ],
          sapNotes: [
            { note: "2400007", desc: "FAQ: SAP HANA 2.0 high availability" },
          ],
          links: [
            { label: "Takeover Procedure", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/123f2c8579fd452da2e7debf7cc2bd93.html" },
          ],
        },
      ],
    },
    {
      id: "ha",
      title: "High Availability (HA)",
      nodes: [
        {
          id: "hana-ha-pacemaker",
          title: "HA with Pacemaker / SBD",
          icon: "Activity",
          badge: "Production",
          summary:
            "Pacemaker is the industry-standard HA cluster manager used with HANA System Replication to automate failover. SBD (STONITH Block Device) or Azure/AWS fencing is used to prevent split-brain.",
          steps: [
            "Install HA packages: pacemaker, corosync, resource-agents-sap-hana (SLES/RHEL specific)",
            "Configure corosync.conf — define ring0/ring1 network for cluster communication",
            "Bootstrap cluster: ha-cluster-init (SLES) or pcs cluster auth (RHEL)",
            "Configure SBD STONITH device or cloud fencing agent",
            "Add SAP HANA resource agent: SAPHana resource class handles sr_takeover automatically",
            "Define constraints: SAPHana-PRD must run on primary; Virtual-IP colocated with primary",
            "Test: simulate primary failure → verify Pacemaker promotes secondary in <60 seconds",
          ],
          keyPoints: [
            "SAP-certified HA solutions: SLES HAE + SAPHanaSR, RHEL HA + resource-agents-sap",
            "SBD fencing: dedicated small iSCSI LUN visible to both nodes — prevents split-brain",
            "Azure: use azure-lb as STONITH or Azure Fence Agent",
            "AWS: use ec2-fencing with IAM role",
            "Virtual IP (VIP): floating IP that moves with primary — application always connects to VIP",
            "RTO target with automated failover: typically 120–300 seconds end-to-end",
          ],
          sapNotes: [
            { note: "2018667", desc: "Installation of SAP HANA on RHEL" },
            { note: "1984787", desc: "SUSE Linux Enterprise Server 12: Installation notes" },
            { note: "1056161", desc: "SUSE Linux priority support for SAP applications" },
          ],
          links: [
            { label: "SAP HANA HA on SLES Best Practice", url: "https://documentation.suse.com/sbp/sap-15/html/SLES4SAP-hana-sr-guide-perfopt-15/index.html" },
            { label: "SAP HANA HA on RHEL", url: "https://access.redhat.com/articles/3004101" },
          ],
          tip: "Always run crm_mon -1 after cluster configuration to verify all resources are started and constraints are satisfied before marking the system production-ready.",
        },
      ],
    },
    {
      id: "dr",
      title: "Disaster Recovery (DR)",
      nodes: [
        {
          id: "hana-dr-multitier",
          title: "DR with Multitier / Multitarget Replication",
          icon: "GitBranch",
          badge: "DR",
          summary:
            "For geographic DR, HANA supports multitier (chain: Primary → HA Secondary → DR Tertiary) and multitarget (Primary replicates to both HA Secondary and DR site simultaneously).",
          steps: [
            "Multitier: Enable SR on primary → secondary → tertiary (3 hosts)",
            "Multitarget: hdbnsutil -sr_register on DR site pointing directly to primary with --operationMode=logreplay_readaccess",
            "Verify all tiers: hdbnsutil -sr_state --sapcontrol=1",
            "Configure DR takeover procedure in your runbook — require explicit decision gate",
            "DR test: planned suspension of primary replication → takeover on DR site → validate → failback",
            "Update connection strings, DNS, and SAP logon groups after DR activation",
          ],
          keyPoints: [
            "Multitarget: PRD → HA Secondary (sync) AND PRD → DR (async) — two independent secondaries",
            "DR site typically uses async replication to avoid latency impact on production",
            "RPO for async: seconds to minutes depending on log backup schedule",
            "RTO for DR: minutes to hours depending on restart time + data sync state",
            "Always test DR quarterly — include SAP application layer validation",
            "After DR activation: old primary must NOT be started until replication is cleaned up",
          ],
          sapNotes: [
            { note: "2423036", desc: "SAP HANA multitier system replication" },
            { note: "2046080", desc: "SAP HANA multitarget replication" },
          ],
          links: [
            { label: "HANA Multitarget System Replication", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/1c5b3f1df4fa4494bb86b32b5bc72d2a.html" },
          ],
          warning: "DR activation should be treated as a major incident event — require approval from Basis Lead + Business before executing takeover. Document every step.",
        },
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring",
      nodes: [
        {
          id: "hana-monitoring-cockpit",
          title: "HANA Cockpit & Key Monitoring Views",
          icon: "Monitor",
          badge: "Daily",
          summary:
            "HANA Cockpit is the primary web-based monitoring tool. Combined with HANA system views (M_* tables), it provides complete visibility into memory, CPU, services, replication, and alerts.",
          steps: [
            "Access HANA Cockpit: https://<host>:4<instance>12 (System DB port)",
            "Check: Administration → Overview → All Services must show ACTIVE",
            "Memory: SELECT HOST, COMPONENT, USED_MEMORY_SIZE/1024/1024 FROM M_MEMORY → alert if >85% allocation",
            "Disk: SELECT HOST, USAGE_TYPE, USED_SIZE/1024/1024/1024 FROM M_DISK_USAGE",
            "Long-running statements: SELECT * FROM M_ACTIVE_STATEMENTS WHERE DURATION_MICROSEC > 60000000",
            "Replication status: SELECT SYSTEM_REPLICATION_STATUS, SECONDARY_FULLY_SYNCED FROM M_SYSTEM_REPLICATION",
            "Alerts: Administration → Alerts → configure thresholds and email notifications",
          ],
          keyPoints: [
            "Key M_* views: M_SERVICES, M_MEMORY, M_DISK_USAGE, M_ACTIVE_STATEMENTS, M_SYSTEM_REPLICATION",
            "HANA Cockpit alerts: configure for memory >85%, CPU >90%, replication lag >30s",
            "minicheck: SELECT * FROM _SYS_EPM.MINI_CHECKS_HANA (run regularly for health)",
            "Performance Analysis: HANA Cockpit → Performance → SQL Monitor",
            "Workload Analyzer: identifies rogue queries consuming memory/CPU",
            "Alert escalation: integrate with SAP Solution Manager or Cloud ALM for central alerts",
          ],
          tcodes: ["DBACOCKPIT", "RZ20", "SM21", "ST05"],
          sapNotes: [
            { note: "1999993", desc: "How-to guide: SAP HANA system monitoring" },
            { note: "2183363", desc: "Monitoring SAP HANA replication" },
          ],
          links: [
            { label: "HANA Administration Guide — Monitoring", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/b3ee5778bc2e4a089d3299b82ec762a7/9165807e2ded490ea06f46035c3e58b1.html" },
            { label: "HANA System Views Reference", url: "https://help.sap.com/docs/SAP_HANA_PLATFORM/4fe29514fd584807ac9f2a04f6754767/20cba7d075191014b47d845b8c170688.html" },
          ],
          tip: "Schedule a daily HANA healthcheck script (calling minicheck + M_MEMORY + M_DISK_USAGE) and email results to the Basis team. Proactive monitoring prevents 90% of production incidents.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// SAP MaxDB
// ─────────────────────────────────────────────
export const maxdbModule: ModuleData = {
  id: "maxdb",
  title: "SAP MaxDB",
  subtitle: "SAP MaxDB Database Administration",
  version: "MaxDB 7.9",
  sourceUrl: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362174143.html",
  overview:
    "SAP MaxDB is SAP's proprietary relational database system, originally shipped with SAP Systems up to NetWeaver 7.0. It underpins older SAP landscapes. While no longer strategic (superseded by HANA), it is still in production across thousands of SAP systems globally and requires expert Basis knowledge for administration.",
  color: "#E65100",
  sections: [
    {
      id: "getting-started",
      title: "Getting Started",
      nodes: [
        {
          id: "maxdb-overview",
          title: "SAP MaxDB — Overview & Architecture",
          icon: "Database",
          badge: "Fundamentals",
          summary:
            "SAP MaxDB is a full-featured relational database. Key administrative tools include Database Manager (dbmcli), Database Studio (GUI), and Web Database Manager (WebDBM).",
          keyPoints: [
            "Official brand name: SAP MaxDB (not just 'MaxDB')",
            "Tools: dbmcli (command line), Database Studio (Eclipse-based GUI), WebDBM (browser)",
            "Default port: 7210 (Database Manager port)",
            "OS support: Linux, Windows, AIX, HP-UX (per SAP Note 767598)",
            "Current version: 7.9 — see SAP Note 1444241 for features",
            "End of mainstream maintenance: review SAP Note 1178367 for support dates",
          ],
          sapNotes: [
            { note: "1444241", desc: "SAP MaxDB Version 7.9 — Features overview" },
            { note: "1722076", desc: "The Future of SAP MaxDB" },
            { note: "1178367", desc: "SAP MaxDB: End of Support Dates" },
            { note: "767598", desc: "Available SAP MaxDB Documentation" },
          ],
          links: [
            { label: "SAP MaxDB Help Portal", url: "https://help.sap.com/docs/SAP_MAXDB" },
            { label: "Getting Started with SAP MaxDB", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173459.html" },
            { label: "MaxDB Library 7.9", url: "https://help.sap.com/docs/SAP_NETWEAVER_DBOS/f6dc2be339de4c78b2c85f8f998a20f2/44b7012835041388e10000000a155369.html" },
            { label: "SAP MaxDB Community", url: "https://pages.community.sap.com/topics/maxdb" },
          ],
          tip: "Download MaxDB software for non-SAP customers from SAP Developer Trials (search 'SAP MaxDB'). SAP customers use Software Download Center (SWDC) — see SAP Note 1672252.",
        },
        {
          id: "maxdb-install",
          title: "Installation & Initial Setup",
          icon: "Package",
          badge: "Setup",
          summary:
            "Install MaxDB using the SDBSETUP installer on Linux/Windows. The installation creates the database software and optionally creates a first database instance.",
          steps: [
            "Download MaxDB installer from SWDC / SAP Developer Trials",
            "Linux: chmod +x SDBSETUP && ./SDBSETUP (run as root)",
            "Windows: run Setup.exe as Administrator",
            "Create a database instance: dbmcli -u control,<password> -d <DBNAME> db_create",
            "Initialize data volumes: dbmcli -u control,<password> -d <DBNAME> db_addvolume DATA 2000 PERMANENT",
            "Initialize log volumes: dbmcli -u control,<password> -d <DBNAME> db_addvolume LOG 500",
            "Start the database: dbmcli -u control,<password> -d <DBNAME> db_online",
            "Load SAP system catalog if migrating: dbmcli ... load_systab",
          ],
          links: [
            { label: "MaxDB Installation and Upgrade Guides", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173894.html" },
            { label: "MaxDB HowTo Guides", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173804.html" },
          ],
          keyPoints: [
            "Software paths: /usr/spool/sql (Linux default), C:\\sapdb (Windows default)",
            "Control user: special administrative user — not the same as DB owner (SUPERDBA)",
            "dbmsrv (Database Manager Server) must be running before issuing dbmcli commands",
            "Always verify OS kernel parameters before install on Linux (shmmax, semaphores)",
          ],
        },
      ],
    },
    {
      id: "manage",
      title: "Manage Database",
      nodes: [
        {
          id: "maxdb-start-stop",
          title: "Start / Stop MaxDB",
          icon: "Power",
          badge: "Daily Ops",
          summary:
            "MaxDB has three operational states: OFFLINE, ADMIN (maintenance), and ONLINE (production). Use dbmcli to transition between states.",
          steps: [
            "Check state: dbmcli -u control,<pwd> -d <DBNAME> db_state",
            "Start to ONLINE: dbmcli -u control,<pwd> -d <DBNAME> db_online",
            "Start to ADMIN (maintenance, no users): dbmcli -u control,<pwd> -d <DBNAME> db_admin",
            "Stop (OFFLINE): dbmcli -u control,<pwd> -d <DBNAME> db_offline",
            "Restart: db_offline then db_online in sequence",
            "Check active sessions: dbmcli -u control,<pwd> -d <DBNAME> info sessions",
          ],
          keyPoints: [
            "OFFLINE: database is completely stopped — safe for OS-level operations",
            "ADMIN: only database admin users can connect — used for backup, recovery, config changes",
            "ONLINE: normal operation mode — all users can connect",
            "dbmsrv (listener) keeps running even when DB is OFFLINE — do not kill it",
          ],
          sapNotes: [
            { note: "767598", desc: "Available SAP MaxDB Documentation" },
          ],
          links: [
            { label: "MaxDB Support Guide", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173996.html" },
          ],
        },
        {
          id: "maxdb-backup",
          title: "Backup & Recovery",
          icon: "Archive",
          badge: "Critical",
          summary:
            "MaxDB uses complete data backups and incremental log backups. Recovery requires the last complete backup plus all log backups up to the recovery point.",
          steps: [
            "Complete data backup: dbmcli -u control,<pwd> -d <DBNAME> backup_start <BackupTool_MediaName>",
            "Log backup (automatic): configure via dbmcli backup_ext_ids_get or Database Studio",
            "Schedule: set log_backup_interval in database parameters",
            "Recovery initiation: set DB to ADMIN state → dbmcli recover_start <options>",
            "Incremental recovery (point-in-time): recover_start ... UNTIL <timestamp>",
            "After recovery: dbmcli db_online to bring database back online",
          ],
          keyPoints: [
            "MaxDB supports: File-based, Pipe-based, and Backint-based backups",
            "Medium name = logical backup target name defined in dbmcli",
            "Log auto-backup: configure max_log_queue to avoid log full situations",
            "Log full = DB becomes OFFLINE — critical incident requiring immediate response",
            "Always keep at least 3 generations of full backups",
          ],
          sapNotes: [
            { note: "1642148", desc: "FAQ: Database backup and recovery" },
          ],
          links: [
            { label: "MaxDB Backup HowTo", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173804.html" },
          ],
          warning: "If log volume becomes full, MaxDB stops accepting writes and goes OFFLINE. Monitor log usage daily. Pre-emptively trigger log backups when log usage exceeds 70%.",
        },
        {
          id: "maxdb-perf",
          title: "Performance & Tuning",
          icon: "TrendingUp",
          summary:
            "MaxDB performance tuning focuses on data cache hit ratio, log queue usage, bad indexes, and long-running SQL. Database Studio's Performance Monitor is the primary tool.",
          steps: [
            "Launch Database Studio → connect to DB → Performance → Performance Monitor",
            "Check data cache hit ratio: should be >99% for OLTP workloads",
            "Review bad indexes: Tools → Database Analyzer → Index Statistics",
            "Identify expensive SQL: use sqlplan (query plan analysis) in xsqlplan utility",
            "Adjust data cache size: ALTER SESSION SET <data_cache_pages> = <value>",
            "Run Database Analyzer (dbanalyzer) weekly for automated recommendations",
          ],
          keyPoints: [
            "Data cache miss > 1% in steady state = consider increasing DATA_CACHE parameter",
            "Lock contention: check via info lockstatistics in dbmcli",
            "Run RUNSTATS on busy tables to keep statistics up to date",
            "MaxDB Optimizer uses statistics for query plans — stale stats = slow queries",
          ],
          links: [
            { label: "Tuning SAP MaxDB", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362174025.html" },
            { label: "MaxDB Features in SAP Notes", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362174230.html" },
          ],
        },
      ],
    },
    {
      id: "upgrade",
      title: "Upgrade",
      nodes: [
        {
          id: "maxdb-upgrade",
          title: "MaxDB Version Upgrade",
          icon: "ArrowUpCircle",
          summary:
            "MaxDB upgrades follow SAP's standard installation update process. The database must be in OFFLINE state before applying a new software version.",
          steps: [
            "Check current version: dbmcli -u control,<pwd> -d <DBNAME> version",
            "Download new MaxDB installer from SWDC",
            "Stop SAP application servers",
            "Stop MaxDB: dbmcli db_offline",
            "Stop dbmsrv: x_server stop",
            "Run new installer: ./SDBSETUP (it detects existing installation and upgrades software)",
            "Start dbmsrv: x_server start",
            "Perform AUTOCHECK: dbmcli -u control,<pwd> -d <DBNAME> db_admin → db_online",
            "Verify: dbmcli version → confirm new version",
            "Start SAP application servers and perform smoke test",
          ],
          sapNotes: [
            { note: "1444241", desc: "MaxDB 7.9 version notes" },
            { note: "1722076", desc: "The Future of SAP MaxDB — upgrade path guidance" },
          ],
          links: [
            { label: "MaxDB Installation and Upgrade", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173894.html" },
          ],
          tip: "Before any MaxDB upgrade, take a complete data backup and document the current version. Always test the upgrade procedure in DEV/QAS before PRD. Keep the previous installer available for rollback.",
        },
      ],
    },
    {
      id: "support",
      title: "Support & Resources",
      nodes: [
        {
          id: "maxdb-faq",
          title: "FAQ & Common Issues",
          icon: "HelpCircle",
          badge: "Support",
          summary:
            "The most common MaxDB issues involve log full events, backup failures, connectivity problems (dbmsrv not running), and slow query performance.",
          keyPoints: [
            "Log full: emergency log backup → check log volume size → resize if needed",
            "DB cannot start: check x_server status → review knltrace (kernel trace) in /usr/spool/sql/wrk/<DBNAME>",
            "Connection refused: verify dbmsrv running (x_server status), check port 7210",
            "Slow performance: run Database Analyzer → rebuild statistics → check indexes",
            "High lock waits: check info locks in dbmcli → identify and kill blocking session",
          ],
          sapNotes: [
            { note: "767598", desc: "Available SAP MaxDB Documentation" },
          ],
          links: [
            { label: "SAP MaxDB FAQ", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362174019.html" },
            { label: "SAP MaxDB FAQ Notes", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173553.html" },
            { label: "MaxDB Support Guide", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173996.html" },
            { label: "SAP MaxDB Services", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362174171.html" },
            { label: "MaxDB Community", url: "https://community.sap.com/t5/c-khhcw49343/SAP+MaxDB/pd-p/571267881358674984386133031541144" },
          ],
        },
        {
          id: "maxdb-learning",
          title: "Learning Map & Education",
          icon: "GraduationCap",
          summary:
            "Official SAP MaxDB education resources and learning maps for administrators.",
          links: [
            { label: "SAP MaxDB Education Portal", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173685.html" },
            { label: "SAP MaxDB Learning Map", url: "https://maxdb.sap.com/training/SAP_MaxDB_learning_map.htm" },
            { label: "SAP MaxDB Events", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173580.html" },
            { label: "SAP Community — MaxDB", url: "https://pages.community.sap.com/topics/maxdb" },
          ],
          keyPoints: [
            "Learning Map covers: Installation, Administration, Backup/Recovery, Performance, Migration",
            "SAP MaxDB Education courses available through SAP Learning Hub",
          ],
        },
      ],
    },
  ],
};

// Master registry
export const moduleRegistry: Record<string, ModuleData> = {
  hana: hanaModule,
  maxdb: maxdbModule,
};
