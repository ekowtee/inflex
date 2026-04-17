import {
  Brain,
  Cloud,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type ProgrammeLevel = "Beginner" | "Intermediate" | "Advanced";
export type DeliveryFormat = "In-person" | "Virtual" | "Hybrid";
export type AudienceType = "individual" | "corporate";

export interface CurriculumModule {
  title: string;
  topics: string[];
  duration: string;
}

export interface Programme {
  slug: string;
  domainSlug: string;
  title: string;
  subtitle: string;
  level: ProgrammeLevel;
  duration: string;
  formats: DeliveryFormat[];
  description: string;
  learningObjectives: string[];
  targetAudience: string[];
  prerequisites: string[];
  curriculum: CurriculumModule[];
  heroImage: string;
  featured?: boolean;
  audienceTypes: AudienceType[];
}

export interface AcademyDomain {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  overview: string;
  icon: LucideIcon;
  heroImage: string;
  overviewImage: string;
  benefits: { title: string; description: string }[];
  relatedSolutions: string[];
}

export const domains: AcademyDomain[] = [
  {
    slug: "ai-intelligent-systems",
    title: "AI & Intelligent Systems",
    shortTitle: "AI & Intelligent Systems",
    tagline: "Build fluency in the technology reshaping every industry.",
    description:
      "From foundational literacy to advanced LLM engineering, our AI programmes equip teams and individuals to lead confidently in the AI era.",
    overview:
      "Artificial intelligence is no longer optional. Our AI & Intelligent Systems track moves learners from conceptual understanding to hands-on application — covering large language models, prompt engineering, industry-specific use cases, and AI-era business strategy. Every programme is grounded in real enterprise deployments, not theoretical sandboxes.",
    icon: Brain,
    heroImage: "/assets/solutions/sol6.jpeg",
    overviewImage: "/assets/solutions/sol1.jpeg",
    benefits: [
      {
        title: "Practitioner-Led",
        description:
          "Delivered by consultants actively deploying AI systems for enterprise clients.",
      },
      {
        title: "Industry-Contextualised",
        description:
          "Examples drawn from healthcare, finance, marketing, education, and more.",
      },
      {
        title: "Strategy-Aligned",
        description:
          "Equips leaders to translate AI capability into commercial outcomes.",
      },
    ],
    relatedSolutions: ["data-centric-solutions"],
  },
  {
    slug: "infrastructure-cloud",
    title: "Infrastructure & Cloud",
    shortTitle: "Infrastructure & Cloud",
    tagline: "Master the systems that power modern enterprise.",
    description:
      "Hands-on programmes covering cloud platforms, network architecture, virtualisation, and enterprise operating systems.",
    overview:
      "Infrastructure is the foundation every digital initiative rests on. Our Infrastructure & Cloud programmes give engineers and architects the depth to design, deploy, and operate resilient systems across AWS, Azure, on-premises networks, virtualised estates, and containerised workloads. Every course balances vendor certifications with vendor-agnostic engineering judgement.",
    icon: Cloud,
    heroImage: "/assets/solutions/sol7.jpeg",
    overviewImage: "/assets/solutions/sol5.jpeg",
    benefits: [
      {
        title: "Hands-On Labs",
        description:
          "Real consoles, real networks, real configurations — not slides about slides.",
      },
      {
        title: "Certification Aligned",
        description:
          "Curricula mapped to AWS, Azure, and Microsoft certification paths.",
      },
      {
        title: "Multi-Vendor Perspective",
        description:
          "Learn the trade-offs between platforms, not just the marketing talking points.",
      },
    ],
    relatedSolutions: ["cloud-services", "network-infrastructure"],
  },
  {
    slug: "cybersecurity-compliance",
    title: "Cybersecurity & Compliance",
    shortTitle: "Cybersecurity & Compliance",
    tagline: "Defend, govern, and certify — at every level of the stack.",
    description:
      "From information security fundamentals to ISO 27001 implementation, CISA, and CISM exam preparation.",
    overview:
      "Regulatory pressure and threat sophistication are rising simultaneously. Our Cybersecurity & Compliance programmes prepare practitioners for the realities of modern security — from day-to-day security operations to formal audit frameworks. Curricula are aligned with internationally recognised standards including ISO 27001, ISACA CISA, and ISACA CISM.",
    icon: ShieldCheck,
    heroImage: "/assets/solutions/sol8.jpeg",
    overviewImage: "/assets/solutions/sol2.jpeg",
    benefits: [
      {
        title: "Standards-Aligned",
        description:
          "Curricula mapped to ISO 27001, ISACA, and NIST frameworks.",
      },
      {
        title: "Audit-Ready",
        description:
          "Programmes prepare learners for real certification exams and audit engagements.",
      },
      {
        title: "Risk-Informed",
        description:
          "Security taught as an enabler of business outcomes, not a compliance checkbox.",
      },
    ],
    relatedSolutions: ["data-security"],
  },
  {
    slug: "digital-strategy",
    title: "Digital Strategy & Transformation",
    shortTitle: "Digital Strategy",
    tagline: "Translate technology capability into commercial advantage.",
    description:
      "Programmes for leaders, founders, and marketers shaping digital-first organisations.",
    overview:
      "Technology alone does not transform a business — strategy does. Our Digital Strategy & Transformation programmes equip executives, founders, and marketing leaders with frameworks to build digital-first organisations, launch successful ventures, and make data-driven decisions. Grounded in commercial realities, not consulting jargon.",
    icon: TrendingUp,
    heroImage: "/assets/services/Services1.jpeg",
    overviewImage: "/assets/services/Services2.jpeg",
    benefits: [
      {
        title: "Commercially Grounded",
        description:
          "Frameworks drawn from live engagements with founders and enterprise leaders.",
      },
      {
        title: "Executive-Ready",
        description:
          "Programmes sized for busy leaders — dense, actionable, no fluff.",
      },
      {
        title: "Outcome-Focused",
        description:
          "Every module ties back to measurable commercial results.",
      },
    ],
    relatedSolutions: ["data-centric-solutions"],
  },
];

export const programmes: Programme[] = [
  {
    slug: "ai-foundations",
    domainSlug: "ai-intelligent-systems",
    title: "AI Foundations",
    subtitle: "A plain-English grounding in how modern AI actually works.",
    level: "Beginner",
    duration: "2 days",
    formats: ["Virtual", "In-person"],
    description:
      "A comprehensive introduction to artificial intelligence for professionals who need to lead, commission, or collaborate on AI work without becoming data scientists. Covers the intuition behind large language models, the realities of current capability and limitation, and a practical framework for identifying AI opportunities in your own organisation.",
    learningObjectives: [
      "Explain how modern AI systems work without relying on jargon",
      "Distinguish between traditional ML, generative AI, and agentic systems",
      "Identify high-value AI use cases in your organisation",
      "Recognise the risks, limitations, and failure modes of current AI",
      "Brief stakeholders and commission AI work with confidence",
    ],
    targetAudience: [
      "Managers and directors across any function",
      "Founders evaluating AI for their business",
      "Marketers, product owners, and operational leaders",
    ],
    prerequisites: ["No technical background required"],
    curriculum: [
      {
        title: "Module 1: The AI Landscape Today",
        topics: [
          "A brief history of AI and where we are now",
          "Understanding large language models",
          "Traditional ML vs. generative AI vs. agents",
        ],
        duration: "3 hours",
      },
      {
        title: "Module 2: How LLMs Actually Work",
        topics: [
          "Tokens, embeddings, and context windows",
          "Training vs. inference",
          "Prompting as a core competency",
        ],
        duration: "3 hours",
      },
      {
        title: "Module 3: Opportunities & Risks",
        topics: [
          "Use case identification workshop",
          "Hallucinations, bias, and data leakage",
          "Governance essentials",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 4: Building an AI Roadmap",
        topics: [
          "Vendor landscape and build-vs-buy",
          "Pilot design and success metrics",
          "Change management for AI adoption",
        ],
        duration: "4 hours",
      },
    ],
    heroImage: "/assets/solutions/sol6.jpeg",
    featured: true,
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "advanced-llm-engineering",
    domainSlug: "ai-intelligent-systems",
    title: "Advanced LLM Engineering",
    subtitle:
      "Production-grade techniques for engineers building serious AI systems.",
    level: "Advanced",
    duration: "3 days",
    formats: ["In-person"],
    description:
      "A deep, technical programme for software engineers and ML practitioners building real LLM-powered applications. Covers retrieval-augmented generation, agentic architectures, evaluation pipelines, cost and latency optimisation, and the operational realities of running LLM systems at scale.",
    learningObjectives: [
      "Architect production-grade RAG systems",
      "Design and evaluate multi-step agentic workflows",
      "Build robust evaluation pipelines for LLM applications",
      "Optimise for cost, latency, and reliability in production",
      "Implement guardrails and failure handling at scale",
    ],
    targetAudience: [
      "Software engineers shipping LLM-powered features",
      "ML engineers moving into generative AI",
      "Technical architects evaluating LLM platforms",
    ],
    prerequisites: [
      "Proficient in Python",
      "Prior exposure to APIs and backend development",
      "Basic familiarity with LLM prompting",
    ],
    curriculum: [
      {
        title: "Module 1: Beyond Prompting",
        topics: [
          "Structured outputs and tool use",
          "Function calling patterns",
          "Prompt chains and composition",
        ],
        duration: "6 hours",
      },
      {
        title: "Module 2: Retrieval-Augmented Generation",
        topics: [
          "Embedding models and vector stores",
          "Chunking, reranking, and retrieval quality",
          "Hybrid search and query rewriting",
        ],
        duration: "6 hours",
      },
      {
        title: "Module 3: Agentic Architectures",
        topics: [
          "Tool-using agents and loop design",
          "Multi-agent coordination patterns",
          "Failure modes and recovery",
        ],
        duration: "6 hours",
      },
      {
        title: "Module 4: Evaluation & Production",
        topics: [
          "Offline evals and regression suites",
          "Online evaluation and user feedback loops",
          "Cost, latency, and observability",
        ],
        duration: "6 hours",
      },
    ],
    heroImage: "/assets/solutions/sol1.jpeg",
    featured: true,
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "ai-for-industry-applications",
    domainSlug: "ai-intelligent-systems",
    title: "AI for Industry Applications",
    subtitle:
      "Sector-specific AI adoption patterns — tailored to your vertical.",
    level: "Intermediate",
    duration: "2 days",
    formats: ["Virtual", "In-person"],
    description:
      "A vertical-aware programme exploring how AI is being applied across healthcare, financial services, insurance, advertising, marketing, education, and DevOps. Delivered with live case studies, common pitfalls, and a structured framework for identifying high-value use cases in your industry.",
    learningObjectives: [
      "Survey the AI adoption landscape in your industry",
      "Identify proven, high-ROI AI use cases for your sector",
      "Understand regulatory and data considerations by vertical",
      "Build a vertical-specific AI opportunity map",
    ],
    targetAudience: [
      "Industry leaders evaluating AI strategy",
      "Product managers in vertical SaaS",
      "Consultants advising sector-specific clients",
    ],
    prerequisites: [
      "Basic AI literacy (or completion of AI Foundations)",
    ],
    curriculum: [
      {
        title: "Module 1: AI in Financial Services & Insurance",
        topics: [
          "Fraud detection and underwriting",
          "Customer operations and claims automation",
          "Compliance and model risk",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 2: AI in Healthcare & Education",
        topics: [
          "Clinical decision support and diagnostics",
          "Personalised learning and assessment",
          "Regulation and data sensitivity",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 3: AI in Marketing, Advertising & DevOps",
        topics: [
          "Creative generation and personalisation",
          "Code generation and developer productivity",
          "AI-assisted operations and observability",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 4: Opportunity Mapping Workshop",
        topics: [
          "Use case identification canvas",
          "Prioritisation against cost and risk",
          "Roadmap drafting for your organisation",
        ],
        duration: "4 hours",
      },
    ],
    heroImage: "/assets/solutions/sol3.jpeg",
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "cloud-operations-aws-azure",
    domainSlug: "infrastructure-cloud",
    title: "Cloud Operations: AWS & Azure",
    subtitle:
      "Operate production cloud estates with confidence across the two leading platforms.",
    level: "Intermediate",
    duration: "3 days",
    formats: ["In-person"],
    description:
      "A hands-on programme for engineers and operations staff running workloads across AWS and Azure. Covers core services, identity and networking, observability, cost governance, and the operational practices that separate running cloud from running it well.",
    learningObjectives: [
      "Navigate the AWS and Azure service catalogues fluently",
      "Design secure identity and network boundaries",
      "Implement observability and cost governance",
      "Apply operational best practices for reliability",
      "Compare and select services across both platforms",
    ],
    targetAudience: [
      "Systems and DevOps engineers",
      "Cloud engineers transitioning between AWS and Azure",
      "IT operations staff taking on cloud responsibility",
    ],
    prerequisites: [
      "Foundational understanding of networking and Linux",
      "Some prior exposure to at least one cloud platform",
    ],
    curriculum: [
      {
        title: "Module 1: Platform Fundamentals",
        topics: [
          "AWS and Azure service anatomy",
          "Identity and access management (IAM, Entra ID)",
          "Resource organisation and accounts/subscriptions",
        ],
        duration: "6 hours",
      },
      {
        title: "Module 2: Networking & Security",
        topics: [
          "VPC/VNet design and peering",
          "Security groups, NSGs, and private endpoints",
          "Encryption, key management, and secrets",
        ],
        duration: "6 hours",
      },
      {
        title: "Module 3: Observability & Operations",
        topics: [
          "Metrics, logs, and tracing across both clouds",
          "Incident response runbooks",
          "Backup, DR, and business continuity",
        ],
        duration: "6 hours",
      },
      {
        title: "Module 4: Cost & Governance",
        topics: [
          "Tagging, budgets, and cost analysis",
          "FinOps fundamentals",
          "Policy as code (SCPs, Azure Policy)",
        ],
        duration: "6 hours",
      },
    ],
    heroImage: "/assets/solutions/sol7.jpeg",
    featured: true,
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "network-architecture-fundamentals",
    domainSlug: "infrastructure-cloud",
    title: "Network Architecture Fundamentals",
    subtitle: "Design, implement, and troubleshoot enterprise networks.",
    level: "Beginner",
    duration: "2 days",
    formats: ["In-person"],
    description:
      "An intensive introduction to enterprise networking for new network engineers, systems staff expanding into networking, and technical leaders who need to engage credibly with network architects. Covers LAN/WAN design, routing, switching, wireless, and modern SD-WAN principles.",
    learningObjectives: [
      "Understand the OSI and TCP/IP models in practice",
      "Design LAN and WAN topologies for reliability",
      "Configure and troubleshoot routing and switching basics",
      "Apply modern concepts including SD-WAN and zero-trust networking",
    ],
    targetAudience: [
      "New network engineers",
      "Systems administrators expanding scope",
      "Technical managers responsible for network investment",
    ],
    prerequisites: ["Basic IT literacy"],
    curriculum: [
      {
        title: "Module 1: Networking Primitives",
        topics: [
          "OSI and TCP/IP in practice",
          "IP addressing and subnetting",
          "Cabling, interfaces, and physical layer",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 2: Switching & Routing",
        topics: [
          "VLANs, trunking, and spanning tree",
          "Static and dynamic routing basics",
          "Troubleshooting workflows",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 3: WAN & SD-WAN",
        topics: [
          "WAN topologies and transport options",
          "SD-WAN principles and trade-offs",
          "QoS and traffic engineering",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 4: Wireless & Modern Networking",
        topics: [
          "Enterprise wireless design",
          "Zero-trust network access",
          "Observability and telemetry",
        ],
        duration: "4 hours",
      },
    ],
    heroImage: "/assets/solutions/sol5.jpeg",
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "virtualization-containerization",
    domainSlug: "infrastructure-cloud",
    title: "Virtualisation & Containerisation",
    subtitle:
      "From hypervisors to Kubernetes — the modern compute stack end to end.",
    level: "Intermediate",
    duration: "2 days",
    formats: ["Virtual", "In-person"],
    description:
      "A practical programme for engineers and architects working across virtualisation platforms and container orchestrators. Covers VMware, hyper-converged infrastructure, Docker, and Kubernetes with a focus on design patterns, operational realities, and workload placement decisions.",
    learningObjectives: [
      "Understand hypervisor and HCI architectures",
      "Build, ship, and run containerised workloads",
      "Operate Kubernetes at production scale",
      "Make sound workload placement decisions",
    ],
    targetAudience: [
      "Systems engineers adopting containers",
      "Platform engineers running Kubernetes",
      "Architects designing modern compute platforms",
    ],
    prerequisites: ["Comfortable with Linux command line and basic networking"],
    curriculum: [
      {
        title: "Module 1: Virtualisation & HCI",
        topics: [
          "Hypervisor fundamentals",
          "HCI architecture and trade-offs",
          "Storage and networking in virtualised estates",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 2: Containers with Docker",
        topics: [
          "Images, layers, and registries",
          "Networking and storage for containers",
          "Security fundamentals",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 3: Kubernetes Core",
        topics: [
          "Pods, deployments, and services",
          "Ingress, storage classes, and RBAC",
          "Observability and troubleshooting",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 4: Workload Placement",
        topics: [
          "VM vs. container decisions",
          "Stateful workloads on Kubernetes",
          "Platform cost and operational comparisons",
        ],
        duration: "4 hours",
      },
    ],
    heroImage: "/assets/solutions/sol4.jpeg",
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "information-security-fundamentals",
    domainSlug: "cybersecurity-compliance",
    title: "Information Security Fundamentals",
    subtitle:
      "The security mental models every technology professional should hold.",
    level: "Beginner",
    duration: "2 days",
    formats: ["Virtual", "In-person"],
    description:
      "A foundational programme covering the language, frameworks, and core practices of information security. Designed for IT staff, developers, and managers who need to embed security thinking into their day-to-day work without becoming full-time security practitioners.",
    learningObjectives: [
      "Apply the CIA triad and defence-in-depth principles",
      "Recognise common attack patterns and threat actors",
      "Understand core controls across identity, endpoint, and network",
      "Contribute meaningfully to incident response",
    ],
    targetAudience: [
      "IT and systems staff",
      "Software developers",
      "Managers responsible for security posture",
    ],
    prerequisites: ["Basic IT literacy"],
    curriculum: [
      {
        title: "Module 1: Security Foundations",
        topics: [
          "CIA triad, threat modelling basics",
          "Risk, threat, vulnerability",
          "Defence-in-depth",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 2: Identity & Access",
        topics: [
          "Authentication vs. authorisation",
          "MFA, SSO, and modern identity",
          "Privileged access management",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 3: Network & Endpoint Security",
        topics: [
          "Firewalls, IDS/IPS, and segmentation",
          "Endpoint protection and EDR",
          "Email and web security",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 4: Operations & Response",
        topics: [
          "Logging, monitoring, and detection",
          "Incident response lifecycle",
          "Security awareness in practice",
        ],
        duration: "4 hours",
      },
    ],
    heroImage: "/assets/solutions/sol8.jpeg",
    featured: true,
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "iso-27001-implementation-auditing",
    domainSlug: "cybersecurity-compliance",
    title: "ISO 27001 Implementation & Auditing",
    subtitle:
      "Lead your organisation through ISO 27001 with confidence — as implementer or auditor.",
    level: "Advanced",
    duration: "5 days",
    formats: ["In-person"],
    description:
      "A rigorous programme preparing learners to design, implement, and audit ISO 27001-aligned Information Security Management Systems. Covers the full ISO/IEC 27001 standard, Annex A controls, implementation planning, and the audit process end to end. Aligned with Lead Implementer and Lead Auditor competency requirements.",
    learningObjectives: [
      "Design an ISMS aligned with ISO/IEC 27001:2022",
      "Implement and operate Annex A controls",
      "Plan and execute internal and external audits",
      "Prepare an organisation for certification",
    ],
    targetAudience: [
      "Information security managers",
      "GRC professionals",
      "Internal auditors and compliance leaders",
    ],
    prerequisites: [
      "Prior experience with information security concepts",
      "Familiarity with management-system thinking helpful but not required",
    ],
    curriculum: [
      {
        title: "Module 1: ISMS Foundations",
        topics: [
          "Purpose and structure of ISO/IEC 27001",
          "Context, leadership, planning clauses",
          "Risk management requirements",
        ],
        duration: "8 hours",
      },
      {
        title: "Module 2: Annex A Controls",
        topics: [
          "Organisational, people, physical, and technological controls",
          "Statement of Applicability",
          "Control operating effectiveness",
        ],
        duration: "8 hours",
      },
      {
        title: "Module 3: Implementation Journey",
        topics: [
          "Scoping, gap analysis, and roadmap",
          "Documentation strategy",
          "Running the ISMS day-to-day",
        ],
        duration: "8 hours",
      },
      {
        title: "Module 4: Internal Audit",
        topics: [
          "Audit programme design",
          "Evidence-gathering techniques",
          "Non-conformity and corrective action",
        ],
        duration: "8 hours",
      },
      {
        title: "Module 5: Certification & Continual Improvement",
        topics: [
          "Stage 1 and Stage 2 audit expectations",
          "Management review and measurement",
          "Mock audit exercises",
        ],
        duration: "8 hours",
      },
    ],
    heroImage: "/assets/solutions/sol2.jpeg",
    featured: true,
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "marketing-digital-comms-strategy",
    domainSlug: "digital-strategy",
    title: "Marketing & Digital Communications Strategy",
    subtitle:
      "Build a modern marketing engine that actually moves commercial outcomes.",
    level: "Intermediate",
    duration: "2 days",
    formats: ["Virtual", "In-person"],
    description:
      "A practical programme for marketers, founders, and business leaders who want to move beyond tactics and build coherent marketing and digital communications strategies. Covers positioning, channel strategy, content systems, and measurement — with examples drawn from startups and enterprise alike.",
    learningObjectives: [
      "Develop distinctive positioning and messaging",
      "Design a channel strategy aligned to audience and stage",
      "Build content systems that scale",
      "Define and measure commercially meaningful metrics",
    ],
    targetAudience: [
      "Marketing managers and leaders",
      "Founders shaping go-to-market",
      "Communications and brand professionals",
    ],
    prerequisites: ["Working familiarity with marketing concepts"],
    curriculum: [
      {
        title: "Module 1: Positioning & Audience",
        topics: [
          "Category design and differentiation",
          "Audience research and segmentation",
          "Messaging frameworks",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 2: Channel Strategy",
        topics: [
          "Owned, earned, and paid trade-offs",
          "Channel fit by stage and segment",
          "Budget allocation principles",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 3: Content Systems",
        topics: [
          "Editorial planning and repurposing",
          "Content-to-demand pipelines",
          "AI in the marketing workflow",
        ],
        duration: "4 hours",
      },
      {
        title: "Module 4: Measurement & Iteration",
        topics: [
          "Attribution realities",
          "Commercial vs. vanity metrics",
          "Quarterly planning cadence",
        ],
        duration: "4 hours",
      },
    ],
    heroImage: "/assets/services/Services2.jpeg",
    audienceTypes: ["individual", "corporate"],
  },
  {
    slug: "starting-a-business-to-succeed",
    domainSlug: "digital-strategy",
    title: "Starting a Business to Succeed",
    subtitle:
      "A founder-to-founder intensive on the decisions that shape early-stage survival.",
    level: "Beginner",
    duration: "1 day",
    formats: ["Virtual", "In-person"],
    description:
      "A one-day intensive for founders and aspiring entrepreneurs who want a clear-eyed view of what it actually takes to start and scale a business. Covers idea validation, early-stage finance, go-to-market, team building, and common early-stage pitfalls — delivered by operators who have built businesses, not academics who teach about them.",
    learningObjectives: [
      "Validate a business idea against market reality",
      "Model early-stage finances and runway",
      "Design a credible early go-to-market plan",
      "Make better decisions on team, co-founders, and advisors",
    ],
    targetAudience: [
      "First-time founders",
      "Aspiring entrepreneurs evaluating an idea",
      "Corporate professionals exploring a venture",
    ],
    prerequisites: ["None"],
    curriculum: [
      {
        title: "Module 1: Idea & Market",
        topics: [
          "Problem validation techniques",
          "Market sizing without delusion",
          "Competitive positioning",
        ],
        duration: "2 hours",
      },
      {
        title: "Module 2: Money Mechanics",
        topics: [
          "Runway, burn, and unit economics",
          "Bootstrap vs. raise",
          "Early financial discipline",
        ],
        duration: "2 hours",
      },
      {
        title: "Module 3: Go-to-Market",
        topics: [
          "Earliest customers and channels",
          "Pricing experiments",
          "Founder-led sales",
        ],
        duration: "2 hours",
      },
      {
        title: "Module 4: People & Pitfalls",
        topics: [
          "Co-founders, equity, and early hires",
          "Common first-year traps",
          "Building a founder support system",
        ],
        duration: "2 hours",
      },
    ],
    heroImage: "/assets/services/Services1.jpeg",
    audienceTypes: ["individual", "corporate"],
  },
];

export function getDomain(slug: string): AcademyDomain | undefined {
  return domains.find((d) => d.slug === slug);
}

export function getProgramme(
  domainSlug: string,
  programmeSlug: string
): Programme | undefined {
  return programmes.find(
    (p) => p.domainSlug === domainSlug && p.slug === programmeSlug
  );
}

export function getProgrammesByDomain(domainSlug: string): Programme[] {
  return programmes.filter((p) => p.domainSlug === domainSlug);
}

export function getFeaturedProgrammes(): Programme[] {
  return programmes.filter((p) => p.featured);
}
