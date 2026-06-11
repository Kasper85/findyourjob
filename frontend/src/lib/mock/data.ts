export type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  modality: "Remoto" | "Híbrido" | "Presencial";
  seniority: "Junior" | "Semi-Senior" | "Senior" | "Lead";
  salary: string;
  match: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
  vertical: "Tech" | "Ciberseguridad" | "Fintech" | "Telco";
};

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Backend Engineer (Go)",
    company: "Northwind Cloud",
    logo: "NC",
    location: "CDMX, México",
    modality: "Remoto",
    seniority: "Senior",
    salary: "$80k - $110k USD",
    match: 94,
    matchedSkills: ["Go", "Docker", "PostgreSQL", "gRPC", "AWS"],
    missingSkills: ["Kubernetes"],
    reasons: [
      "5/6 skills críticas coinciden",
      "Experiencia en fintech alineada",
      "Seniority compatible",
    ],
    description:
      "Construye servicios distribuidos de alto rendimiento para procesamiento de pagos.",
    responsibilities: [
      "Diseñar APIs gRPC",
      "Optimizar consultas PostgreSQL",
      "Mentorear ingenieros junior",
    ],
    requirements: [
      "5+ años con Go",
      "Experiencia con sistemas distribuidos",
      "Inglés conversacional",
    ],
    postedAt: "hace 2 días",
    vertical: "Fintech",
  },
  {
    id: "2",
    title: "Pentester Senior",
    company: "Sentinel Labs",
    logo: "SL",
    location: "Remoto LATAM",
    modality: "Remoto",
    seniority: "Senior",
    salary: "$70k - $95k USD",
    match: 87,
    matchedSkills: ["Burp Suite", "OWASP", "Python", "Linux"],
    missingSkills: ["OSCP", "Red Team"],
    reasons: ["Skills core de pentesting validadas", "Falta certificación OSCP"],
    description: "Pruebas de penetración en aplicaciones web y APIs para clientes fintech.",
    responsibilities: ["Pentest web/API", "Reportes ejecutivos", "Red team exercises"],
    requirements: ["OSCP deseable", "OWASP Top 10", "3+ años exp"],
    postedAt: "hace 4 días",
    vertical: "Ciberseguridad",
  },
  {
    id: "3",
    title: "DevOps / SRE",
    company: "Mercado Telco",
    logo: "MT",
    location: "Bogotá, Colombia",
    modality: "Híbrido",
    seniority: "Semi-Senior",
    salary: "$45k - $65k USD",
    match: 76,
    matchedSkills: ["Docker", "Terraform", "AWS", "Linux"],
    missingSkills: ["Kubernetes", "Prometheus"],
    reasons: ["Infra core OK", "Faltan herramientas de observabilidad"],
    description: "Operación de infraestructura para una red de telecomunicaciones moderna.",
    responsibilities: ["Mantener clusters", "Automatizar pipelines CI/CD", "On-call rotativo"],
    requirements: ["Terraform", "Cloud (AWS/GCP)", "Bash"],
    postedAt: "hace 1 semana",
    vertical: "Telco",
  },
  {
    id: "4",
    title: "Full-Stack Engineer (TS + React)",
    company: "Bloomline Fintech",
    logo: "BF",
    location: "Remoto",
    modality: "Remoto",
    seniority: "Semi-Senior",
    salary: "$55k - $75k USD",
    match: 82,
    matchedSkills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    missingSkills: ["GraphQL"],
    reasons: ["Stack 100% alineado al frontend", "Backend en Node ya validado"],
    description: "Construye dashboards financieros con foco en performance y accesibilidad.",
    responsibilities: ["Features end-to-end", "Code review", "Accesibilidad WCAG"],
    requirements: ["TS", "React 18+", "Node", "Pruebas automatizadas"],
    postedAt: "hace 3 días",
    vertical: "Fintech",
  },
  {
    id: "5",
    title: "Cloud Security Architect",
    company: "Vault Networks",
    logo: "VN",
    location: "Madrid, España",
    modality: "Híbrido",
    seniority: "Lead",
    salary: "€80k - €110k",
    match: 71,
    matchedSkills: ["AWS", "IAM", "Zero Trust", "Terraform"],
    missingSkills: ["Azure", "GCP"],
    reasons: ["Fuerte en AWS, débil multi-cloud"],
    description: "Diseña arquitecturas Zero Trust para clientes regulados.",
    responsibilities: ["Threat modeling", "Compliance ISO27001", "Mentoring"],
    requirements: ["AWS Solutions Architect Pro", "Experiencia Zero Trust"],
    postedAt: "hace 5 días",
    vertical: "Ciberseguridad",
  },
  {
    id: "6",
    title: "ML Engineer",
    company: "Northwind Cloud",
    logo: "NC",
    location: "Remoto LATAM",
    modality: "Remoto",
    seniority: "Senior",
    salary: "$85k - $120k USD",
    match: 64,
    matchedSkills: ["Python", "Docker", "SQL"],
    missingSkills: ["PyTorch", "MLOps", "Kubeflow"],
    reasons: ["Base sólida, falta especialización ML"],
    description: "Modelos de ranking y matching para una plataforma de talento.",
    responsibilities: ["Entrenar modelos", "Servir en producción", "AB testing"],
    requirements: ["Python avanzado", "ML fundamentals", "MLOps"],
    postedAt: "hace 6 días",
    vertical: "Tech",
  },
];

