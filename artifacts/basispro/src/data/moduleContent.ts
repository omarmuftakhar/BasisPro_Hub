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
      id: "high-availability",
      title: "High Availability & Hot Standby",
      nodes: [
        {
          id: "maxdb-hotstandby-overview",
          title: "Hot Standby System — Architecture & Concept",
          icon: "Shield",
          badge: "Mission Critical",
          summary:
            "SAP MaxDB supports a Hot Standby configuration using a shared log area combined with third-party cluster software and storage replication. This is the most advanced HA approach for MaxDB and SAP liveCache. The solution is particularly critical for SAP SCM scenarios requiring liveCache high availability.",
          keyPoints: [
            "Architecture: two clustered servers share access to the log volumes on storage; data volumes are replicated via storage-level cloning",
            "Third-party requirement: SAP MaxDB Hot Standby MUST be implemented by SAP-certified third-party vendors (see SAP Note 3534972)",
            "SAP Note 3534972 lists all certified Hot Standby implementations — no other implementations are supported",
            "The standby runs on a SECONDARY server and maintains its own data volume copy",
            "Standby continuously reads from the shared log volume of the PRIMARY to stay in sync",
            "If sync gap is too large, standby triggers a storage-level full data clone from the primary — WITHOUT interrupting primary operations",
            "No separate log shipping mechanism is needed — built into the hot standby protocol",
            "No permanent hardware-based volume synchronization during MaxDB runtime — only shared log area is continuously accessible",
            "Primary benefit for liveCache: eliminates long-running rollback operations after crash; prevents cold-restart performance degradation",
            "Failover time is dramatically faster than traditional MaxDB restart with recovery",
          ],
          sapNotes: [
            { note: "3534972", desc: "SAP MaxDB/liveCache Hot Standby solutions — certified implementations" },
          ],
          links: [
            { label: "MaxDB Hot Standby (Shared Log Area)", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173723.html" },
            { label: "HowTo: Standby System (Recovery from Log Backup)", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173875.html" },
          ],
          warning: "Do NOT attempt to implement MaxDB Hot Standby without a certified third-party vendor library. Without the vendor library implementing the Hot Standby API, the feature cannot function.",
          tip: "Hot standby is most valuable for SAP liveCache (used in SAP SCM/APO/IBP). For pure MaxDB without liveCache, evaluate if simpler HA options (cluster + cold standby) meet your RTO requirements.",
        },
        {
          id: "maxdb-hotstandby-components",
          title: "Hot Standby — Required Building Blocks",
          icon: "Layers",
          badge: "Infrastructure",
          summary:
            "Setting up MaxDB Hot Standby requires specific IT infrastructure components: two clustered servers, shared-access storage for log volumes, separate data volumes with fast-clone capability, and a certified third-party vendor library integrated into the MaxDB RTE.",
          keyPoints: [
            "Two clustered servers: active (primary) and passive (standby) — both must run MaxDB with identical version",
            "Shared-access storage for LOG volumes: both nodes must access the same physical log volume simultaneously",
            "Separate data volumes per node: each node maintains its own data volume copy",
            "Fast data clone capability: storage must support full physical copy of data volumes WITHOUT blocking primary read/write",
            "Vendor library: third-party library integrates into MaxDB RTE (runtime environment) and implements the Hot Standby API",
            "Cluster software: typically provided by the same vendor — manages VIP failover and disk group management",
            "DBM commands for Hot Standby: the vendor-extended MaxDB DBM handles all hot standby lifecycle operations",
            "SAP MaxDB Database Manager GUI: Hot Standby concept is also integrated into the GUI for administration",
          ],
          steps: [
            "Step 1: Verify storage vendor supports MaxDB Hot Standby API — check SAP Note 3534972",
            "Step 2: Configure two clustered servers with identical MaxDB installation",
            "Step 3: Set up shared log volume accessible by BOTH nodes simultaneously",
            "Step 4: Set up separate data volumes for each node on storage that supports fast cloning",
            "Step 5: Install vendor cluster software and register virtual IP (VIP) for MaxDB service name",
            "Step 6: Install vendor Hot Standby library into MaxDB RTE directory",
            "Step 7: Configure MaxDB to load vendor library at startup",
            "Step 8: Start primary MaxDB in normal mode; then start standby MaxDB in hot standby mode via DBM",
            "Step 9: Verify standby is reading from shared log and applying changes: check via DBM hot standby status commands",
            "Step 10: Test failover procedure in a maintenance window before go-live",
          ],
          sapNotes: [
            { note: "3534972", desc: "Certified Hot Standby implementations and vendor list" },
          ],
        },
        {
          id: "maxdb-hotstandby-ops",
          title: "Hot Standby — How It Works & Operations",
          icon: "RefreshCw",
          badge: "Operations",
          summary:
            "Understanding the operational flow of MaxDB Hot Standby is essential for Basis consultants responsible for the system. The standby continuously applies log changes; in case of primary failure, cluster software triggers VIP failover and the standby is promoted.",
          keyPoints: [
            "NORMAL OPERATION: Primary MaxDB runs normally; writes go to data volumes + shared log volume",
            "STANDBY SYNC: Standby MaxDB reads shared log volume continuously; applies redo to its own data volumes",
            "INITIAL SYNC / RE-SYNC: If standby cannot sync from logs alone (e.g. after long offline period), it triggers a storage-level data volume clone from primary",
            "CLONE PROCESS: Vendor library orchestrates clone — primary remains fully operational during clone",
            "SPLIT: After clone completes, standby data volume is split from primary and then synced via shared logs",
            "FAILOVER: On primary failure, cluster software detects failure → moves VIP to standby node → standby MaxDB is promoted to primary",
            "POST-FAILOVER: Standby (now primary) opens database — since it was hot, no long recovery is needed",
            "FAILBACK: After original primary is repaired, it can rejoin as new standby — requires re-sync via storage clone",
          ],
          links: [
            { label: "MaxDB Hot Standby Documentation", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173723.html" },
            { label: "Standby System Recovery from Log Backup", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173875.html" },
          ],
          tip: "Document your vendor's exact DBM commands for hot standby monitoring, failover trigger, and re-sync. These differ between implementations but always follow the MaxDB Hot Standby API contract.",
        },
        {
          id: "maxdb-cluster-ha",
          title: "Traditional Cluster HA (Without Hot Standby)",
          icon: "Server",
          badge: "HA",
          summary:
            "For MaxDB systems where hot standby vendor solutions are not available or not required, traditional Linux/Windows cluster HA with shared disk is the alternative. This gives protection against server failure but has a longer failover time due to cold MaxDB startup and potential recovery.",
          keyPoints: [
            "Traditional HA: cluster software (Pacemaker, Veritas, IBM) monitors MaxDB process; on failure, starts MaxDB on secondary node",
            "Shared storage: both nodes access same LUN/filesystem — only one node mounts it at a time",
            "Failover time: longer than hot standby — includes cluster detection time + MaxDB startup + potential log replay",
            "For liveCache: traditional HA may result in long rollback and cold-start performance degradation — hot standby preferred",
            "Linux Pacemaker: MaxDB/liveCache OCF (Open Cluster Framework) resource agent available",
            "Configure MaxDB to use the cluster's virtual hostname, not the physical hostname",
            "Test failover quarterly and after every MaxDB or cluster software maintenance",
          ],
          sapNotes: [
            { note: "3534972", desc: "Hot Standby vs traditional HA — when to use each" },
          ],
        },
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring & Troubleshooting",
      nodes: [
        {
          id: "maxdb-monitoring",
          title: "MaxDB Monitoring — Knldiag & Database Studio",
          icon: "Activity",
          badge: "Daily Ops",
          summary:
            "MaxDB monitoring is done via DBM CLI, Database Studio, and SAP CCMS. The kernel diagnostic file (knldiag) is the primary log for MaxDB issues. Key metrics: cache hit ratio, data volume fill level, log volume usage, and active sessions.",
          steps: [
            "CHECK MaxDB status: dbmcli -d <DBNAME> -u DBM,<password> db_state",
            "CHECK data volume usage: dbmcli -d <DBNAME> -u DBM,<pw> db_fill",
            "CHECK cache hit ratio (target >95%): dbmcli -d <DBNAME> -u DBM,<pw> info cache",
            "VIEW kernel diagnostic log: tail -100 /sapdb/<DBNAME>/db/wrk/knldiag",
            "DATABASE STUDIO: connect to <DBNAME> → Performance → System Overview",
            "CCMS monitoring: RZ20 → MaxDB Alerts monitor template",
            "CHECK active sessions: SQL → SELECT * FROM MONITOR_SESSIONS",
            "LOG full emergency: dbmcli -d <DBNAME> -u DBM,<pw> backup_start <config> to auto_log",
          ],
          keyPoints: [
            "knldiag: MaxDB equivalent of Oracle alert log — check daily for ERR entries",
            "Data volume > 90%: extend or add data volume immediately via Database Studio or dbmcli",
            "Log volume full: triggers immediate freeze of all writes — extend log volume or initiate log backup",
            "Cache hit ratio < 90%: increase data cache size in MaxDB parameters",
            "MONITOR_* system tables: MaxDB internal monitoring views (similar to Oracle v$ views)",
            "SAP Note 1928533 — MaxDB diagnosis and monitoring guide",
          ],
          tcodes: ["DB13", "DB12", "RZ20", "SM21"],
          sapNotes: [
            { note: "1928533", desc: "MaxDB diagnosis and monitoring in SAP landscapes" },
          ],
          tip: "Set up OS-level monitoring (Nagios/Prometheus/Zabbix) to monitor knldiag for ERR strings and check dbmcli db_fill output against thresholds — faster than waiting for CCMS polling.",
        },
        {
          id: "maxdb-troubleshoot",
          title: "Common MaxDB Issues & Fixes",
          icon: "Wrench",
          badge: "Troubleshooting",
          summary:
            "The most common MaxDB issues are log full, data volume full, connectivity issues, and MaxDB kernel crashes. Each has a specific resolution path documented in SAP Notes.",
          keyPoints: [
            "LOG FULL: dbmcli → backup_start <config> to auto_log — perform immediate log backup; then investigate why scheduled log backups failed",
            "DATA VOLUME FULL: Database Studio → Configuration → Volumes → Add Volume; or dbmcli -d <DBNAME> vol_add DATA <path>",
            "MaxDB not starting: check knldiag for last error; check if data files are accessible; check lock files in /sapdb/<DBNAME>/db/wrk/",
            "Connection refused: check MaxDB listener (x_server process) — xserver start",
            "OOM (Out of Memory): check MaxDB parameter 'CACHE_SIZE' and 'DATA_CACHE' — reduce if OS is swapping",
            "Backup failure: check backup medium configuration (dbmcli medium_get) and available disk space",
          ],
          sapNotes: [
            { note: "767598", desc: "MaxDB — knldiag error messages reference" },
            { note: "1928533", desc: "MaxDB problem diagnosis in SAP systems" },
          ],
          links: [
            { label: "MaxDB Support Content", url: "https://help.sap.com/docs/SUPPORT_CONTENT/maxdb/3362173723.html" },
          ],
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

// ─────────────────────────────────────────────
// Sybase ASE
// ─────────────────────────────────────────────
export const sybaseModule: ModuleData = {
  id: "sybase",
  title: "SAP Sybase ASE",
  subtitle: "Adaptive Server Enterprise Administration",
  version: "SAP ASE 16.0 SP04+",
  sourceUrl: "https://help.sap.com/docs/SAP_ASE",
  overview:
    "SAP Adaptive Server Enterprise (ASE) is a high-performance relational database used extensively in SAP Business Suite landscapes. As a Senior Basis Consultant, you manage ASE installation, configuration, backup/recovery, replication, high availability, performance tuning, and upgrades. ASE uses its own internal language (Transact-SQL) and requires deep knowledge of devices, segments, and server parameters.",
  color: "#E53935",
  sections: [
    {
      id: "getting-started",
      title: "Getting Started",
      nodes: [
        {
          id: "sybase-overview",
          title: "SAP ASE — Architecture Overview",
          icon: "Database",
          badge: "Foundation",
          summary:
            "SAP ASE (formerly Sybase ASE) is a client-server RDBMS based on a shared-memory, multi-threaded engine. It runs as the 'dataserver' process and manages databases, devices, logins, stored procedures, and transactions through Transact-SQL.",
          keyPoints: [
            "ASE Engine: Multi-threaded, shared-memory architecture — single 'dataserver' OS process",
            "Key databases: master (catalog), model (template), sybsystemprocs, sybsecurity, tempdb, user DBs",
            "Devices: ASE uses logical devices mapped to OS files or raw partitions — always pre-allocate",
            "Interfaces file: $SYBASE/interfaces maps server names to host:port — critical for connectivity",
            "Default port: 5000 (TCP); check with netstat -tlnp | grep 5000",
            "Key tools: isql (CLI), SAP ASE Cockpit (web GUI), sybsystemprocs stored procs, dbcc commands",
            "Character sets: configure during installation — must match SAP application server settings",
            "SAP ASE supports row-level locking (ASE 15.x+), table-level, and page-level locking modes",
            "Key environment variables: SYBASE, SYBASE_ASE, DSQUERY, PATH, LD_LIBRARY_PATH",
          ],
          links: [
            { label: "SAP ASE Documentation Hub", url: "https://help.sap.com/docs/SAP_ASE" },
            { label: "SAP ASE 16.0 Admin Guide", url: "https://help.sap.com/docs/SAP_ASE/493dce9cd45a4de89cbbdda7f84a4cbe/672ef48c6663101482f2b6c3c9fb9c23.html" },
          ],
          tip: "Always check $SYBASE/ASE-<version>/install/RUN_<servername> for the exact startup parameters used for your dataserver.",
        },
        {
          id: "sybase-install",
          title: "Installation & Initial Configuration",
          icon: "Server",
          badge: "Setup",
          summary:
            "SAP ASE installation in an SAP landscape is typically performed via the SAP Software Provisioning Manager (SWPM) or the ASE installer directly. Post-installation steps include configuring max memory, setting up backup server, creating user databases, and connecting the SAP kernel.",
          steps: [
            "1. Download ASE software from SAP Software Centre (SAP_ASE / SYBESE package)",
            "2. Pre-check OS: glibc version, kernel semaphores (semmsl ≥ 250), shared memory limits",
            "3. Set ulimits: nofile ≥ 65536, nproc ≥ 65536 in /etc/security/limits.conf",
            "4. Run installer: ./setup.bin -i console (or use SWPM for SAP system installs)",
            "5. During install: choose Installation Type = 'Configure new SAP ASE'",
            "6. Set master device size ≥ 500 MB; sysprocs device ≥ 250 MB",
            "7. Post-install: apply latest EBF (Emergency Bug Fix) from SAP Support Portal",
            "8. Tune 'max memory' parameter: sp_configure 'max memory', <value_in_2KB_pages>",
            "9. Set 'number of user connections', 'number of locks', 'procedure cache percent'",
            "10. Configure Backup Server (SAP_BS) for backup operations",
            "11. Test connectivity: isql -S<servername> -Usa -P<password> → go",
            "12. Run sp_configure to review and document all non-default parameters",
          ],
          keyPoints: [
            "ASE memory unit = 2 KB pages; convert MB to pages: MB × 512 = pages",
            "Critical init params: max memory, number of user connections, procedure cache percent, lock scheme",
            "interfaces file entry must exist on both DB server and all app servers",
            "SAP recommends enabling 'enable CIS' and 'enable xact coordination' for distributed transactions",
            "Backup Server (sybbackup) must be running for all dump/load operations",
          ],
          sapNotes: [
            { note: "1618161", desc: "SAP ASE — supported OS platforms and versions" },
            { note: "1015289", desc: "SAP on Sybase ASE — installation and configuration" },
          ],
          links: [
            { label: "SAP ASE Installation Guide", url: "https://help.sap.com/docs/SAP_ASE/493dce9cd45a4de89cbbdda7f84a4cbe/672ef48c6663101482f2b6c3c9fb9c23.html" },
          ],
        },
      ],
    },
    {
      id: "manage",
      title: "Manage Database",
      nodes: [
        {
          id: "sybase-startstop",
          title: "Start / Stop SAP ASE",
          icon: "Power",
          badge: "Daily Ops",
          summary:
            "ASE is controlled through the RUN_<server> startup script and the 'shutdown' Transact-SQL command. Always stop gracefully using isql to allow checkpoints and transaction completion.",
          steps: [
            "START ASE:",
            "su - <syb_user>",
            "source $SYBASE/SYBASE.sh",
            "$SYBASE/$SYBASE_ASE/bin/startserver -f $SYBASE/$SYBASE_ASE/install/RUN_<SERVERNAME>",
            "START Backup Server (required for backups):",
            "$SYBASE/$SYBASE_ASE/bin/startserver -f $SYBASE/$SYBASE_ASE/install/RUN_<SERVERNAME>_BS",
            "VERIFY ASE is running:",
            "isql -S<SERVERNAME> -Usa -P<password> -Q 'select @@servername, getdate()'",
            "SHUTDOWN ASE gracefully:",
            "isql -S<SERVERNAME> -Usa -P<password>",
            "1> shutdown with nowait",
            "2> go",
            "STOP via OS (last resort — risk of corrupt transaction log):",
            "kill -15 <dataserver_pid>",
          ],
          keyPoints: [
            "Always source SYBASE.sh before any ASE command to set correct environment",
            "'shutdown' waits for all active transactions to complete — preferred method",
            "'shutdown with nowait' forces checkpoint and immediate stop — use in emergencies only",
            "Backup Server must be started separately — it is its own process (sybbackup)",
            "Check ASE error log after start: $SYBASE/$SYBASE_ASE/install/<SERVERNAME>.log",
          ],
          tcodes: ["DB13", "DB12"],
          warning: "Never kill -9 the dataserver process — this will corrupt the transaction log and require recovery.",
          tip: "Create a simple shell script to start ASE + Backup Server + optionally XP Server in sequence, with sleep delays between each.",
        },
        {
          id: "sybase-backup",
          title: "Backup & Recovery",
          icon: "Archive",
          badge: "Critical",
          summary:
            "ASE uses DUMP DATABASE and DUMP TRANSACTION commands. Backups require an active Backup Server. The backup strategy must include full database dumps plus transaction log dumps to minimize RPO.",
          steps: [
            "FULL database dump:",
            "dump database <dbname> to '/backup/path/<dbname>.dmp' with compression = 101",
            "TRANSACTION LOG dump (incremental):",
            "dump transaction <dbname> to '/backup/path/<dbname>_log.dmp'",
            "RESTORE — full database load:",
            "load database <dbname> from '/backup/path/<dbname>.dmp'",
            "RESTORE — apply transaction log dumps in sequence:",
            "load transaction <dbname> from '/backup/path/<dbname>_log1.dmp'",
            "load transaction <dbname> from '/backup/path/<dbname>_log2.dmp'",
            "BRING DB ONLINE after recovery:",
            "online database <dbname>",
            "VERIFY backup via BR*Tools (SAP managed ASE landscapes):",
            "brbackup -d ase -t online -m all",
          ],
          keyPoints: [
            "Backup Server must be running before any dump/load — check sybbackup process",
            "Transaction log must not be 'trunc log on chkpt' if you need point-in-time recovery",
            "'select name, trunc_log on chkpt from sysdatabases' — verify database options",
            "Use 'dump database ... with init' to overwrite existing dump file",
            "Load order is always: full dump → log dump 1 → log dump 2 → ... → online database",
            "Stripe dumps across multiple files for large DBs: 'dump database ... to \"/dev/rmt0\" stripe on \"/dev/rmt1\"'",
          ],
          sapNotes: [
            { note: "1602074", desc: "BR*Tools support for SAP ASE databases" },
            { note: "1748888", desc: "ASE transaction log — dump and management" },
          ],
          links: [
            { label: "ASE Backup and Recovery Guide", url: "https://help.sap.com/docs/SAP_ASE/493dce9cd45a4de89cbbdda7f84a4cbe/672ef48c6663101482f2b6c3c9fb9c23.html" },
          ],
          warning: "If transaction log is full, ASE will freeze all write activity. Emergency fix: dump transaction <db> with truncate_only — but you LOSE recoverability for that period.",
          tip: "Schedule: Full dump Sunday night, log dumps every 2–4 hours on weekdays. Use DBA Planning Calendar (DB13) if integrated with SAP.",
        },
        {
          id: "sybase-users",
          title: "User & Login Management",
          icon: "Users",
          badge: "Security",
          summary:
            "ASE separates server-level logins from database-level users. A login connects to ASE; a database user maps the login to a specific database. Roles are granted at the server level.",
          steps: [
            "CREATE server login:",
            "sp_addlogin '<loginname>', '<password>', '<default_db>'",
            "ADD login as database user:",
            "use <dbname>",
            "go",
            "sp_adduser '<loginname>', '<username_in_db>'",
            "GRANT object permission in DB:",
            "grant select on <tablename> to <username>",
            "GRANT server-level role:",
            "grant role sa_role to <loginname>",
            "LIST all logins: select name, dbname from master..syslogins",
            "LIST DB users: select name, uid from sysusers",
            "LOCK a login:",
            "sp_modifylogin '<loginname>', 'locked', true",
            "DROP login (must drop DB user first):",
            "sp_dropuser '<username>'",
            "sp_droplogin '<loginname>'",
          ],
          keyPoints: [
            "Key roles: sa_role (system admin), sso_role (security officer), oper_role (operator)",
            "SAP systems typically use a dedicated login (e.g. 'sap<SID>' or 'sa') — never share SA password",
            "sp_displaylogins — comprehensive login audit report",
            "sp_helpuser — shows all users and their roles in current database",
            "'probe' login is special — used by ASE for SRS replication; do not drop",
          ],
          tcodes: ["SU01", "SUIM"],
          tip: "Audit all logins with 'sa_role' using: select l.name from master..syslogins l, master..syssrvroles r, master..sysrolemember rm where r.name='sa_role' and r.srid=rm.srid and rm.lrid=l.suid",
        },
        {
          id: "sybase-space",
          title: "Space Management",
          icon: "HardDrive",
          badge: "Daily Ops",
          summary:
            "ASE manages disk space through logical devices (files or raw partitions). Each database is allocated segments across one or more devices. Space must be monitored proactively to prevent log-full situations.",
          steps: [
            "CHECK database size and free space:",
            "sp_spaceused",
            "CHECK device free space:",
            "sp_helpdevice",
            "sp_helpsegment",
            "ADD new device to ASE:",
            "disk init name = '<dev_name>', physname = '/data/ase/<dev_name>.dat', size = '10240M'",
            "EXTEND existing database with new device:",
            "alter database <dbname> on <dev_name> = 2048",
            "EXTEND transaction log segment on a device:",
            "alter database <dbname> log on <logdev_name> = 1024",
            "CHECK transaction log usage:",
            "dbcc checktable(syslogs)",
            "use <dbname>",
            "go",
            "sp_helpsegment logsegment",
          ],
          keyPoints: [
            "Keep transaction log on a SEPARATE device from data — never mix on same device",
            "Alert threshold: configure threshold procedures with sp_addthreshold to auto-alert at 80% log full",
            "sp_helpthreshold — shows configured log thresholds",
            "Extend database before it runs full — ASE does NOT auto-extend like other RDBMS",
            "Device size is fixed at init time; use 'disk resize' (ASE 15.7+) to grow an existing device",
          ],
          sapNotes: [
            { note: "1740571", desc: "ASE log segment full — causes and resolution" },
          ],
          warning: "If logsegment fills 100%, all writes STOP. Always set a threshold procedure that dumps the log or alerts your team.",
        },
        {
          id: "sybase-performance",
          title: "Performance Tuning",
          icon: "Activity",
          badge: "Advanced",
          summary:
            "ASE performance is tuned through configuration parameters, index maintenance, query plan analysis (showplan), and monitoring through stored procedures like sp_sysmon and optdiag.",
          steps: [
            "RUN sp_sysmon (comprehensive performance snapshot):",
            "sp_sysmon '00:05:00'",
            "CHECK cache hit ratio (target > 95%):",
            "sp_sysmon '00:01:00', 'noclear', 'cache'",
            "IDENTIFY long-running queries:",
            "select spid, status, cmd, loginame, hostname from master..sysprocesses where status = 'running'",
            "KILL blocking process:",
            "kill <spid>",
            "ANALYZE query plan:",
            "set showplan on",
            "set noexec on",
            "<your query>",
            "go",
            "REBUILD indexes:",
            "reorg rebuild <tablename>",
            "UPDATE statistics:",
            "update statistics <tablename>",
          ],
          keyPoints: [
            "Cache hit ratio below 90%: increase 'total data cache size' via sp_configure",
            "Procedure cache: if sp_sysmon shows >20% procedure cache washouts, increase 'procedure cache percent'",
            "Use 'set statistics io on' and 'set statistics time on' to profile queries",
            "optdiag — reads and writes optimizer statistics; use to fix bad query plans",
            "max worker processes: must be ≥ number of user connections for parallel queries",
            "Lock contention: use 'select spid, blocked from master..sysprocesses where blocked > 0' to identify",
          ],
          tip: "sp_sysmon output is the most important ASE diagnostic. Run it during peak hours and compare against baseline snapshots to identify degradation.",
        },
      ],
    },
    {
      id: "replication",
      title: "Replication (ASE Replication Server)",
      nodes: [
        {
          id: "sybase-rep-overview",
          title: "Replication Server Architecture",
          icon: "RefreshCw",
          badge: "Advanced",
          summary:
            "SAP Replication Server (SRS) is a separate product that replicates data between ASE databases in real-time using a log-based replication model. SRS reads the ASE transaction log via a RepAgent thread running inside ASE.",
          keyPoints: [
            "Components: Primary ASE (source) → RepAgent thread → SRS (Replication Server) → Replicate ASE (target)",
            "RepAgent: runs inside ASE as a thread; must be enabled per database",
            "Replication Server uses RSSD database (its own ASE DB) to store replication metadata",
            "Stable queues: SRS uses disk-based queues (inbound/outbound) to buffer replicated data",
            "latency monitoring: 'admin who, sqt' in isql connected to SRS",
            "Replication definitions define which tables/columns/operations are replicated",
            "Subscriptions bind replication definitions to a replicate connection",
          ],
          steps: [
            "ENABLE RepAgent on primary database:",
            "sp_config_rep_agent <dbname>, 'enable', '<rs_servername>', '<rs_username>', '<rs_password>'",
            "START RepAgent:",
            "sp_start_rep_agent <dbname>",
            "CHECK RepAgent status:",
            "sp_help_rep_agent <dbname>",
            "CONNECT to Replication Server (isql -SRS_SERVER):",
            "admin who",
            "go",
            "CHECK subscription status:",
            "check subscription all for <repdef> with replicate at <replicate_ds.db>",
          ],
          sapNotes: [
            { note: "1651844", desc: "SAP Replication Server — overview and support" },
          ],
          links: [
            { label: "SAP Replication Server Documentation", url: "https://help.sap.com/docs/SAP_REPLICATION_SERVER" },
          ],
          tip: "Monitor SRS latency continuously — if stable queues grow large, the replicate system may be down or overloaded. Use 'admin who, sqt' and 'admin stats, rsi' for diagnostics.",
        },
        {
          id: "sybase-rep-setup",
          title: "Setting Up Replication",
          icon: "Layers",
          badge: "Advanced",
          summary:
            "Setting up ASE replication requires configuration on both primary and replicate sides, plus Replication Server. The process involves creating replication definitions, subscriptions, and connections.",
          steps: [
            "Step 1: Install and configure Replication Server (rs_init utility)",
            "Step 2: Create RSSD database on a designated ASE instance",
            "Step 3: Grant RepAgent permissions in master: sp_addlogin '<rs_maint_user>', '<password>'",
            "Step 4: On primary ASE — grant RepAgent access: sp_adduser '<rs_maint_user>'",
            "Step 5: Enable logging for all columns: sp_setreplicate <tablename>, true",
            "Step 6: Create replication definition in RS isql: create replication definition <repdef> with primary at <primary_ds.db> ....",
            "Step 7: Create subscription: create subscription <sub> for <repdef> with replicate at <replicate_ds.db>",
            "Step 8: Activate subscription: activate subscription <sub> for <repdef> with replicate at <replicate_ds.db>",
            "Step 9: Validate subscription: check subscription <sub> for <repdef> with replicate at <replicate_ds.db>",
          ],
          warning: "All tables to be replicated must have a unique index (primary key equivalent) — ASE RepAgent requires this to identify rows for replication.",
        },
      ],
    },
    {
      id: "high-availability",
      title: "High Availability",
      nodes: [
        {
          id: "sybase-ha-overview",
          title: "ASE High Availability — Companion Configuration",
          icon: "Shield",
          badge: "Mission Critical",
          summary:
            "SAP ASE HA uses the 'ASE Companion' configuration — two ASE servers share a common set of disk resources. If the primary fails, the companion takes over. This requires cluster software (e.g. Veritas Cluster, IBM HACMP, or Linux Pacemaker).",
          keyPoints: [
            "Two modes: failover (companion is standby) and failback (primary reclaims resources)",
            "Both ASEs must be identical version and configuration",
            "Shared storage holds the data and log devices — must be accessible by both nodes",
            "ASE HA is configured via: sp_companion procedure",
            "Virtual server name: clients connect to virtual IP/name, not physical server name",
            "Cluster software manages IP failover and disk group mounting",
            "SAP Note 1612888 — configuring ASE companion HA",
          ],
          steps: [
            "Step 1: Install identical ASE version on both nodes",
            "Step 2: Configure cluster software (VCS/HACMP/Pacemaker) to manage VIP and disk groups",
            "Step 3: On primary ASE: sp_companion '<companion_servername>', configure, with_proxydb",
            "Step 4: Test failover: cluster software initiates VIP and disk group move",
            "Step 5: On companion: sp_companion '<primary_servername>', failover",
            "Step 6: After primary is restored: sp_companion '<companion_servername>', failback, with_proxydb",
          ],
          sapNotes: [
            { note: "1612888", desc: "SAP ASE Companion — HA configuration guide" },
            { note: "1828015", desc: "ASE Always-On — new HA option in ASE 15.7+" },
          ],
          links: [
            { label: "ASE High Availability Guide", url: "https://help.sap.com/docs/SAP_ASE/493dce9cd45a4de89cbbdda7f84a4cbe/672ef48c6663101482f2b6c3c9fb9c23.html" },
          ],
        },
        {
          id: "sybase-alwayson",
          title: "ASE Always-On (Warm Standby)",
          icon: "Zap",
          badge: "ASE 15.7+",
          summary:
            "ASE Always-On is a warm standby option available from ASE 15.7. It uses Replication Server internally to maintain a secondary ASE in near-real-time sync. Failover is near-instantaneous and does not require shared storage.",
          keyPoints: [
            "Always-On uses SRS internally — a Replication Server instance is auto-configured",
            "Does NOT require shared storage — secondary has its own devices",
            "Primary and secondary can be geographically separated (DR use case)",
            "Clients use a 'fault manager' or HADR connection string to auto-redirect",
            "Failover time: typically < 60 seconds",
            "Supported from: ASE 15.7 ESD#2 onwards",
            "SAP Note 1850233 — SAP landscape support with ASE Always-On",
          ],
          sapNotes: [
            { note: "1850233", desc: "SAP ASE Always-On HA/DR support for SAP landscapes" },
            { note: "2253955", desc: "ASE Always-On configuration and best practices" },
          ],
        },
      ],
    },
    {
      id: "upgrade",
      title: "Upgrade & Migration",
      nodes: [
        {
          id: "sybase-upgrade",
          title: "ASE Version Upgrade",
          icon: "TrendingUp",
          badge: "Planned",
          summary:
            "ASE upgrades require careful preparation — checking compatibility matrices, running sybsystemprocs upgrades, and applying EBFs. Always test in sandbox first. Downgrade is possible only via backup restore.",
          steps: [
            "Step 1: Check SAP PAM for supported ASE version for your SAP release (SAP Note 1618161)",
            "Step 2: Download target ASE version + latest EBF from SAP Software Centre",
            "Step 3: Pre-upgrade checks: sp_checkreswords, sp_aux_checkreswords for reserved word conflicts",
            "Step 4: Full database dump of ALL databases (especially master, sybsystemprocs)",
            "Step 5: Stop all SAP application servers connected to ASE",
            "Step 6: Shutdown ASE gracefully: isql → 'shutdown with nowait'",
            "Step 7: Run new ASE installer in upgrade mode: setup.bin -i console → select 'Upgrade Existing ASE'",
            "Step 8: Apply latest EBF after base installation",
            "Step 9: Start new ASE — it will auto-upgrade internal catalog",
            "Step 10: Run sp_checkreswords again post-upgrade",
            "Step 11: Run dbcc checkdb and dbcc checkalloc on all user databases",
            "Step 12: Start SAP application servers and validate connectivity",
          ],
          keyPoints: [
            "Upgrade path: must not skip major versions (e.g. 15.0 → 15.7 → 16.0, not 15.0 → 16.0 directly)",
            "EBF = Emergency Bug Fix; always apply latest EBF immediately after major version install",
            "sp_checkreswords detects reserved word conflicts that would break after upgrade",
            "Always validate sybsystemprocs database is healthy before upgrade",
            "Post-upgrade: run 'installmontables' script to add new monitoring tables",
          ],
          sapNotes: [
            { note: "1618161", desc: "Supported SAP ASE versions for SAP applications" },
            { note: "720757", desc: "ASE upgrade guide and compatibility notes" },
          ],
          warning: "Never upgrade production without completing a successful upgrade in a sandbox environment with a copy of production data.",
          tip: "Keep the old ASE installation directory intact until the new version is fully validated — rollback requires restoring from backup, but having the old binaries helps diagnose issues.",
        },
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring & Troubleshooting",
      nodes: [
        {
          id: "sybase-monitoring",
          title: "ASE Monitoring — Key Views & Procedures",
          icon: "BarChart3",
          badge: "Daily Ops",
          summary:
            "ASE provides monitoring through system stored procedures (sp_sysmon, sp_who, sp_lock), MDA (Monitoring and Diagnostic Architecture) tables (monProcessActivity, monDeadLock), and SAP tools (DB13, CCMS).",
          steps: [
            "CHECK active processes: sp_who",
            "CHECK locks: sp_lock",
            "CHECK blocking: select spid, blocked, cmd, loginame from master..sysprocesses where blocked > 0",
            "SYSMON — full performance report: sp_sysmon '00:05:00'",
            "CHECK error log: select * from master..syslogshold (log hold check)",
            "MDA tables (enable with sp_configure 'enable monitoring', 1):",
            "select * from master..monProcessActivity order by CPUTime desc",
            "select * from master..monDeadLock",
            "select * from master..monCachePool",
            "CHECK database consistency: dbcc checkdb(<dbname>)",
            "CHECK log segment: dbcc checktable(syslogs)",
            "CCMS alert monitoring in SAP: transaction DB13, DB12",
          ],
          keyPoints: [
            "MDA tables: must enable 'enable monitoring' = 1 via sp_configure — they are memory tables",
            "sp_sysmon covers: CPU usage, cache statistics, transaction rates, network I/O, lock contention",
            "DBCC commands: run weekly in non-production and monthly in production at minimum",
            "Error log location: $SYBASE/$SYBASE_ASE/install/<SERVERNAME>.log — check after every restart",
            "CCMS threshold monitors: configure via RZ20 in SAP to auto-alert on DB issues",
            "Deadlock tracing: sp_configure 'print deadlock information', 1 → writes to error log",
          ],
          tcodes: ["DB13", "DB12", "RZ20", "ST04", "DB02"],
          links: [
            { label: "SAP ASE MDA Tables Reference", url: "https://help.sap.com/docs/SAP_ASE/493dce9cd45a4de89cbbdda7f84a4cbe/672ef48c6663101482f2b6c3c9fb9c23.html" },
            { label: "SAP CCMS DB Monitoring", url: "https://help.sap.com/docs/SUPPORT_CONTENT/sybase/3362697907.html" },
          ],
          tip: "Schedule sp_sysmon to run automatically using a cron job or SAP job (SM36) every hour during business hours and save output to a log file — gives you baseline trend data.",
        },
        {
          id: "sybase-troubleshoot",
          title: "Common Issues & Resolution",
          icon: "Wrench",
          badge: "Troubleshooting",
          summary:
            "Most critical ASE issues fall into three categories: transaction log full, 'max user connections' reached, and corruption detected by DBCC. Each has a specific resolution path.",
          keyPoints: [
            "LOG FULL: dump transaction <db> with truncate_only → immediate relief, then dump transaction normally; investigate root cause (long-running open transactions)",
            "MAX CONNECTIONS: increase 'number of user connections' via sp_configure — requires ASE restart",
            "DBCC errors: Do NOT ignore — consult SAP Note 1650229 for DBCC error handling procedure",
            "1105 error (no space in tempdb): alter database tempdb on <device> = <size_mb>",
            "806 error (could not find virtual page): device-level corruption — restore from backup immediately",
            "2812 error (stored procedure not found): run installmontables or instmsgs scripts from $SYBASE",
            "RepAgent not starting: check sybsystemprocs is healthy; sp_help_rep_agent <db>",
          ],
          sapNotes: [
            { note: "1650229", desc: "DBCC errors in SAP ASE — handling and escalation" },
            { note: "1740571", desc: "ASE log segment full — immediate resolution steps" },
          ],
          tip: "Create a runbook document with the resolution steps for your top-5 most common ASE issues. Include the exact isql commands tested in your environment.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Oracle Database (SAP Environment)
// ─────────────────────────────────────────────
export const oracleModule: ModuleData = {
  id: "oracle",
  title: "Oracle Database",
  subtitle: "Oracle DBA in SAP Environments",
  version: "Oracle 19c / 21c",
  sourceUrl: "https://help.sap.com/doc/saphelp_snc700_ehp01/7.0.1/en-US/48/bbe36fd880307ce10000000a42189b/content.htm",
  overview:
    "Oracle is one of the most widely deployed databases in SAP landscapes, particularly in classic SAP ECC, BW, and SCM systems. As a Senior Basis Consultant managing Oracle, your responsibilities include BR*Tools administration, backup/recovery, space management, performance tuning, upgrades, and Oracle RAC high availability.",
  color: "#C62828",
  sections: [
    {
      id: "getting-started",
      title: "Getting Started",
      nodes: [
        {
          id: "oracle-architecture",
          title: "Oracle Architecture in SAP Landscapes",
          icon: "Database",
          badge: "Foundation",
          summary:
            "SAP systems on Oracle use the ABAP DB layer to connect via SQL*Net. The Oracle instance comprises an SGA (Shared Global Area) and background processes. SAP BR*Tools extend Oracle DBA capabilities with SAP-specific backup, recovery, and administration.",
          keyPoints: [
            "Oracle instance = SGA (database buffer cache, shared pool, redo log buffer) + background processes",
            "Key background processes: DBWR (writes dirty buffers), LGWR (writes redo), SMON, PMON, ARCH (archiver)",
            "SAP uses dedicated schema user (e.g. SAPSR3, SAPABAP1) — all SAP tables are in this schema",
            "BR*Tools: SAP's suite for Oracle DBA — brbackup, brrestore, brrecover, brspace, brconnect",
            "SAP Parameter file: init<SID>.ora / spfile<SID>.ora under $ORACLE_HOME/dbs",
            "Archive Log Mode: MUST be enabled in production SAP systems — required for online backups",
            "Oracle listener: handles client connections — check with 'lsnrctl status'",
            "Key Oracle directories: $ORACLE_HOME (binaries), $ORACLE_BASE/oradata (datafiles), $ORACLE_BASE/fast_recovery_area",
            "OPS$<SID>ADM: OS-authenticated Oracle user used by BR*Tools — must exist",
          ],
          links: [
            { label: "SAP Oracle DBA Guide", url: "https://help.sap.com/docs/ABAP_PLATFORM_NEW/4784d2f261fb4bcd9cf48b43acd8a5cb/4b9c8e3bbd3f43efe10000000a42189c.html" },
            { label: "BR*Tools Documentation", url: "https://help.sap.com/docs/SAP_NETWEAVER_750/d1d04c0d65544522b4b5a7e0f9e44aef/4b9c8e3bbd3f43efe10000000a42189c.html" },
          ],
          tip: "Always set ORA_NLS10 and NLS_LANG environment variables to match your SAP system character set before running any Oracle or BR*Tools commands.",
        },
        {
          id: "oracle-tools",
          title: "Tools for Oracle DBA in SAP",
          icon: "Wrench",
          badge: "Foundation",
          summary:
            "SAP provides BR*Tools as the primary Oracle DBA interface. Inside SAP, transactions DB02, DB13, DB12 provide monitoring and scheduling. SQLPlus and Oracle Enterprise Manager are available as supplementary tools.",
          keyPoints: [
            "brbackup: backup tool — online/offline, full/incremental, archive logs",
            "brrestore: restore individual files from backup",
            "brrecover: full database recovery — point-in-time and complete",
            "brspace: space management — extend tablespaces, add datafiles, segment management",
            "brconnect: database statistics, checks, parameter management",
            "brtools: interactive menu-driven wrapper for all BR*Tools",
            "DB02: SAP transaction for space alerts, tablespace monitoring, missing indexes",
            "DB13: DBA Planning Calendar — schedule brbackup, brconnect, brspace jobs",
            "DB12: Backup logs and catalog",
            "sqlplus /nolog: Oracle CLI for direct SQL access (use sparingly in SAP landscape)",
          ],
          tcodes: ["DB02", "DB13", "DB12", "DB14", "DB16", "SM21", "ST04"],
          links: [
            { label: "BR*Tools for Oracle", url: "https://help.sap.com/docs/SAP_NETWEAVER_750/d1d04c0d65544522b4b5a7e0f9e44aef/4b9c8e3bbd3f43efe10000000a42189c.html" },
          ],
        },
      ],
    },
    {
      id: "manage",
      title: "Instance Management",
      nodes: [
        {
          id: "oracle-startstop",
          title: "Start / Stop Oracle Instance",
          icon: "Power",
          badge: "Daily Ops",
          summary:
            "Oracle instances in SAP landscapes are started and stopped using BR*Tools or sqlplus. The SAP system should always be stopped before shutting down Oracle. Use 'shutdown immediate' for graceful stops.",
          steps: [
            "LOGIN as Oracle OS user: su - ora<SID> (e.g. su - oraS4H)",
            "SET environment: . /home/ora<SID>/.sapenv.sh (or .profile)",
            "START Oracle instance (via BR*Tools):",
            "brtools -f start -o startup",
            "OR via sqlplus:",
            "sqlplus / as sysdba",
            "SQL> startup",
            "STOP Oracle instance (BR*Tools):",
            "brtools -f stop -o immediate",
            "OR via sqlplus:",
            "SQL> shutdown immediate",
            "VERIFY instance state:",
            "SQL> select status from v$instance;",
            "START/STOP Oracle Listener:",
            "lsnrctl start",
            "lsnrctl stop",
            "lsnrctl status",
          ],
          keyPoints: [
            "Always stop SAP application servers BEFORE stopping Oracle",
            "'startup mount' = instance up but database not open — used for RMAN operations",
            "'startup restrict' = only users with RESTRICTED SESSION privilege can connect",
            "'shutdown abort' = immediate — like pulling power; may require recovery on next startup",
            "'shutdown immediate' = rollbacks uncommitted transactions, closes files cleanly — ALWAYS prefer this",
            "Check alert log for errors after every startup: $ORACLE_BASE/diag/rdbms/<SID>/<SID>/trace/alert_<SID>.log",
          ],
          tcodes: ["DB13"],
          warning: "Never 'shutdown abort' unless 'shutdown immediate' hangs. Abort will require Oracle crash recovery on next startup and may extend downtime.",
        },
        {
          id: "oracle-backup",
          title: "Backup with BR*Tools",
          icon: "Archive",
          badge: "Critical",
          summary:
            "BR*Tools (brbackup) is the SAP-certified method for backing up Oracle in SAP landscapes. It supports online/offline backups, archive log backups, and integrates with SAP BACKINT for third-party backup software (NetBackup, Commvault, etc.).",
          steps: [
            "ONLINE backup — all tablespaces (preferred for production):",
            "brbackup -u / -d disk -t online -m all",
            "OFFLINE backup (cold):",
            "brbackup -u / -d disk -t offline -m all",
            "ARCHIVE LOG backup:",
            "brarchive -u / -d disk -sc all",
            "INCREMENTAL backup (after full):",
            "brbackup -u / -d disk -t online -m incr",
            "VERIFY backup in SAP (DB12):",
            "Go to DB12 → select server → check last backup status",
            "BACKINT integration (3rd party backup) — configure in initSID.sap:",
            "backup_dev_type = pipe_auto",
            "backup_root_dir = /usr/sap/<SID>/backup",
            "List backup volumes: brbackup -u / -q brlist",
          ],
          keyPoints: [
            "Online backup requires ARCHIVE LOG mode — verify: SQL> archive log list",
            "initSID.sap (not init.ora!) is the BR*Tools config file — always in $ORACLE_HOME/dbs/",
            "BACKINT: SAP Note 50972 explains the BACKINT interface specification for 3rd-party agents",
            "Backup catalog: stored in sapbackup directory and in Oracle controlfile",
            "Check backup status: brbackup -u / -q brlist -t all",
            "Daily: archive log backup every 2–4 hours; weekly: full online backup",
          ],
          sapNotes: [
            { note: "50972", desc: "BACKINT interface for SAP backup tools" },
            { note: "1645702", desc: "BR*Tools patch levels and support policy" },
            { note: "789011", desc: "BR*Tools — FAQ and common issues" },
          ],
          links: [
            { label: "brbackup Reference", url: "https://help.sap.com/docs/SAP_NETWEAVER_750/d1d04c0d65544522b4b5a7e0f9e44aef/4b9c8e3bbd3f43efe10000000a42189c.html" },
          ],
          tip: "Schedule brbackup via DBA Planning Calendar (DB13) — use predefined action patterns for daily, weekly, and monthly backup cycles.",
        },
        {
          id: "oracle-recovery",
          title: "Restore & Recovery",
          icon: "RotateCcw",
          badge: "Critical",
          summary:
            "BR*Tools recovery (brrecover) handles all Oracle recovery scenarios: complete recovery, point-in-time recovery, and tablespace recovery. RMAN is used internally by BR*Tools in newer configurations.",
          steps: [
            "COMPLETE recovery (after media failure — all archive logs available):",
            "brrecover -u / -t full",
            "POINT-IN-TIME recovery:",
            "brrecover -u / -t pitr -e <YYYYMMDDHHMMSS>",
            "SINGLE DATAFILE recovery:",
            "brrecover -u / -t datafile -f <filename>",
            "INTERACTIVE mode (guided):",
            "brrecover",
            "Select option from menu interactively",
            "RMAN-based recovery (newer BR*Tools versions):",
            "brrecover uses RMAN internally — check BR*Tools version compatibility",
            "POST-RECOVERY: start SAP system and validate",
            "Check SAP system with SM21, SICK, SE38→RSBDCOS0",
          ],
          keyPoints: [
            "brrecover first restores datafiles (brrestore), then applies archive logs to reach consistency",
            "Ensure ALL archive logs are available — gaps will cause recovery to fail at that SCN",
            "After point-in-time recovery: open database with RESETLOGS → all archive logs after that point are invalid",
            "Always test recovery procedure in sandbox — recovery from backup must be validated regularly",
            "Document RTO (Recovery Time Objective) based on actual test results",
          ],
          sapNotes: [
            { note: "362633", desc: "Recovery of an Oracle database with BR*Tools" },
            { note: "1021895", desc: "Procedure for Oracle database recovery" },
          ],
          warning: "After RESETLOGS (point-in-time recovery), immediately take a full backup. Archive logs created before RESETLOGS cannot be applied after this point.",
        },
        {
          id: "oracle-space",
          title: "Space Management with brspace",
          icon: "HardDrive",
          badge: "Daily Ops",
          summary:
            "brspace is the BR*Tools utility for Oracle space management. It handles extending tablespaces, adding datafiles, segment management, and cleaning up fragmentation.",
          steps: [
            "CHECK tablespace usage (DB02 or SQL):",
            "SELECT tablespace_name, round(used_percent,2) pct_used FROM dba_tablespace_usage_metrics ORDER BY used_percent DESC;",
            "EXTEND tablespace — add datafile:",
            "brspace -u / -c tsextend -t <TABLESPACE_NAME> -s <size_MB>",
            "CHECK missing indexes:",
            "brconnect -u / -f check -t ora",
            "CHECK and rebuild indexes:",
            "brspace -u / -c idrebuild -t <TABLE_NAME>",
            "CLEANUP unused segments:",
            "brspace -u / -c cleanup",
            "VIEW space alerts in SAP:",
            "Transaction DB02 → Space → Critical Objects",
          ],
          keyPoints: [
            "Alert threshold: configure CCMS (RZ20) to alert when tablespace > 90% full",
            "PSAPSR3 (or PSAPABAP): largest tablespace — data for ABAP objects",
            "PSAPSR3700: additional data tablespace in newer Unicode systems",
            "PSAPTEMP: temporary tablespace — can fill during large sorts/joins; resize as needed",
            "SYSAUX tablespace: Oracle internal — monitor growth (AWR snapshots, audit trails)",
            "DB02 shows missing indexes and table fragmentation — action weekly",
          ],
          tcodes: ["DB02", "DB13", "SE14"],
          sapNotes: [
            { note: "646681", desc: "Monitoring Oracle tablespace usage in SAP" },
          ],
        },
        {
          id: "oracle-params",
          title: "Oracle Parameter Management",
          icon: "Settings",
          badge: "Advanced",
          summary:
            "Oracle parameters are stored in spfile (binary) or pfile (text). Key SAP-relevant parameters include sga_target, pga_aggregate_target, db_block_size, undo_retention, and log_archive_dest. brconnect manages parameter changes.",
          steps: [
            "VIEW current parameters:",
            "SQL> show parameter <parameter_name>",
            "CHANGE parameter dynamically (no restart):",
            "SQL> alter system set <parameter> = <value> scope=both;",
            "CHANGE via brconnect:",
            "brconnect -u / -f chparam -p <parameter_name> -v <value>",
            "EXPORT spfile to pfile (for editing):",
            "SQL> create pfile='/tmp/initSID.ora' from spfile;",
            "REBUILD spfile from pfile:",
            "SQL> create spfile from pfile='/tmp/initSID.ora';",
            "VIEW parameter history:",
            "SELECT * FROM v$parameter_history ORDER BY update_comment;",
          ],
          keyPoints: [
            "sga_target: controls automatic SGA management — set to 60–70% of total RAM for DB server",
            "pga_aggregate_target: controls sort/hash memory — set to 20% of RAM",
            "undo_retention: set ≥ 900 seconds in production to avoid ORA-01555 (snapshot too old)",
            "db_block_size: fixed at DB creation — cannot change; SAP standard = 8192 (8KB)",
            "processes / sessions: must match expected concurrent users + background processes",
            "log_buffer: increase if LGWR contention found in AWR/ASH reports",
          ],
          sapNotes: [
            { note: "830576", desc: "SAP-recommended Oracle parameter settings" },
            { note: "105047", desc: "Oracle parameter settings for OLTP SAP systems" },
          ],
        },
      ],
    },
    {
      id: "performance",
      title: "Performance & Monitoring",
      nodes: [
        {
          id: "oracle-performance",
          title: "Oracle Performance Tuning",
          icon: "Activity",
          badge: "Advanced",
          summary:
            "Oracle performance in SAP landscapes is monitored through AWR (Automatic Workload Repository), ASH (Active Session History), SQL Trace, ST05, and the SAP Oracle Extended Monitor. Key metrics: buffer cache hit ratio, parse counts, wait events, and top SQL.",
          steps: [
            "SAP TRANSACTION ST04 — Oracle Extended Monitor (start here always):",
            "ST04 → Detailed Analysis → Top SQL / Wait Events",
            "GENERATE AWR report (Oracle licensed feature):",
            "@$ORACLE_HOME/rdbms/admin/awrrpt.sql",
            "VIEW top wait events:",
            "SELECT event, total_waits, time_waited FROM v$system_event WHERE wait_class != 'Idle' ORDER BY time_waited DESC;",
            "VIEW buffer cache hit ratio (target >99%):",
            "SELECT round(1-(physical_reads/(db_block_gets+consistent_gets)),4)*100 'Hit%' FROM v$buffer_pool_statistics;",
            "IDENTIFY top SQL by elapsed time:",
            "SELECT sql_id, elapsed_time, executions, sql_text FROM v$sql ORDER BY elapsed_time DESC FETCH FIRST 20 ROWS ONLY;",
            "SAP SQL TRACE: ST05 → Activate Trace → perform action → Display Trace",
            "UPDATE STATISTICS: brconnect -u / -f stats -t all",
          ],
          keyPoints: [
            "DB_CACHE_HIT < 99%: increase db_cache_size or sga_target",
            "Top wait events: 'db file sequential read' = index scans; 'db file scattered read' = full table scans",
            "High parse ratios: increase shared_pool_size; check cursor_sharing parameter",
            "'log file sync' waits: I/O bottleneck on redo logs — move redo logs to faster storage",
            "Missing index: check DB02 → Missing Indexes; run brconnect -f check",
            "SQL statistics outdated: schedule brconnect stats update weekly via DB13",
          ],
          tcodes: ["ST04", "ST05", "DB02", "SM50", "SM66"],
          sapNotes: [
            { note: "1984787", desc: "Oracle performance — SAP system checklist" },
            { note: "830576", desc: "Oracle parameters for optimal SAP performance" },
          ],
        },
        {
          id: "oracle-monitoring",
          title: "Monitoring — Alert Log & CCMS",
          icon: "Bell",
          badge: "Daily Ops",
          summary:
            "Daily Oracle monitoring in SAP includes checking the Oracle alert log, CCMS thresholds, backup status, tablespace usage, and lock waits. Proactive monitoring prevents critical outages.",
          keyPoints: [
            "Alert log: $ORACLE_BASE/diag/rdbms/<SID>/<SID>/trace/alert_<SID>.log — check daily for ORA- errors",
            "CCMS Oracle monitors: RZ20 → SAP CCMS Monitor Templates → Database → Oracle",
            "DB12: shows last successful backup date and time — check daily",
            "DB02: shows tablespace fill levels — alert > 90%",
            "Archiver stuck: if archive destination full, Oracle STOPS — monitor free space on archive log mount",
            "ORA-00257: archiver stuck — immediate action: free up archive log space, then brarchive to backup",
            "v$session: check for blocking sessions > 5 minutes",
            "SM21: SAP system log — check for database connection errors",
          ],
          tcodes: ["RZ20", "DB12", "DB02", "SM21", "ST04"],
          sapNotes: [
            { note: "12078", desc: "Archiver stuck — handling and prevention" },
          ],
          tip: "Set up an OS cron job to tail the Oracle alert log and email/Slack on any 'ORA-' occurrence — this is faster than waiting for CCMS polling cycles.",
        },
      ],
    },
    {
      id: "high-availability",
      title: "High Availability — Oracle RAC & Data Guard",
      nodes: [
        {
          id: "oracle-rac",
          title: "Oracle Real Application Clusters (RAC)",
          icon: "Shield",
          badge: "Enterprise",
          summary:
            "Oracle RAC allows multiple instances to access the same database on shared storage. SAP on Oracle RAC provides HA and horizontal scalability. Requires Oracle Clusterware (Grid Infrastructure) and shared ASM storage.",
          keyPoints: [
            "RAC = multiple Oracle instances (nodes) accessing one shared database on ASM/shared disk",
            "Oracle Grid Infrastructure: manages clusterware, VIP (virtual IP), and ASM — installed separately",
            "SAP workload: typically uses one primary node for ABAP and one for Java — or active-active load balancing",
            "Interconnect: private network between RAC nodes — must be low-latency (< 1 ms); use dedicated NIC",
            "Cache Fusion: RAC nodes share buffer caches via interconnect — if interconnect is slow, performance degrades",
            "Services: create Oracle Service for SAP SID; SAPDBHOST resolves to VIP for failover",
            "Monitoring: crsctl status res -t (check all cluster resources)",
            "SAP Note 527843: SAP on Oracle RAC — supported configurations",
          ],
          sapNotes: [
            { note: "527843", desc: "SAP on Oracle RAC — supported configurations and best practices" },
            { note: "1617464", desc: "Oracle Grid Infrastructure installation for SAP" },
          ],
          links: [
            { label: "SAP Oracle RAC Guide", url: "https://help.sap.com/docs/ABAP_PLATFORM_NEW/4784d2f261fb4bcd9cf48b43acd8a5cb/4b9c8e3bbd3f43efe10000000a42189c.html" },
          ],
        },
        {
          id: "oracle-dataguard",
          title: "Oracle Data Guard (DR)",
          icon: "Globe",
          badge: "DR",
          summary:
            "Oracle Data Guard maintains a standby database in sync with the primary via redo log shipping. SAP supports Data Guard as a DR solution. Physical standby (block-for-block copy) is used for SAP systems.",
          keyPoints: [
            "Physical standby: exact binary copy of primary; managed recovery applies redo continuously",
            "Logical standby: SQL-applied standby — can be open for read/queries; less common in SAP",
            "Protection modes: Maximum Performance (async — no RPO guarantee), Maximum Availability (sync — risk of performance impact), Maximum Protection (sync — zero data loss)",
            "Active Data Guard: standby is open read-only while in recovery mode — useful for reporting",
            "Fast-Start Failover (FSFO): automatic failover using Data Guard Observer — SAP requires manual testing",
            "switchover vs failover: switchover = planned (no data loss); failover = unplanned (potential gap)",
            "SAP Note 1619682: SAP support for Oracle Data Guard in SAP landscapes",
          ],
          sapNotes: [
            { note: "1619682", desc: "SAP on Oracle Data Guard — support policy and setup" },
          ],
        },
      ],
    },
    {
      id: "upgrade",
      title: "Oracle Upgrade",
      nodes: [
        {
          id: "oracle-upgrade",
          title: "Oracle Database Upgrade in SAP Landscape",
          icon: "TrendingUp",
          badge: "Planned",
          summary:
            "Oracle upgrades in SAP systems are performed using the SAP Database Upgrade procedure (combination of Oracle DBUA/manual upgrade + SAP post-upgrade steps via brconnect). Always check SAP PAM first.",
          steps: [
            "Step 1: Check SAP PAM for target Oracle version compatibility with your SAP release",
            "Step 2: Review SAP Note for target version (e.g. SAP Note 2799920 for Oracle 19c)",
            "Step 3: Download Oracle 19c (or target) + SAP DB-specific patches from SAP Software Centre",
            "Step 4: Apply Oracle Jan/Apr/Jul/Oct Quarterly Release Update (QRU) + SAP Bundle Patch",
            "Step 5: Pre-upgrade checks: run Oracle Pre-Upgrade Information Tool: java -jar $ORACLE_HOME/rdbms/admin/preupgrd.jar",
            "Step 6: Full offline backup via brbackup",
            "Step 7: Stop SAP system completely",
            "Step 8: Install new Oracle Home (do NOT overwrite existing)",
            "Step 9: Run DBUA (Database Upgrade Assistant) or manual upgrade scripts",
            "Step 10: Apply SAP Bundle Patch for Oracle (from SAP Note specific to version)",
            "Step 11: Run brconnect -u / -f dbcheck post-upgrade",
            "Step 12: Update Oracle parameters (spfile) for new version requirements",
            "Step 13: Start SAP system; run SE38→RSBDCOS0 to verify DB connectivity",
          ],
          keyPoints: [
            "Never skip versions: 11g → 12c → 19c (12c is the intermediate if coming from 11g)",
            "SAP Bundle Patch (SBP): SAP-specific Oracle patches combining Oracle PSU + SAP fixes — always apply",
            "Update BRTOOLS after Oracle upgrade — older BR*Tools may not support new Oracle syntax",
            "Post-upgrade: mandatory to run catupgrd.sql and utlrp.sql if not using DBUA",
            "Gather fresh statistics after upgrade: brconnect -u / -f stats -t all",
          ],
          sapNotes: [
            { note: "2799920", desc: "Oracle 19c installation notes for SAP" },
            { note: "1431795", desc: "SAP Bundle Patch for Oracle — quarterly release" },
            { note: "1592701", desc: "Supported Oracle versions for SAP NetWeaver" },
          ],
          warning: "Always apply the SAP Bundle Patch (SBP) — not the standard Oracle PSU — to Oracle used with SAP. Standard PSU may break SAP-specific Oracle components.",
          tip: "Test upgrade in a sandbox system that is a copy of production. Use the exact same OS patch level and Oracle home path to ensure reproducibility.",
        },
      ],
    },
  ],
};

// Master registry
export const moduleRegistry: Record<string, ModuleData> = {
  hana: hanaModule,
  maxdb: maxdbModule,
  sybase: sybaseModule,
  oracle: oracleModule,
};
