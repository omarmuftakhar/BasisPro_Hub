import React, { useState, useContext, createContext } from "react";
import {
  Monitor, CheckCircle2, ExternalLink, ChevronRight, ChevronDown,
  Shield, Zap, AlertTriangle, Server, Layers, BookOpen, Activity,
  Settings, Database, Info, Code, Globe, Key,
} from "lucide-react";

// ─── Navigation context ────────────────────────────────────────────────────────

const NavCtx = createContext<((id: string) => void) | undefined>(undefined);

// ─── Per-issue action config ───────────────────────────────────────────────────

const ISSUE_ACTIONS: Record<string, {
  treeId: string; guideId: string; tcodes: string;
}> = {
  "svc-not-starting":  { treeId: "system-down", guideId: "system-down-recovery", tcodes: "SM51 · SM21 · ST22" },
  "gui-connection":    { treeId: "rfc-issue",   guideId: "rfc-connection-issue", tcodes: "SM59 · SMICM · ST11" },
  "sql-connectivity":  { treeId: "system-down", guideId: "system-down-recovery", tcodes: "DBACOCKPIT · ST04 · SM21" },
  "performance":       { treeId: "system-down", guideId: "system-down-recovery", tcodes: "SM50 · SM66 · ST03N · STAD" },
  "permissions":       { treeId: "rfc-issue",   guideId: "rfc-connection-issue", tcodes: "SU01 · PFCG · ST01 · SM21" },
};

