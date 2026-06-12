// Mock data for the new ecosystem modules (Empleabilidad, Skills, Challenges, etc.)

export const employability = {
  score: 78,
  previousScore: 71,
  percentile: 82, // mejor que el 82% de candidatos similares
  interviewProbability: 64,
  competitivenessLevel: "Alta" as const,
  history: [
    { month: "Ene", score: 58 },
    { month: "Feb", score: 62 },
    { month: "Mar", score: 65 },
    { month: "Abr", score: 70 },
    { month: "May", score: 71 },
    { month: "Jun", score: 78 },
  ],
  strengths: [
    { label: "Go avanzado", detail: "Verificada con evaluación 92/100", verified: true },
    { label: "PostgreSQL", detail: "8 años de experiencia documentada", verified: true },
    { label: "Docker Foundations", detail: "Certificación FYJ", verified: true },
    { label: "Arquitectura distribuida", detail: "3 proyectos de alto impacto", verified: false },
  ],
  weaknesses: [
    { label: "Kubernetes", detail: "Requisito en 64% de vacantes Senior", critical: true },
    {
      label: "Certificación AWS Solutions Architect",
      detail: "Solicitada en 41% de tus matches",
      critical: true,
    },
    { label: "Experiencia multi-cloud", detail: "Limitada a AWS", critical: false },
    { label: "Inglés C2", detail: "Actualmente C1", critical: false },
  ],
  recommendations: [
    {
      id: "r1",
      action: "Aprender Kubernetes",
      impact: 12,
      kind: "skill" as const,
      effort: "6 semanas",
      reason: "Aparece en 64% de vacantes Senior fintech",
    },
    {
      id: "r2",
      action: "Obtener certificación AWS Solutions Architect",
      impact: 18,
      kind: "cert" as const,
      effort: "3 meses",
      reason: "Multiplica tu match en cloud por 1.8x",
    },
    {
      id: "r3",
      action: "Completar perfil al 100%",
      impact: 5,
      kind: "profile" as const,
      effort: "10 min",
      reason: "Faltan portfolio público y 1 referencia",
    },
    {
      id: "r4",
      action: "Reto técnico: Kubernetes Networking",
      impact: 7,
      kind: "challenge" as const,
      effort: "15 min",
      reason: "Sube tu credibilidad técnica medible",
    },
  ],
};

export type SkillCategory = {
  name: string;
  level: number;
  verified: number; // % verificado del total
  skills: { name: string; level: number; verified: boolean }[];
};

export const skillMap: SkillCategory[] = [
  {
    name: "Backend",
    level: 90,
    verified: 85,
    skills: [
      { name: "Go", level: 95, verified: true },
      { name: "Node.js", level: 78, verified: true },
      { name: "gRPC", level: 82, verified: true },
      { name: "REST APIs", level: 92, verified: false },
    ],
  },
  {
    name: "Cloud",
    level: 60,
    verified: 40,
    skills: [
      { name: "AWS", level: 78, verified: true },
      { name: "GCP", level: 30, verified: false },
      { name: "Azure", level: 15, verified: false },
    ],
  },
  {
    name: "DevOps",
    level: 45,
    verified: 30,
    skills: [
      { name: "Docker", level: 90, verified: true },
      { name: "Kubernetes", level: 25, verified: false },
      { name: "Terraform", level: 65, verified: false },
      { name: "CI/CD", level: 70, verified: false },
    ],
  },
  {
    name: "Bases de Datos",
    level: 82,
    verified: 70,
    skills: [
      { name: "PostgreSQL", level: 88, verified: true },
      { name: "Redis", level: 72, verified: false },
      { name: "MongoDB", level: 60, verified: false },
    ],
  },
  {
    name: "Seguridad",
    level: 55,
    verified: 35,
    skills: [
      { name: "OWASP", level: 65, verified: true },
      { name: "OAuth/JWT", level: 80, verified: false },
      { name: "Zero Trust", level: 40, verified: false },
    ],
  },
  {
    name: "Frontend",
    level: 50,
    verified: 20,
    skills: [
      { name: "TypeScript", level: 70, verified: false },
      { name: "React", level: 55, verified: false },
    ],
  },
  {
    name: "Networking",
    level: 48,
    verified: 25,
    skills: [
      { name: "TCP/IP", level: 60, verified: false },
      { name: "Load Balancing", level: 50, verified: false },
      { name: "VPC/VPN", level: 45, verified: false },
    ],
  },
];

export type MatchFactor = {
  label: string;
  weight: number;
  score: number;
  detail: string;
};

