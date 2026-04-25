import React, { useState } from "react";
import { Award, ExternalLink, ChevronDown, ChevronRight, Star, Clock, BookOpen, CheckCircle2, Layers, Cloud, Database, Shield, Trophy, Zap, AlertCircle } from "lucide-react";

interface Cert {
  id: string;
  code: string;
  title: string;
  vendor: "SAP" | "AWS" | "Azure" | "GCP";
  level: "Foundational" | "Associate" | "Professional" | "Specialty" | "Expert";
  duration: string;
  questions: number;
  passMark: number;
  validity: string;
  description: string;
  topics: string[];
  tips: string[];
  examUrl: string;
  studyUrl?: string;
  relevance: "critical" | "high" | "useful";
  gradient: string;
  systemBased?: boolean;
  maxAttempts?: number;
  requiresScheduling?: boolean;
}

const CERTS: Cert[] = [
  // ── SAP ────────────────────────────────────────────────────────────────────
  {
    id: "c_s4adm",
    code: "C_S4ADM_2404",
    title: "SAP Certified Associate – SAP S/4HANA System Administration",
    vendor: "SAP",
    level: "Associate",
    duration: "180 min",
    questions: 80,
    passMark: 65,
    validity: "2 years",
    description: "The primary SAP Basis certification for S/4HANA administrators. Covers system monitoring, client administration, transport management, profile parameters, background jobs, HANA integration, and Fiori basics.",
    topics: [
      "S/4HANA architecture, installation, and landscape",
      "Client administration (SCC4, SCCL, SCC7)",
      "Transport Management System — STMS routes and import queues",
      "System monitoring with CCMS (RZ20, AL01, SM50/SM66)",
      "User administration and authorizations (SU01, PFCG, SUIM)",
      "Background job scheduling and management (SM36/SM37)",
      "Profile parameter management (RZ10 / RZ11)",
      "Support package installation (SPAM / SAINT)",
      "SAP HANA administration basics — backup, monitoring",
      "Fiori Launchpad and OData service activation",
    ],
    tips: [
      "Know SM36/SM37/SM50 deeply — these are consistently examined",
      "Understand all SCC* client copy transactions and their differences",
      "RZ10 static vs dynamic parameters — expect scenario-based questions",
      "STMS domain controller concept and transport route configuration",
      "Use SAP Learning Hub trial systems for hands-on practice before exam",
    ],
    examUrl: "https://learning.sap.com/certifications",
    studyUrl: "https://learning.sap.com/",
    relevance: "critical",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: "c_dbadm",
    code: "C_DBADM_2601",
    title: "SAP Certified – Database Administrator – SAP HANA",
    vendor: "SAP",
    level: "Associate",
    duration: "180 min",
    questions: 0,
    passMark: 0,
    validity: "2 years",
    description: "System-Based Assessment validating hands-on SAP HANA database administration skills. Covers installation, HANA System Replication, backup & recovery, security, multi-tenant containers, monitoring, and performance tuning. Requires scheduling in advance — available slots are limited and each attempt counts against your annual quota.",
    topics: [
      "SAP HANA installation, configuration, and initial setup",
      "HANA System Replication — SYNC, SYNCMEM, ASYNC modes",
      "Backup and recovery: file, Backint, incremental, delta",
      "Multi-tenant Database Containers (MDC) — system DB vs tenant DB",
      "HANA security: users, roles, privileges, audit policies",
      "HANA monitoring with HANA Cockpit and system views",
      "Persistence and storage configuration for HANA",
      "Performance analysis: expensive statements, delta merge",
      "HANA scale-out architecture concepts",
      "SAP HANA Cloud fundamentals",
    ],
    tips: [
      "System-Based Assessment — you work in a live HANA system, not multiple choice",
      "Schedule your slot well in advance — available seats are limited",
      "Maximum 4 attempts within any 12-month window; plan your preparation carefully",
      "HSR — know all modes and exact configuration commands (hdbnsutil)",
      "Backup/recovery procedure in MDC: system DB first, then tenants",
      "MDC architecture is the most heavily tested area",
      "Use hdbsql CLI for hands-on practice — this exam is entirely CLI/tool-based",
    ],
    examUrl: "https://learning.sap.com/certifications",
    studyUrl: "https://learning.sap.com/",
    relevance: "critical",
    gradient: "from-indigo-600 to-violet-600",
    systemBased: true,
    maxAttempts: 4,
    requiresScheduling: true,
  },

  // ── AWS ────────────────────────────────────────────────────────────────────
  {
    id: "aws-cp",
    code: "CLF-C02",
    title: "AWS Certified Cloud Practitioner",
    vendor: "AWS",
    level: "Foundational",
    duration: "90 min",
    questions: 65,
    passMark: 70,
    validity: "3 years",
    description: "Entry-level AWS certification covering cloud concepts, AWS core services, security, pricing, and billing. Recommended first step for SAP professionals new to AWS cloud.",
    topics: [
      "AWS Cloud concepts and value proposition",
      "Core services: EC2, S3, VPC, IAM, RDS",
      "Security and compliance on AWS",
      "AWS pricing models and cost management tools",
      "Cloud migration and AWS support plans",
    ],
    tips: [
      "No technical depth required — focus on concepts and terminology",
      "Use AWS Cloud Practitioner Essentials free course (AWS Skill Builder)",
      "Good foundation before tackling SAA-C03",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    studyUrl: "https://aws.amazon.com/training/learn-about/cloud-practitioner/",
    relevance: "useful",
    gradient: "from-orange-400 to-amber-400",
  },
  {
    id: "aws-saa",
    code: "SAA-C03",
    title: "AWS Certified Solutions Architect — Associate",
    vendor: "AWS",
    level: "Associate",
    duration: "130 min",
    questions: 65,
    passMark: 72,
    validity: "3 years",
    description: "Industry-standard cloud architect certification. Essential for SAP Basis deploying on AWS — covers EC2 sizing, EBS/EFS/FSx storage, VPC, IAM, HA with Multi-AZ, and disaster recovery.",
    topics: [
      "EC2 instance types, Auto Scaling, placement groups",
      "Storage: EBS (io2/gp3), EFS, S3, FSx for NetApp ONTAP (critical for SAP NFS)",
      "VPC: subnets, routing tables, security groups, NACLs, Transit Gateway",
      "High availability: ALB/NLB, Route 53, Multi-AZ architectures",
      "IAM: users, roles, policies, instance profiles",
      "AWS Backup, snapshots, Disaster Recovery patterns",
      "CloudWatch monitoring and EventBridge",
      "RDS and Aurora for SAP non-HANA databases",
    ],
    tips: [
      "Study FSx for NetApp ONTAP — directly used for SAP HANA shared NFS volume",
      "Transit Gateway for Overlay IP SAP HA routing — exam scenario",
      "Understand EBS io2 Block Express vs gp3 for HANA storage",
      "Elastic Fabric Adapter (EFA) for HANA scale-out network",
      "AWS Free Tier + AWS SAP whitepapers are excellent study materials",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    studyUrl: "https://docs.aws.amazon.com/sap/",
    relevance: "critical",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "aws-cloudops",
    code: "SOA-C02",
    title: "AWS Certified CloudOps Engineer — Associate",
    vendor: "AWS",
    level: "Associate",
    duration: "180 min",
    questions: 65,
    passMark: 72,
    validity: "3 years",
    description: "Validates ability to deploy, manage, and operate workloads on AWS — directly applicable to SAP operations: monitoring with CloudWatch, Systems Manager, Config, automation, patching, and incident management.",
    topics: [
      "AWS Systems Manager (SSM) — automation, patch management, Run Command",
      "AWS CloudWatch — metrics, logs, alarms, dashboards",
      "AWS Config — compliance and resource configuration auditing",
      "Deployment strategies: CloudFormation, rolling, blue/green",
      "AWS Organizations and Service Control Policies (SCP)",
      "Cost management: AWS Cost Explorer, Budgets, Reserved Instances",
      "Incident and event management with EventBridge",
      "Backup and disaster recovery operations",
    ],
    tips: [
      "AWS Systems Manager for SAP is directly tested in this cert's skill set",
      "CloudWatch agent configuration for SAP-specific metrics",
      "AWS Config rules for compliance checks on SAP EC2 instances",
      "Good complement to SAA-C03 for operational SAP-on-AWS roles",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-cloudops-engineer-associate/",
    studyUrl: "https://aws.amazon.com/training/",
    relevance: "high",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "aws-sap-pro",
    code: "SAP-C02",
    title: "AWS Certified Solutions Architect — Professional",
    vendor: "AWS",
    level: "Professional",
    duration: "180 min",
    questions: 75,
    passMark: 75,
    validity: "3 years",
    description: "Advanced AWS architecture certification. Covers complex multi-account architectures, migration strategies, enterprise networking, and advanced HA/DR patterns directly applicable to large-scale SAP on AWS landscapes.",
    topics: [
      "AWS Organizations, Control Tower, multi-account strategy",
      "Advanced networking: Transit Gateway, Direct Connect, VPN",
      "Complex disaster recovery patterns for SAP workloads",
      "SAP migration strategies: lift-and-shift, re-platform, hybrid",
      "Data migration: AWS DMS, Snowball, DataSync",
      "Advanced security: GuardDuty, Security Hub, AWS KMS for HANA encryption",
      "Cost optimization: Savings Plans, Compute Optimizer at scale",
      "Application integration: SQS, SNS, EventBridge for SAP event-driven architectures",
    ],
    tips: [
      "Requires SAA-C03 knowledge as foundation — sit that exam first",
      "Deep understanding of AWS Organizations is critical for enterprise SAP accounts",
      "Study AWS Migration Hub and migration patterns for SAP",
      "Direct Connect bandwidth planning for SAP workloads",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
    studyUrl: "https://aws.amazon.com/training/",
    relevance: "high",
    gradient: "from-amber-600 to-orange-600",
  },
  {
    id: "aws-sap-specialty",
    code: "PAS-C01",
    title: "AWS Certified: SAP on AWS — Specialty",
    vendor: "AWS",
    level: "Specialty",
    duration: "170 min",
    questions: 65,
    passMark: 75,
    validity: "3 years",
    description: "The only SAP-specific cloud certification from AWS. Validates expert-level knowledge of designing, deploying, and operating SAP workloads on AWS — the highest-value certification for SAP Basis professionals on AWS.",
    topics: [
      "SAP HANA sizing: M-series (x1e, u-*tb1), certified EC2 selection",
      "Storage for SAP HANA: EBS io2, FSx for NetApp ONTAP, backint to S3",
      "SAP HA on AWS: HSR + Pacemaker + Overlay IP with Transit Gateway",
      "HANA backup using AWS Backint Agent — configuration and monitoring",
      "Network architecture: VPC design for SAP, Direct Connect, Transit Gateway",
      "SAP migration strategies: homogeneous, heterogeneous, MIGMON, SNP Cockpit",
      "AWS Launch Wizard for SAP and Systems Manager for SAP",
      "RISE with SAP on AWS operational considerations",
      "SAP LaMa integration with AWS cloud extension",
      "Cost optimization for SAP on AWS: Savings Plans, right-sizing",
    ],
    tips: [
      "SAA-C03 is a prerequisite in practice — build that foundation first",
      "Read 'SAP on AWS Best Practices' whitepaper cover-to-cover",
      "Overlay IP routing with Transit Gateway — deep focus needed",
      "AWS Backint Agent configuration steps are exam questions",
      "AWS Systems Manager for SAP — increasingly prominent in this exam",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-sap-on-aws-specialty/",
    studyUrl: "https://docs.aws.amazon.com/sap/",
    relevance: "critical",
    gradient: "from-orange-600 to-red-500",
  },
  {
    id: "aws-security",
    code: "SCS-C02",
    title: "AWS Certified Security — Specialty",
    vendor: "AWS",
    level: "Specialty",
    duration: "170 min",
    questions: 65,
    passMark: 75,
    validity: "3 years",
    description: "Advanced AWS security expertise. Directly relevant for SAP Basis professionals responsible for securing SAP on AWS: KMS key management for HANA encryption, IAM policies, GuardDuty, and network security.",
    topics: [
      "AWS KMS for HANA data-at-rest encryption",
      "IAM policies, Permission Boundaries, AWS Organizations SCPs",
      "AWS GuardDuty, Security Hub, Macie for SAP threat detection",
      "VPC security: NACLs, security groups, Network Firewall",
      "AWS Certificate Manager (ACM) for TLS/SSL in SAP web layers",
      "CloudTrail for SAP operational audit and forensics",
      "AWS WAF for protecting SAP Fiori web endpoints",
      "Secrets Manager for managing SAP technical user credentials",
    ],
    tips: [
      "Requires strong IAM knowledge — study this first",
      "Focus on KMS key policies and grants — common in HANA encryption scenarios",
      "AWS Secrets Manager for SAP database passwords is a best-practice scenario",
    ],
    examUrl: "https://aws.amazon.com/certification/certified-security-specialty/",
    relevance: "useful",
    gradient: "from-red-500 to-rose-600",
  },

  // ── Azure ──────────────────────────────────────────────────────────────────
  {
    id: "az-900",
    code: "AZ-900",
    title: "Microsoft Certified: Azure Fundamentals",
    vendor: "Azure",
    level: "Foundational",
    duration: "60 min",
    questions: 40,
    passMark: 70,
    validity: "Permanent",
    description: "Entry-level Azure certification covering cloud concepts, Azure core services, security, compliance, privacy, pricing, and support. Ideal first step for SAP professionals new to Azure.",
    topics: [
      "Cloud concepts: IaaS, PaaS, SaaS, shared responsibility",
      "Azure core services: Virtual Machines, Storage, Networking",
      "Azure security: Defender, Sentinel, Key Vault",
      "Azure governance: Policy, Blueprints, Management Groups",
      "Azure pricing and SLAs",
    ],
    tips: [
      "Use Microsoft Learn free AZ-900 learning path — official and comprehensive",
      "No hands-on experience required — conceptual understanding is sufficient",
      "Good pre-requisite before AZ-104",
    ],
    examUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
    studyUrl: "https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/",
    relevance: "useful",
    gradient: "from-sky-400 to-blue-500",
  },
  {
    id: "az-104",
    code: "AZ-104",
    title: "Microsoft Certified: Azure Administrator Associate",
    vendor: "Azure",
    level: "Associate",
    duration: "120 min",
    questions: 60,
    passMark: 70,
    validity: "1 year (renewable)",
    description: "Core Azure administration certification. Covers VMs (M-series for HANA), storage (Premium SSD v2, Ultra Disk, ANF), networking, and Azure Monitor — directly applicable to SAP on Azure deployments.",
    topics: [
      "Azure Virtual Machines: M-series sizing for SAP HANA",
      "Managed Disks: Premium SSD v2, Ultra Disk configuration and IOPS",
      "Azure NetApp Files (ANF) for SAP HANA shared and backup volumes",
      "Virtual Networks, NSGs, VNet peering, and routing",
      "Azure Monitor, Log Analytics, and Alerts for SAP workloads",
      "Azure Backup and Recovery Services Vault",
      "Azure Active Directory / Entra ID and RBAC",
      "Azure Site Recovery (ASR) for SAP DR",
    ],
    tips: [
      "Focus heavily on Azure NetApp Files — central to all SAP HANA on Azure deployments",
      "Understand Proximity Placement Groups for SAP HA node latency",
      "Ultra Disk configuration for HANA log volumes — IOPS and throughput requirements",
      "Azure ILB (Standard) as virtual IP for Pacemaker — key SAP-Azure HA concept",
      "Use Microsoft Learn free AZ-104 path (official, regularly updated)",
    ],
    examUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/",
    studyUrl: "https://learn.microsoft.com/en-us/azure/sap/",
    relevance: "critical",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "az-305",
    code: "AZ-305",
    title: "Microsoft Certified: Azure Solutions Architect Expert",
    vendor: "Azure",
    level: "Expert",
    duration: "150 min",
    questions: 60,
    passMark: 70,
    validity: "1 year (renewable)",
    description: "Advanced Azure architecture certification. Validates ability to design full Azure landing zones, networking, governance, and HA architectures at enterprise scale — applicable to designing complex SAP on Azure landscapes.",
    topics: [
      "Azure Landing Zone and Hub-Spoke topology for SAP",
      "Complex networking: ExpressRoute, VPN Gateway, Virtual WAN",
      "Identity and governance: Entra ID, Conditional Access, PIM",
      "SAP HA/DR architecture design on Azure",
      "Azure Kubernetes Service (AKS) for SAP BTP extensions",
      "Azure cost architecture and optimization at scale",
      "Data and analytics: Azure Synapse, Data Factory integration with SAP",
    ],
    tips: [
      "Requires AZ-104 as prerequisite (and AZ-204 recommended)",
      "Study Azure Well-Architected Framework thoroughly",
      "SAP on Azure architecture center guides are relevant study material",
      "ExpressRoute private peering for SAP connectivity is a common scenario",
    ],
    examUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/",
    studyUrl: "https://learn.microsoft.com/en-us/azure/sap/",
    relevance: "high",
    gradient: "from-cyan-500 to-teal-600",
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
    validity: "1 year (renewable)",
    description: "The SAP-specific Azure certification. Validates expert design and deployment of SAP solutions on Azure — the highest-value certification for SAP Basis professionals in Microsoft environments.",
    topics: [
      "SAP HANA on Azure: Mv2 instance selection and HANA HLI",
      "Azure NetApp Files deep dive: service levels, QoS policies, CRR",
      "Pacemaker HA with Azure ILB — full cluster configuration",
      "Azure Site Recovery for SAP: runbook automation, test failover",
      "Azure Center for SAP Solutions (ACSS) — lifecycle management",
      "Azure Monitor for SAP Solutions (AMS) — provider setup, alerts",
      "S/4HANA migration to Azure: homogeneous and heterogeneous paths",
      "Cost management for SAP on Azure: Reserved Instances, right-sizing",
      "RISE with SAP on Azure operational model",
      "ExpressRoute for SAP production connectivity — design and sizing",
    ],
    tips: [
      "Complete AZ-104 before AZ-120 — assumed knowledge",
      "ACSS deployment automation — study the portal wizard steps",
      "Azure Monitor for SAP (AMS) providers and dashboards — exam-heavy",
      "Microsoft Learn SAP on Azure learning path is essential",
      "Hands-on: deploy a HANA HA lab on Azure free trial + ANF trial",
    ],
    examUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-for-sap-workloads-specialty/",
    studyUrl: "https://learn.microsoft.com/en-us/azure/sap/",
    relevance: "critical",
    gradient: "from-teal-500 to-blue-600",
  },
  {
    id: "az-security",
    code: "AZ-500",
    title: "Microsoft Certified: Azure Security Engineer Associate",
    vendor: "Azure",
    level: "Associate",
    duration: "120 min",
    questions: 60,
    passMark: 70,
    validity: "1 year (renewable)",
    description: "Validates Azure security expertise — directly relevant for securing SAP on Azure: Azure Key Vault for SAP HANA encryption keys, Defender for Cloud, Azure Sentinel SIEM integration with SAP logs.",
    topics: [
      "Azure Key Vault for HANA data-at-rest encryption key management",
      "Microsoft Defender for Cloud — security posture for SAP VMs",
      "Microsoft Sentinel — SIEM integration with SAP Security Audit Log",
      "Azure AD Conditional Access for SAP Fiori access",
      "Network security: Azure Firewall, WAF for SAP web endpoints",
      "Entra Privileged Identity Management (PIM) for SAP admin access",
      "Azure DDoS Protection for SAP internet-facing systems",
    ],
    tips: [
      "Microsoft Sentinel SAP integration (SAP connector) is increasingly relevant",
      "Azure Key Vault customer-managed keys for HANA — key scenario",
      "Defender for Cloud security score improvement for SAP VMs",
    ],
    examUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/",
    relevance: "useful",
    gradient: "from-blue-600 to-indigo-600",
  },

  // ── GCP ────────────────────────────────────────────────────────────────────
  {
    id: "gcp-cdl",
    code: "CDL",
    title: "Google Cloud Certified: Cloud Digital Leader",
    vendor: "GCP",
    level: "Foundational",
    duration: "90 min",
    questions: 60,
    passMark: 70,
    validity: "3 years",
    description: "Entry-level GCP certification covering Google Cloud fundamentals, digital transformation concepts, and core GCP services. Ideal for SAP professionals beginning their GCP journey.",
    topics: [
      "Google Cloud core products and services overview",
      "Digital transformation with Google Cloud",
      "Infrastructure modernization and cloud migration concepts",
      "Data management and analytics fundamentals",
      "Security and compliance in Google Cloud",
    ],
    tips: [
      "No technical depth required — conceptual orientation",
      "Google Skills Boost (cloud.google.com) has a free learning path",
      "Good starting point before ACE exam",
    ],
    examUrl: "https://cloud.google.com/certification/cloud-digital-leader",
    studyUrl: "https://cloud.google.com/learn/certification/cloud-digital-leader",
    relevance: "useful",
    gradient: "from-green-400 to-emerald-500",
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
    validity: "3 years",
    description: "Foundational GCP certification covering Compute Engine (M-series VMs), Persistent Disk/Hyperdisk, VPC, IAM, and Cloud Operations — all directly applicable to SAP on GCP deployments.",
    topics: [
      "Compute Engine: M2/M3-series VMs for certified SAP HANA workloads",
      "Storage: Hyperdisk Extreme, PD SSD Extreme, Filestore Enterprise (NFS)",
      "VPC networking, Cloud Load Balancing (ILB for SAP HA)",
      "Cloud IAM: roles, service accounts, policies",
      "Cloud Operations: Cloud Monitoring, Logging, Error Reporting",
      "Cloud Storage for HANA backups (Backint for GCS)",
      "Deployment Manager and Infrastructure as Code",
    ],
    tips: [
      "Hyperdisk Extreme vs PD Extreme for HANA log volumes — know the difference",
      "Filestore Enterprise for SAP production NFS — service levels and SLAs",
      "Regional PD for cross-zone synchronous replication (HA data volumes)",
      "Google Skills Boost: 'Getting Started with Google Kubernetes Engine' is useful context",
      "GCP Workload Manager for SAP is increasingly important",
    ],
    examUrl: "https://cloud.google.com/certification/cloud-engineer",
    studyUrl: "https://cloud.google.com/solutions/sap",
    relevance: "critical",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    id: "gcp-pca",
    code: "PCA",
    title: "Google Cloud Professional Cloud Architect",
    vendor: "GCP",
    level: "Professional",
    duration: "120 min",
    questions: 60,
    passMark: 70,
    validity: "2 years",
    description: "GCP's most recognized professional certification. Validates ability to design, manage, and govern Google Cloud solutions — directly applicable to architecting SAP landscapes on GCP.",
    topics: [
      "GCP landing zone and VPC architecture for SAP",
      "Hybrid connectivity: Cloud Interconnect, VPN for SAP Direct Connect equivalent",
      "SAP HANA HA on GCP: HSR + Pacemaker + ILB virtual IP",
      "Security: Cloud KMS for HANA encryption, VPC Service Controls",
      "Disaster recovery patterns for SAP: regional failover, backup strategies",
      "Cloud Spanner, BigQuery for SAP data analytics extension",
      "GCP resource hierarchy: organizations, folders, projects for SAP isolation",
      "Identity and access: Workload Identity, IAM conditions",
    ],
    tips: [
      "ACE certification is a strong foundation before PCA",
      "Study the 4 official case studies (Mountkirk, Dress4Win, TerramEarth, Helicopter) — scenario exam",
      "GCP Workload Manager for SAP best practices — SAP note 3119619",
      "Google Cloud SAP on GCP documentation is the best study guide",
    ],
    examUrl: "https://cloud.google.com/certification/cloud-architect",
    studyUrl: "https://cloud.google.com/solutions/sap",
    relevance: "high",
    gradient: "from-green-600 to-teal-600",
  },
  {
    id: "gcp-pcde",
    code: "PCDE",
    title: "Google Cloud Professional Cloud Database Engineer",
    vendor: "GCP",
    level: "Professional",
    duration: "120 min",
    questions: 60,
    passMark: 70,
    validity: "2 years",
    description: "Validates expertise in GCP database technologies. Relevant for SAP Basis professionals managing HANA on GCP: Hyperdisk configuration, Cloud Spanner for SAP data tier, BigQuery for SAP analytics.",
    topics: [
      "Cloud SQL, Cloud Spanner, BigQuery — design and operations",
      "Database migration to GCP: Database Migration Service",
      "HANA on GCP storage: Hyperdisk, Filestore for database volumes",
      "High availability and replication patterns on GCP",
      "Database security: Cloud KMS, IAM, VPC Service Controls",
      "Monitoring databases with Cloud Monitoring and Logs Explorer",
    ],
    tips: [
      "Useful complement if your role involves HANA on GCP at depth",
      "Focus on migration scenarios — common in this exam",
      "Less critical than ACE/PCA for typical SAP Basis roles",
    ],
    examUrl: "https://cloud.google.com/certification/cloud-database-engineer",
    studyUrl: "https://cloud.google.com/solutions/sap",
    relevance: "useful",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "gcp-security",
    code: "PCSE",
    title: "Google Cloud Professional Cloud Security Engineer",
    vendor: "GCP",
    level: "Professional",
    duration: "120 min",
    questions: 60,
    passMark: 70,
    validity: "2 years",
    description: "Validates GCP security expertise. Relevant for SAP Basis in security-focused roles: Cloud KMS for HANA encryption, VPC Service Controls for SAP data isolation, Security Command Center, and IAM best practices.",
    topics: [
      "Cloud KMS and CMEK for HANA data-at-rest encryption",
      "VPC Service Controls — isolate SAP data perimeter",
      "Identity and Access: IAM, Workload Identity, service accounts for HANA",
      "Security Command Center for SAP VM threat detection",
      "Binary Authorization, Artifact Registry for SAP container deployments",
      "Cloud Logging and Chronicle for SAP security audit integration",
    ],
    tips: [
      "ACE + PCA are recommended before this exam",
      "VPC Service Controls for SAP is an important security design pattern",
      "Cloud KMS customer-managed keys (CMEK) for HANA encryption",
    ],
    examUrl: "https://cloud.google.com/certification/cloud-security-engineer",
    relevance: "useful",
    gradient: "from-cyan-600 to-blue-600",
  },
];

const VENDOR_COLORS: Record<string, string> = {
  SAP: "bg-blue-100 text-blue-700 border-blue-200",
  AWS: "bg-orange-100 text-orange-700 border-orange-200",
  Azure: "bg-cyan-100 text-cyan-700 border-cyan-200",
  GCP: "bg-green-100 text-green-700 border-green-200",
};

const LEVEL_COLORS: Record<string, string> = {
  Foundational: "bg-gray-100 text-gray-600",
  Associate: "bg-emerald-100 text-emerald-700",
  Professional: "bg-blue-100 text-blue-700",
  Specialty: "bg-violet-100 text-violet-700",
  Expert: "bg-rose-100 text-rose-700",
};

const RELEVANCE_BADGE: Record<string, string> = {
  critical: "bg-red-50 border-red-200 text-red-700",
  high: "bg-amber-50 border-amber-200 text-amber-700",
  useful: "bg-gray-50 border-gray-200 text-gray-600",
};

const VENDOR_TABS = [
  { id: "all", label: "All Cloud" },
  { id: "AWS", label: "AWS" },
  { id: "Azure", label: "Azure" },
  { id: "GCP", label: "GCP" },
];

const VENDOR_LINKS: Record<string, { label: string; url: string }> = {
  AWS: { label: "AWS Certification Portal", url: "https://aws.amazon.com/certification/" },
  Azure: { label: "Microsoft Learn Credentials", url: "https://learn.microsoft.com/en-us/credentials/browse/" },
  GCP: { label: "GCP Certification", url: "https://cloud.google.com/learn/certification" },
};

const CLOUD_CERTS = CERTS.filter((c) => c.vendor !== "SAP");

const VENDOR_EXAM_URLS: Record<string, string> = {
  SAP: "https://learning.sap.com/certifications",
  AWS: "https://aws.amazon.com/certification/",
  Azure: "https://learn.microsoft.com/en-us/credentials/",
  GCP: "https://cloud.google.com/learn/certification",
};

export default function CloudCertifications() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const levels = ["all", "Foundational", "Associate", "Professional", "Specialty", "Expert"];

  const shown = CLOUD_CERTS.filter((c) => {
    const vendorMatch = filter === "all" || c.vendor === filter;
    const levelMatch = levelFilter === "all" || c.level === levelFilter;
    return vendorMatch && levelMatch;
  });

  const critical = shown.filter((c) => c.relevance === "critical");
  const high = shown.filter((c) => c.relevance === "high");
  const useful = shown.filter((c) => c.relevance === "useful");

  function renderCert(cert: Cert) {
    const isExpanded = expanded === cert.id;
    return (
      <div
        key={cert.id}
        className={`border rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all ${
          cert.relevance === "critical" ? "border-[#0070F2]/30" :
          cert.relevance === "high" ? "border-amber-200" : "border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : cert.id)}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cert.gradient} flex items-center justify-center text-white flex-shrink-0 mt-0.5`}>
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-1.5 flex-wrap mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${VENDOR_COLORS[cert.vendor]}`}>{cert.vendor}</span>
              <span className="font-mono text-xs font-bold text-gray-500">{cert.code}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[cert.level]}`}>{cert.level}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${RELEVANCE_BADGE[cert.relevance]}`}>
                {cert.relevance === "critical" ? "★ Critical" : cert.relevance === "high" ? "High Value" : "Useful"}
              </span>
              {cert.systemBased && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  <AlertCircle className="w-3 h-3" /> System-Based
                </span>
              )}
            </div>
            <div className="font-semibold text-sm text-gray-900 leading-snug">{cert.title}</div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cert.duration}</span>
              {!cert.systemBased && cert.questions > 0 && <span>{cert.questions} questions</span>}
              {!cert.systemBased && cert.passMark > 0 && <span>Pass: {cert.passMark}%</span>}
              {cert.systemBased && cert.requiresScheduling && <span className="text-violet-600 font-medium">Requires scheduling</span>}
              {cert.systemBased && cert.maxAttempts && <span className="text-violet-600 font-medium">Max {cert.maxAttempts} attempts / 12 months</span>}
              <span>Valid: {cert.validity}</span>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </div>

        {isExpanded && (
          <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
            {cert.systemBased && (
              <div className="flex gap-2 items-start p-3 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-800">
                <AlertCircle className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">System-Based Assessment</div>
                  <div>This exam requires scheduling a time slot — available spots are limited. You must reserve a spot before taking the exam, and your attempt counts from the confirmed start time.</div>
                  {cert.maxAttempts && <div className="font-medium mt-1">Max {cert.maxAttempts} attempts within any 12-month period. After {cert.maxAttempts} failed attempts, retake is allowed 12 months later.</div>}
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600 leading-relaxed">{cert.description}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Exam Topics</div>
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
              <a href={VENDOR_EXAM_URLS[cert.vendor]} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0070F2] text-white rounded-xl hover:bg-[#0060D8] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Register for Exam
              </a>
              {cert.studyUrl && (
                <a href={cert.studyUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-3.5 h-3.5" /> Study Resources
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Career Development</span>
        </div>
        <h1 className="text-2xl font-extrabold mb-1">Cloud Certifications</h1>
        <p className="text-sm opacity-80 max-w-lg mb-5">
          Certification guide for AWS, Azure, GCP, and cloud platforms relevant to SAP Basis and cloud architecture roles.
        </p>
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Trophy className="w-4 h-4" />, value: CLOUD_CERTS.length, label: "Certifications" },
            { icon: <Cloud className="w-4 h-4" />, value: 3, label: "Cloud Platforms" },
            { icon: <Layers className="w-4 h-4" />, value: CLOUD_CERTS.filter((c) => c.relevance === "critical").length, label: "Critical Path" },
            { icon: <Zap className="w-4 h-4" />, value: CLOUD_CERTS.reduce((a, c) => a + c.tips.length, 0), label: "Study Tips" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "12px 16px" }}>
              <div className="opacity-70 mb-1">{stat.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "white", lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: "11px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", marginTop: "2px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(VENDOR_LINKS).map(([vendor, link]) => (
          <a key={vendor} href={link.url} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm ${VENDOR_COLORS[vendor]}`}
            style={{ padding: "8px 16px", transition: "all 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = ""; }}
          >
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            <span className="flex-1">{link.label}</span>
            <span className="opacity-60 text-[11px] flex-shrink-0">↗</span>
          </a>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="font-semibold text-gray-400">Relevance:</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />Critical Path</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />High Value</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" />Useful</span>
      </div>

      {/* Vendor filter */}
      <div className="flex gap-2 flex-wrap">
        {VENDOR_TABS.map((v) => (
          <button key={v.id} onClick={() => setFilter(v.id)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-all ${
              filter === v.id ? "bg-violet-600 text-white border-violet-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Level filter */}
      <div className="flex gap-1.5 flex-wrap">
        {levels.map((l) => (
          <button key={l} onClick={() => setLevelFilter(l)}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition-all ${
              levelFilter === l
                ? l === "all" ? "bg-gray-700 text-white border-gray-700" : LEVEL_COLORS[l] + " border-current"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}>
            {l === "all" ? "All Levels" : l}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">Showing {shown.length} of {CLOUD_CERTS.length}</span>
      </div>

      {/* Grouped cert list */}
      {shown.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No certifications match the selected filters</div>
      ) : (
        <div className="space-y-6">
          {critical.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">★ Critical Path</span>
                <div className="flex-1 h-px bg-red-100" />
              </div>
              <div className="space-y-2">{critical.map(renderCert)}</div>
            </div>
          )}
          {high.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">High Value</span>
                <div className="flex-1 h-px bg-amber-100" />
              </div>
              <div className="space-y-2">{high.map(renderCert)}</div>
            </div>
          )}
          {useful.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Useful / Complementary</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="space-y-2">{useful.map(renderCert)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