export type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: "Enviada" | "En revisión" | "Evaluación" | "Entrevista" | "Oferta" | "Rechazada";
  appliedAt: string;
  match: number;
};

export const applications: Application[] = [
  {
    id: "a1",
    jobId: "1",
    jobTitle: "Senior Backend Engineer (Go)",
    company: "Northwind Cloud",
    status: "Entrevista",
    appliedAt: "hace 5 días",
    match: 94,
  },
  {
    id: "a2",
    jobId: "4",
    jobTitle: "Full-Stack Engineer (TS + React)",
    company: "Bloomline Fintech",
    status: "Evaluación",
    appliedAt: "hace 1 semana",
    match: 82,
  },
  {
    id: "a3",
    jobId: "3",
    jobTitle: "DevOps / SRE",
    company: "Mercado Telco",
    status: "En revisión",
    appliedAt: "hace 10 días",
    match: 76,
  },
  {
    id: "a4",
    jobId: "5",
    jobTitle: "Cloud Security Architect",
    company: "Vault Networks",
    status: "Rechazada",
    appliedAt: "hace 3 semanas",
    match: 71,
  },
];

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string;
  skills: string[];
  level: "Foundational" | "Associate" | "Professional" | "Expert";
  color: string;
};

export const certifications: Certification[] = [
  {
    id: "c1",
    name: "Go Backend Engineer",
    issuer: "Find Your Job",
    issuedAt: "2025-03-12",
    skills: ["Go", "gRPC", "PostgreSQL"],
    level: "Professional",
    color: "150",
  },
  {
    id: "c2",
    name: "Docker Foundations",
    issuer: "Find Your Job",
    issuedAt: "2024-11-05",
    skills: ["Docker", "Linux"],
    level: "Foundational",
    color: "200",
  },
  {
    id: "c3",
    name: "AWS Cloud Practitioner",
    issuer: "Find Your Job",
    issuedAt: "2025-01-22",
    skills: ["AWS", "Cloud"],
    level: "Associate",
    color: "75",
  },
  {
    id: "c4",
    name: "Secure Coding (OWASP)",
    issuer: "Find Your Job",
    issuedAt: "2025-02-14",
    skills: ["OWASP", "Security"],
    level: "Associate",
    color: "25",
  },
];

export type Evaluation = {
  id: string;
  title: string;
  skill: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  duration: number;
  type: "Opción múltiple" | "Código en vivo" | "Caso práctico" | "Simulación";
  questions: number;
  unlocks?: string;
};

export const evaluations: Evaluation[] = [
  {
    id: "e1",
    title: "Fundamentos de Go",
    skill: "Go",
    difficulty: "Intermedio",
    duration: 45,
    type: "Código en vivo",
    questions: 8,
    unlocks: "Go Backend Engineer",
  },
  {
    id: "e2",
    title: "Docker & Contenedores",
    skill: "Docker",
    difficulty: "Básico",
    duration: 30,
    type: "Opción múltiple",
    questions: 20,
    unlocks: "Docker Foundations",
  },
  {
    id: "e3",
    title: "Kubernetes Operations",
    skill: "Kubernetes",
    difficulty: "Avanzado",
    duration: 60,
    type: "Simulación",
    questions: 5,
  },
  {
    id: "e4",
    title: "OWASP Top 10 Práctico",
    skill: "Security",
    difficulty: "Intermedio",
    duration: 50,
    type: "Caso práctico",
    questions: 6,
    unlocks: "Secure Coding (OWASP)",
  },
  {
    id: "e5",
    title: "PostgreSQL Performance",
    skill: "PostgreSQL",
    difficulty: "Avanzado",
    duration: 45,
    type: "Código en vivo",
    questions: 7,
  },
  {
    id: "e6",
    title: "React + TypeScript",
    skill: "React",
    difficulty: "Intermedio",
    duration: 40,
    type: "Código en vivo",
    questions: 8,
  },
];

export type EvalHistory = {
  id: string;
  evalId: string;
  title: string;
  score: number;
  passed: boolean;
  takenAt: string;
};