export const matchExplanation = {
  jobTitle: "Senior Backend Engineer (Go)",
  company: "Northwind Cloud",
  total: 92,
  factors: [
    { label: "Coincidencia técnica", weight: 35, score: 88, detail: "5/6 skills core coinciden" },
    { label: "Experiencia", weight: 25, score: 95, detail: "7 años · requisito 5+" },
    { label: "Certificaciones", weight: 15, score: 100, detail: "Go Backend + Docker verificadas" },
    {
      label: "Verificación Zero Trust",
      weight: 15,
      score: 100,
      detail: "Identidad y email validados",
    },
    { label: "Modalidad y ubicación", weight: 10, score: 80, detail: "Remoto LATAM compatible" },
  ] as MatchFactor[],
  matched: ["Go", "PostgreSQL", "Docker", "gRPC", "AWS"],
  missing: ["Kubernetes"],
  signal: "Tu perfil está en el top 5% para esta vacante.",
};

export type CertCatalogItem = {
  id: string;
  name: string;
  category: "Backend" | "Cloud" | "DevOps" | "Seguridad" | "Datos";
  level: "Foundational" | "Associate" | "Professional";
  price: number;
  durationHours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  skills: string[];
  jobBenefit: string;
  popularity: number;
  newest?: boolean;
};

export const certCatalog: CertCatalogItem[] = [
  {
    id: "cc1",
    name: "Backend Go Fundamentals",
    category: "Backend",
    level: "Foundational",
    price: 49,
    durationHours: 6,
    difficulty: 2,
    skills: ["Go", "REST APIs"],
    jobBenefit: "Acceso a 240+ vacantes Junior/Semi-Senior",
    popularity: 92,
    newest: true,
  },
  {
    id: "cc2",
    name: "Docker Associate",
    category: "DevOps",
    level: "Associate",
    price: 79,
    durationHours: 8,
    difficulty: 3,
    skills: ["Docker", "Linux"],
    jobBenefit: "+18% probabilidad de entrevista",
    popularity: 88,
  },
  {
    id: "cc3",
    name: "Linux Administration",
    category: "DevOps",
    level: "Associate",
    price: 69,
    durationHours: 10,
    difficulty: 3,
    skills: ["Linux", "Bash", "Networking"],
    jobBenefit: "Requisito en 71% de roles DevOps",
    popularity: 75,
  },
  {
    id: "cc4",
    name: "Kubernetes Junior",
    category: "DevOps",
    level: "Associate",
    price: 99,
    durationHours: 12,
    difficulty: 4,
    skills: ["Kubernetes", "Docker"],
    jobBenefit: "+12 puntos de empleabilidad",
    popularity: 95,
    newest: true,
  },
  {
    id: "cc5",
    name: "Cloud Practitioner",
    category: "Cloud",
    level: "Foundational",
    price: 59,
    durationHours: 7,
    difficulty: 2,
    skills: ["AWS", "Cloud Computing"],
    jobBenefit: "Puerta de entrada a roles cloud",
    popularity: 90,
  },
  {
    id: "cc6",
    name: "PostgreSQL Performance",
    category: "Datos",
    level: "Professional",
    price: 129,
    durationHours: 14,
    difficulty: 5,
    skills: ["PostgreSQL", "SQL", "Tuning"],
    jobBenefit: "Diferenciador para roles Senior Backend",
    popularity: 64,
  },
  {
    id: "cc7",
    name: "Secure Coding (OWASP)",
    category: "Seguridad",
    level: "Associate",
    price: 89,
    durationHours: 9,
    difficulty: 3,
    skills: ["OWASP", "Security"],
    jobBenefit: "Obligatoria en fintech regulada",
    popularity: 81,
  },
  {
    id: "cc8",
    name: "AWS Solutions Architect",
    category: "Cloud",
    level: "Professional",
    price: 149,
    durationHours: 20,
    difficulty: 5,
    skills: ["AWS", "Architecture", "IAM"],
    jobBenefit: "+18 puntos de empleabilidad",
    popularity: 97,
  },
];

export type LearningCourse = {
  id: string;
  title: string;
  provider: "Udemy" | "Coursera" | "Platzi" | "FYJ Learning" | "Pluralsight";
  durationHours: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  rating: number;
  students: number;
  price: number;
  skill: string;
  employabilityImpact: number;
  relatedVacancies: number;
  affiliate: boolean;
};

