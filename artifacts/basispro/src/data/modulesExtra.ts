import type { ModuleData } from "./moduleContent";

// ─────────────────────────────────────────────
// SAP on AWS
// ─────────────────────────────────────────────
export const awsModule: ModuleData = {
  id: "aws",
  title: "SAP on AWS",
  subtitle: "SAP Workloads on Amazon Web Services",
  version: "2024 / RISE with SAP on AWS",
  sourceUrl: "https://docs.aws.amazon.com/sap/latest/general/welcome.html",
  overview:
    "AWS is one of the leading hyperscalers for running SAP workloads globally. As a Senior Basis Consultant, you architect and operate SAP systems on AWS covering instance sizing, storage layout, HA/DR with AWS native services, networking, monitoring with AWS Data Provider, and RISE with SAP deployments.",
  color: "#E65100",
  sections: [
    {
      id: "overview",
      title: "Overview & Architecture",
      nodes: [
        {
          id: "aws-overview",
          title: "SAP on AWS — Architecture & EC2 Instance Types",
          icon: "Cloud",
          badge: "Foundation",
          summary:
            "AWS supports all major SAP workloads: S/4HANA, BW/4HANA, ECC, Business Suite, SAP HANA scale-up and scale-out. Certified EC2 instances are available for both HANA OLTP (x1e, r5, r6i, u series) and HANA OLAP (scale-out).",
          keyPoints: [
            "SAP HANA certified instances: x1e.32xlarge (4 TB RAM), r6i.metal, r5b.metal — check SAP Note 2235581 for current certification list",
            "HANA Scale-up: single EC2 instance — x1e, r5, r6i families support up to 24 TB RAM",
            "HANA Scale-out: multiple EC2 instances connected via high-bandwidth networking (ENI, EFA)",
            "SAP NetWeaver / ABAP App Server: c5, m5, m6i instance families — right-size using SAPS ratings",
            "AWS Data Provider for SAP: agent installed on EC2 that feeds cloud-specific metrics to HANA and SAP CCMS",
            "RISE with SAP on AWS: SAP-managed subscription; infrastructure provisioned by SAP on AWS — customer manages application layer",
            "EC2 placement groups: cluster placement groups recommended for HANA scale-out (minimizes inter-node latency)",
            "Dedicated hosts / dedicated instances for SAP licensing compliance in some scenarios",
          ],
          links: [
            { label: "SAP HANA Certified EC2 Instances", url: "https://docs.aws.amazon.com/sap/latest/general/sap-hana-aws-ec2.html" },
            { label: "SAP on AWS Overview", url: "https://docs.aws.amazon.com/sap/latest/general/sap-on-aws-overview.html" },
            { label: "EC2 Instance Types for SAP", url: "https://docs.aws.amazon.com/sap/latest/general/ec2-instance-types-sap.html" },
          ],
          sapNotes: [
            { note: "2235581", desc: "SAP HANA — certified Amazon EC2 instances" },
            { note: "1656099", desc: "SAP applications on AWS — supported instance types" },
          ],
          tip: "Always validate EC2 instance type against the latest SAP PAM before sizing. AWS updates certifications quarterly — what's certified for HANA 2.0 SPS06 may differ from SPS07.",
        },
        {
          id: "aws-storage",
          title: "Storage Architecture for SAP on AWS",
          icon: "HardDrive",
          badge: "Critical",
          summary:
            "SAP HANA on AWS requires specific storage throughput and IOPS for data and log volumes. EBS gp3 and io2 volumes are the standard choices; FSx for NetApp ONTAP enables shared NFS for scale-out and backup.",
          keyPoints: [
            "HANA Data volume: EBS gp3 (minimum 250 MiB/s, 3000 IOPS) — provision 3× RAM size for data",
            "HANA Log volume: EBS io2 Block Express — minimum 250 MiB/s throughput, 4000 IOPS — latency < 1 ms required",
            "HANA Shared/Backup: EFS (NFS) or FSx for NetApp ONTAP — accessible across multiple instances",
            "EBS encryption at rest: enabled by default using AWS KMS — required for HANA data protection",
            "Multi-attach EBS (io2): allows same volume on multiple EC2 (needed for shared log in HANA HSR failover scenarios)",
            "AWS Backup for SAP HANA: native integration with HANA backup catalog; supports BACKINT API",
            "SAP HANA Backint agent for AWS: replaces disk-based backups; backups go directly to S3 via AWS Backint agent",
            "For HANA scale-out: use NFS on FSx for NetApp ONTAP for /hana/shared across all nodes",
          ],
          sapNotes: [
            { note: "2779240", desc: "SAP HANA AWS storage configuration guidelines" },
            { note: "1944799", desc: "SAP HANA guidelines for SLES on VMware vSphere and AWS" },
          ],
          links: [
            { label: "AWS Storage Guide for SAP HANA", url: "https://docs.aws.amazon.com/sap/latest/sap-hana/welcome.html" },
            { label: "AWS Backint Agent for SAP HANA", url: "https://docs.aws.amazon.com/sap/latest/sap-hana/aws-backint-agent-config.html" },
          ],
          warning: "Do not use EBS gp2 for HANA log volumes — it cannot guarantee the consistent sub-millisecond latency HANA requires for redo log writes.",
        },
      ],
    },
    {
      id: "networking",
      title: "Networking & Security",
      nodes: [
        {
          id: "aws-networking",
          title: "VPC Design & SAP Network Architecture",
          icon: "Globe",
          badge: "Architecture",
          summary:
            "SAP on AWS network architecture uses VPCs with subnets separated by tier (app, DB, management). Connectivity to on-premise SAP systems uses AWS Direct Connect or Site-to-Site VPN. SAP transport routes must be explicitly defined.",
          keyPoints: [
            "VPC layout: private subnets for SAP App + DB servers; management subnet for bastion/jump host",
            "Security groups: tightly restrict SAP ports — 3200/3300 (DIAG), 8080/443 (HTTP/S), 3000-3099 (RFC), 5000 (ASE), 30015 (HANA SQL)",
            "Direct Connect: minimum 1 Gbps for production SAP landscapes with active data replication or bulk data loads",
            "HANA scale-out: use EFA (Elastic Fabric Adapter) or cluster placement group for inter-node communication",
            "SAP transport routes (STMS): define virtual hostnames for AWS instances — use CNAME or Route 53 private hosted zones",
            "Overlay IP routing: AWS Transit Gateway + NLB pattern for SAP HA transparent IP failover across AZs",
            "DNS: use Route 53 private hosted zones for SAP hostnames; avoid relying on private IP addresses directly",
            "NFS for /sapmnt: EFS or FSx — mount with nfs4 protocol, rsize/wsize=1048576, timeo=600",
          ],
          links: [
            { label: "SAP on AWS HA with Overlay IP", url: "https://docs.aws.amazon.com/sap/latest/sap-hana/sap-ha-overlay-ip.html" },
            { label: "AWS VPC for SAP", url: "https://docs.aws.amazon.com/sap/latest/general/architecture-guidance-of-sap-on-aws.html" },
          ],
          tip: "Use AWS Route 53 private hosted zone records for SAP virtual hostnames — this allows failover without IP changes and works transparently with SAP STMS and RFC destinations.",
        },
      ],
    },
    {
      id: "ha-dr",
      title: "High Availability & Disaster Recovery",
      nodes: [
        {
          id: "aws-ha",
          title: "SAP HANA HA on AWS — Multi-AZ",
          icon: "Shield",
          badge: "Mission Critical",
          summary:
            "SAP HANA HA on AWS uses HANA System Replication (HSR) across two Availability Zones combined with Pacemaker cluster and AWS Overlay IP routing. This provides sub-30-second automatic failover.",
          keyPoints: [
            "Architecture: Primary HANA in AZ-1 + Secondary HANA (HSR SYNC) in AZ-2 + Pacemaker + AWS Overlay IP",
            "Overlay IP: virtual IP address routed via AWS Transit Gateway — moves between AZs on failover without EIP changes",
            "Pacemaker: manages HANA resource agents (SAPHana, SAPHanaTopology) and Overlay IP",
            "AWS Data Provider: must be running on all nodes for cloud-specific health signals",
            "HSR mode: SYNC preferred for HA; SYNCMEM for zero RPO in same DC; ASYNC for DR across regions",
            "AWS Launch Wizard for SAP: automates HA deployment — provisions EC2, storage, Pacemaker, HSR in one workflow",
            "SAP Note 1868591: cluster configuration guide for SLES on AWS with Pacemaker + HSR",
          ],
          steps: [
            "Step 1: Deploy two identical r6i EC2 instances in different AZs, same region",
            "Step 2: Configure EBS gp3/io2 volumes on both instances per storage guidelines",
            "Step 3: Install and configure SAP HANA on primary instance",
            "Step 4: Configure HANA System Replication: hdbnsutil -sr_enable --name=SITE1",
            "Step 5: Register secondary: hdbnsutil -sr_register --remoteHost=<primary> --remoteInstance=<NR> --replicationMode=sync --name=SITE2",
            "Step 6: Install Pacemaker + AWS Overlay IP resource agent on both nodes",
            "Step 7: Configure SAPHana and SAPHanaTopology OCF resources in Pacemaker",
            "Step 8: Test failover: crm resource migrate msl_SAPHana_<SID> <secondary_node>",
            "Step 9: Validate application connectivity via virtual hostname after failover",
          ],
          sapNotes: [
            { note: "1868591", desc: "SAP HANA HA cluster configuration on AWS" },
            { note: "2578899", desc: "SUSE Linux Enterprise Server 15 on AWS — SAP support" },
          ],
          links: [
            { label: "SAP HANA HA on AWS Guide", url: "https://docs.aws.amazon.com/sap/latest/sap-hana/welcome.html" },
          ],
        },
        {
          id: "aws-dr",
          title: "Disaster Recovery — AWS Elastic Disaster Recovery",
          icon: "RefreshCw",
          badge: "DR",
          summary:
            "AWS Elastic Disaster Recovery (AWS DRS) provides continuous replication of SAP servers to a recovery region with RPO in seconds and RTO in minutes. For HANA, HSR async replication to a DR region is the preferred approach.",
          keyPoints: [
            "AWS DRS: block-level replication of entire EC2 instances to DR region — supports any OS/application including SAP",
            "For HANA DR: HANA HSR ASYNC (third tier) to DR region preferred — more efficient than DRS for HANA",
            "HANA Multitier DR: Production (sync HSR for HA) + DR site (async HSR) — full automation via Pacemaker",
            "RPO with HANA ASYNC HSR: typically seconds to low minutes depending on network bandwidth",
            "RTO: HANA restart in DR region from ASYNC secondary — typically 10-20 minutes",
            "AWS Route 53 failover routing: switch DNS to DR region on failover — update STMS target if needed",
            "Test DR annually: AWS DRS supports drill mode — spin up DR servers without stopping replication",
          ],
          links: [
            { label: "Disaster Recovery with AWS DRS", url: "https://docs.aws.amazon.com/sap/latest/general/dr-sap.html" },
          ],
        },
      ],
    },
    {
      id: "operations",
      title: "Operations & Monitoring",
      nodes: [
        {
          id: "aws-data-provider",
          title: "AWS Data Provider for SAP",
          icon: "Activity",
          badge: "Monitoring",
          summary:
            "AWS Data Provider for SAP is an agent installed on SAP EC2 instances that provides cloud infrastructure metrics (CPU, memory, disk, network) to SAP systems via HANA and CCMS. Required for proper SAP support on AWS.",
          steps: [
            "Download AWS Data Provider package from SAP Software Centre (SAPCAR archive)",
            "Install on ALL SAP instances: ./install.sh",
            "Verify service: systemctl status aws-data-provider",
            "Validate data flowing to HANA: select * from SYS.M_HOST_INFORMATION where KEY like 'cloud%'",
            "Check in CCMS (AL13): look for AWS infrastructure data under shared memory objects",
            "Update periodically: check SAP Note 2376043 for latest Data Provider version",
          ],
          keyPoints: [
            "Required by SAP for official AWS support — without it, SAP cannot confirm EC2 infrastructure for support tickets",
            "Provides: instance type, region, AZ, hypervisor version, EBS volume info to SAP HANA",
            "SAP Note 2039572: AWS Data Provider for SAP — installation guide",
            "Must run on: HANA DB server, ABAP app servers, any SAP-certified instance",
          ],
          sapNotes: [
            { note: "2039572", desc: "AWS Data Provider for SAP — installation and configuration" },
            { note: "2376043", desc: "AWS Data Provider — version history and updates" },
          ],
          links: [
            { label: "AWS Data Provider Documentation", url: "https://docs.aws.amazon.com/sap/latest/general/aws-data-provider.html" },
            { label: "Data Provider Installation", url: "https://docs.aws.amazon.com/sap/latest/general/data-provider-installation.html" },
          ],
        },
        {
          id: "aws-ssm",
          title: "AWS Systems Manager for SAP",
          icon: "Settings",
          badge: "Automation",
          summary:
            "AWS Systems Manager for SAP (SSM for SAP) provides a managed control plane to register, discover, and manage SAP applications on AWS — including HANA operations, automated patching, and change calendar integration.",
          keyPoints: [
            "Register SAP systems via SSM for SAP — enables central visibility of SAP landscape on AWS",
            "Automated patching: SSM Patch Manager integrates with OS patching schedule for SAP EC2 instances",
            "SAP HANA backup automation: SSM Automation documents for HANA backup via Backint",
            "Change calendar: block patching during SAP freeze periods using SSM Change Calendar",
            "Cost optimization: use SSM Fleet Manager to identify underutilized SAP instances",
            "SAP Note 3271087: AWS Systems Manager for SAP — setup and configuration",
          ],
          links: [
            { label: "AWS SSM for SAP", url: "https://docs.aws.amazon.com/ssm-sap/latest/userguide/what-is-ssm-for-sap.html" },
            { label: "AWS Launch Wizard for SAP", url: "https://docs.aws.amazon.com/launchwizard/latest/userguide/launch-wizard-sap.html" },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// SAP on GCP
// ─────────────────────────────────────────────
export const gcpModule: ModuleData = {
  id: "gcp",
  title: "SAP on GCP",
  subtitle: "SAP Workloads on Google Cloud Platform",
  version: "2024 / RISE with SAP on GCP",
  sourceUrl: "https://cloud.google.com/solutions/sap",
  overview:
    "Google Cloud Platform (GCP) supports SAP HANA, S/4HANA, BW/4HANA, and other SAP workloads with dedicated certified machine types (M2, M3 series). The Google Cloud Agent for SAP provides cloud-native infrastructure metrics to SAP. GCP's Bare Metal Solution supports full HANA scale-up configurations.",
  color: "#1565C0",
  sections: [
    {
      id: "overview",
      title: "Overview & Instance Types",
      nodes: [
        {
          id: "gcp-overview",
          title: "SAP on GCP — Architecture & Machine Types",
          icon: "Cloud",
          badge: "Foundation",
          summary:
            "GCP certifies specific machine families for SAP HANA. M2 and M3 ultra-high-memory machines handle the largest HANA deployments. Standard compute VMs handle SAP application servers.",
          keyPoints: [
            "HANA certified machine types: M2 (m2-ultramem-208, m2-megamem-96), M3 (m3-ultramem-32/64/128/208) — up to 12 TB RAM",
            "HANA scale-out: multiple M-series VMs with Filestore NFS for shared volumes",
            "App server sizing: n2, n2d, c2 machine families — mapped to SAPS rating in SAP PAM",
            "Bare Metal Solution (BMS): dedicated physical servers in GCP datacenters for largest HANA deployments requiring bare-metal performance",
            "Google Cloud Agent for SAP: replaces legacy SAP Host Agent cloud connectivity — mandatory for GCP support",
            "Persistent Disk (PD SSD): primary storage for HANA data/log; PD Extreme for maximum IOPS",
            "Hyperdisk Extreme: new storage with up to 350,000 IOPS — recommended for HANA log volumes",
            "SAP Note 2456301: SAP on Google Cloud — certified GCP machine types",
          ],
          links: [
            { label: "SAP on Google Cloud Documentation", url: "https://cloud.google.com/solutions/sap" },
            { label: "SAP HANA on GCP", url: "https://cloud.google.com/solutions/sap/docs/sap-hana-planning-guide" },
          ],
          sapNotes: [
            { note: "2456301", desc: "SAP on Google Cloud — certified GCP instances and storage" },
            { note: "3119751", desc: "Google Cloud Agent for SAP — installation guide" },
          ],
        },
        {
          id: "gcp-storage",
          title: "Storage for SAP HANA on GCP",
          icon: "HardDrive",
          badge: "Critical",
          summary:
            "GCP offers Persistent Disk (balanced, SSD, Extreme) and Hyperdisk for SAP HANA storage. Log volumes require the lowest possible latency; use PD Extreme or Hyperdisk Extreme.",
          keyPoints: [
            "HANA data volume: pd-ssd, minimum 400 MB/s throughput, 15000 IOPS",
            "HANA log volume: pd-extreme or hyperdisk-extreme — must sustain < 1 ms write latency",
            "HANA shared/backup: Filestore (NFS) — Filestore Enterprise for production multi-zone",
            "Regional Persistent Disk: replicates PD synchronously across two zones in same region — enables HA with near-zero storage failover",
            "Backup: Google Cloud Storage (GCS) via HANA Backint Agent for GCP",
            "SAP Note 2779240: GCP storage configuration for HANA (shared with AWS — check GCP-specific addendum)",
          ],
          sapNotes: [
            { note: "3072209", desc: "GCP Hyperdisk configuration for SAP HANA" },
          ],
          links: [
            { label: "SAP HANA Storage on GCP", url: "https://cloud.google.com/solutions/sap/docs/sap-hana-planning-guide#storage" },
          ],
        },
      ],
    },
    {
      id: "ha-dr",
      title: "High Availability & DR",
      nodes: [
        {
          id: "gcp-ha",
          title: "SAP HANA HA on GCP — Multi-Zone",
          icon: "Shield",
          badge: "Mission Critical",
          summary:
            "SAP HANA HA on GCP uses HSR across two GCP zones with Pacemaker cluster and a GCP Internal Load Balancer (ILB) as the virtual IP mechanism — replacing the traditional virtual IP with a floating ILB frontend.",
          keyPoints: [
            "Architecture: HANA primary (zone A) + HANA secondary HSR SYNC (zone B) + Pacemaker + GCP ILB",
            "GCP ILB as virtual IP: ILB frontend IP routes to the active HANA instance — no need for IP address failover",
            "Pacemaker OCF agents: SAPHana + SAPHanaTopology + GCP resource agents for ILB health check management",
            "Regional Persistent Disk: synchronously replicated across zones — storage available on either zone instantly",
            "HANA HSR modes: SYNC for HA (same region); ASYNC for DR (cross-region)",
            "Failover testing: crm resource migrate msl_SAPHana to trigger managed failover",
            "SAP Note 2927211: HANA HA cluster on RHEL on GCP; SAP Note 2958721 for SLES on GCP",
          ],
          sapNotes: [
            { note: "2927211", desc: "SAP HANA HA cluster on RHEL on GCP" },
            { note: "2958721", desc: "SAP HANA HA on SLES on GCP" },
          ],
          links: [
            { label: "HANA HA on GCP Guide", url: "https://cloud.google.com/solutions/sap/docs/sap-hana-ha-config-sles" },
          ],
        },
        {
          id: "gcp-dr",
          title: "Disaster Recovery on GCP",
          icon: "Globe",
          badge: "DR",
          summary:
            "SAP DR on GCP uses HANA HSR ASYNC replication to a secondary GCP region, combined with GCS-based backup for non-HANA workloads. Google Cloud VMware Engine (GCVE) can also host DR workloads.",
          keyPoints: [
            "HANA DR: third HSR tier in a secondary GCP region with ASYNC replication",
            "GCS Backup: HANA Backint for GCS enables direct backups to Google Cloud Storage",
            "Restore time estimate: download from GCS + HANA recovery time; test regularly",
            "GCVE (Google Cloud VMware Engine): run VMware-based SAP workloads in GCP for DR",
            "Cross-region latency: choose closest secondary region to minimize ASYNC lag",
            "DR testing: use GCP VM snapshots to create DR test environment non-destructively",
          ],
          links: [
            { label: "SAP HANA Backup to GCS", url: "https://cloud.google.com/solutions/sap/docs/sap-hana-backint-overview" },
          ],
        },
      ],
    },
    {
      id: "operations",
      title: "Operations & Tools",
      nodes: [
        {
          id: "gcp-agent",
          title: "Google Cloud Agent for SAP",
          icon: "Activity",
          badge: "Required",
          summary:
            "The Google Cloud Agent for SAP replaces the legacy GCP SAP Host Agent functions and provides HANA monitoring, workload manager integration, and cloud-native metrics to SAP systems. Mandatory for GCP SAP support.",
          steps: [
            "Install on all SAP EC2 VM instances: agent included in GCP marketplace SAP HANA image or install manually",
            "sudo apt-get install google-cloud-sap-agent (Debian/SLES) or rpm install",
            "Configure /etc/google-cloud-sap-agent/configuration.json — set SID, instance number, service account",
            "Enable and start: sudo systemctl enable --now google-cloud-sap-agent",
            "Verify: sudo systemctl status google-cloud-sap-agent",
            "Check logs: sudo journalctl -u google-cloud-sap-agent",
          ],
          keyPoints: [
            "Provides: VM metrics, HANA monitoring data, backup status, performance metrics to Cloud Ops",
            "Required for: Cloud Monitoring dashboards, Workload Manager SAP compliance checks",
            "GCP Workload Manager: validates SAP HANA configuration against best practices automatically",
            "SAP Note 3119751: agent installation and configuration guide",
          ],
          sapNotes: [
            { note: "3119751", desc: "Google Cloud Agent for SAP — installation and configuration" },
          ],
          links: [
            { label: "Google Cloud Agent for SAP", url: "https://cloud.google.com/solutions/sap/docs/agent-for-sap/latest/all-guides" },
            { label: "GCP Workload Manager for SAP", url: "https://cloud.google.com/workload-manager/docs/sap-workloads" },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// SAP on Azure
// ─────────────────────────────────────────────
export const azureModule: ModuleData = {
  id: "azure",
  title: "SAP on Azure",
  subtitle: "SAP Workloads on Microsoft Azure",
  version: "2024 / RISE with SAP on Azure",
  sourceUrl: "https://learn.microsoft.com/en-us/azure/sap/",
  overview:
    "Microsoft Azure is the most common hyperscaler in enterprise SAP landscapes, especially in existing Microsoft-heavy environments. Azure certifies M-series and Mv2 VMs for SAP HANA. RISE with SAP on Azure, Azure Center for SAP Solutions (ACSS), and Azure Monitor for SAP provide a full lifecycle management toolchain.",
  color: "#0078D4",
  sections: [
    {
      id: "overview",
      title: "Overview & VM Sizing",
      nodes: [
        {
          id: "azure-overview",
          title: "SAP on Azure — Architecture & VM Types",
          icon: "Cloud",
          badge: "Foundation",
          summary:
            "Azure M-series and Mv2-series VMs are certified for SAP HANA up to 11.5 TB RAM. Standard_M208ms_v2 and Standard_M832ixs_v2 cover the largest HANA scale-up needs. D and E series VMs serve SAP application server tiers.",
          keyPoints: [
            "HANA certified VMs: M-series (M32ts to M208ms), Mv2-series (M208ms_v2 to M832ixs_v2 — up to 11.5 TB RAM)",
            "App servers: E-series (Edsv4/Ev4), D-series (Ddsv4) for SAP ABAP/Java instances",
            "HANA Large Instances (HLI): dedicated bare-metal physical servers in Azure datacenters — Type I (up to 2 TB) and Type II (up to 20 TB); being phased out in favor of Mv2 VMs",
            "ACSS (Azure Center for SAP Solutions): Azure's native SAP lifecycle management — deploys, monitors, manages SAP on Azure",
            "Azure Proximity Placement Groups (PPG): ensure low-latency co-location of SAP DB and app servers",
            "SAP Note 1928533: SAP on Azure — supported VM types and sizes",
            "Azure regions for SAP: choose based on data sovereignty, latency to users, and paired region availability",
          ],
          links: [
            { label: "SAP on Azure Documentation Hub", url: "https://learn.microsoft.com/en-us/azure/sap/" },
            { label: "Azure Center for SAP Solutions", url: "https://learn.microsoft.com/en-us/azure/sap/center-sap-solutions/overview" },
            { label: "SAP HANA on Azure VM Sizes", url: "https://learn.microsoft.com/en-us/azure/sap/large-instances/hana-available-skus" },
          ],
          sapNotes: [
            { note: "1928533", desc: "SAP on Azure — supported VM types and storage" },
            { note: "2367194", desc: "Using SAP HANA on Azure Virtual Machines" },
          ],
        },
        {
          id: "azure-storage",
          title: "Azure Storage for SAP HANA",
          icon: "HardDrive",
          badge: "Critical",
          summary:
            "Azure Premium SSD v2 and Ultra Disk are the storage options for HANA log and data volumes. Azure NetApp Files (ANF) provides NFS shared storage for HANA shared, /sapmnt, and scale-out scenarios.",
          keyPoints: [
            "HANA data volume: Azure Premium SSD v2 (adjustable IOPS/throughput) or Ultra Disk",
            "HANA log volume: Azure Ultra Disk — provision minimum 2000 IOPS, 250 MB/s per log volume; latency < 1 ms",
            "HANA shared + /sapmnt: Azure NetApp Files (ANF) — NFS 4.1 protocol; Ultra service level for production",
            "ANF cross-zone replication: replicate ANF volumes across AZs for HA/DR",
            "Azure Backup for SAP HANA: native integration with HANA backup catalog via Azure Backup plugin",
            "Disk caching: host caching MUST be disabled for HANA data and log volumes (critical for data integrity)",
            "SAP Note 2972977: Azure storage guidelines for SAP HANA",
          ],
          sapNotes: [
            { note: "2972977", desc: "Azure storage configuration for SAP HANA" },
            { note: "3199382", desc: "Azure Ultra Disk for SAP HANA log volumes" },
          ],
          links: [
            { label: "Azure NetApp Files for SAP", url: "https://learn.microsoft.com/en-us/azure/sap/workloads/hana-vm-operations-netapp" },
          ],
          warning: "Never enable Azure disk host caching (ReadOnly or ReadWrite) on HANA data and log volumes. This can cause data corruption if the host cache is lost during a host failure.",
        },
      ],
    },
    {
      id: "ha-dr",
      title: "High Availability & DR",
      nodes: [
        {
          id: "azure-ha",
          title: "SAP HANA HA on Azure — Availability Zones",
          icon: "Shield",
          badge: "Mission Critical",
          summary:
            "Azure HANA HA uses HANA HSR across Availability Zones with Pacemaker and Azure Load Balancer (Standard ILB) as the virtual IP mechanism. Azure zones provide physical datacenter separation within a region.",
          keyPoints: [
            "Architecture: HANA primary (Zone 1) + HANA secondary HSR SYNC (Zone 2) + Pacemaker + Azure Standard ILB",
            "Azure Standard ILB: acts as floating virtual IP — routes to active HANA instance via health probes",
            "Proximity Placement Groups: ensure DB and app servers remain in same zone after failover",
            "Pacemaker on Azure: use Azure fence agent (SBD alternative) for node fencing — Azure fence agent uses Azure REST API to restart/stop VM",
            "Availability Set vs Zones: Zones preferred for production HANA HA; Availability Sets for older deployments",
            "ACSS (Azure Center for SAP Solutions): can deploy full HA HANA architecture automatically",
            "SAP Note 1984787: SUSE Linux Enterprise Server 12 SP3 installation notes for Azure",
          ],
          steps: [
            "Step 1: Deploy two M-series VMs in different Availability Zones in same region",
            "Step 2: Configure ANF volumes or Ultra Disk per storage guidelines",
            "Step 3: Install SAP HANA on primary; configure HSR: hdbnsutil -sr_enable",
            "Step 4: Register secondary: hdbnsutil -sr_register --replicationMode=sync",
            "Step 5: Deploy Azure Standard ILB with frontend IP (virtual hostname IP), backend pool = both VM NICs",
            "Step 6: Configure ILB health probe on port 62500 (SAPHana default probe port)",
            "Step 7: Install Pacemaker with Azure fence agent; configure SAPHana + SAPHanaTopology resources",
            "Step 8: Test failover and verify ILB routes correctly to secondary",
          ],
          sapNotes: [
            { note: "1984787", desc: "SLES installation for SAP on Azure" },
            { note: "3024346", desc: "Linux Pacemaker on Azure — configuration guide" },
          ],
          links: [
            { label: "HANA HA with Pacemaker on Azure", url: "https://learn.microsoft.com/en-us/azure/sap/workloads/sap-hana-high-availability" },
          ],
        },
        {
          id: "azure-dr",
          title: "Azure Site Recovery & HANA DR",
          icon: "RefreshCw",
          badge: "DR",
          summary:
            "Azure Site Recovery (ASR) replicates non-HANA SAP workloads to a paired region. For HANA DR, use HANA HSR ASYNC to a third node in the DR region or a separate DR region.",
          keyPoints: [
            "Azure Site Recovery: block-level replication for SAP app servers and non-HANA DBs to paired region",
            "HANA DR: HSR ASYNC to third tier (cross-region) — RPO in seconds; RTO 15-30 minutes",
            "ANF Cross-Region Replication: replicate ANF volumes (shared, backup) to DR region automatically",
            "Azure Backup: cross-region restore for HANA backups stored in Recovery Services Vault",
            "DR testing: ASR test failover in isolated network — no impact on production",
            "ACSS: includes DR configuration guidance and runbook generation for SAP",
          ],
          links: [
            { label: "Azure Site Recovery for SAP", url: "https://learn.microsoft.com/en-us/azure/site-recovery/site-recovery-sap" },
          ],
        },
      ],
    },
    {
      id: "monitoring",
      title: "Azure Monitor for SAP",
      nodes: [
        {
          id: "azure-monitor",
          title: "Azure Monitor for SAP Solutions",
          icon: "Activity",
          badge: "Operations",
          summary:
            "Azure Monitor for SAP Solutions (AMS) provides native Azure monitoring for SAP HANA, SAP NetWeaver, SAP application servers, and infrastructure metrics — all in Azure Monitor dashboards without external tools.",
          keyPoints: [
            "AMS providers: SAP HANA, SAP Application Server (via SAP Host Agent), OS, HA cluster (Pacemaker), MS SQL",
            "Alerting: configure Azure Alerts on AMS metrics — e.g. alert when HANA data volume > 90%",
            "HANA metrics: memory usage, CPU usage, service status, backup status, replication lag",
            "NetWeaver metrics: ABAP short dumps, work process utilization, dialog response time, RFC failures",
            "Integration with Azure Monitor Workbooks: pre-built SAP monitoring dashboards",
            "ACSS monitoring: built-in health checks for SAP systems registered in ACSS",
            "SAP Note 3109201: Azure Monitor for SAP — feature overview and configuration",
          ],
          steps: [
            "Go to Azure Portal → Create Resource → Azure Monitor for SAP Solutions",
            "Create AMS resource in same region and VNet as SAP systems",
            "Add providers: HANA, NetWeaver, HA Cluster, OS",
            "For HANA provider: enter HANA IP, tenant, port, and monitoring user credentials",
            "For NetWeaver: enter message server host and HTTP port",
            "View dashboards: AMS resource → Workbooks → select SAP HANA or NetWeaver workbook",
          ],
          sapNotes: [
            { note: "3109201", desc: "Azure Monitor for SAP Solutions — configuration guide" },
          ],
          links: [
            { label: "Azure Monitor for SAP", url: "https://learn.microsoft.com/en-us/azure/sap/monitor/about-azure-monitor-sap-solutions" },
            { label: "Azure Center for SAP Solutions", url: "https://learn.microsoft.com/en-us/azure/sap/center-sap-solutions/overview" },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Solution Manager
// ─────────────────────────────────────────────
export const solmanModule: ModuleData = {
  id: "solman",
  title: "SAP Solution Manager",
  subtitle: "ALM Platform — Operations & Change Management",
  version: "SAP Solution Manager 7.2 SP14+",
  sourceUrl: "https://support.sap.com/en/alm/solution-manager.html",
  overview:
    "SAP Solution Manager 7.2 (SolMan) is the central ALM platform for SAP landscapes running classic on-premise or hybrid architectures. As a Senior Basis Consultant, you manage SolMan for LMDB maintenance, Change Control Management (ChaRM), Focused Run configuration, system monitoring, and the eventual transition to SAP Cloud ALM.",
  color: "#2E7D32",
  sections: [
    {
      id: "setup",
      title: "Setup & Configuration",
      nodes: [
        {
          id: "solman-setup",
          title: "Solution Manager Initial Setup",
          icon: "Settings",
          badge: "Foundation",
          summary:
            "SolMan 7.2 requires post-installation configuration via SOLMAN_SETUP (managed system configuration wizard) including diagnostics agent connectivity, LMDB population, and managed system setup.",
          steps: [
            "Run SOLMAN_SETUP transaction — SAP Solution Manager Configuration",
            "Complete Basic Configuration: system preparation, ABAP connector, Java connector",
            "Configure Managed Systems: run managed system setup for each connected system",
            "Activate SAP Solution Manager scenarios as needed: System Monitoring, ChaRM, ITSM, etc.",
            "Configure SAP-Passport connection for SAP Support connectivity (OSS1 / SOLMAN_SETUP)",
            "Set up Diagnostics Agents (SMD Agent) on all managed systems for deep monitoring",
            "Run LMDB (LMDB transaction) — validate system landscape database is populated correctly",
            "Configure SLD connection: SLDCHECK → verify SLD data is flowing to SolMan",
          ],
          keyPoints: [
            "SOLMAN_SETUP is the single entry point for all SolMan configuration — always start here",
            "SLD vs LMDB: SLD (System Landscape Directory) feeds landscape data to LMDB in SolMan",
            "SMD Agent: SAP diagnostics agent running on managed systems — required for E2E diagnostics and Focused Run",
            "Solution Manager Launchpad: /sap/bc/ui2/flp?sap-client=001 — start navigation here",
            "Technical Monitoring: configure via SOLMAN_SETUP → Technical Monitoring → System Monitoring",
          ],
          tcodes: ["SOLMAN_SETUP", "LMDB", "SMSY", "DSWP", "SOLUTION_DOCUMENTATION"],
          sapNotes: [
            { note: "1824148", desc: "SAP Solution Manager 7.2 — setup and upgrade guide" },
            { note: "2354738", desc: "SolMan 7.2 — central note for known issues and corrections" },
          ],
          links: [
            { label: "Solution Manager 7.2 Documentation", url: "https://support.sap.com/en/alm/solution-manager.html" },
            { label: "SolMan Help Portal", url: "https://help.sap.com/docs/SUPPORT_CONTENT/sm/3518048080.html" },
          ],
        },
        {
          id: "solman-lmdb",
          title: "LMDB — Landscape Management Database",
          icon: "Database",
          badge: "Core",
          summary:
            "LMDB (Landscape Management Database) is the central repository in Solution Manager for all technical system and landscape information. It is the foundation for ChaRM, ITSM, monitoring, and operations.",
          keyPoints: [
            "LMDB stores: technical systems, software components, product versions, transport routes, RFC destinations",
            "Data sources: SLD (auto-populated via ABAP and Java SLD registration), manual entry, automatic discovery",
            "SMSY: older transaction — replaced by LMDB in SolMan 7.2; still used for some configurations",
            "LMDB Health Check: LMDB → Technical Administration → validate consistency",
            "Product system assignment: assign technical systems to product systems (business context)",
            "Transport Landscape: defined in LMDB — must match STMS transport routes",
            "Synchronization with SLD: LMDB receives data from SLD automatically via scheduled jobs",
          ],
          tcodes: ["LMDB", "SMSY", "SOLMAN_SETUP"],
          sapNotes: [
            { note: "1863476", desc: "LMDB in SAP Solution Manager 7.2 — guide and best practices" },
          ],
          tip: "Always validate LMDB data after system copies or landscape changes — stale LMDB data causes failures in ChaRM and monitoring.",
        },
      ],
    },
    {
      id: "change-management",
      title: "Change Control Management (ChaRM)",
      nodes: [
        {
          id: "solman-charm",
          title: "Change Request Management (ChaRM)",
          icon: "GitBranch",
          badge: "ALM",
          summary:
            "ChaRM in SolMan enforces a controlled change process for SAP landscapes. Changes are linked to transport requests and approved through a workflow before being deployed to production.",
          keyPoints: [
            "Change document types: Normal Change, Urgent Change, Defect Correction, Administrative Change",
            "Change lifecycle: Created → In Development → Testing → Approved → Deployed → Closed",
            "Integration with STMS: transport requests are linked to change documents; cannot be imported to Production without approval",
            "Retrofit: ChaRM supports retrofit of changes from maintenance track back to development track",
            "SolMan ITSM integration: incidents can be linked to change documents for traceability",
            "Quality Gate Management (QGM): automated gate checks before import to each system",
            "ChaRM Workaround: Urgent Change allows emergency production fixes outside normal change process",
          ],
          tcodes: ["DSWP", "CRM_DNO_MONITOR", "SM_WORKCENTER", "SCDT_SETUP"],
          links: [
            { label: "ChaRM Configuration Guide", url: "https://help.sap.com/docs/SUPPORT_CONTENT/sm/3518048080.html" },
          ],
          tip: "Configure ChaRM's 'Change Request: Direct Transport Import' setting carefully — in production landscapes, NEVER allow direct STMS import; all imports must go through ChaRM.",
        },
      ],
    },
    {
      id: "monitoring-ops",
      title: "System Monitoring & Operations",
      nodes: [
        {
          id: "solman-monitoring",
          title: "Technical Monitoring & System Monitoring",
          icon: "Activity",
          badge: "Operations",
          summary:
            "SolMan Technical Monitoring provides centralized infrastructure and application monitoring across the entire SAP landscape. Alerts are collected via the SMD Agent and CCMS channel, displayed in the System Monitoring Work Center.",
          keyPoints: [
            "System Monitoring: health of all SAP systems in landscape — availability, performance, configuration",
            "Alert inbox: central alert management in SolMan Work Center → Technical Monitoring",
            "Interface Monitoring: monitor IDocs, qRFC, BDoc, PI/PO interfaces from one place",
            "Job Monitoring: centralized visibility of background jobs across systems",
            "SAP Early Watch Alert (EWA): automated weekly health report for all connected systems; sends to SAP",
            "Exception Management: central log viewer across all managed system logs",
            "CCMS-based monitoring: SolMan collects CCMS alerts from managed systems via RFC",
          ],
          tcodes: ["SOLMAN_WORKCENTER", "SM_WORKCENTER", "DSWP", "SOLMAN_OPERATIONS"],
          sapNotes: [
            { note: "1865914", desc: "Technical Monitoring in SAP Solution Manager 7.2" },
          ],
          links: [
            { label: "System Monitoring Documentation", url: "https://support.sap.com/en/alm/solution-manager.html" },
          ],
        },
        {
          id: "solman-focused-run",
          title: "Focused Run for SAP Solution Manager",
          icon: "Zap",
          badge: "Advanced",
          summary:
            "SAP Focused Run is a specialized SolMan deployment for large-scale system monitoring (5000+ managed systems). It replaces traditional SolMan monitoring for hyperscaler and managed service provider use cases.",
          keyPoints: [
            "Focused Run = SolMan 7.2 SP05+ with focused deployment for monitoring-only use case",
            "Capabilities: Advanced System Management, Monitoring & Alerting Infrastructure (MAI), Health Monitoring",
            "Scale: designed for MSPs managing thousands of SAP systems from a single SolMan instance",
            "Architecture: separate SolMan system dedicated to monitoring — decoupled from ChaRM/ITSM SolMan",
            "Integration with Cloud ALM: SAP is transitioning Focused Run capabilities to Cloud ALM",
            "SAP Note 2589853: Focused Run — overview and configuration guide",
          ],
          sapNotes: [
            { note: "2589853", desc: "SAP Focused Run — overview and installation" },
          ],
          links: [
            { label: "SAP Focused Run", url: "https://support.sap.com/en/alm/solution-manager/focused-run.html" },
          ],
        },
      ],
    },
    {
      id: "transition",
      title: "Transition to Cloud ALM",
      nodes: [
        {
          id: "solman-transition",
          title: "SolMan → Cloud ALM Transition",
          icon: "TrendingUp",
          badge: "Strategic",
          summary:
            "SAP is transitioning ALM capabilities from Solution Manager to SAP Cloud ALM (CALM). SolMan 7.2 support ends December 2027 (with extended maintenance). Organizations must plan and execute migration to Cloud ALM.",
          keyPoints: [
            "SolMan 7.2 mainstream maintenance: ends December 2027; extended maintenance: until 2030 (with additional fee)",
            "Cloud ALM capabilities covering SolMan functions: Implementation, Operations, Change & Deploy, Test Management",
            "Migration path: activate Cloud ALM tenant → connect managed systems → migrate monitoring, change processes",
            "Parallel operation: run SolMan and Cloud ALM in parallel during migration period",
            "ChaRM migration: Cloud ALM Change & Deploy replaces ChaRM — new process design required",
            "SAP Transition Portal: https://support.sap.com/alm-transition — central resource for transition planning",
          ],
          links: [
            { label: "SAP ALM Transition Portal", url: "https://support.sap.com/alm-transition" },
            { label: "Transition from SolMan to Cloud ALM", url: "https://support.sap.com/en/alm/sap-cloud-alm/transition-to-sap-cloud-alm.html" },
          ],
          tip: "Start planning the Cloud ALM transition now — even if SolMan maintenance runs to 2027. Cloud ALM requires network setup, Identity Authentication Service (IAS) configuration, and re-onboarding all managed systems.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Cloud ALM
// ─────────────────────────────────────────────
export const cloudAlmModule: ModuleData = {
  id: "cloudAlm",
  title: "SAP Cloud ALM",
  subtitle: "Cloud Application Lifecycle Management",
  version: "Cloud ALM (SaaS — continuously updated)",
  sourceUrl: "https://support.sap.com/en/alm/sap-cloud-alm.html",
  overview:
    "SAP Cloud ALM (CALM) is SAP's modern, cloud-native ALM platform included in Enterprise Support, cloud edition. It covers the full SAP lifecycle: Implementation (project management, testing, deployment), Operations (system monitoring, integration monitoring, job management), and Change & Deploy (CTS-based change management). For Basis consultants, CALM connectivity setup, managed system onboarding, and integration with SAP BTP are key responsibilities.",
  color: "#006064",
  sections: [
    {
      id: "setup",
      title: "Tenant Setup & Connectivity",
      nodes: [
        {
          id: "calm-activation",
          title: "Cloud ALM Tenant Activation",
          icon: "Cloud",
          badge: "Foundation",
          summary:
            "Cloud ALM is provisioned as a SaaS application in SAP BTP. Activation is done via SAP for Me (or SAP Cloud ALM request). Post-activation, the SAP BTP subaccount must be configured for system connectivity.",
          steps: [
            "Request Cloud ALM tenant: SAP for Me → Systems & Provisioning → Request Cloud ALM",
            "Activate Identity Authentication Service (IAS) in your BTP subaccount (required for SSO)",
            "Configure trust between IAS and Cloud ALM BTP subaccount",
            "Configure SAP BTP Connectivity (Cloud Connector) for on-premise managed systems",
            "Assign roles to administrators: Cloud ALM Administrator, Cloud ALM Operations Operator",
            "Register managed systems: see 'Managed System Onboarding' node below",
          ],
          keyPoints: [
            "Cloud ALM is included with SAP S/4HANA Cloud, SAP Enterprise Support cloud edition — verify your entitlement first",
            "URL format: https://YOUR-TENANT.eu10.alm.cloud.sap/launchpad",
            "BTP subaccount: Cloud ALM runs in a dedicated BTP subaccount in your global account",
            "IAS: must be configured for user authentication — IAS is separate from your company's Azure AD/LDAP (bridge needed)",
            "SAP Note 3032940: Cloud ALM provisioning and initial setup",
          ],
          sapNotes: [
            { note: "3032940", desc: "SAP Cloud ALM provisioning — tenant activation" },
            { note: "3091558", desc: "Cloud ALM managed system setup — overview" },
          ],
          links: [
            { label: "Cloud ALM Setup Guide", url: "https://support.sap.com/en/alm/sap-cloud-alm.html" },
            { label: "Cloud ALM Help Portal", url: "https://help.sap.com/docs/cloud-alm" },
          ],
        },
        {
          id: "calm-onboarding",
          title: "Managed System Onboarding",
          icon: "Server",
          badge: "Core Setup",
          summary:
            "Connecting managed SAP systems to Cloud ALM requires specific SAP BTP service instances and credentials. On-premise systems connect via Cloud Connector; cloud systems connect directly.",
          steps: [
            "Step 1: In SAP BTP, create service instance for 'SAP Cloud ALM API' service",
            "Step 2: Create service key for the instance — download JSON with URL, clientid, clientsecret",
            "Step 3: In managed SAP system (S/4HANA, BW, etc.): run /SDF/ALM_SETUP transaction",
            "Step 4: Enter Cloud ALM service key credentials in /SDF/ALM_SETUP",
            "Step 5: Activate Cloud ALM registration — system will appear in Cloud ALM Landscape Management",
            "Step 6: For on-premise systems: ensure Cloud Connector is configured with access to SAP BTP",
            "Step 7: In Cloud ALM: validate system appears in Landscape Management with correct status",
            "Step 8: Enable required use cases: Operations, Change & Deploy per system",
          ],
          keyPoints: [
            "/SDF/ALM_SETUP: key TCode for Cloud ALM registration in managed systems",
            "/SDF/ALM_DIAGNOSTIC: diagnostic TCode to check Cloud ALM connectivity from managed system side",
            "Cloud Connector: required for on-premise system connectivity to BTP/Cloud ALM",
            "Multiple systems: repeat onboarding steps for each managed system (S/4HANA, BW, SolMan, etc.)",
            "SAP Note 3150851: /SDF/ALM_SETUP transaction guide",
          ],
          tcodes: ["/SDF/ALM_SETUP", "/SDF/ALM_DIAGNOSTIC"],
          sapNotes: [
            { note: "3150851", desc: "/SDF/ALM_SETUP — Cloud ALM registration in managed systems" },
            { note: "3091558", desc: "Managed system setup for SAP Cloud ALM" },
          ],
          links: [
            { label: "Cloud ALM Managed System Setup", url: "https://help.sap.com/docs/cloud-alm/setup-administration/managed-systems" },
          ],
        },
      ],
    },
    {
      id: "operations",
      title: "Operations",
      nodes: [
        {
          id: "calm-monitoring",
          title: "System & Integration Monitoring",
          icon: "Activity",
          badge: "Daily Ops",
          summary:
            "Cloud ALM Operations provides real-time monitoring of system health, integration flows, background jobs, and exceptions across all connected SAP systems in one unified dashboard.",
          keyPoints: [
            "Health Monitoring: system availability, performance, configuration compliance across all managed systems",
            "Integration & Exception Monitoring: monitor IDocs, BAPIs, interface errors, and exception classes",
            "Business Service Management: group systems into business services for end-to-end monitoring",
            "Job & Automation Monitoring: visibility of background jobs across all managed systems",
            "Alerting: configure threshold-based alerts with email/Teams/Slack notifications via BTP Alert Notification Service",
            "Real User Monitoring (RUM): browser-side performance data for Fiori/UI5 applications",
            "Data Collection: Cloud ALM agents pull data from managed systems via REST/RFC every 5 minutes",
          ],
          links: [
            { label: "Cloud ALM Operations", url: "https://help.sap.com/docs/cloud-alm/applicationhelp/operations" },
          ],
          tip: "Set up Business Service Management early — grouping systems into services (e.g. 'Order-to-Cash') gives business-relevant view of health instead of system-by-system monitoring.",
        },
        {
          id: "calm-change",
          title: "Change & Deploy",
          icon: "GitBranch",
          badge: "Change Management",
          summary:
            "Cloud ALM Change & Deploy replaces ChaRM for cloud and hybrid landscapes. It integrates with CTS (Change and Transport System) to manage and approve the deployment of transports across development, test, and production systems.",
          keyPoints: [
            "Feature set: change planning, transport management, deployment automation, approval workflows",
            "CTS integration: Cloud ALM reads transport requests from connected systems and tracks their status",
            "Deployment pipeline: define transport routes in Cloud ALM → automated import queue management",
            "Approval gate: configure mandatory approvals before import to QAS and PRD",
            "Diff view: see what changed between transport exports and imports",
            "Integration with JIRA/ServiceNow: change documents can be linked to external ITSM tickets",
            "Retrofitting: similar to ChaRM retrofit — backport changes to maintenance tracks",
          ],
          links: [
            { label: "Cloud ALM Change & Deploy", url: "https://help.sap.com/docs/cloud-alm/applicationhelp/change-and-deploy" },
          ],
        },
      ],
    },
    {
      id: "implementation",
      title: "Implementation & Testing",
      nodes: [
        {
          id: "calm-implementation",
          title: "Implementation — Projects & Test Management",
          icon: "BookOpen",
          badge: "Projects",
          summary:
            "Cloud ALM Implementation covers SAP project management, process documentation, configuration tracking, and testing. It is the successor to SolMan Solution Documentation and BPM for SAP Cloud projects.",
          keyPoints: [
            "Project setup: create project in Cloud ALM → assign scope (business processes) → assign team",
            "Process Library: pre-built SAP business process content (S/4HANA, BTP, SuccessFactors) for rapid documentation",
            "Fit-to-Standard workshops: Cloud ALM Implementation supports structured fit/gap analysis",
            "Test Management: integrated test case management; integrates with SAP Test Automation by Tricentis",
            "Handover to Operations: transition project process documentation to operations monitoring",
            "SAP Activate: Cloud ALM aligns with SAP Activate methodology phases",
          ],
          links: [
            { label: "Cloud ALM Implementation Guide", url: "https://help.sap.com/docs/cloud-alm/applicationhelp/implementation" },
            { label: "SAP Activate & Cloud ALM", url: "https://support.sap.com/en/alm/sap-cloud-alm.html" },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Content Server DMS
// ─────────────────────────────────────────────
export const dmsModule: ModuleData = {
  id: "dms",
  title: "Content Server & DMS",
  subtitle: "SAP BTP Document Management Service Integration",
  version: "SAP BTP DMS (Integration Option) + S/4HANA",
  sourceUrl: "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/1317b7d3a93c4763a041b49532666fd7/422dd110eef64c968edaa8feace86cc9.html",
  overview:
    "SAP Document Management Service (DMS) on BTP is a cloud-native document repository replacing the on-premise SAP Content Server. As a Senior Basis Consultant, you configure the integration between S/4HANA and SAP BTP DMS using the Integration Option, set up OAuth 2.0 authentication, configure OAC0 content repositories, and manage document migration from legacy content servers.",
  color: "#4A148C",
  sections: [
    {
      id: "overview",
      title: "DMS Overview & Architecture",
      nodes: [
        {
          id: "dms-overview",
          title: "BTP DMS Architecture — Options & Scenarios",
          icon: "Database",
          badge: "Foundation",
          summary:
            "SAP BTP DMS has three options: Application Option (standalone SaaS UI), Integration Option (APIs/PaaS for custom integration), and Repository Option (storage layer add-on). For S/4HANA integration, the Integration Option is mandatory.",
          keyPoints: [
            "Application Option: standalone SaaS web app for document management — NOT supported for S/4HANA outbound integration",
            "Integration Option: PaaS — provides REST/CMIS APIs for integrating DMS into SAP applications (S/4HANA, BTP apps)",
            "Repository Option: add-on storage layer (used with Integration or Application Option)",
            "Inbound Scenario: BTP DMS consumes S/4HANA DMS as external CMIS repository — BTP users browse S/4HANA content",
            "Outbound Scenario: S/4HANA uses BTP DMS as content repository — documents created in S/4 are stored in BTP DMS",
            "Key point: to implement S/4HANA outbound, ONLY Integration Option is supported",
            "Prerequisite: read SAP Note 3595329 and download BTP SSL certificates (KBA-2853519)",
          ],
          sapNotes: [
            { note: "3595329", desc: "Prerequisites for S/4HANA BTP DMS integration" },
            { note: "2853519", desc: "Download SSL certificates for SAP BTP — KBA" },
          ],
          links: [
            { label: "SAP BTP DMS Documentation", url: "https://help.sap.com/docs/document-management-service" },
            { label: "S/4HANA DMS Configuration Guide", url: "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/1317b7d3a93c4763a041b49532666fd7/422dd110eef64c968edaa8feace86cc9.html" },
          ],
        },
      ],
    },
    {
      id: "btp-setup",
      title: "BTP Repository Onboarding",
      nodes: [
        {
          id: "dms-btp-repo",
          title: "BTP Subaccount & Service Instance Setup",
          icon: "Cloud",
          badge: "Setup",
          summary:
            "Setting up BTP DMS requires creating a subaccount, enabling DMS Integration and Repository entitlements, creating a service instance and key, and onboarding a repository via the BTP DMS REST API.",
          steps: [
            "Step 1: Create BTP subaccount or use existing — assign to global account",
            "Step 2: Go to Entitlements → Add Service Plan → search 'Document Management Service'",
            "Step 3: Add both 'Integration Option' and 'Repository Option' entitlements",
            "Step 4: Go to Service Marketplace → Document Management Service, Integration Option → Create Instance",
            "Step 5: Name instance (e.g. DMS_TEST); click Create",
            "Step 6: Go to Instances & Subscriptions → DMS instance → Create Service Key (e.g. DMS_TEST_KEY)",
            "Step 7: View credentials — note down: ecmservice URL, uaa.url, uaa.clientid, uaa.clientsecret",
            "Step 8: Generate OAuth bearer token via Postman: POST to uaa.url/oauth/token with client credentials",
            "Step 9: Onboard repository — POST to ecmservice URL /rest/v2/repositories with JSON body",
            "Step 10: Verify: GET /rest/v2/repositories — repository should appear with status active",
          ],
          keyPoints: [
            "Repository JSON payload: displayName, externalId, isContentBridgeEnabled:true, repositoryType:internal, cmisRepositoryId",
            "ecmservice URL: taken from service key credentials — differs per BTP region",
            "Bearer token expiry: typically 30 minutes — re-generate if POST fails with 401",
            "DMS REST endpoints: POST /rest/v2/repositories (create), GET (list), DELETE /{repoId} (remove)",
            "CMIS Browser Binding URL: GET /browser — browse repository content once onboarded",
          ],
          links: [
            { label: "BTP DMS Onboarding API", url: "https://help.sap.com/docs/document-management-service/sap-document-management-service/onboarding-your-repository" },
          ],
          tip: "Keep the service key JSON safe — it contains the clientsecret. Store it in your password manager or SAP BTP Secret Rotation service.",
        },
      ],
    },
    {
      id: "s4-config",
      title: "S/4HANA Configuration",
      nodes: [
        {
          id: "dms-s4-config",
          title: "S/4HANA Side — SSL, RFC, OAC0 Setup",
          icon: "Settings",
          badge: "Technical",
          summary:
            "S/4HANA must be configured to trust BTP DMS SSL certificates, create an HTTP RFC destination to BTP, configure OAuth 2.0 client profile, and define the content repository (OAC0) pointing to BTP DMS.",
          steps: [
            "Step 1: STRUST — Import BTP SSL certificate chain into SSL client certificate list",
            "  - STRUST → SSL Client (Anonymous) → import certificate PEM → save",
            "Step 2: SM59 — Create HTTP RFC destination to BTP DMS ecmservice URL",
            "  - Connection Type: G (HTTP); Target Host: api-sdm-di.cfapps.<region>.hana.ondemand.com; Path: /",
            "  - Logon/Security tab: no basic auth (OAuth handled separately)",
            "Step 3: OA2C — Create OAuth 2.0 Client Profile",
            "  - Profile name, grant type: Client Credentials",
            "  - Token URL: <uaa.url>/oauth/token from service key",
            "  - Client ID and Secret from service key",
            "Step 4: OAC0 — Create Content Repository",
            "  - Repository: ZBTP_DMS or similar",
            "  - Document Area: e.g. ARCHIVELINK or DMS_C1_ST",
            "  - Storage type: HTTP Content Server",
            "  - Version No: 0047 (for BTP DMS)",
            "  - Host and HTTP destination: point to RFC destination from Step 2",
            "Step 5: Test connection: OAC0 → select repository → Test Connection button",
            "Step 6: Create secondary types and folder categories (OAD5/OAD2) as needed",
          ],
          keyPoints: [
            "STRUST certificate import is critical — without it, SSL handshake to BTP will fail",
            "OAC0 version 0047: specifically for BTP DMS Integration Option — do not use older versions",
            "OAuth 2.0 client in S/4HANA: managed via OA2C transaction; token refresh is handled automatically by S/4",
            "Document types: link business objects (e.g. Material, Purchase Order) to content repository via OAD0",
            "Test scenario: CV01N or GOS attachment → verify file lands in BTP DMS repository",
          ],
          tcodes: ["STRUST", "SM59", "OAC0", "OAD0", "OAD2", "OAD5", "CV01N"],
          sapNotes: [
            { note: "3595329", desc: "S/4HANA BTP DMS integration — prerequisites" },
            { note: "389366", desc: "RSIRPIRL — migration of ArchiveLink documents" },
            { note: "2774469", desc: "Z_DOC_COPY — DMS document copy/migration utility" },
          ],
          links: [
            { label: "S/4HANA DMS Config Guide", url: "https://help.sap.com/docs/document-management-service/sap-document-management-service/configuration-settings-to-connect-document-management-service-web-app-to-sap-s-4hana-dms" },
          ],
          warning: "SAP BTP DMS Application Option is NOT supported for S/4HANA outbound integration. Only use Integration Option for this scenario.",
        },
        {
          id: "dms-migration",
          title: "Document Migration from Legacy Content Server",
          icon: "RefreshCw",
          badge: "Migration",
          summary:
            "Migrating existing documents from an on-premise SAP Content Server to BTP DMS requires specific SAP migration programs. Multiple approaches exist depending on the document type and source.",
          keyPoints: [
            "RSIRPIRL (SAP Note 389366): migrate ArchiveLink documents between repositories",
            "Z_DOC_COPY (SAP Note 2774469): copy/migrate DMS documents; newer alternative: RSCMSCPY2 (SAP Note 3080565)",
            "Z_MIGRATE_ARCHIVELINK (SAP Note 1043676): legacy archivelink migration; newer: ARCHIVELINK_MIGRATION (SAP Note 3305771)",
            "Recommended approach: use the NEWER programs (RSCMSCPY2, ARCHIVELINK_MIGRATION) for S/4HANA 2020+",
            "Migration validation: verify document count before and after; check BTP DMS repository document count via CMIS GET API",
            "Cutover: after migration, update OAC0 default repository assignment for new documents to BTP DMS",
          ],
          sapNotes: [
            { note: "389366", desc: "RSIRPIRL — ArchiveLink document migration" },
            { note: "3080565", desc: "RSCMSCPY2 — new DMS document copy program" },
            { note: "3305771", desc: "ARCHIVELINK_MIGRATION — new ArchiveLink migration program" },
          ],
        },
        {
          id: "dms-troubleshoot",
          title: "DMS Troubleshooting & Connectivity Checklist",
          icon: "Wrench",
          badge: "Troubleshooting",
          summary:
            "Common DMS connectivity issues stem from SSL certificate problems, OAuth token failures, or network connectivity between S/4HANA and BTP endpoints. Use this checklist for systematic diagnosis.",
          keyPoints: [
            "1. SSL: STRUST → verify BTP certificates are imported and trusted (both root CA and intermediate)",
            "2. RFC: SM59 → test connection to BTP DMS HTTP RFC — should return HTTP 200 or 401 (not connection refused)",
            "3. OAuth: OA2C → test OAuth token retrieval — should return bearer token",
            "4. OAC0: test connection button → should show 'Connection successful'",
            "5. Network: if on-premise, verify Cloud Connector is running and virtual host mapping is correct",
            "6. Cloud Connector: SCC Admin → Check backend connectivity → BTP DMS URL reachable",
            "7. S/4HANA SM21: check system log for SSL or HTTP errors during DMS test",
            "8. BTP Cockpit: check DMS service instance for error states or rate limiting",
          ],
          tcodes: ["STRUST", "SM59", "OAC0", "SM21", "SMICM"],
          links: [
            { label: "BTP DMS S/4HANA Integration Guide", url: "https://help.sap.com/docs/document-management-service" },
          ],
          tip: "Enable ICM trace (SMICM → Trace → Set Trace) at level 3 for detailed SSL handshake diagnostics when troubleshooting certificate issues with BTP.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// SAC Configuration
// ─────────────────────────────────────────────
export const sacModule: ModuleData = {
  id: "sac",
  title: "SAP Analytics Cloud",
  subtitle: "SAC Configuration & Integration",
  version: "SAC (SaaS — quarterly updates)",
  sourceUrl: "https://help.sap.com/docs/SAP_ANALYTICS_CLOUD",
  overview:
    "SAP Analytics Cloud (SAC) is SAP's cloud-based analytics platform covering Business Intelligence (BI), Planning, and Predictive Analytics. As a Basis Consultant, your SAC responsibilities include tenant setup, user provisioning via Identity Authentication (IAS), live data connectivity to S/4HANA and BW (via SAP HANA Cloud, SAP Analytics Cloud Agent, or Live Connection), and security configuration.",
  color: "#880E4F",
  sections: [
    {
      id: "setup",
      title: "Tenant Setup & Administration",
      nodes: [
        {
          id: "sac-tenant",
          title: "SAC Tenant Setup & Identity Management",
          icon: "Settings",
          badge: "Foundation",
          summary:
            "SAC is provisioned as a SaaS application in SAP BTP. Identity Authentication Service (IAS) handles SSO. Users are provisioned from IAS or synced from Azure AD/LDAP via IAS.",
          steps: [
            "Step 1: Access SAC tenant URL: https://<tenantname>.eu1.sapanalytics.cloud",
            "Step 2: Assign System Owner and Tenant Administrator roles in SAC",
            "Step 3: Configure Identity Authentication (IAS): SAC Settings → Identity Authentication",
            "Step 4: Enable SSO with your corporate identity provider (Azure AD, OKTA) via IAS as proxy",
            "Step 5: Configure user provisioning: IAS → User Provisioning → configure SCIM sync from AD",
            "Step 6: Create SAC roles: Viewer, Creator, BI Admin, Planning Creator as needed",
            "Step 7: Set up data access controls and team security",
          ],
          keyPoints: [
            "SAC URL format: https://<tenantname>.<region>.sapanalytics.cloud/sap/fpa/ui/app.html",
            "Trial vs Production: trial is time-limited; production requires SAC subscription in BTP",
            "IAS: mandatory for enterprise SSO — do NOT use basic authentication for production",
            "User roles: Viewer (read-only), Creator (can build stories), BI Admin (manage content), Planner (planning models)",
            "Custom roles: SAC supports custom roles based on object permissions (stories, models, data sources)",
          ],
          tcodes: ["SCOT", "SM59"],
          links: [
            { label: "SAC Administration Guide", url: "https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/1fb1f4ce92f44fc983debc25ac1f2cc9.html" },
            { label: "SAC Help Portal", url: "https://help.sap.com/docs/SAP_ANALYTICS_CLOUD" },
          ],
          sapNotes: [
            { note: "2814411", desc: "SAP Analytics Cloud — Basis administration guide" },
          ],
        },
      ],
    },
    {
      id: "connectivity",
      title: "Live Data Connectivity",
      nodes: [
        {
          id: "sac-live-s4",
          title: "Live Connection — S/4HANA & BW",
          icon: "Globe",
          badge: "Integration",
          summary:
            "SAC can connect to S/4HANA and BW in real-time via Live Data Connections. Two methods: (1) SAP Analytics Cloud Agent (on-premise connector) and (2) Direct HANA/BW connection for cloud-hosted systems.",
          steps: [
            "METHOD 1 — SAC Agent (on-premise S/4HANA):",
            "Step 1: Download SAC Data Export Service (SAML certificate) from SAC Settings → Custom SAML IDP",
            "Step 2: Configure SAP HANA/BW SAML IDP in the on-premise system (SAML2 transaction)",
            "Step 3: Download and install SAP Analytics Cloud Agent on a host with network access to on-premise SAP",
            "Step 4: Configure agent to point to S/4HANA/BW host and port",
            "Step 5: In SAC: Administration → Connections → Add Live Data Connection → S/4HANA",
            "Step 6: Use connection in story/model to pull live data",
            "METHOD 2 — Direct (cloud-hosted SAP HANA):",
            "SAC connections → SAP HANA Cloud → enter HANA Cloud URL, port, credentials",
          ],
          keyPoints: [
            "SAC Agent: lightweight Java application; install on a Windows/Linux server near on-premise SAP",
            "SAML SSO: required for live connections — SAC acts as SAML Identity Provider; S/4HANA/BW as SP",
            "BW live data: supports BEx queries and BW/4HANA CompositeProviders via BICS connection",
            "S/4HANA live: connects to HANA analytical views and OData services",
            "Import data connection: alternative to live — data is imported into SAC model (batch, no real-time)",
            "SAP HANA Cloud: direct connection without agent — preferred for cloud-hosted landscapes",
          ],
          sapNotes: [
            { note: "2710800", desc: "SAC live data connection — supported platforms and prerequisites" },
          ],
          links: [
            { label: "SAC Connectivity Guide", url: "https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/1fb1f4ce92f44fc983debc25ac1f2cc9.html" },
          ],
        },
        {
          id: "sac-security",
          title: "Data Access Control & Security",
          icon: "Shield",
          badge: "Security",
          summary:
            "SAC security covers object-level (story/model visibility), data-level (row filtering via data access controls), and connection-level permissions. Basis consultants configure DACs and integration with S/4HANA authorizations.",
          keyPoints: [
            "Data Access Controls (DAC): row-level filtering in SAC models — restrict data by user attribute (e.g. company code, profit center)",
            "DAC types: Flat (static mapping) and Hierarchy-based (dynamic inheritance)",
            "Single Sign-On: users must be provisioned in both IAS and the S/4HANA/BW source system with matching username",
            "Connection permissions: restrict which users can use each live data connection",
            "SAP S/4HANA authorization: live connections use the S/4HANA user's HANA analytical privilege — ensure correct roles assigned in S/4",
            "Audit log: SAC audit log captures all user access and content changes — retain for compliance",
          ],
          links: [
            { label: "SAC Security Guide", url: "https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/1fb1f4ce92f44fc983debc25ac1f2cc9.html" },
          ],
          tip: "Configure DAC based on the authorization concept early — retrofitting row-level security into existing models requires model redesign. Design DAC during the connection setup phase.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Cloud Connectors
// ─────────────────────────────────────────────
export const connectorsModule: ModuleData = {
  id: "connectors",
  title: "Cloud Connectors",
  subtitle: "SAP BTP Connectivity — Cloud Connector",
  version: "SAP Cloud Connector 2.17+",
  sourceUrl: "https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector",
  overview:
    "SAP Cloud Connector (SCC) is the reverse proxy component that creates a secure tunnel between SAP BTP and on-premise SAP systems (or any on-premise backend) without opening inbound firewall ports. As a Basis Consultant, you install, configure, and maintain Cloud Connector instances for Cloud ALM, BTP Integration, SAC, and other BTP services connectivity.",
  color: "#37474F",
  sections: [
    {
      id: "architecture",
      title: "Architecture & Installation",
      nodes: [
        {
          id: "scc-architecture",
          title: "Cloud Connector Architecture",
          icon: "Shield",
          badge: "Foundation",
          summary:
            "Cloud Connector establishes an outbound HTTPS tunnel from the on-premise network to SAP BTP. No inbound firewall ports are needed. BTP services initiate virtual connections through the tunnel to reach on-premise backends.",
          keyPoints: [
            "Architecture: Cloud Connector (on-premise host) → HTTPS tunnel → SAP BTP Connectivity Service",
            "No inbound ports: all connections are initiated outbound from SCC — safe for enterprise firewalls",
            "High Availability: master + shadow Cloud Connector instances — shadow takes over if master fails",
            "Subaccount binding: each SCC instance connects to one or more BTP subaccounts",
            "Virtual host mapping: define virtual hostnames (exposed to BTP) mapped to real on-premise backends",
            "Supported protocols: HTTP/HTTPS (RFC over HTTP), RFC (ABAP RFC connections), LDAP, TCP",
            "Port 443 outbound: SCC connects to BTP on port 443 — verify firewall allows HTTPS outbound from SCC host",
          ],
          links: [
            { label: "Cloud Connector Documentation", url: "https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector" },
            { label: "SCC Administration", url: "https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/administration" },
          ],
          sapNotes: [
            { note: "2835207", desc: "SAP Cloud Connector — installation and upgrade" },
          ],
        },
        {
          id: "scc-install",
          title: "Installation & Initial Configuration",
          icon: "Server",
          badge: "Setup",
          summary:
            "Cloud Connector is installed on a dedicated on-premise host (Linux or Windows). Installation is a simple package install; post-install configuration connects SCC to the BTP subaccount and defines on-premise system access controls.",
          steps: [
            "Step 1: Download Cloud Connector installer from SAP Software Centre (cloud_connector_linux.zip or .exe for Windows)",
            "Step 2: Install on Linux: sudo rpm -i com.sap.scc-ui-<version>.rpm OR sudo dpkg -i .deb",
            "Step 3: Start SCC service: sudo systemctl start scc_daemon",
            "Step 4: Access SCC Admin UI: https://<scc-host>:8443 (default admin/manage credentials)",
            "Step 5: Change admin password immediately after first login",
            "Step 6: Add BTP subaccount: enter BTP Region, Subaccount ID, User, Password",
            "Step 7: Define on-premise systems (Cloud to On-Premise): Add virtual host mapping",
            "  - Virtual Host: e.g. s4h-dev.internal (hostname BTP will use)",
            "  - Internal Host: e.g. s4hdev.company.com:443 (real on-premise hostname)",
            "Step 8: Define resources: add URL paths or RFC destinations accessible through the mapping",
            "Step 9: In BTP Cockpit: Connectivity → Cloud Connectors → verify SCC appears as Connected",
          ],
          keyPoints: [
            "Recommended OS: SUSE Linux or RHEL — same OS as SAP landscape",
            "Java requirement: SCC requires JDK 11 or 17 — install OpenJDK before SCC",
            "Default ports: 8443 (Admin UI), 8044 (HTTPS tunnel to BTP)",
            "Production recommendation: install SCC in DMZ or dedicated connectivity zone",
            "Log files: /opt/sap/scc/log/ — check scc_core.log for tunnel and connectivity issues",
          ],
          sapNotes: [
            { note: "2835207", desc: "SAP Cloud Connector — installation and upgrade notes" },
          ],
          links: [
            { label: "SCC Installation Guide", url: "https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/installation" },
          ],
          warning: "Never expose the Cloud Connector Admin UI (port 8443) to the internet. Restrict access to the SCC admin host via network ACL to only trusted admin workstations.",
        },
      ],
    },
    {
      id: "operations",
      title: "Operations & HA",
      nodes: [
        {
          id: "scc-ha",
          title: "High Availability — Master & Shadow",
          icon: "RefreshCw",
          badge: "HA",
          summary:
            "Cloud Connector supports HA via a master + shadow configuration. The shadow instance mirrors the master's configuration and takes over automatically if the master becomes unavailable.",
          steps: [
            "Step 1: Install Cloud Connector on a second host (shadow)",
            "Step 2: Log into shadow SCC Admin UI (https://<shadow-host>:8443)",
            "Step 3: Set shadow mode: Configuration → Shadow → Enable Shadow Mode",
            "Step 4: Enter master SCC host URL: https://<master-host>:8443",
            "Step 5: Enter master admin credentials for synchronization",
            "Step 6: Shadow will sync all subaccount and virtual host configurations from master",
            "Step 7: On master: Configuration → High Availability → verify shadow is connected",
            "Step 8: Test failover: stop master → shadow should automatically take over BTP tunnel",
          ],
          keyPoints: [
            "Shadow replicates: subaccount connections, virtual host mappings, resource access controls, TLS trust",
            "Failover: automatic — BTP detects master disconnect and routes traffic to shadow within seconds",
            "Failback: when master comes back, it resumes as primary; shadow goes back to standby",
            "Monitoring: check SCC Admin UI → Monitoring → Tunnel status; both master and shadow should show BTP Connected",
          ],
          tip: "Install master and shadow SCC instances on different physical hosts and in different network segments (if possible different subnets) to ensure they fail independently.",
        },
        {
          id: "scc-monitoring",
          title: "Monitoring & Troubleshooting",
          icon: "Activity",
          badge: "Operations",
          summary:
            "Cloud Connector monitoring covers tunnel status, request statistics, certificate validity, and backend connectivity. The SCC Admin UI provides all diagnostics; BTP Cockpit shows connectivity status from the cloud side.",
          keyPoints: [
            "SCC Admin UI → Monitoring → Tunnel: verify tunnel state = Connected",
            "SCC Admin UI → Monitoring → Top Services: shows which BTP apps are using the tunnel most",
            "BTP Cockpit → Connectivity → Cloud Connectors: shows SCC status, subaccount binding, last connect time",
            "Certificate management: SCC certificate expires every 1 year by default — renew before expiry via SCC Admin → Maintenance → Certificate Renewal",
            "Connection issues: check scc_core.log for 'TUNNEL_CLOSED' or SSL errors",
            "Virtual host reachability: SCC Admin → Cloud To On-Premise → select mapping → Check Availability",
            "Proxy issues: if SCC is behind corporate proxy, configure proxy in SCC Admin → Configuration → Proxy",
          ],
          links: [
            { label: "SCC Troubleshooting Guide", url: "https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/troubleshooting-cloud-connector" },
          ],
          warning: "SCC certificate expiry silently breaks all BTP connectivity. Set a calendar reminder 30 days before certificate expiry and renew proactively via SCC Admin UI.",
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Configuration",
      nodes: [
        {
          id: "scc-rfc",
          title: "RFC Over Cloud Connector — ABAP Connectivity",
          icon: "Layers",
          badge: "Integration",
          summary:
            "Cloud Connector supports RFC protocol, enabling BTP Integration Suite and other BTP services to call SAP ABAP systems over RFC through the tunnel. This requires specific configuration in both SCC and the BTP destination service.",
          steps: [
            "In SCC Admin → Cloud to On-Premise → Add System: select 'ABAP System' protocol",
            "Enter Virtual Host (e.g. s4h-rfc) and Internal Host (real ABAP message server)",
            "Add resource: enter client, system number, and any logon groups",
            "In BTP Cockpit: Connectivity → Destinations → create new destination",
            "  - Type: RFC; Proxy Type: OnPremise; URL: rfcg://<virtual-host>",
            "  - Authentication: PrincipalPropagation or BasicAuthentication",
            "Test destination from BTP Cockpit → check connection",
          ],
          keyPoints: [
            "RFC protocol in SCC: SCC proxies RFC calls through the tunnel to on-premise ABAP systems",
            "Principal Propagation: BTP user identity forwarded to ABAP as SAP logon token — requires ABAP trust configuration",
            "BTP Integration Suite: uses RFC destinations to call BAPIs in ABAP systems from integration flows",
            "SAP JCo: BTP apps use SAP JCo library to make RFC calls through the destination",
          ],
          links: [
            { label: "RFC via Cloud Connector", url: "https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/configure-rfc" },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// SAP Basis TCodes
// ─────────────────────────────────────────────
export const tcodesModule: ModuleData = {
  id: "tcodes",
  title: "SAP Basis TCodes",
  subtitle: "Curated TCode Reference by Category",
  version: "S/4HANA 2023+ | 372 curated TCodes",
  sourceUrl: "https://help.sap.com/docs/SAP_S4HANA",
  overview:
    "A curated, categorized reference of all essential SAP Basis Transaction Codes. Organized by functional area — from background jobs and client administration to transport management, user security, monitoring, Fiori/Gateway, and Solution Manager. Each TCode includes its purpose, when to use it, and the step-by-step procedure.",
  color: "#1A237E",
  sections: [
    {
      id: "core-basis",
      title: "Core Basis",
      nodes: [
        {
          id: "tc-background-jobs",
          title: "Background Jobs",
          icon: "Activity",
          badge: "Core Basis",
          summary: "Schedule, monitor, and manage SAP background jobs. Essential for periodic reporting, data processing, housekeeping, and event-driven job chains.",
          keyPoints: [
            "SM36 — Schedule Background Job: Create jobs with program, variant, and start conditions (immediate, time, event)",
            "SM37 — Job Overview: Monitor all jobs — filter by user, name, status, date; view logs; cancel stuck jobs",
            "SM35 — Batch Input Monitoring: Monitor data migration sessions; replay or delete failed sessions",
            "SM39 — Job Analysis: Detailed performance statistics for background job execution",
            "SM49 — Execute OS Commands: Run OS-level commands defined in SM69 directly from SAP",
            "SM62 — Event History: Define SAP events for event-driven job scheduling (job chains)",
            "SM64 — Trigger Events: Manually trigger batch events to start event-dependent jobs",
            "SM65 — Background Processing Analysis: Diagnose background processing configuration issues",
            "SM69 — Maintain OS Commands: Define/maintain allowed OS commands callable from SM49",
            "SMX — Own Jobs: Display status of jobs scheduled by the current user",
          ],
          steps: [
            "SCHEDULE a background job: SM36 → Job Name → Add Step (Program + Variant) → Start Condition → Save",
            "MONITOR running jobs: SM37 → enter filter criteria → Execute → click job → Job Log",
            "CANCEL stuck job: SM37 → select job → Job menu → Cancel (or Delete if aborted)",
            "RESCHEDULE a failed job: SM37 → select job → Job menu → Copy → adjust → save",
            "DEFINE job chain: SM62 → define event → SM36 → link job to event as start condition",
          ],
          tcodes: ["SM36", "SM37", "SM35", "SM39", "SM49", "SM62", "SM64", "SM65", "SM69", "SMX"],
          tip: "Always set a job class (A/B/C) matching the business priority — Class A jobs run in parallel with highest priority. Use Class C for non-critical housekeeping to avoid resource contention.",
        },
        {
          id: "tc-client-admin",
          title: "Client Administration",
          icon: "Server",
          badge: "Core Basis",
          summary: "Manage SAP clients — create, configure, copy, export, import, and delete clients. Critical for landscape management, testing environments, and system migrations.",
          keyPoints: [
            "SCC4 — Client Administration: Create clients, set change options (Customizing, All changes, No changes), restrict productive clients",
            "SCC0 — Client Copy (all types): Full client copy with profiles — includes application data, config, users",
            "SCCL — Local Client Copy: Copy client within the same system; schedule in background for large clients",
            "SCC9 — Remote Client Copy: Direct copy between systems via RFC — requires stable RFC connection",
            "SCC8 — Client Export: Export client to transport files for cross-system copy (use with STMS + SCC7)",
            "SCC6 — Client Import: Import client data from transport file",
            "SCC7 — Post-Processing Import: Fix system-specific settings after client import/system copy",
            "SCC3 — Client Copy Log: Monitor running copies, review history, troubleshoot failures",
            "SCC5 — Delete Client: Irreversible — delete client and all its data; use only on obsolete clients",
          ],
          steps: [
            "CREATE client: SCC4 → New entries → enter client number, description, city, currency, change options → Save",
            "LOCAL client copy: SCCL in TARGET client → select source client → choose profile → schedule in background → monitor in SCC3",
            "CROSS-SYSTEM copy: SCC8 in source client (export) → STMS import to target system → SCC7 post-processing",
            "DELETE client: SCC5 → enter client number → confirm warning (irreversible) → monitor deletion",
          ],
          tcodes: ["SCC4", "SCC0", "SCCL", "SCC9", "SCC8", "SCC6", "SCC7", "SCC3", "SCC5", "SCC1", "SCC2"],
          warning: "SCC5 (Delete Client) is irreversible. Always verify client number twice and ensure you have a full backup before deleting any client.",
          tip: "For large client copies, always run in background (SCCL → schedule). A local copy of a production client can take 10-24 hours for large databases.",
        },
        {
          id: "tc-software-maintenance",
          title: "Software Maintenance",
          icon: "Package",
          badge: "Core Basis",
          summary: "Manage SAP software components, support packages, add-ons, and note corrections. Core tool for SAP patching and maintenance cycles.",
          keyPoints: [
            "SPAM — Support Package Manager: Install support packages and Enhancement Packages; primary patching tool",
            "SAINT — Add-On Installation Tool: Install SAP add-ons, industry solutions, component patch levels",
            "SNOTE — Note Assistant: Apply SAP correction notes directly (code-level corrections)",
            "SGEN — SAP Load Generator: Generate ABAP programs into memory post-upgrade for performance",
            "BAOV — Add-On Version Information: Display all installed add-on versions and components",
            "SPDD — Modified DDIC Objects: Review and adjust DDIC modifications after support package upgrade",
            "SPAU — Modified Repository Objects: Review and adjust repository object modifications post-upgrade",
          ],
          steps: [
            "APPLY support package: SPAM → upload .PAT files to transport directory → check queue → import queue",
            "APPLY SAP Note: SNOTE → enter note number → download → check preconditions → implement → confirm",
            "INSTALL add-on: SAINT → upload installation file → check prerequisites → start installation → monitor",
            "POST-UPGRADE: SPDD first (DDIC objects) → then SPAU (repository objects) → then SGEN",
          ],
          tcodes: ["SPAM", "SAINT", "SNOTE", "SGEN", "BAOV", "SPDD", "SPAU"],
          sapNotes: [
            { note: "1800645", desc: "SPAM/SAINT — known issues and corrections" },
          ],
          warning: "Always run SPDD before SPAU after a support package or upgrade. DDIC changes (SPDD) must be adjusted before repository objects (SPAU) to avoid inconsistencies.",
        },
        {
          id: "tc-system-admin",
          title: "System Administration",
          icon: "Settings",
          badge: "Core Basis",
          summary: "Core system administration TCodes for profile management, buffer management, instance configuration, user sessions, and SAP system operations.",
          keyPoints: [
            "RZ10 — Maintain Profile Parameters: Edit SAP instance/default profiles; requires restart for most changes",
            "RZ11 — Profile Parameter Documentation: View current value, allowed values, and documentation for any parameter",
            "RZ04 — Maintain SAP Instances: Configure operation modes and instance properties",
            "SM04 — User Sessions on Instance: View and terminate active user logons on current application server",
            "SM50 — Work Processes: View all work process types and status on current instance",
            "SM51 — Started Instances: List all active application server instances in the SAP system",
            "SM66 — Global Work Processes: View work processes across ALL instances simultaneously",
            "SM21 — System Log: Central SAP system log — check for errors, security events, system messages",
            "$TAB — Refresh Table Buffer: Force immediate refresh of table buffers (use cautiously in production)",
            "$SYNC — Synchronize All Buffers: Synchronize all buffer types across all instances",
            "SICK — Installation Check: Verify installation integrity after upgrades or system copies",
            "AL11 — SAP Directories: Browse SAP file system directories from within the system",
            "STRUST — Trust Manager: Manage SSL certificates and trust lists",
            "SMLG — Logon Groups: Maintain logon group assignments for load balancing across app servers",
          ],
          tcodes: ["RZ10", "RZ11", "RZ04", "SM04", "SM50", "SM51", "SM66", "SM21", "$TAB", "$SYNC", "SICK", "AL11", "STRUST", "SMLG", "SMLT", "SSAA"],
          tip: "RZ10 profile changes require a system restart. For dynamic parameter changes (where possible), use RZ11 → Set Value (only works for parameters marked as dynamic).",
        },
        {
          id: "tc-transport",
          title: "Transport Management",
          icon: "GitFork",
          badge: "Core Basis",
          summary: "Manage the SAP Change and Transport System (CTS) — create, release, import, and monitor transport requests across the system landscape.",
          keyPoints: [
            "STMS — Transport Management System: Central TMS — configure transport routes, import queues, domain controller",
            "SE09 / SE10 — Transport Organizer: Create, display, and manage workbench and customizing transport requests",
            "SE01 — Transport Organizer (extended): Full view of all transport requests with additional functions",
            "SE03 — Transport Organizer Tools: Administrative functions — set project, change category, repair requests",
            "SE07 — CTS Status Display: Overview of transport system status across all systems",
            "SE06 — Set Up Transport Organizer: Initial CTS setup; configure virtual system, transport layers",
            "CG3Y / CG3Z — Download/Upload Files: Transfer files between SAP file system and workstation",
            "/SDF/TRCHECK — Transport Request Check: Validate transport request quality before release",
          ],
          steps: [
            "RELEASE transport: SE09 → find request → Release (envelope icon) → confirm; adds to import queue",
            "IMPORT to system: STMS → Import queue → select system → add transports to queue → import all",
            "CHECK import queue: STMS → Import Overview → select system → view pending imports",
            "MONITOR import: STMS → import queue → select transport → Logs → view SLOG and ALOG",
          ],
          tcodes: ["STMS", "SE09", "SE10", "SE01", "SE03", "SE07", "SE06", "CG3Y", "CG3Z", "/SDF/TRCHECK"],
          warning: "Never manually edit transport files in the file system — always use STMS/SE09. Manual edits bypass CTS integrity checks and can corrupt the transport directory.",
        },
        {
          id: "tc-user-security",
          title: "User & Security",
          icon: "Shield",
          badge: "Core Basis",
          summary: "SAP user administration, authorization roles, audit logs, and Central User Administration (CUA) management.",
          keyPoints: [
            "SU01 — User Maintenance: Create, modify, lock, unlock individual users; reset passwords",
            "SU10 — User Mass Maintenance: Apply changes to multiple users at once (lock, password, roles)",
            "PFCG — Role Maintenance: Create, modify composite and single roles; generate authorization profiles",
            "SU24 — Authorization Defaults: Maintain proposal values for authorization objects per TCode",
            "SU25 — Upgrade Authorization Proposals: Update SU24 data after upgrade using proposal comparison",
            "SU53 — Authorization Check: Display failed authorization check for a user (run in their session)",
            "SU56 — User Buffer: Display user's authorization buffer — shows currently loaded authorizations",
            "SUIM — User Information System: Report on user authorizations, roles, profiles — audit tool",
            "SM19 / SM20 — Security Audit Log: Configure and evaluate security audit log",
            "SCUA — Central User Administration: Configure CUA; SCUL — lock/unlock users centrally across systems",
            "STRUST — Trust Manager: Manage SSL/TLS certificates for system connectivity",
          ],
          steps: [
            "CREATE user: SU01 → new user → fill logon, address, roles → save → communicate password",
            "TROUBLESHOOT authorization: SU53 (run in user's session) → shows last failed auth check → fix role in PFCG",
            "CREATE role: PFCG → create role → menu tab → add TCodes → authorization tab → maintain values → generate profile",
            "AUDIT user access: SUIM → Users by authorization values → filter by auth object and value",
          ],
          tcodes: ["SU01", "SU10", "SU01D", "PFCG", "PFUD", "SU24", "SU25", "SU53", "SU56", "SUIM", "SM19", "SM20", "SCUA", "SCUL", "SCUM"],
          sapNotes: [
            { note: "1539556", desc: "SAP Security Optimization Guide — user administration" },
          ],
          tip: "Always run SU25 after every support package upgrade to ensure authorization proposal values are updated. Missing SU25 run causes incomplete authorization profiles.",
        },
        {
          id: "tc-work-processes",
          title: "Work Processes & Locks",
          icon: "Activity",
          badge: "Core Basis",
          summary: "Monitor and manage SAP work processes, update processing, lock entries, and instance-level operations.",
          keyPoints: [
            "SM50 — Work Processes (current instance): View dialog, background, update, enqueue, spool WPs; identify stuck/long-running processes",
            "SM66 — Global Work Processes: Same as SM50 but across ALL instances — essential for cluster systems",
            "SM12 — Display/Delete Lock Entries: View and delete SAP enqueue locks — critical for resolving lock conflicts",
            "SM13 — Update Management: Monitor and reprocess failed update records (V1/V2 updates)",
            "SM14 — Update Administration: Configure update work process parameters",
            "ARFC — Asynchronous RFC Monitor: Monitor outstanding async RFC calls",
            "SM38 — Queue Maintenance: Maintain queued RFC (qRFC) connections",
            "SM56 — Number Range Buffer: Display and reset number range buffer; use after number range conflicts",
          ],
          tcodes: ["SM50", "SM66", "SM12", "SM13", "SM14", "ARFC", "SM38", "SM56", "SM51", "SM54", "SM55"],
          tip: "SM12 locked entries should be investigated before deletion. A lock held by an active session should not be deleted — only delete locks whose owner process has already ended.",
        },
        {
          id: "tc-spool",
          title: "Spool & Output",
          icon: "Monitor",
          badge: "Core Basis",
          summary: "Manage SAP spool system — monitor output requests, configure printers, check TemSe consistency, and manage output devices.",
          keyPoints: [
            "SP01 — Output Controller: Monitor all spool requests; resend stuck print jobs; delete old requests",
            "SP02 — Personal Spool Requests: View current user's own spool requests",
            "SPAD — Spool Administration: Configure output devices (printers), access methods, server groups",
            "SP11 — TemSe Directory: Display contents of TemSe (Temporary Sequential) storage",
            "SP12 — TemSe Administration: Manage TemSe; delete old entries; check consistency",
            "SPCC — Spool Consistency Check: Identify and fix spool inconsistencies",
            "SP03 — Spool Load Formats: Configure page formats for spool output",
          ],
          tcodes: ["SP01", "SP02", "SP03", "SP11", "SP12", "SPAD", "SPCC", "SPIC", "SP00"],
          tip: "Schedule regular TemSe cleanup via SM36 using program RSPO1041 — large TemSe databases slow down all print operations and consume significant database space.",
        },
      ],
    },
    {
      id: "monitoring-ops-tc",
      title: "Monitoring & Operations",
      nodes: [
        {
          id: "tc-db-performance",
          title: "Database & Performance",
          icon: "BarChart3",
          badge: "Monitoring",
          summary: "Database administration, performance analysis, and optimization TCodes. These are daily tools for any SAP Basis consultant monitoring database and system performance.",
          keyPoints: [
            "ST04 — DB Performance Monitor: Comprehensive database statistics — buffer hit ratios, wait events, top SQL; key daily tool",
            "ST05 — Performance Trace: SQL/RFC/enqueue trace at the ABAP layer — analyze slow transactions",
            "ST02 — SAP Buffer Statistics: View all SAP memory buffers (table, program, CUA) and hit ratios",
            "ST06 — Operating System Monitor: CPU, memory, disk, network at OS level",
            "ST03 — Workload Monitor: Historical ABAP workload statistics — dialog response times, DB request times",
            "DB02 — Tables and Indexes Monitor: Tablespace usage, missing indexes, table sizes, fragmentation",
            "DB13 — DBA Planning Calendar: Schedule brbackup, brconnect, statistics, DBCC jobs",
            "DB12 — DBA Backup Logs: Review backup status and history",
            "DBACOCKPIT — DBA Cockpit: Unified DB monitoring for HANA, Oracle, ASE, MaxDB from within SAP",
            "/SDF/SQLM — SQL Monitor: Capture and analyze top SQL statements in production",
            "STAD — Statistics Display: Detailed runtime statistics for specific users or dialog steps",
          ],
          tcodes: ["ST04", "ST05", "ST02", "ST06", "ST03", "DB02", "DB13", "DB12", "DBACOCKPIT", "/SDF/SQLM", "STAD", "STAT", "DB01", "DB20"],
          tip: "ST05 trace must be activated BEFORE the problem occurs. Activate → reproduce issue → deactivate → analyze. Never leave ST05 active in production without a time limit.",
        },
        {
          id: "tc-monitoring-alerts",
          title: "Monitoring & Alerts (CCMS)",
          icon: "Bell",
          badge: "Monitoring",
          summary: "SAP CCMS monitoring infrastructure — configure and respond to system alerts, monitor infrastructure, view EarlyWatch data.",
          keyPoints: [
            "RZ20 — CCMS Monitoring: Central alert monitor — view all CCMS alerts from all instances and subsystems",
            "RZ21 — CCMS Architecture Configuration: Configure monitoring infrastructure, agents, and alert thresholds",
            "AL01 — SAP Alert Monitor: Simplified alert view; drill-down into specific alerts",
            "AL02 — Database Alert Monitor: Database-specific alerts (tablespace, backup, performance)",
            "AL03 — OS Alert Monitor: Operating system alerts (CPU, disk space, swap)",
            "AL07 — EarlyWatch Report: Automated weekly system health report; review before SAP support tickets",
            "AL08 — Users Logged On: Count and list of all active user sessions across the system",
            "AL12 — Table Buffer Display: Detailed view of table buffer contents and hit rates",
            "AL13 — Shared Memory Display: View SAP shared memory segments",
            "/SDF/SMON — Snapshot Monitor: Real-time work process and performance snapshot",
          ],
          tcodes: ["RZ20", "RZ21", "AL01", "AL02", "AL03", "AL07", "AL08", "AL12", "AL13", "/SDF/SMON", "RZ01", "RZ02"],
          tip: "Configure RZ20 threshold values based on actual system behavior (not just defaults). Too-low thresholds cause alert fatigue; too-high thresholds miss real problems.",
        },
        {
          id: "tc-dumps-logs",
          title: "Dumps & Logs",
          icon: "FileText",
          badge: "Troubleshooting",
          summary: "Analyze and diagnose ABAP runtime errors (ST22), trace files (ST11), and application logs (/SDF/SLG1).",
          keyPoints: [
            "ST22 — ABAP Dump Analysis: View short dumps (runtime errors); analyze cause, stack trace, variables",
            "ST11 — Developer Trace Files: View ICM, dialog, background, spool work process trace files",
            "/SDF/SLG1 — Application Log: Read application log objects (SLOG); replaces older SLG1 for newer versions",
            "SM21 — System Log: Core SAP system log — security events, system messages, errors",
          ],
          steps: [
            "ANALYZE dump: ST22 → select date/user/TCode filter → select dump → view long text and variable values",
            "READ trace file: ST11 → select work process type → open latest trace file → search for ERROR",
            "CHECK application log: /SDF/SLG1 → enter object/subobject → date range → display",
          ],
          tcodes: ["ST22", "ST11", "/SDF/SLG1", "SM21"],
          tip: "ST22 dumps older than 7 days are deleted by default (controlled by profile parameter rdisp/max_wprun_time). Increase retention for production or archive important dumps.",
        },
        {
          id: "tc-network-rfc",
          title: "Network & RFC",
          icon: "Globe",
          badge: "Connectivity",
          summary: "Monitor and configure SAP network connectivity — RFC destinations, ICM/HTTP services, Gateway monitoring, and qRFC queues.",
          keyPoints: [
            "SM59 — RFC Destinations: Create and test RFC connections to remote SAP or non-SAP systems",
            "SMGW — Gateway Monitor: Monitor SAP Gateway connections — external RFC programs, remote systems",
            "SMICM — ICM Monitor: Monitor Internet Communication Manager — HTTP/HTTPS services, SSL, threads",
            "SICF — HTTP Service Hierarchy: Activate/deactivate SAP HTTP/HTTPS services; configure service handlers",
            "SM58 — Asynchronous RFC Errors: View and process failed asynchronous RFC calls",
            "SMQ1 / SMQ2 — qRFC Monitor: Monitor outbound and inbound queued RFC queues",
          ],
          steps: [
            "TEST RFC connection: SM59 → find/create RFC → Connection Test button → verify green status",
            "ACTIVATE HTTP service: SICF → navigate to service path → right-click → Activate",
            "CHECK ICM status: SMICM → Goto → Services → verify HTTP/HTTPS services are active",
          ],
          tcodes: ["SM59", "SMGW", "SMICM", "SICF", "SM58", "SMQ1", "SMQ2"],
        },
      ],
    },
    {
      id: "platform-tc",
      title: "S/4 Platform",
      nodes: [
        {
          id: "tc-fiori-gateway",
          title: "Fiori & Gateway",
          icon: "LayoutGrid",
          badge: "S/4 Platform",
          summary: "Configure and troubleshoot SAP Fiori Launchpad, Gateway services, OData services, and UI5 metadata. Essential for S/4HANA Fiori deployments.",
          keyPoints: [
            "/IWFND/MAINT_SERVICE — Activate & Maintain Services: Activate OData services in the frontend hub system",
            "/IWFND/GW_CLIENT — Gateway Client: Test OData service calls directly; debug service responses",
            "/IWFND/ERROR_LOG — Gateway Error Log: Central error log for all OData request failures",
            "/IWFND/TRACES — Gateway Traces: Enable and view gateway trace for debugging service issues",
            "/UI2/FLP — Fiori Launchpad: Access FLP for testing; check tile visibility",
            "/UI2/FLPD_CUST — Launchpad Designer (Customer): Configure customer-specific FLP spaces and pages",
            "/UI2/CACHE — Cache Registration: Register services for UI5 metadata caching",
            "/UI2/CACHE_DEL — Delete Cache: Clear FLP and OData service cache after updates",
            "SEGW — Gateway Service Builder: Build and activate custom OData services (back-end)",
            "STC01 / STC02 — Task Manager: Execute and monitor technical configuration tasks (SolMan-linked)",
          ],
          steps: [
            "ACTIVATE OData service: /IWFND/MAINT_SERVICE → Add Service → enter technical service name → activate",
            "DEBUG OData error: /IWFND/ERROR_LOG → find error → open → check error details; cross-reference with /IWFND/GW_CLIENT test",
            "CLEAR FLP cache: /UI2/CACHE_DEL → select cache type → delete → hard-refresh browser",
            "TEST OData call: /IWFND/GW_CLIENT → enter request URI → execute → inspect response",
          ],
          tcodes: ["/IWFND/MAINT_SERVICE", "/IWFND/GW_CLIENT", "/IWFND/ERROR_LOG", "/IWFND/TRACES", "/UI2/FLP", "/UI2/FLPD_CUST", "/UI2/CACHE", "/UI2/CACHE_DEL", "SEGW", "/IWBEP/REG_SERVICE"],
          tip: "After every support package upgrade, run /UI2/CACHE_DEL and clear browser cache. Stale OData metadata cache causes Fiori app loading failures that look like permission issues.",
        },
        {
          id: "tc-archive-ilm",
          title: "Archive & ILM",
          icon: "Archive",
          badge: "S/4 Platform",
          summary: "SAP Data Archiving and Information Lifecycle Management (ILM) — archive business data, manage archivelink documents, and configure retention policies.",
          keyPoints: [
            "SARA — Archive Administration: Central transaction for data archiving; create, execute, and manage archiving runs",
            "AOBJ — Archiving Object Definitions: Display available archiving objects and their configuration",
            "SARI — Archive Information System: Search and retrieve archived data (for users)",
            "OAC0 — Content Repository Management: Configure archivelink content repositories (on-premise or BTP DMS)",
            "OAA1 — ArchiveLink Administration: Central ArchiveLink menu for all related configuration",
            "OAM1 — ArchiveLink Monitor: Monitor ArchiveLink document creation and retrieval",
            "OAOR — Business Document Navigator: Navigate and manage archived business documents",
            "AS_AFB — Archive File Browser: Browse archive files on the archive server",
          ],
          tcodes: ["SARA", "AOBJ", "SARI", "OAC0", "OAA1", "OAA3", "OAM1", "OAOR", "AS_AFB", "OAD0"],
          tip: "Before running a production archiving run in SARA, always run the 'Write' phase in Test Run mode first. Test run identifies data that would be archived without actually archiving it.",
        },
        {
          id: "tc-solman",
          title: "Solution Manager",
          icon: "Activity",
          badge: "S/4 Platform",
          summary: "Key TCodes for working with SAP Solution Manager — from landscape management and change control to system monitoring and work centers.",
          keyPoints: [
            "SOLMAN_SETUP — Solution Manager Setup: Run all SolMan configuration steps from one central wizard",
            "LMDB — Landscape Management DB: View and maintain system landscape, product systems, technical systems",
            "DSWP — SolMan Work Center: Entry point for SolMan functions — projects, change management, monitoring",
            "SOLMAN_WORKCENTER — Work Center (new): Fiori-based SolMan launchpad",
            "CRM_DNO_MONITOR — CRM Service Monitor: Monitor ChaRM change documents, incidents, service requests",
            "SMSY — System Landscape (legacy): Older landscape transaction; replaced by LMDB in SolMan 7.2",
            "STWB_2 — Test Plan Management: Create and manage test plans in SolMan ITSM/ChaRM",
            "SOLAR_PROJECT_ADMIN — Solution Manager Project Admin: Create and manage SAP implementation projects",
          ],
          tcodes: ["SOLMAN_SETUP", "LMDB", "DSWP", "SOLMAN_WORKCENTER", "CRM_DNO_MONITOR", "SMSY", "STWB_2", "SOLAR_PROJECT_ADMIN", "SM_WORKCENTER", "/SDF/ALM_SETUP", "/SDF/ALM_DIAGNOSTIC"],
        },
        {
          id: "tc-dev-integration",
          title: "ABAP Development & Integration",
          icon: "Terminal",
          badge: "Development",
          summary: "Core ABAP development tools, interface monitoring, and IDocs management for SAP Basis integration work.",
          keyPoints: [
            "SE38 — ABAP Editor: Write, test, and execute ABAP programs; run background reports directly",
            "SE11 — ABAP Dictionary: View and maintain tables, views, data elements, domains",
            "SE16N — Table Data Browser: Display table contents with flexible filtering and column selection",
            "SE80 — Object Navigator: Navigate all ABAP objects (programs, function groups, classes, packages)",
            "SM30 — View Maintenance: Maintain customizing table entries via generated views",
            "SE37 — Function Module Builder: Create and test function modules (BAPIs)",
            "WE02 / WE05 — IDoc Display/List: View IDoc status, content, and processing errors",
            "BD87 — IDoc Error Handling: Reprocess failed IDocs; filter by partner, message type, status",
            "WE20 — Partner Profiles: Configure IDoc partner profiles for EDI and interface partners",
            "SXMB_MONI — XI/PI Integration Monitor: Monitor message processing in SAP PI/PO",
            "SOAMANAGER — SOA Manager: Configure Web Services (SOAP) security policies and bindings",
          ],
          tcodes: ["SE38", "SE11", "SE16N", "SE80", "SM30", "SE37", "WE02", "WE05", "BD87", "WE20", "SXMB_MONI", "SOAMANAGER", "SALE", "BD54"],
        },
      ],
    },
  ],
};