export const evalHistory: EvalHistory[] = [
  {
    id: "h1",
    evalId: "e1",
    title: "Fundamentos de Go",
    score: 92,
    passed: true,
    takenAt: "2025-03-12",
  },
  {
    id: "h2",
    evalId: "e2",
    title: "Docker & Contenedores",
    score: 88,
    passed: true,
    takenAt: "2024-11-05",
  },
  {
    id: "h3",
    evalId: "e4",
    title: "OWASP Top 10 Práctico",
    score: 81,
    passed: true,
    takenAt: "2025-02-14",
  },
  {
    id: "h4",
    evalId: "e3",
    title: "Kubernetes Operations",
    score: 58,
    passed: false,
    takenAt: "2025-04-02",
  },
];

export type LearningItem = {
  id: string;
  title: string;
  type: "Curso" | "Evaluación" | "Certificación";
  provider: string;
  skill: string;
  duration: string;
  progress: number;
};

export const learningPath: LearningItem[] = [
  {
    id: "l1",
    title: "Kubernetes desde cero",
    type: "Curso",
    provider: "FYJ Learning",
    skill: "Kubernetes",
    duration: "6h",
    progress: 35,
  },
  {
    id: "l2",
    title: "Evaluación Kubernetes Ops",
    type: "Evaluación",
    provider: "Find Your Job",
    skill: "Kubernetes",
    duration: "60min",
    progress: 0,
  },
  {
    id: "l3",
    title: "Certificación K8s Associate",
    type: "Certificación",
    provider: "Find Your Job",
    skill: "Kubernetes",
    duration: "—",
    progress: 0,
  },
  {
    id: "l4",
    title: "GraphQL para backenders",
    type: "Curso",
    provider: "FYJ Learning",
    skill: "GraphQL",
    duration: "4h",
    progress: 0,
  },
  {
    id: "l5",
    title: "Azure Fundamentals",
    type: "Curso",
    provider: "FYJ Learning",
    skill: "Azure",
    duration: "5h",
    progress: 12,
  },
];

export type UserProfile = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  bio: string;
  experience: { company: string; role: string; period: string; description: string }[];
  education: { institution: string; degree: string; period: string }[];
  skills: { name: string; level: number }[];
  languages: { name: string; level: string }[];
  completion: number;
  employabilityIndex: number;
  verification: "none" | "partial" | "full";
};

export const user: UserProfile = {
  name: "Diego Ramírez",
  title: "Senior Backend Engineer",
  location: "Ciudad de México, México",
  email: "diego.ramirez@email.com",
  phone: "+52 55 1234 5678",
  linkedin: "linkedin.com/in/diegoramirez",
  github: "github.com/dramirez",
  portfolio: "diegoramirez.dev",
  bio: "Ingeniero backend con 7 años de experiencia construyendo sistemas distribuidos para fintech. Apasionado por Go, sistemas de pagos y observabilidad.",
  experience: [
    {
      company: "Bloomline Fintech",
      role: "Senior Backend Engineer",
      period: "2022 — Presente",
      description: "Liderazgo técnico del servicio de pagos, migración a Go.",
    },
    {
      company: "Northwind Cloud",
      role: "Backend Engineer",
      period: "2019 — 2022",
      description: "APIs en Node.js y migración a microservicios.",
    },
    {
      company: "Startup Foo",
      role: "Full-Stack Developer",
      period: "2017 — 2019",
      description: "Primer ingeniero. Producto, infra y soporte.",
    },
  ],
  education: [{ institution: "UNAM", degree: "Ingeniería en Computación", period: "2012 — 2016" }],
  skills: [
    { name: "Go", level: 95 },
    { name: "PostgreSQL", level: 88 },
    { name: "Docker", level: 90 },
    { name: "AWS", level: 78 },
    { name: "gRPC", level: 82 },
    { name: "TypeScript", level: 70 },
    { name: "Linux", level: 85 },
    { name: "Terraform", level: 65 },
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "C1" },
  ],
  completion: 86,
  employabilityIndex: 78,
  verification: "partial",
};

export type Notification = {
  id: string;
  type: "vacante" | "sistema" | "evaluacion" | "certificacion";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "vacante",
    title: "Nueva vacante con 94% match",
    description: "Senior Backend Engineer (Go) en Northwind Cloud",
    time: "hace 2h",
    read: false,
  },
  {
    id: "n2",
    type: "certificacion",
    title: "Certificación emitida",
    description: "Go Backend Engineer ya está disponible en tu perfil",
    time: "hace 1 día",
    read: false,
  },
  {
    id: "n3",
    type: "evaluacion",
    title: "Resultado de evaluación",
    description: "Aprobaste Fundamentos de Go con 92/100",
    time: "hace 1 día",
    read: true,
  },
  {
    id: "n4",
    type: "sistema",
    title: "Verifica tu identidad",
    description: "Eleva tu nivel Zero Trust al 100%",
    time: "hace 3 días",
    read: true,
  },
];
