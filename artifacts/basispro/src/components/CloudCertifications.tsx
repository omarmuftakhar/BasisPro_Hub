import React, { useState } from "react";
import { Award, ExternalLink, ChevronDown, ChevronRight, Star, Clock, Layers, Globe, Shield, Database, Cloud, BookOpen, CheckCircle2 } from "lucide-react";

interface Cert {
  id: string;
  code: string;
  title: string;
  vendor: "SAP" | "AWS" | "Azure" | "GCP" | "Generic";
  level: "Associate" | "Professional" | "Specialty" | "Expert" | "Foundational";
  duration: string;
  questions: number;
  passMark: number;
  price: string;
  validity: string;
  description: string;
  topics: string[];
  tips: string[];
  examUrl: string;
  studyUrl?: string;
  relevance: "critical" | "high" | "useful";
  color: string;
  icon: React.ReactNode;
}

const CERTS: Cert[] = [
  {
    id: "c_s4adm",
    code: "C_S4ADM_2404",
    title: "SAP Certified Associate – SAP S/4HANA System Administration",
    vendor: "SAP",
    level: "Associate",
    duration: "180 min",
    questions: 80,
    passMark: 65,
    price: "$575 USD",
    validity: "2 years",
    description: "The primary SAP Basis certification for S/4HANA system administrators. Covers system monitoring, client administration, transport management, profile parameters, background jobs, and HANA integration.",
    topics: [
      "S/4HANA system architecture and components",
      "Client administration and client copy",
      "Transport Management System (STMS)",
      "System monitoring and CCMS (RZ20/AL01)",
      "User administration and authorizations (SU01/PFCG)",
      "Background job management (SM36/SM37)",
      "Profile parameter management (RZ10/RZ11)",
      "Support package installation (SPAM/SAINT)",
      "SAP HANA administration basics",
      "Fiori Launchpad configuration",
    ],
    tips: [
      "Focus on SM36/SM37/SM50 — commonly tested in detail",
      "Know all SCC* transactions for client copy scenarios",
      "Understand STMS transport routes and domain controller concept",
      "RZ10 dynamic vs static parameters — exam favourite",
      "Practice with SAP Learning Hub trial systems before exam",
    ],
    examUrl: "https://training.sap.com/certification/c_s4adm_2404-sap-certified-associate---sap-s4hana-system-administration-g/",
    studyUrl: "https://learning.sap.com/",
    relevance: "critical",
    color: "from-blue-600 to-indigo-600",
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "c_hanatec",
    code: "C_HANATEC_18",
    title: "SAP Certified Technology Associate – SAP HANA 2.0",
    vendor: "SAP",
    level: "Associate",
    duration: "180 min",
    questions: 80,
    passMark: 68,
    price: "$575 USD",
    validity: "2 years",
    description: "Deep dive into SAP HANA 2.0 database administration: installation, configuration, backup & recovery, monitoring, security, and replication. Essential for any DBA-focused Basis role.",
    topics: [
      "SAP HANA installation and initial configuration",
      "HANA System Replication (HSR) — SYNC, ASYNC, SYNCMEM",
      "HANA backup and recovery strategies (file, backint, snapshot)",
      "HANA security: users, roles, privileges, auditing",
      "HANA monitoring with HANA Cockpit and Studio",
      "HANA persistence layer and storage configuration",
      "HANA multi-tenant database containers (MDC)",
      "HANA performance analysis and SQL tuning",
      "HANA scale-out architecture",
      "SAP HANA Cloud fundamentals",
    ],
    tips: [
      "Deep focus on HSR — know all modes and when to use each",
      "Backup/recovery scenarios: full, incremental, delta — exam tests recovery procedures",
      "MDC architecture (system DB vs tenant DB) is heavily tested",
      "Security: difference between object privileges, system privileges, analytic privileges",
      "Use hdbsql command-line for practice — many exam questions are on CLI procedures",
    ],
    examUrl: "https://training.sap.com/certification/c_hanatec_18-sap-certified-technology-associate---sap-hana-20-sps07-g/",
    relevance: "critical",
    color: "from-indigo-600 to-violet-600",
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "c_byd_mis",
    code: "C_BYD_MIS",
    title: "SAP Certified Technology Specialist – SAP BTP Integration",
    vendor: "SAP",
    level: "Professional",
    duration: "180 min",
    questions: 60,
    passMark: 62,
    price: "$575 USD",
    validity: "2 years",
    description: "BTP Integration Suite configuration and operations. Relevant for Basis consultants managing SAP BTP subaccounts, Cloud Connector, and integration flows connecting on-premise to cloud.",
    topics: [
      "SAP BTP account structure and subaccount management",
      "Cloud Connector installation and configuration",
      "Integration Suite iFlow design and monitoring",
      "API Management basics",
      "Identity Authentication (IAS) setup",
      "BTP security and role management",
    ],
    tips: [
      "Focus on Cloud Connector master/shadow HA — widely tested",
      "Know the difference between Application Option and Integration Option in DMS",
      "IAS as SAML proxy — common exam scenario",
    ],
    examUrl: "https://training.sap.com/",
    relevance: "high",
    color: "from-violet-600 to-pink-600",
    icon: <Cloud className="w-5 h-5" />,
  },
  {
    id: "aws-saa",
    code: "SAA-C03",
    title: "AWS Solutions Architect — Associate",
    vendor: "AWS",
    level: "Associate",
    duration: "130 min",
    questions: 65,
    passMark: 72,
    price: "$300 USD",
    validity: "3 years",
    description: "Industry-standard cloud architect certification. Highly valuable for SAP Basis consultants deploying SAP on AWS — covers EC2 instance sizing, EBS/EFS storage, VPC networking, HA, and IAM.",
    topics: [
      "EC2 instance types and auto scaling",
      "Storage: EBS, EFS, S3, FSx (including ONTAP for SAP NFS)",
      "VPC: subnets, routing, security groups, NACLs",
      "High availability: ALB/NLB, Multi-AZ, Route 53",
      "IAM: users, roles, policies (critical for SAP EC2 permissions)",
      "AWS Backup and Disaster Recovery (DRS)",
      "RDS/Aurora (for non-HANA SAP DBs on AWS)",
      "CloudWatch monitoring and alerting",
    ],
    tips: [
      "Study FSx for NetApp ONTAP — directly relevant for HANA shared volumes",
      "Understand Elastic Fabric Adapter (EFA) for HANA scale-out",
      "EBS io2 Block Express vs gp3 — understand when to use each",
      "Transit Gateway for Overlay IP SAP HA — study carefully",
      "Free tier practice + AWS SAP whitepapers are excellent study materials",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    studyUrl: "https://docs.aws.amazon.com/sap/",
    relevance: "critical",
    color: "from-orange-500 to-amber-500",
    icon: <Cloud className="w-5 h-5" />,
  },
  {
    id: "aws-sap",
    code: "PAS-C01",
    title: "AWS Certified: SAP on AWS — Specialty",
    vendor: "AWS",
    level: "Specialty",
    duration: "170 min",
    questions: 65,
    passMark: 75,
    price: "$300 USD",
    validity: "3 years",
    description: "The only SAP-specific cloud certification from AWS. Validates expertise in designing, deploying, and operating SAP workloads on AWS. Highly valued by consulting firms and SAP customers on AWS.",
    topics: [
      "SAP HANA sizing and EC2 instance selection",
      "Storage for SAP HANA (EBS io2, FSx, backint)",
      "SAP HA with HSR + Pacemaker + Overlay IP on AWS",
      "SAP backup strategies: backint to S3, EBS snapshots",
      "Network design for SAP: VPC, Transit Gateway, Direct Connect",
      "SAP migration strategies to AWS (HomHetSys, SNP, MIGMON)",
      "AWS Launch Wizard for SAP and Systems Manager for SAP",
      "RISE with SAP on AWS operational considerations",
      "SAP LaMa (Landscape Management) integration with AWS",
      "Cost optimization for SAP on AWS",
    ],
    tips: [
      "Complete the AWS SAA-C03 first — prerequisite knowledge",
      "Read the 'SAP on AWS Best Practices' whitepaper thoroughly",
      "Understand Overlay IP routing with Transit Gateway in depth",
      "HANA backup with Backint for AWS S3 — know configuration steps",
      "AWS Systems Manager for SAP — increasingly exam-relevant",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-sap-on-aws-specialty/",
    studyUrl: "https://docs.aws.amazon.com/sap/",
    relevance: "critical",
    color: "from-amber-600 to-orange-600",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "az-104",
    code: "AZ-104",
    title: "Microsoft Azure Administrator",
    vendor: "Azure",
    level: "Associate",
    duration: "120 min",
    questions: 60,
    passMark: 70,
    price: "$165 USD",
    validity: "1 year (renewable)",
    description: "Foundational Azure certification for managing Azure infrastructure. Covers VMs, storage (Premium SSD v2, Ultra Disk, ANF), networking, and Azure Monitor — directly applicable to SAP on Azure deployments.",
    topics: [
      "Azure Virtual Machines: M-series sizing for SAP HANA",
      "Managed Disks: Premium SSD v2, Ultra Disk configuration",
      "Azure NetApp Files (ANF) for SAP HANA shared/backup",
      "Virtual networks, NSGs, and peering",
      "Azure Monitor and Alerts for SAP workloads",
      "Azure Backup and Recovery Services Vault",
      "Azure Active Directory and RBAC",
      "Azure Site Recovery (ASR) for SAP DR",
    ],
    tips: [
      "Focus heavily on Azure NetApp Files — it's central to all SAP HANA on Azure deployments",
      "Understand Proximity Placement Groups — exam-tested for SAP",
      "Ultra Disk configuration for HANA log volumes — know throughput/IOPS requirements",
      "Azure ILB (Standard) as virtual IP for Pacemaker — key SAP-Azure HA concept",
      "Use Microsoft Learn free path for AZ-104 (official, up-to-date)",
    ],
    examUrl: "https://learn.microsoft.com/en-us/certifications/exams/az-104/",
    studyUrl: "https://learn.microsoft.com/en-us/azure/sap/",
    relevance: "high",
    color: "from-blue-500 to-cyan-500",
    icon: <Cloud className="w-5 h-5" />,
  },
  {
    id: "az-120",
    code: "AZ-120",
    title: "Microsoft Certified: Azure for SAP Workloads — Specialty",
    vendor: "Azure",
    level: "Specialty",
    duration: "120 min",
    questions: 60,
    passMark: 70,
    price: "$165 USD",
    validity: "1 year (renewable)",
    description: "The SAP-specific Azure certification. Validates design and deployment of SAP solutions on Azure. One of the highest-value certifications for SAP Basis professionals in Microsoft-centric enterprises.",
    topics: [
      "SAP HANA on Azure: M-series and Mv2 instance selection",
      "HANA Large Instances (HLI) architecture and operations",
      "Azure NetApp Files deep dive: service levels, QoS, CRR",
      "Pacemaker HA with Azure ILB — full configuration",
      "Azure Site Recovery for SAP: runbooks and test failover",
      "Azure Center for SAP Solutions (ACSS)",
      "Azure Monitor for SAP Solutions (AMS)",
      "S/4HANA migration to Azure: Homogeneous/Heterogeneous",
      "Cost management for SAP on Azure",
      "RISE with SAP on Azure operational model",
    ],
    tips: [
      "Complete AZ-104 before attempting AZ-120",
      "Study ACSS thoroughly — it's SAP lifecycle management on Azure",
      "Azure Monitor for SAP (AMS) — providers, metrics, dashboards",
      "Read the SAP on Azure architecture center guides (Microsoft)",
      "Hands-on labs with Azure free tier + SAP CAL trial systems",
    ],
    examUrl: "https://learn.microsoft.com/en-us/certifications/exams/az-120/",
    studyUrl: "https://learn.microsoft.com/en-us/azure/sap/",
    relevance: "critical",
    color: "from-cyan-500 to-blue-600",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "gcp-ace",
    code: "ACE",
    title: "Google Cloud Associate Cloud Engineer",
    vendor: "GCP",
    level: "Associate",
    duration: "120 min",
    questions: 50,
    passMark: 70,
    price: "$200 USD",
    validity: "3 years",
    description: "Foundational GCP certification covering Compute Engine (M-series VMs), Persistent Disk/Hyperdisk, VPC, IAM, and Cloud Operations — all applicable to SAP on GCP deployments.",
    topics: [
      "Compute Engine: M2/M3 VMs for SAP HANA",
      "Storage: Persistent Disk (SSD, Extreme), Hyperdisk, Filestore NFS",
      "GCP networking: VPC, Cloud Load Balancing (ILB for SAP HA)",
      "Cloud Operations: Cloud Monitoring, Logging",
      "IAM and service accounts",
      "Cloud Storage for HANA backups (Backint for GCS)",
    ],
    tips: [
      "Understand Hyperdisk Extreme vs PD Extreme for HANA log volumes",
      "Filestore Enterprise for production SAP NFS — study service levels",
      "GCP Workload Manager for SAP — emerging but exam-relevant",
      "Regional PD for cross-zone HA (synchronous replication)",
    ],
    examUrl: "https://cloud.google.com/learn/certification/cloud-engineer",
    studyUrl: "https://cloud.google.com/solutions/sap",
    relevance: "useful",
    color: "from-green-500 to-emerald-600",
    icon: <Cloud className="w-5 h-5" />,
  },
];

const VENDOR_COLORS: Record<string, string> = {
  SAP: "bg-blue-100 text-blue-700 border-blue-200",
  AWS: "bg-amber-100 text-amber-700 border-amber-200",
  Azure: "bg-cyan-100 text-cyan-700 border-cyan-200",
  GCP: "bg-green-100 text-green-700 border-green-200",
};

const RELEVANCE_COLORS = {
  critical: "bg-red-50 border-red-200 text-red-700",
  high: "bg-amber-50 border-amber-200 text-amber-700",
  useful: "bg-gray-50 border-gray-200 text-gray-600",
};

export default function CloudCertifications() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const vendors = ["all", "SAP", "AWS", "Azure", "GCP"];
  const shown = filter === "all" ? CERTS : CERTS.filter((c) => c.vendor === filter);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Career Development</span>
        </div>
        <h1 className="text-2xl font-extrabold mb-1">Cloud & SAP Certifications</h1>
        <p className="text-sm opacity-80 max-w-lg">
          Curated certification guide for SAP Basis professionals — covering SAP, AWS, Azure, and GCP with exam details, study tips, and salary impact.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {vendors.map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-all ${
              filter === v
                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {v === "all" ? "All Certifications" : v}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />Critical Path</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />High Value</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" />Useful</span>
        </div>
      </div>

      {/* Cert Cards */}
      <div className="space-y-3">
        {shown.map((cert) => {
          const isExpanded = expanded === cert.id;
          return (
            <div
              key={cert.id}
              className={`border rounded-2xl overflow-hidden transition-all ${
                cert.relevance === "critical" ? "border-[#0070F2]/30" :
                cert.relevance === "high" ? "border-amber-200" : "border-gray-200"
              } bg-white hover:shadow-md`}
            >
              {/* Card header */}
              <div
                className="flex items-start gap-3 p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : cert.id)}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-white flex-shrink-0 mt-0.5`}>
                  {cert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${VENDOR_COLORS[cert.vendor]}`}>
                      {cert.vendor}
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-500">{cert.code}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${RELEVANCE_COLORS[cert.relevance]}`}>
                      {cert.relevance === "critical" ? "★ Critical" : cert.relevance === "high" ? "High Value" : "Useful"}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-gray-900 mt-1 leading-snug">{cert.title}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cert.duration}</span>
                    <span>{cert.questions} questions</span>
                    <span>Pass: {cert.passMark}%</span>
                    <span className="font-medium text-gray-600">{cert.price}</span>
                    <span>Valid: {cert.validity}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
                  <p className="text-sm text-gray-600 leading-relaxed">{cert.description}</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Exam Topics</div>
                      <ul className="space-y-1">
                        {cert.topics.map((t) => (
                          <li key={t} className="flex gap-1.5 text-xs text-gray-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Study Tips</div>
                      <ul className="space-y-1">
                        {cert.tips.map((t) => (
                          <li key={t} className="flex gap-1.5 text-xs text-gray-700">
                            <Star className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={cert.examUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0070F2] text-white rounded-xl hover:bg-[#0060D8] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Register for Exam
                    </a>
                    {cert.studyUrl && (
                      <a
                        href={cert.studyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Study Resources
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
