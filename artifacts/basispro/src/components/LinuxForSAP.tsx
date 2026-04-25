import React, { useState } from "react";
import {
  Terminal, CheckCircle2, ExternalLink, ChevronRight, ChevronDown,
  Shield, Zap, AlertTriangle, Server, Layers, BookOpen, Activity,
  Settings, Database, Cloud, Info, Code,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  tag?: string;
  tagColor?: string;
  content: React.ReactNode;
}

// ─── Command block component ─────────────────────────────────────────────────

function CmdBlock({ cmds }: { cmds: { cmd: string; desc: string }[] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 mt-2">
      <div className="bg-gray-900 px-3 py-1.5 flex items-center gap-2">
        <Terminal className="w-3 h-3 text-green-400" />
        <span className="text-xs text-gray-400 font-mono">bash</span>
      </div>
      <div className="bg-gray-950 divide-y divide-gray-800">
        {cmds.map(({ cmd, desc }) => (
          <div key={cmd} className="flex items-start gap-3 px-3 py-2">
            <code className="text-green-400 font-mono text-xs whitespace-nowrap flex-shrink-0">{cmd}</code>
            <span className="text-gray-400 text-xs leading-relaxed">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Info card component ──────────────────────────────────────────────────────

function InfoCard({ title, items, color = "blue" }: { title: string; items: string[]; color?: "blue" | "green" | "amber" | "violet" }) {
  const colors = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-emerald-50 border-emerald-100",
    amber: "bg-amber-50 border-amber-100",
    violet: "bg-violet-50 border-violet-100",
  };
  const dotColors = {
    blue: "bg-[#0070F2]",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
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

const SECTIONS: Section[] = [
  {
    id: "why-linux",
    title: "Why Linux Matters for SAP",
    icon: <Server className="w-4 h-4" />,
    tag: "Foundation",
    tagColor: "bg-blue-100 text-blue-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          SAP HANA runs exclusively on Linux. Every modern SAP S/4HANA system is therefore Linux-based at the database layer,
          and most application servers in production environments run on Linux as well. A Basis consultant who cannot work
          comfortably on Linux is operationally limited on every modern project.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <InfoCard title="SAP HANA" items={["Runs only on Linux (RHEL, SLES)", "No Windows HANA support", "All HANA system files under Linux paths"]} color="blue" />
          <InfoCard title="Application Server" items={["ABAP/Java stack runs on Linux", "Instance profiles stored on Linux FS", "Kernel patches applied on Linux host"]} color="green" />
          <InfoCard title="HA/DR" items={["Pacemaker cluster runs on Linux", "HSR configured with Linux tools", "Failover scripts run in bash"]} color="violet" />
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <span className="font-bold">Practical reality:</span> In most client engagements, your first action after receiving system access is an SSH session to the Linux host. If you can't navigate the file system, check process status, or read logs — you cannot diagnose incidents independently.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "hana-linux",
    title: "Linux Role in SAP HANA and S/4HANA",
    icon: <Database className="w-4 h-4" />,
    tag: "Core",
    tagColor: "bg-emerald-100 text-emerald-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          SAP HANA is an in-memory database that runs entirely on Linux. SAP S/4HANA — the next-generation ERP — requires SAP HANA
          as its database, which means every S/4HANA deployment has Linux at its core. Understanding this stack is essential for any modern Basis consultant.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="S/4HANA Stack" items={["SAP HANA DB → Linux host (RHEL/SLES)", "ABAP Application Server → Linux or Windows", "SAP GUI / Fiori → client-side, platform agnostic", "Transport system (STMS) → stored in HANA"]} color="blue" />
          <InfoCard title="Key HANA Linux Paths" items={["/hana/data — HANA data volumes", "/hana/log — redo log volumes", "/hana/shared — shared HANA files", "/usr/sap/<SID>/HDB<NR>/trace — HANA trace files", "/hana/shared/<SID>/HDB<NR>/backup — backups"]} color="green" />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">HANA User & Service Management on Linux</div>
          <CmdBlock cmds={[
            { cmd: "su - <sid>adm", desc: "Switch to HANA admin user (e.g., hanaadm, s4hadm)" },
            { cmd: "HDB info", desc: "Show HANA process status (nameserver, indexserver, etc.)" },
            { cmd: "HDB start / HDB stop", desc: "Start or stop the HANA database" },
            { cmd: "hdbsql -i <NR> -u SYSTEM", desc: "Connect to HANA via command-line SQL client" },
          ]} />
        </div>
      </div>
    ),
  },
  {
    id: "rhel-sap",
    title: "RHEL for SAP Solutions Overview",
    icon: <Shield className="w-4 h-4" />,
    tag: "Platform",
    tagColor: "bg-violet-100 text-violet-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Red Hat Enterprise Linux for SAP Solutions is the recommended Linux distribution for running SAP HANA, SAP NetWeaver,
          and SAP S/4HANA in production. It is SAP-certified and comes with repositories, configurations, and support agreements
          specifically designed for SAP workloads.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="What RHEL for SAP Provides" items={[
            "SAP-specific software repositories (RHEL for SAP Apps, HANA)",
            "High Availability Add-On — Pacemaker cluster support",
            "Extended Update Support (EUS) — long lifecycle",
            "Proactive monitoring via Red Hat Insights",
            "Ansible automation with System Roles for SAP",
            "SAP HANA OS tuning via saptune / tuned-adm",
          ]} color="violet" />
          <InfoCard title="Supported Cloud Platforms" items={[
            "AWS — SAP-certified EC2 instance types (x1e, u-series)",
            "Microsoft Azure — M-series VMs (M128s, M208s)",
            "Google Cloud — M3 bare metal instances",
            "On-premise bare metal or VMware",
            "Consistent image across all platforms",
            "Cloud-specific RHEL marketplace images available",
          ]} color="blue" />
        </div>
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">SAP certification:</span> Only specific RHEL versions are certified by SAP for HANA. Always check the{" "}
            <a href="https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;v:hana" target="_blank" rel="noopener noreferrer" className="underline">SAP Hardware Directory</a>{" "}
            before deploying. Using an uncertified OS version voids SAP support.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "core-skills",
    title: "Core Linux Skills for Basis Consultants",
    icon: <Layers className="w-4 h-4" />,
    tag: "Essential",
    tagColor: "bg-[#0070F2]/10 text-[#0070F2]",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          These are the Linux skills every Basis consultant must be comfortable with in order to operate independently on any SAP landscape.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="File System Navigation" items={[
            "Navigate /usr/sap, /hana, /sapmnt directory trees",
            "Read and tail log files (cat, tail -f, less)",
            "Find files by pattern (find, locate)",
            "Check disk space and inode usage (df -h, du -sh)",
            "Understand SAP instance directory layout",
          ]} color="blue" />
          <InfoCard title="Process & Service Management" items={[
            "Check SAP process status with sapcontrol",
            "Manage systemd services (systemctl start/stop/status)",
            "Monitor processes with top, ps -ef, pgrep",
            "Kill stuck processes safely (kill -SIGTERM, -SIGKILL)",
            "Check process resource usage with pidstat",
          ]} color="green" />
          <InfoCard title="Networking Basics" items={[
            "Check IP configuration (ip addr, ifconfig)",
            "Test connectivity (ping, traceroute, nc)",
            "DNS resolution (nslookup, dig, host)",
            "Check open ports and connections (ss -tlnp, netstat)",
            "SSH key management for system access",
          ]} color="violet" />
          <InfoCard title="User & Permissions" items={[
            "Understand SAP OS users: <sid>adm, sapadm",
            "Manage file permissions (chmod, chown)",
            "Use sudo for privileged commands",
            "Read /etc/passwd and /etc/group for SAP users",
            "Set umask for SAP work directory security",
          ]} color="amber" />
        </div>
      </div>
    ),
  },
  {
    id: "hana-migration",
    title: "SAP HANA Migration and Linux Readiness",
    icon: <Activity className="w-4 h-4" />,
    tag: "Migration",
    tagColor: "bg-amber-100 text-amber-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Migrating an SAP system to HANA means migrating it to Linux. Any ERP or Business Suite system that previously ran on
          Windows with SQL Server or Oracle must move to a Linux host when converting to S/4HANA. This is a fundamental Basis
          project deliverable.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="Linux Readiness Checklist" items={[
            "OS version SAP-certified for HANA (check SAP HW Directory)",
            "RHEL SAP repositories enabled and registered",
            "saptune applied with HANA solution profile",
            "Transparent Huge Pages (THP) disabled or managed",
            "Swap space configured per SAP note 1999997",
            "NTP configured for time sync across nodes",
            "Hostname resolves correctly in /etc/hosts",
          ]} color="amber" />
          <InfoCard title="Migration Scenarios Requiring Linux" items={[
            "Suite on HANA (SoH) — ECC to HANA DB swap",
            "S/4HANA new implementation — HANA-only",
            "S/4HANA conversion (In-Place) — DMO or SWPM",
            "RISE with SAP migration — cloud HANA",
            "Database Migration Option (DMO) of SUM tool",
            "System Copy with OS/DB migration (heterogeneous)",
          ]} color="blue" />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key OS Tuning Commands Pre-Migration</div>
          <CmdBlock cmds={[
            { cmd: "saptune solution apply HANA", desc: "Apply SAP HANA OS tuning profile (replaces tuned-adm on SLES/RHEL)" },
            { cmd: "saptune status", desc: "Check current tuning solution and active notes" },
            { cmd: "tuned-adm active", desc: "Check active tuned profile (on systems without saptune)" },
            { cmd: "cat /proc/sys/vm/nr_hugepages", desc: "Check transparent huge pages configuration" },
            { cmd: "free -g", desc: "Verify available RAM before HANA installation" },
          ]} />
        </div>
      </div>
    ),
  },
  {
    id: "ha-dr",
    title: "HA/DR and Clustering Basics",
    icon: <Shield className="w-4 h-4" />,
    tag: "Advanced",
    tagColor: "bg-rose-100 text-rose-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          SAP HANA High Availability (HA) and Disaster Recovery (DR) on Linux use Pacemaker, a cluster resource manager,
          combined with HANA System Replication (HSR). Understanding the Linux layer is essential for troubleshooting cluster failures.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="Pacemaker Cluster Components" items={[
            "pacemaker — cluster resource manager",
            "corosync — cluster communication layer",
            "pcs or crm — cluster management CLI",
            "SAPHana resource agent — manages HANA in cluster",
            "SAPHanaTopology resource agent — monitors HSR topology",
            "stonith — fencing to avoid split-brain",
          ]} color="violet" />
          <InfoCard title="Key Cluster Checks" items={[
            "pcs status — overall cluster and resource status",
            "crm_mon -1 — one-shot cluster status view",
            "pcs constraint list — check placement constraints",
            "corosync-cfgtool -s — check corosync ring status",
            "journalctl -u pacemaker — pacemaker service log",
            "hdbnsutil -sr_state — HSR replication state",
          ]} color="blue" />
        </div>
        <CmdBlock cmds={[
          { cmd: "pcs status", desc: "Show cluster and resource status — first command in any cluster incident" },
          { cmd: "pcs resource move SAPHana_<SID> <node>", desc: "Manually move HANA master to a specific node" },
          { cmd: "hdbnsutil -sr_state", desc: "Check HSR mode: PRIMARY / SECONDARY / NONE" },
          { cmd: "pcs stonith fence <nodename>", desc: "Manually trigger fencing of a node (use with caution)" },
          { cmd: "corosync-cfgtool -s", desc: "Verify corosync communication ring health" },
        ]} />
      </div>
    ),
  },
  {
    id: "ansible",
    title: "Automation with Ansible / System Roles",
    icon: <Settings className="w-4 h-4" />,
    tag: "Automation",
    tagColor: "bg-green-100 text-green-700",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Red Hat provides a collection of RHEL System Roles for SAP that automate OS configuration tasks required before
          SAP HANA or SAP NetWeaver installation. These are Ansible-based and can be used in pipelines or run manually.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard title="RHEL System Roles for SAP" items={[
            "sap_hana_install — automates HANA installation steps",
            "sap_netweaver_install — automates NetWeaver setup",
            "sap_os_setup — applies OS parameters for SAP",
            "sap_storage_setup — partitions and mounts HANA volumes",
            "sap_ha_pacemaker_cluster — deploys Pacemaker HA cluster",
            "sap_hostagent — manages SAP Host Agent lifecycle",
          ]} color="green" />
          <InfoCard title="Why This Matters for Basis" items={[
            "Reduces manual OS setup errors before HANA install",
            "Enables repeatable, auditable deployments",
            "Used by SAP cloud partners for automated migrations",
            "RISE with SAP provisioning often uses Ansible internally",
            "Required skill for DevOps-integrated Basis roles",
            "Red Hat publishes collection on Ansible Galaxy",
          ]} color="blue" />
        </div>
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800">
          <Zap className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Practical note:</span> Even if you don't write Ansible playbooks yourself, understanding
            what System Roles do helps you verify that an automated deployment was configured correctly before you run HANA installation.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "commands",
    title: "Daily Basis Linux Commands",
    icon: <Terminal className="w-4 h-4" />,
    tag: "Reference",
    tagColor: "bg-gray-100 text-gray-600",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          These are the Linux commands you will use repeatedly as a Basis consultant — during system monitoring, incident response,
          HANA administration, and network diagnostics.
        </p>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System Health</div>
            <CmdBlock cmds={[
              { cmd: "top", desc: "Real-time CPU, memory, and process usage — press 1 for per-CPU view" },
              { cmd: "free -g", desc: "Show memory in GB — check total, used, and free RAM" },
              { cmd: "df -h", desc: "Disk usage of all mounted filesystems — check /hana, /usr/sap" },
              { cmd: "uptime", desc: "System uptime and load averages — quick health check" },
              { cmd: "ps -ef | grep sap", desc: "List all running SAP-related processes" },
            ]} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Services & Logs</div>
            <CmdBlock cmds={[
              { cmd: "systemctl status <service>", desc: "Check status of a systemd service (e.g., sapinit)" },
              { cmd: "journalctl -xe", desc: "Show recent systemd journal with extended error context" },
              { cmd: "journalctl -u <service> -f", desc: "Follow logs for a specific service in real time" },
              { cmd: "tail -f /usr/sap/<SID>/D<NR>/work/dev_w0", desc: "Follow SAP work process trace log" },
            ]} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Network</div>
            <CmdBlock cmds={[
              { cmd: "ip addr", desc: "Show all network interfaces and IP addresses" },
              { cmd: "ping <hostname>", desc: "Basic connectivity check to target host" },
              { cmd: "nslookup <hostname>", desc: "Verify DNS resolution — critical for RFC and HANA connectivity" },
              { cmd: "ssh <sid>adm@<host>", desc: "SSH to SAP host as admin user" },
              { cmd: "ss -tlnp", desc: "Show listening TCP ports — verify HANA/ICM/dispatcher ports" },
            ]} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">SAP OS Tuning</div>
            <CmdBlock cmds={[
              { cmd: "saptune status", desc: "Show current SAP OS tuning status and active solution" },
              { cmd: "saptune solution apply HANA", desc: "Apply HANA tuning profile (sets kernel params, scheduling)" },
              { cmd: "tuned-adm active", desc: "Show active tuned profile on non-saptune systems" },
              { cmd: "tuned-adm profile sap-hana", desc: "Apply sap-hana tuned profile manually" },
            ]} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting Checklist",
    icon: <AlertTriangle className="w-4 h-4" />,
    tag: "Incident",
    tagColor: "bg-red-100 text-red-700",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          A structured Linux-level checklist for SAP incident first response. Work through these before escalating.
        </p>
        {[
          { label: "Check OS-level health", items: ["top — CPU saturation?", "free -g — memory exhausted?", "df -h — disk full on /hana/data, /hana/log, /usr/sap?", "uptime — system recently rebooted unexpectedly?"] },
          { label: "Check SAP process status", items: ["sapcontrol -nr <NR> -function GetProcessList", "HDB info (for HANA hosts)", "ps -ef | grep -i sap (list all SAP processes)"] },
          { label: "Check application logs", items: ["tail -200 /usr/sap/<SID>/D<NR>/work/dev_w0 — work process trace", "journalctl -xe — OS-level errors since last boot", "cat /var/log/messages | grep -i err — kernel/OS errors"] },
          { label: "Check HANA trace files", items: ["ls -lt /usr/sap/<SID>/HDB<NR>/trace/ | head -20 — latest traces", "grep -i 'error\\|crash\\|oom' /hana/shared/<SID>/HDB<NR>/trace/nameserver.trc"] },
          { label: "Check network and connectivity", items: ["ping <target> — can host reach other SAP hosts?", "nslookup <hostname> — DNS resolving correctly?", "ss -tlnp | grep 3<NR>15 — HANA SQL port listening?"] },
          { label: "Check cluster (HA environments)", items: ["pcs status — any resources in FAILED state?", "hdbnsutil -sr_state — HSR replication mode and status", "journalctl -u pacemaker — recent cluster events"] },
        ].map(({ label, items }) => (
          <div key={label} className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
            <div className="text-xs font-bold text-gray-700 mb-2">{label}</div>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <code className="font-mono">{item}</code>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
          { label: "RHEL for SAP Solutions", desc: "Red Hat's enterprise Linux platform for SAP HANA, NetWeaver, and S/4HANA workloads", url: "https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/sap" },
          { label: "Linux for ERP", desc: "Why Linux is the foundation for modern enterprise ERP deployments", url: "https://www.redhat.com/en/topics/linux/what-is-erp" },
          { label: "SAP HANA Migration and Linux", desc: "How Linux enables SAP HANA migration and what Basis consultants need to know", url: "https://www.redhat.com/en/topics/linux/what-is-sap-hana-migration" },
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

export default function LinuxForSAP() {
  const [openId, setOpenId] = useState<string>("why-linux");

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <Terminal className="w-4 h-4 opacity-80" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Operating Systems</span>
        </div>
        <h1 className="text-xl font-extrabold mb-1">Linux for SAP Basis & SAP HANA Operations</h1>
        <p className="text-xs opacity-70 max-w-xl">
          A practical SAP Basis guide to Linux — covering RHEL for SAP, HANA administration, clustering, OS tuning, and the commands you use every day.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {["SAP HANA", "RHEL for SAP", "Pacemaker HA", "saptune", "S/4HANA"].map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const isOpen = openId === section.id;
          return (
            <div key={section.id} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? "border-[#0070F2]/30 shadow-sm" : "border-gray-200"} bg-white`}>
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
  );
}