function ActionButtons({ issue }: { issue: keyof typeof ISSUE_ACTIONS }) {
  const nav = useContext(NavCtx);
  const cfg = ISSUE_ACTIONS[issue];

  function openTree() {
    localStorage.setItem("basisproTargetTree", cfg.treeId);
    nav?.("troubleshoot");
  }

  function openGuide() {
    localStorage.setItem("basisproTargetGuide", cfg.guideId);
    nav?.("actGuides");
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-gray-200">
      <button
        onClick={openTree}
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#EBF3FD] text-[#0070F2] font-semibold hover:bg-[#D4E8FA] transition-colors"
      >
        <Layers className="w-3 h-3" />
        Open Troubleshoot Tree
      </button>
      <button
        onClick={openGuide}
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#EBF3FD] text-[#0070F2] font-semibold hover:bg-[#D4E8FA] transition-colors"
      >
        <BookOpen className="w-3 h-3" />
        Open Related Guide
      </button>
      <button
        onClick={() => nav?.("tcodes")}
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
      >
        <Key className="w-3 h-3" />
        {cfg.tcodes}
      </button>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function CmdBlock({ cmds }: { cmds: { cmd: string; desc: string }[] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 mt-2">
      <div className="bg-blue-900 px-3 py-1.5 flex items-center gap-2">
        <Monitor className="w-3 h-3 text-blue-300" />
        <span className="text-xs text-blue-300 font-mono">cmd / powershell</span>
      </div>
      <div className="bg-blue-950 divide-y divide-blue-900">
        {cmds.map(({ cmd, desc }) => (
          <div key={cmd} className="flex items-start gap-3 px-3 py-2">
            <code className="text-cyan-300 font-mono text-xs whitespace-nowrap flex-shrink-0">{cmd}</code>
            <span className="text-blue-300 text-xs leading-relaxed">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, items, color = "blue" }: { title: string; items: string[]; color?: "blue" | "green" | "amber" | "violet" | "red" }) {
  const colors = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-emerald-50 border-emerald-100",
    amber: "bg-amber-50 border-amber-100",
    violet: "bg-violet-50 border-violet-100",
    red: "bg-red-50 border-red-100",
  };
  const dotColors = {
    blue: "bg-[#0070F2]",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
    red: "bg-red-500",
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColors[color]}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Section data ─────────────────────────────────────────────────────────────

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  tag?: string;
  tagColor?: string;
  content: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: "when-windows",
    title: "When Windows is Used in SAP Landscapes",
    icon: <Server className="w-4 h-4" />,
    tag: "Foundation",
    tagColor: "bg-blue-100 text-blue-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Windows is still used in SAP landscapes in specific roles. While SAP HANA runs exclusively on Linux,
          Windows hosts continue to appear as SAP application server hosts, frontend machines, and in older landscapes
          running AnyDB databases such as SQL Server or MaxDB. Understanding where Windows fits helps you scope projects correctly.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="Windows IS Used For" items={[
            "SAP application servers (ABAP stack on Windows)",
            "SAP Central Services (ASCS/SCS on Windows)",
            "SAP GUI client administration and distribution",
            "SQL Server as AnyDB for older SAP landscapes",
            "SAP message server on Windows hosts",
            "SAP router and SAProuter on Windows",
            "Content Server (DMS) on Windows",
          ]} color="blue" />
          <InfoCard title="Windows is NOT Used For" items={[
            "SAP HANA database — Linux only",
            "SAP S/4HANA DB layer — Linux only",
            "Pacemaker HA clusters — Linux only",
            "New greenfield RISE with SAP — cloud Linux",
            "HANA System Replication — Linux only",
            "Production HANA workloads on bare metal",
          ]} color="red" />
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Migration trend:</span> Many customers running SAP on Windows with SQL Server are migrating to S/4HANA on Linux with HANA. As a Basis consultant, you may need to plan and execute this OS migration as part of a DMO (Database Migration Option) project.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "app-servers",
    title: "SAP Application Servers on Windows",
    icon: <Layers className="w-4 h-4" />,
    tag: "Core",
    tagColor: "bg-emerald-100 text-emerald-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          The SAP ABAP application server (dispatcher + work processes) can run on Windows. In such configurations,
          the SAP instance executable, trace files, and transport directories follow Windows path conventions.
          Key administration tasks are the same, but the tooling differs.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="SAP Directory Layout on Windows" items={[
            "C:\\usr\\sap\\<SID>\\D<NR>\\ — instance directory",
            "C:\\usr\\sap\\<SID>\\D<NR>\\work\\ — trace files (dev_w0, dev_disp)",
            "C:\\usr\\sap\\trans\\ — transport directory (sapmnt)",
            "C:\\usr\\sap\\<SID>\\SYS\\exe\\uc\\NTAMD64\\ — SAP kernel binaries",
            "C:\\sapmnt\\ — shared profile and transport mount",
          ]} color="blue" />
          <InfoCard title="Windows-Specific Considerations" items={[
            "SAP instances run as Windows services (auto-start)",
            "SAP service user: SAPService<SID> (domain or local)",
            "sapmnt shared via UNC path (\\\\<host>\\sapmnt\\<SID>)",
            "Instance profile stored in C:\\usr\\sap\\<SID>\\SYS\\profile",
            "Transport directory shared via Windows file sharing",
            "Kernel patch: stop services, replace EXE, restart",
          ]} color="green" />
        </div>
        <CmdBlock cmds={[
          { cmd: "sapcontrol -nr <NR> -function GetProcessList", desc: "Check SAP process status on Windows host" },
          { cmd: "sapcontrol -nr <NR> -function Start", desc: "Start SAP instance from command line" },
          { cmd: "sapcontrol -nr <NR> -function Stop", desc: "Stop SAP instance gracefully" },
          { cmd: "dir C:\\usr\\sap\\<SID>\\D<NR>\\work\\dev_w*", desc: "List work process trace files" },
        ]} />
      </div>
    ),
  },
  {
    id: "windows-services",
    title: "Windows Services for SAP",
    icon: <Settings className="w-4 h-4" />,
    tag: "Administration",
    tagColor: "bg-violet-100 text-violet-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          SAP instances on Windows run as Windows services. Understanding service naming, startup types,
          and dependency order is essential for Basis operations on Windows-based SAP hosts.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="Key SAP Windows Services" items={[
            "SAP<SID>_<NR> — main SAP instance service (dispatcher)",
            "SAPSID_<NR> — alternate naming in older landscapes",
            "SAPHostControl — SAP Host Agent (monitors all instances)",
            "SAPService<SID> — service logon account (not a service itself)",
            "Startup order: message server → enqueue → app server",
          ]} color="violet" />
          <InfoCard title="Service Administration" items={[
            "services.msc — GUI for viewing and managing services",
            "sc query type= service | findstr SAP — list SAP services via CLI",
            "sc start SAP<SID>_<NR> — start SAP instance service",
            "sc stop SAP<SID>_<NR> — stop SAP instance service",
            "Set to Automatic (Delayed Start) for production hosts",
            "Never set SAP services to Disabled — prevents DR recovery",
          ]} color="blue" />
        </div>
        <CmdBlock cmds={[
          { cmd: "services.msc", desc: "Open Windows Services snap-in — view and control SAP services" },
          { cmd: "sc query SAP<SID>_<NR>", desc: "Query specific SAP service state from command line" },
          { cmd: "net start SAP<SID>_<NR>", desc: "Start SAP service via net command" },
          { cmd: "net stop SAP<SID>_<NR>", desc: "Stop SAP service via net command" },
        ]} />
      </div>
    ),
  },
  {
    id: "filesystem",
    title: "File Systems, Permissions, and Shared Folders",
    icon: <Database className="w-4 h-4" />,
    tag: "Core",
    tagColor: "bg-emerald-100 text-emerald-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          SAP on Windows uses NTFS file system with specific permission requirements. Shared folders (sapmnt, trans)
          must be configured with correct ACLs, or transports and profile changes will fail.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="Critical Shared Paths" items={[
            "\\\\<host>\\sapmnt\\<SID>\\profile — instance profiles",
            "\\\\<host>\\sapmnt\\<SID>\\global — global data",
            "\\\\<host>\\trans — transport directory (must be same path on all hosts)",
            "UNC paths must be reachable from all app server hosts",
            "If sapmnt share goes offline — all instances fail to start",
          ]} color="blue" />
          <InfoCard title="NTFS Permissions for SAP" items={[
            "SAPService<SID>: Full Control on instance directory",
            "<SID>adm user: Full Control on instance and sapmnt",
            "Administrators group: Full Control (not required but common)",
            "SYSTEM: Full Control on SAP directories",
            "Never restrict SAP kernel directories — prevents patch application",
          ]} color="amber" />
        </div>
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Common permission error:</span> If an SAP transport import fails with "cannot write to file" or a profile parameter change doesn't take effect, the first check is whether SAPService&lt;SID&gt; has write access to the affected path.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "sap-gui",
    title: "SAP GUI / Frontend Administration",
    icon: <Monitor className="w-4 h-4" />,
    tag: "Frontend",
    tagColor: "bg-gray-100 text-gray-600",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          SAP GUI for Windows is the primary frontend for SAP system administration. As a Basis consultant,
          you are responsible for distributing, configuring, and troubleshooting SAP GUI on user workstations.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="SAP GUI Administration Tasks" items={[
            "Deploy SAP GUI via Group Policy (ADMX) or software center",
            "Configure SAP Logon Pad with system connection strings",
            "Apply SAP GUI patches via SAP Service Marketplace",
            "Configure SNC for encrypted GUI connections",
            "Manage SAP GUI shortcuts (sapshcut.exe) for users",
            "Troubleshoot session limit errors (icm/max_conn)",
          ]} color="blue" />
          <InfoCard title="SAP GUI Connection Parameters" items={[
            "Application Server: <hostname or IP>",
            "Instance Number: <NR> (2-digit, e.g. 00)",
            "System ID: <SID> (3-character, e.g. S4H)",
            "Logon Group: use for load balancing across app servers",
            "Message Server: for group-based logon (SM_<SID>MS_<NR>)",
            "SNC: configure for encrypted sessions",
          ]} color="green" />
        </div>
        <CmdBlock cmds={[
          { cmd: "saplogon.exe", desc: "Launch SAP GUI Logon Pad" },
          { cmd: "sapshcut.exe /system=<SID> /client=100 /user=basis", desc: "Launch direct system connection via shortcut" },
          { cmd: "sapgui.exe /H/<router>/<SID>", desc: "Connect via SAP Router for external access" },
        ]} />
      </div>
    ),
  },
  {
    id: "sql-server",
    title: "SQL Server-Based SAP Landscapes",
    icon: <Database className="w-4 h-4" />,
    tag: "Database",
    tagColor: "bg-[#0070F2]/10 text-[#0070F2]",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Microsoft SQL Server is one of the supported AnyDB databases for SAP. Systems running SAP ECC, SAP NetWeaver BW,
          or other SAP products on SQL Server are typically Windows-based. As a Basis consultant, you need basic SQL Server
          administration knowledge to operate these systems.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="SQL Server for SAP — Key Facts" items={[
            "SAP supports SQL Server as AnyDB (not HANA)",
            "SAP system data stored in SQL Server databases",
            "MSSQL service must be running for SAP to start",
            "Backup managed via SQL Server Agent jobs or BRTOOLS",
            "BR*Tools (brbackup/brrestore) work with SQL Server",
            "SQL Server Management Studio (SSMS) for DBA work",
          ]} color="blue" />
          <InfoCard title="Key SQL Server Monitoring for SAP" items={[
            "DBACOCKPIT in SAP GUI — primary monitoring tool",
            "SQL Server Error Log — C:\\Program Files\\SQL...\\MSSQL\\LOG",
            "Windows Event Viewer — check Application log for SQL errors",
            "SQL Server Agent — review scheduled backup job status",
            "Database size growth — monitor to prevent full disks",
            "SQL Server Performance Monitor counters for SAP tuning",
          ]} color="amber" />
        </div>
      </div>
    ),
  },
  {
    id: "monitoring",
    title: "Monitoring and Troubleshooting Basics",
    icon: <Activity className="w-4 h-4" />,
    tag: "Operations",
    tagColor: "bg-amber-100 text-amber-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Windows provides a set of built-in monitoring tools that Basis consultants use for diagnosing performance issues,
          service failures, and network problems on SAP Windows hosts.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="Performance Monitoring" items={[
            "Task Manager (taskmgr) — CPU, memory, processes at a glance",
            "Resource Monitor — per-process CPU, memory, disk, network",
            "Performance Monitor (perfmon) — detailed counters for SAP",
            "Key counters: CPU %, Available MB RAM, Disk Queue Length",
            "SAP ICM process high CPU often indicates web service overload",
          ]} color="blue" />
          <InfoCard title="Log & Event Analysis" items={[
            "Event Viewer (eventvwr) — Application, System, Security logs",
            "Filter by source: check SAP, MSSQL, Pacemaker events",
            "Windows Error Reporting — crash dumps for SAP processes",
            "C:\\usr\\sap\\<SID>\\D<NR>\\work\\dev_w* — SAP work process logs",
            "C:\\usr\\sap\\<SID>\\D<NR>\\work\\dev_disp — dispatcher trace",
          ]} color="amber" />
        </div>
        <CmdBlock cmds={[
          { cmd: "eventvwr", desc: "Open Event Viewer — check Application log for SAP service errors" },
          { cmd: "taskmgr", desc: "Open Task Manager — find high CPU processes (disp+work.exe, work.exe)" },
          { cmd: "perfmon", desc: "Open Performance Monitor — add SAP-specific counters" },
          { cmd: "resmon", desc: "Open Resource Monitor — detailed per-process resource view" },
        ]} />
      </div>
    ),
  },
  {
    id: "commands",
    title: "Windows Commands Useful for Basis",
    icon: <Code className="w-4 h-4" />,
    tag: "Reference",
    tagColor: "bg-gray-100 text-gray-600",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          These are the Windows commands most frequently used by SAP Basis consultants during operations and troubleshooting.
        </p>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Services & Processes</div>
          <CmdBlock cmds={[
            { cmd: "services.msc", desc: "Open Services snap-in — manage SAP Windows services" },
            { cmd: "taskmgr", desc: "Task Manager — identify high CPU/memory SAP processes" },
            { cmd: "tasklist | findstr sap", desc: "List all running SAP-related processes" },
            { cmd: "taskkill /PID <pid> /F", desc: "Force-terminate a stuck SAP process (use with caution)" },
          ]} />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System & Diagnostics</div>
          <CmdBlock cmds={[
            { cmd: "eventvwr", desc: "Event Viewer — check Application/System logs for SAP errors" },
            { cmd: "perfmon", desc: "Performance Monitor — add SAP process counters" },
            { cmd: "whoami", desc: "Verify which user account you are running as" },
            { cmd: "hostname", desc: "Get server hostname — verify against SAP profile parameters" },
            { cmd: "gpupdate /force", desc: "Force Group Policy refresh (useful after SAP GUI policy deploy)" },
          ]} />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Network</div>
          <CmdBlock cmds={[
            { cmd: "ipconfig /all", desc: "Show all network adapter IP addresses and DNS config" },
            { cmd: "ping <hostname>", desc: "Basic connectivity check to SAP host or database server" },
            { cmd: "nslookup <hostname>", desc: "Verify DNS resolution — critical for RFC and SAP router config" },
            { cmd: "tracert <hostname>", desc: "Trace network path to target — identify routing issues" },
            { cmd: "netstat -ano", desc: "Show all connections with PIDs — verify SAP gateway/dispatcher ports" },
          ]} />
        </div>
      </div>
    ),
  },
  {
    id: "common-issues",
    title: "Common SAP Basis Issues on Windows",
    icon: <AlertTriangle className="w-4 h-4" />,
    tag: "Incidents",
    tagColor: "bg-red-100 text-red-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          These are the most frequent production issues on Windows-hosted SAP systems. Each scenario lists what to check first
          and the actions to resolve it.
        </p>

        {/* Issue 1 */}
        <div className="border border-red-200 rounded-xl overflow-hidden">
          <div className="bg-red-50 px-4 py-2.5 flex items-center gap-2 border-b border-red-100">
            <Settings className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold text-red-800">1. SAP Service Not Starting</span>
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCard title="Check Steps" items={[
                "services.msc — is SAP<SID>_<NR> service stopped or in error state?",
                "Windows Event Viewer (eventvwr) → Application log — SAP service errors",
                "Check service logon account — is SAPService<SID> account locked/expired?",
                "Verify sapmnt UNC share is reachable: ping <central-host>",
                "Check C:\\usr\\sap\\<SID>\\D<NR>\\work\\dev_disp for dispatcher errors",
              ]} color="amber" />
              <InfoCard title="Actions" items={[
                "Start service: net start SAP<SID>_<NR> (or via services.msc)",
                "If logon account error: reset SAPService<SID> password in AD, update service",
                "If profile read error: verify sapmnt share permissions",
                "Check instance profile for parameter misconfigurations",
                "After fix: monitor Windows Event Viewer for successful start entry",
              ]} color="green" />
            </div>
            <CmdBlock cmds={[
              { cmd: "services.msc", desc: "Open Windows Services — check SAP service state and startup type" },
              { cmd: "eventvwr", desc: "Event Viewer → Application log — look for SAP source entries at error time" },
              { cmd: "net start SAP<SID>_<NR>", desc: "Start SAP Windows service from command line" },
              { cmd: "sapcontrol -nr <NR> -function GetProcessList", desc: "Verify SAP processes after service start" },
            ]} />
            <ActionButtons issue="svc-not-starting" />
          </div>
        </div>

        {/* Issue 2 */}
        <div className="border border-orange-200 rounded-xl overflow-hidden">
          <div className="bg-orange-50 px-4 py-2.5 flex items-center gap-2 border-b border-orange-100">
            <Globe className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-800">2. SAP GUI Connection Issues</span>
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCard title="Check Steps" items={[
                "ping <sap-hostname> — can the client workstation reach the SAP server?",
                "tracert <sap-hostname> — identify where the connection drops",
                "Verify SAP Logon Pad: is the hostname or IP configured correctly?",
                "Check instance number — must match what SAP is running on",
                "If using SAP Router: is saprouter process running on port 3299?",
              ]} color="amber" />
              <InfoCard title="Actions" items={[
                "Correct hostname/IP in SAP Logon Pad entry",
                "Check firewall rules — ports 32<NR>15 (HANA SQL) or 32<NR>00 (dispatcher) blocked?",
                "Try direct connection (bypass router) to isolate the issue",
                "Test from another machine to rule out local client issue",
                "For SNC issues: verify PSE certificate validity in STRUST",
              ]} color="green" />
            </div>
            <CmdBlock cmds={[
              { cmd: "ping <sap-hostname>", desc: "Confirm network reachability from user workstation to SAP host" },
              { cmd: "tracert <sap-hostname>", desc: "Trace route — identify where the network path fails" },
              { cmd: "nslookup <sap-hostname>", desc: "Confirm DNS resolves to the correct SAP server IP" },
              { cmd: "telnet <sap-hostname> 32<NR>00", desc: "Test if SAP dispatcher port is reachable (replace <NR> with instance number)" },
            ]} />
            <ActionButtons issue="gui-connection" />
          </div>
        </div>

        {/* Issue 3 */}
        <div className="border border-blue-200 rounded-xl overflow-hidden">
          <div className="bg-blue-50 px-4 py-2.5 flex items-center gap-2 border-b border-blue-100">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-blue-800">3. SQL Server Connectivity Issues</span>
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCard title="Check Steps" items={[
                "services.msc — is SQL Server (MSSQLSERVER) service running?",
                "SQL Server Error Log — C:\\Program Files\\Microsoft SQL Server\\...\\MSSQL\\Log",
                "Windows Event Viewer — Application log for SQL Server errors",
                "DBACOCKPIT (transaction) — SAP-side database connection status",
                "netstat -ano — is SQL Server port 1433 listening?",
              ]} color="amber" />
              <InfoCard title="Actions" items={[
                "Start SQL Server: net start MSSQLSERVER (then start SAP)",
                "Verify SQL Server logon account (SAPService<SID> needs db access)",
                "Check SQL Server Agent is running — required for backup jobs",
                "In DBACOCKPIT: run database check and review error messages",
                "Validate that SAP profile parameter dbs/mss/server is correct",
              ]} color="green" />
            </div>
            <CmdBlock cmds={[
              { cmd: "netstat -ano | findstr 1433", desc: "Verify SQL Server port 1433 is listening" },
              { cmd: "net start MSSQLSERVER", desc: "Start SQL Server service from command line" },
              { cmd: "eventvwr", desc: "Event Viewer → Application — filter by SQL Server source" },
            ]} />
            <ActionButtons issue="sql-connectivity" />
          </div>
        </div>

        {/* Issue 4 */}
        <div className="border border-amber-200 rounded-xl overflow-hidden">
          <div className="bg-amber-50 px-4 py-2.5 flex items-center gap-2 border-b border-amber-100">
            <Activity className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-800">4. Performance Issues</span>
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCard title="Check Steps" items={[
                "Task Manager (taskmgr) — which process is consuming CPU or memory?",
                "Resource Monitor (resmon) — per-process disk, CPU, network detail",
                "Performance Monitor (perfmon) — add SAP process and system counters",
                "SM50 / SM66 — check for long-running work processes on SAP side",
                "Windows Pagefile usage — if near 100%, system is out of RAM",
              ]} color="amber" />
              <InfoCard title="Actions" items={[
                "High CPU on disp+work.exe: investigate work processes in SM50",
                "Low available memory: reduce icm/max_conn or kill non-SAP processes",
                "Disk I/O bottleneck (perfmon): review SQL Server I/O or transport activity",
                "If paging is high: add RAM or reduce em/initial_size profile parameter",
                "Use SM04 to check active user sessions — reduce if session count too high",
              ]} color="green" />
            </div>
            <CmdBlock cmds={[
              { cmd: "taskmgr", desc: "Task Manager — sort by CPU or Memory to find the top consumer" },
              { cmd: "resmon", desc: "Resource Monitor — detailed CPU, disk, network per process" },
              { cmd: "perfmon", desc: "Performance Monitor — add counters: % Processor Time, Available MBytes, Disk Queue Length" },
            ]} />
            <ActionButtons issue="performance" />
          </div>
        </div>

        {/* Issue 5 */}
        <div className="border border-violet-200 rounded-xl overflow-hidden">
          <div className="bg-violet-50 px-4 py-2.5 flex items-center gap-2 border-b border-violet-100">
            <Shield className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-violet-800">5. Permission Issues</span>
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCard title="Check Steps" items={[
                "Right-click folder → Properties → Security — check SAPService<SID> permissions",
                "Check if transport import fails with 'Access Denied' on C:\\usr\\sap\\trans",
                "Verify sapmnt share permissions (both share-level and NTFS)",
                "Check if kernel patch fails — SAPService<SID> must write to exe directory",
                "Event Viewer → Security log — audit failures show exact permission denials",
              ]} color="amber" />
              <InfoCard title="Actions" items={[
                "Grant SAPService<SID>: Full Control on C:\\usr\\sap\\<SID> recursively",
                "Grant SAPService<SID>: Full Control on C:\\usr\\sap\\trans",
                "For sapmnt: set share permissions to Full Control for SAPService<SID>",
                "After permission change: restart SAP service and retry the operation",
                "Use icacls command to set permissions from command line in scripts",
              ]} color="green" />
            </div>
            <CmdBlock cmds={[
              { cmd: "icacls C:\\usr\\sap\\<SID> /grant SAPService<SID>:(OI)(CI)F /T", desc: "Grant SAPService<SID> Full Control on SAP instance directory recursively" },
              { cmd: "icacls C:\\usr\\sap\\trans /grant SAPService<SID>:(OI)(CI)F /T", desc: "Grant full access to transport directory" },
              { cmd: "whoami /priv", desc: "Check current user privileges — verify you have admin rights" },
            ]} />
            <ActionButtons issue="permissions" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "linux-vs-windows",
    title: "Limitations Compared to Linux for HANA",
    icon: <AlertTriangle className="w-4 h-4" />,
    tag: "Awareness",
    tagColor: "bg-red-100 text-red-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          While Windows remains a valid platform for SAP application servers, it has fundamental limitations for modern SAP workloads.
          Understanding these constraints helps you advise clients on migration paths and architecture decisions.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="What Windows Cannot Do for SAP" items={[
            "Run SAP HANA database — Linux only, no exception",
            "Run SAP S/4HANA DB layer — requires HANA = Linux",
            "Host Pacemaker HA clusters for SAP",
            "Use HANA System Replication (HSR)",
            "Support saptune OS tuning profiles",
            "Run on SAP-certified bare metal HANA appliances",
            "Support RISE with SAP cloud HANA workloads",
          ]} color="red" />
          <InfoCard title="Why Linux is Preferred for SAP" items={[
            "HANA in-memory tuning is Linux kernel-specific (THP, NUMA)",
            "Pacemaker/corosync HA — mature Linux-only stack",
            "Ansible automation for SAP — Linux system roles",
            "Container/Kubernetes support (BTP on Kyma — Linux)",
            "Larger SAP memory support on Linux bare metal",
            "SAP strongly recommends Linux for all new deployments",
            "Most cloud SAP reference architectures use Linux",
          ]} color="green" />
        </div>
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
          <Zap className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Career note:</span> If you are currently working on a Windows-based SAP landscape,
            invest in Linux skills proactively. Virtually all S/4HANA migrations require moving the database layer to Linux.
            Linux proficiency is now a baseline expectation for senior Basis consultants.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "references",
    title: "Reference Links",
    icon: <BookOpen className="w-4 h-4" />,
    tag: "Links",
    tagColor: "bg-gray-100 text-gray-600",
    content: (
      <div className="space-y-2">
        {[
          { label: "SAP on Windows — SAP Help Portal", desc: "SAP documentation for application server installation on Windows", url: "https://help.sap.com/docs/SAP_NETWEAVER" },
          { label: "Microsoft SQL Server for SAP", desc: "SQL Server as AnyDB for SAP NetWeaver and Business Suite systems", url: "https://www.microsoft.com/en-us/sql-server/sql-server-downloads" },
          { label: "SAP GUI for Windows", desc: "Download and install SAP GUI for Windows from the SAP Support Portal", url: "https://support.sap.com/en/tools/connectivity/sapgui.html" },
        ].map(({ label, desc, url }) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl bg-white hover:border-[#0070F2]/30 hover:bg-blue-50/30 transition-all group">
            <ExternalLink className="w-4 h-4 text-[#0070F2] flex-shrink-0 mt-0.5 group-hover:text-[#0060D8]" />
            <div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-[#0070F2]">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </div>
          </a>
        ))}
      </div>
    ),
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WindowsForSAP({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [openId, setOpenId] = useState<string>("when-windows");

  return (
    <NavCtx.Provider value={onNavigate}>
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <Monitor className="w-4 h-4 opacity-80" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Operating Systems</span>
        </div>
        <h1 className="text-xl font-extrabold mb-1">Windows for SAP Basis Operations</h1>
        <p className="text-xs opacity-70 max-w-xl">
          A practical SAP Basis guide to Windows — covering SAP application servers, services, SQL Server landscapes, monitoring, and key limitations versus Linux.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {["SAP on Windows", "SQL Server", "SAP GUI", "Windows Services", "Migration Awareness"].map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const isOpen = openId === section.id;
          return (
            <div key={section.id} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? "border-blue-300/50 shadow-sm" : "border-gray-200"} bg-white`}>
              <button
                onClick={() => setOpenId(isOpen ? "" : section.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{section.title}</span>
                    {section.tag && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${section.tagColor}`}>{section.tag}</span>
                    )}
                  </div>
                </div>
                {isOpen
                  ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                }
              </button>
              {isOpen && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/30">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </NavCtx.Provider>
  );
}