export const learningMarketplace: LearningCourse[] = [
  {
    id: "lc1",
    title: "Kubernetes para principiantes",
    provider: "Udemy",
    durationHours: 18,
    level: "Principiante",
    rating: 4.7,
    students: 24800,
    price: 12.99,
    skill: "Kubernetes",
    employabilityImpact: 12,
    relatedVacancies: 64,
    affiliate: true,
  },
  {
    id: "lc2",
    title: "AWS Solutions Architect Associate",
    provider: "Coursera",
    durationHours: 32,
    level: "Intermedio",
    rating: 4.8,
    students: 41200,
    price: 49,
    skill: "AWS",
    employabilityImpact: 18,
    relatedVacancies: 91,
    affiliate: true,
  },
  {
    id: "lc3",
    title: "Go avanzado: concurrencia y performance",
    provider: "FYJ Learning",
    durationHours: 14,
    level: "Avanzado",
    rating: 4.9,
    students: 3200,
    price: 39,
    skill: "Go",
    employabilityImpact: 9,
    relatedVacancies: 48,
    affiliate: false,
  },
  {
    id: "lc4",
    title: "Terraform en producción",
    provider: "Pluralsight",
    durationHours: 11,
    level: "Intermedio",
    rating: 4.6,
    students: 12400,
    price: 29,
    skill: "Terraform",
    employabilityImpact: 7,
    relatedVacancies: 38,
    affiliate: true,
  },
  {
    id: "lc5",
    title: "GraphQL para backenders",
    provider: "Platzi",
    durationHours: 8,
    level: "Intermedio",
    rating: 4.5,
    students: 9700,
    price: 19,
    skill: "GraphQL",
    employabilityImpact: 5,
    relatedVacancies: 22,
    affiliate: true,
  },
  {
    id: "lc6",
    title: "Observabilidad con Prometheus y Grafana",
    provider: "Udemy",
    durationHours: 9,
    level: "Intermedio",
    rating: 4.7,
    students: 15600,
    price: 14.99,
    skill: "Prometheus",
    employabilityImpact: 6,
    relatedVacancies: 31,
    affiliate: true,
  },
];

export type EdgeChallenge = {
  id: string;
  topic: string;
  vertical: "Backend" | "DevOps" | "Cloud" | "Seguridad";
  level: "Básico" | "Intermedio" | "Avanzado";
  durationMin: number;
  generatedAt: string;
  uniqueSeed: string;
  status: "Disponible" | "En progreso" | "Completado" | "Expirado";
  score?: number;
  description: string;
};

export const edgeChallenges: EdgeChallenge[] = [
  {
    id: "ch1",
    topic: "Docker Networking",
    vertical: "DevOps",
    level: "Intermedio",
    durationMin: 15,
    generatedAt: "hace 2 min",
    uniqueSeed: "FYJ-7H2K-9XL",
    status: "Disponible",
    description:
      "Debug un escenario único de comunicación entre contenedores en redes overlay personalizadas.",
  },
  {
    id: "ch2",
    topic: "Go Goroutines + Race Conditions",
    vertical: "Backend",
    level: "Avanzado",
    durationMin: 20,
    generatedAt: "hace 14 min",
    uniqueSeed: "FYJ-B3M1-44PA",
    status: "Disponible",
    description: "Resuelve un deadlock generado exclusivamente para tu perfil.",
  },
  {
    id: "ch3",
    topic: "SQL Injection Mitigation",
    vertical: "Seguridad",
    level: "Intermedio",
    durationMin: 12,
    generatedAt: "hace 1 hora",
    uniqueSeed: "FYJ-Q8R5-77ZD",
    status: "En progreso",
    description: "Audita una API mock generada para identificar y corregir vectores OWASP.",
  },
  {
    id: "ch4",
    topic: "Kubernetes Pod Scheduling",
    vertical: "DevOps",
    level: "Avanzado",
    durationMin: 25,
    generatedAt: "ayer",
    uniqueSeed: "FYJ-K9X2-12VN",
    status: "Completado",
    score: 88,
    description: "Optimiza un cluster con restricciones específicas a tu seed.",
  },
  {
    id: "ch5",
    topic: "IAM Policy Hardening (AWS)",
    vertical: "Cloud",
    level: "Intermedio",
    durationMin: 18,
    generatedAt: "hace 2 días",
    uniqueSeed: "FYJ-P4S7-08LM",
    status: "Completado",
    score: 92,
    description: "Re-escribe políticas IAM de un entorno mock para Zero Trust.",
  },
];

export const roiData = {
  timeToHire: { fyj: 21, industry: 35 },
  costPerHire: { fyj: 1850, industry: 4200 },
  qualityOfHire: { fyj: 8.7, industry: 6.4 }, // /10
  earlyAttrition: { fyj: 6, industry: 18 }, // %
  funnelEfficiency: { fyj: 78, industry: 42 },
  savings: { hours: 320, money: 28400 },
  hireQuarter: [
    { q: "Q1", fyj: 24, industry: 38 },
    { q: "Q2", fyj: 22, industry: 36 },
    { q: "Q3", fyj: 21, industry: 35 },
    { q: "Q4", fyj: 19, industry: 34 },
  ],
  csat: 92,
};

export const zeroTrustRequirements = [
  { id: "z1", label: "Perfil completo (>80%)", done: true, weight: 10 },
  { id: "z2", label: "Email corporativo o personal verificado", done: true, weight: 10 },
  { id: "z3", label: "CV revisado (sin inconsistencias)", done: true, weight: 15 },
  { id: "z4", label: "Al menos 1 evaluación técnica aprobada", done: true, weight: 15 },
  { id: "z5", label: "Identidad verificada (KYC ligero)", done: false, weight: 20 },
  { id: "z6", label: "Al menos 1 certificación Find Your Job", done: true, weight: 15 },
  { id: "z7", label: "Referencia profesional validada", done: false, weight: 10 },
  { id: "z8", label: "Reto técnico completado (últimos 90 días)", done: false, weight: 5 },
];
