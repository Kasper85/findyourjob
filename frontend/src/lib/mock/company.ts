export type TalentCandidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  seniority: "Junior" | "Semi-Senior" | "Senior" | "Lead";
  modality: "Remoto" | "Híbrido" | "Presencial";
  vertical: "Tech" | "Ciberseguridad" | "Fintech" | "Telco";
  skills: string[];
  employabilityIndex: number;
  verification: "none" | "partial" | "full";
  certifications: number;
  experienceYears: number;
  salaryExpectation: string;
  available: boolean;
  match?: number;
  matchReasons?: string[];
  bio: string;
};

export const talentPool: TalentCandidate[] = [
  {
    id: "t1",
    name: "Diego Ramírez",
    title: "Senior Backend Engineer",
    location: "CDMX, México",
    avatar: "DR",
    seniority: "Senior",
    modality: "Remoto",
    vertical: "Fintech",
    skills: ["Go", "PostgreSQL", "Docker", "gRPC", "AWS", "Linux"],
    employabilityIndex: 92,
    verification: "full",
    certifications: 4,
    experienceYears: 7,
    salaryExpectation: "$90k - $115k USD",
    available: true,
    match: 96,
    matchReasons: ["6/6 skills core", "Vertical fintech", "Seniority alineado", "Zero Trust 100%"],
    bio: "7 años en backend distribuido, foco en sistemas de pagos.",
  },
  {
    id: "t2",
    name: "Laura Castillo",
    title: "Pentester Senior",
    location: "Bogotá, Colombia",
    avatar: "LC",
    seniority: "Senior",
    modality: "Remoto",
    vertical: "Ciberseguridad",
    skills: ["Burp Suite", "OWASP", "Python", "OSCP", "Red Team", "Linux"],
    employabilityIndex: 89,
    verification: "full",
    certifications: 5,
    experienceYears: 6,
    salaryExpectation: "$75k - $95k USD",
    available: true,
    match: 93,
    matchReasons: ["OSCP verificada", "Red team exp", "OWASP Top 10"],
    bio: "Pentester con OSCP y enfoque en aplicaciones fintech.",
  },
  {
    id: "t3",
    name: "Mateo Vargas",
    title: "DevOps Engineer",
    location: "Lima, Perú",
    avatar: "MV",
    seniority: "Semi-Senior",
    modality: "Híbrido",
    vertical: "Telco",
    skills: ["Kubernetes", "Terraform", "AWS", "Prometheus", "Docker", "Bash"],
    employabilityIndex: 84,
    verification: "partial",
    certifications: 3,
    experienceYears: 4,
    salaryExpectation: "$55k - $70k USD",
    available: true,
    match: 88,
    matchReasons: ["K8s validado", "Observabilidad", "Stack cloud completo"],
    bio: "Infra y observabilidad para plataformas de telecomunicaciones.",
  },
  {
    id: "t4",
    name: "Camila Soto",
    title: "Full-Stack Engineer",
    location: "Santiago, Chile",
    avatar: "CS",
    seniority: "Semi-Senior",
    modality: "Remoto",
    vertical: "Fintech",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
    employabilityIndex: 81,
    verification: "partial",
    certifications: 2,
    experienceYears: 4,
    salaryExpectation: "$50k - $68k USD",
    available: true,
    match: 85,
    matchReasons: ["Stack TS completo", "GraphQL +"],
    bio: "Producto de finanzas personales con foco en UX accesible.",
  },
  {
    id: "t5",
    name: "Andrés Park",
    title: "Cloud Security Architect",
    location: "Madrid, España",
    avatar: "AP",
    seniority: "Lead",
    modality: "Híbrido",
    vertical: "Ciberseguridad",
    skills: ["AWS", "Azure", "Zero Trust", "IAM", "Terraform", "ISO27001"],
    employabilityIndex: 95,
    verification: "full",
    certifications: 7,
    experienceYears: 11,
    salaryExpectation: "€95k - €120k",
    available: false,
    match: 90,
    matchReasons: ["Multi-cloud", "Zero Trust experto", "11 años exp"],
    bio: "Arquitecto Zero Trust en banca regulada.",
  },
  {
    id: "t6",
    name: "Valeria Núñez",
    title: "ML Engineer",
    location: "Remoto LATAM",
    avatar: "VN",
    seniority: "Senior",
    modality: "Remoto",
    vertical: "Tech",
    skills: ["Python", "PyTorch", "MLOps", "Kubeflow", "SQL", "Docker"],
    employabilityIndex: 87,
    verification: "full",
    certifications: 4,
    experienceYears: 6,
    salaryExpectation: "$85k - $110k USD",
    available: true,
    match: 86,
    matchReasons: ["MLOps stack completo", "Modelos en prod"],
    bio: "Modelos de ranking y matching a escala.",
  },
  {
    id: "t7",
    name: "Tomás Herrera",
    title: "Junior Backend Developer",
    location: "Quito, Ecuador",
    avatar: "TH",
    seniority: "Junior",
    modality: "Remoto",
    vertical: "Tech",
    skills: ["Node.js", "TypeScript", "PostgreSQL", "Docker"],
    employabilityIndex: 68,
    verification: "partial",
    certifications: 1,
    experienceYears: 1,
    salaryExpectation: "$22k - $32k USD",
    available: true,
    match: 72,
    matchReasons: ["Stack Node sólido para junior"],
    bio: "Bootcamp grad + 1 año en startup local.",
  },
  {
    id: "t8",
    name: "Sofía Mendoza",
    title: "SRE",
    location: "Buenos Aires, Argentina",
    avatar: "SM",
    seniority: "Senior",
    modality: "Remoto",
    vertical: "Telco",
    skills: ["Kubernetes", "Go", "Prometheus", "Grafana", "Terraform", "GCP"],
    employabilityIndex: 91,
    verification: "full",
    certifications: 6,
    experienceYears: 8,
    salaryExpectation: "$78k - $100k USD",
    available: true,
    match: 91,
    matchReasons: ["SRE puro", "Stack observabilidad completo"],
    bio: "SRE con foco en confiabilidad para servicios críticos.",
  },
];

export type PostedVacancy = {
  id: string;
  title: string;
  status: "Activa" | "Pausada" | "Cerrada" | "Borrador";
  vertical: "Tech" | "Ciberseguridad" | "Fintech" | "Telco";
  seniority: "Junior" | "Semi-Senior" | "Senior" | "Lead";
  modality: "Remoto" | "Híbrido" | "Presencial";
  location: string;
  salary: string;
  postedAt: string;
  views: number;
  applicants: number;
  shortlisted: number;
  topMatch: number;
  skillsRequired: string[];
  description: string;
};

export const postedVacancies: PostedVacancy[] = [
  {
    id: "v1",
    title: "Senior Backend Engineer (Go)",
    status: "Activa",
    vertical: "Fintech",
    seniority: "Senior",
    modality: "Remoto",
    location: "LATAM",
    salary: "$80k - $110k USD",
    postedAt: "hace 3 días",
    views: 1240,
    applicants: 47,
    shortlisted: 8,
    topMatch: 96,
    skillsRequired: ["Go", "PostgreSQL", "gRPC", "Docker", "AWS", "Kubernetes"],
    description: "Servicios distribuidos para pagos transfronterizos.",
  },
  {
    id: "v2",
    title: "Pentester Senior",
    status: "Activa",
    vertical: "Ciberseguridad",
    seniority: "Senior",
    modality: "Remoto",
    location: "LATAM",
    salary: "$70k - $95k USD",
    postedAt: "hace 1 semana",
    views: 890,
    applicants: 32,
    shortlisted: 5,
    topMatch: 93,
    skillsRequired: ["OSCP", "Burp Suite", "OWASP", "Python", "Red Team"],
    description: "Pentest web/API y red team para clientes regulados.",
  },
  {
    id: "v3",
    title: "DevOps / SRE",
    status: "Activa",
    vertical: "Telco",
    seniority: "Semi-Senior",
    modality: "Híbrido",
    location: "Bogotá",
    salary: "$45k - $65k USD",
    postedAt: "hace 2 semanas",
    views: 540,
    applicants: 21,
    shortlisted: 4,
    topMatch: 91,
    skillsRequired: ["Kubernetes", "Terraform", "Prometheus", "AWS"],
    description: "Operación de plataforma de telecomunicaciones moderna.",
  },
  {
    id: "v4",
    title: "ML Engineer",
    status: "Pausada",
    vertical: "Tech",
    seniority: "Senior",
    modality: "Remoto",
    location: "LATAM",
    salary: "$85k - $120k USD",
    postedAt: "hace 3 semanas",
    views: 1100,
    applicants: 38,
    shortlisted: 6,
    topMatch: 86,
    skillsRequired: ["Python", "PyTorch", "MLOps", "Kubeflow"],
    description: "Modelos de ranking de talento.",
  },
  {
    id: "v5",
    title: "Full-Stack Engineer (TS + React)",
    status: "Cerrada",
    vertical: "Fintech",
    seniority: "Semi-Senior",
    modality: "Remoto",
    location: "LATAM",
    salary: "$55k - $75k USD",
    postedAt: "hace 1 mes",
    views: 1820,
    applicants: 64,
    shortlisted: 9,
    topMatch: 88,
    skillsRequired: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    description: "Dashboards financieros con foco en performance.",
  },
  {
    id: "v6",
    title: "Cloud Security Architect",
    status: "Borrador",
    vertical: "Ciberseguridad",
    seniority: "Lead",
    modality: "Híbrido",
    location: "Madrid",
    salary: "€80k - €110k",
    postedAt: "—",
    views: 0,
    applicants: 0,
    shortlisted: 0,
    topMatch: 0,
    skillsRequired: ["AWS", "Azure", "Zero Trust", "IAM"],
    description: "Diseña arquitecturas Zero Trust para clientes regulados.",
  },
];

export type Applicant = {
  id: string;
  vacancyId: string;
  candidateId: string;
  stage: "Nuevo" | "Shortlist" | "Evaluación" | "Entrevista" | "Oferta" | "Rechazado";
  match: number;
  appliedAt: string;
  notes?: string;
};

export const applicants: Applicant[] = [
  {
    id: "ap1",
    vacancyId: "v1",
    candidateId: "t1",
    stage: "Entrevista",
    match: 96,
    appliedAt: "hace 2 días",
  },
  {
    id: "ap2",
    vacancyId: "v1",
    candidateId: "t6",
    stage: "Shortlist",
    match: 82,
    appliedAt: "hace 3 días",
  },
  {
    id: "ap3",
    vacancyId: "v1",
    candidateId: "t8",
    stage: "Evaluación",
    match: 91,
    appliedAt: "hace 3 días",
  },
  {
    id: "ap4",
    vacancyId: "v1",
    candidateId: "t7",
    stage: "Nuevo",
    match: 65,
    appliedAt: "hace 1 día",
  },
  {
    id: "ap5",
    vacancyId: "v2",
    candidateId: "t2",
    stage: "Oferta",
    match: 93,
    appliedAt: "hace 5 días",
  },
  {
    id: "ap6",
    vacancyId: "v2",
    candidateId: "t5",
    stage: "Shortlist",
    match: 84,
    appliedAt: "hace 1 semana",
  },
  {
    id: "ap7",
    vacancyId: "v3",
    candidateId: "t3",
    stage: "Entrevista",
    match: 91,
    appliedAt: "hace 1 semana",
  },
  {
    id: "ap8",
    vacancyId: "v3",
    candidateId: "t8",
    stage: "Shortlist",
    match: 88,
    appliedAt: "hace 1 semana",
  },
];

export type Interview = {
  id: string;
  candidateId: string;
  vacancyId: string;
  date: string;
  time: string;
  type: "Técnica" | "Cultural" | "Final";
  interviewer: string;
  status: "Programada" | "Completada" | "Cancelada";
};

export const interviews: Interview[] = [
  {
    id: "i1",
    candidateId: "t1",
    vacancyId: "v1",
    date: "2026-06-09",
    time: "10:00",
    type: "Técnica",
    interviewer: "Andrés Park",
    status: "Programada",
  },
  {
    id: "i2",
    candidateId: "t3",
    vacancyId: "v3",
    date: "2026-06-09",
    time: "14:30",
    type: "Cultural",
    interviewer: "María López",
    status: "Programada",
  },
  {
    id: "i3",
    candidateId: "t2",
    vacancyId: "v2",
    date: "2026-06-10",
    time: "11:00",
    type: "Final",
    interviewer: "Andrés Park",
    status: "Programada",
  },
  {
    id: "i4",
    candidateId: "t8",
    vacancyId: "v1",
    date: "2026-06-11",
    time: "16:00",
    type: "Técnica",
    interviewer: "Carla Méndez",
    status: "Programada",
  },
  {
    id: "i5",
    candidateId: "t6",
    vacancyId: "v4",
    date: "2026-06-05",
    time: "10:00",
    type: "Técnica",
    interviewer: "Andrés Park",
    status: "Completada",
  },
];

export const companyAnalytics = {
  activeVacancies: postedVacancies.filter((v) => v.status === "Activa").length,
  totalApplicants: postedVacancies.reduce((a, v) => a + v.applicants, 0),
  avgMatch: 84,
  timeToHire: 18,
  funnel: [
    { stage: "Aplicaciones", value: 202 },
    { stage: "Pre-cualificados IA", value: 138 },
    { stage: "Shortlist", value: 32 },
    { stage: "Entrevistas", value: 18 },
    { stage: "Ofertas", value: 6 },
    { stage: "Contratados", value: 4 },
  ],
  weeklyApplicants: [
    { d: "Lun", v: 12 },
    { d: "Mar", v: 18 },
    { d: "Mié", v: 22 },
    { d: "Jue", v: 15 },
    { d: "Vie", v: 28 },
    { d: "Sáb", v: 7 },
    { d: "Dom", v: 4 },
  ],
  verticalBreakdown: [
    { name: "Fintech", value: 45 },
    { name: "Ciberseguridad", value: 28 },
    { name: "Tech", value: 17 },
    { name: "Telco", value: 10 },
  ],
};

export const company = {
  name: "Northwind Cloud",
  logo: "NC",
  industry: "Fintech B2B",
  size: "120 empleados",
  location: "CDMX, México",
  website: "northwind.cloud",
  plan: "Growth",
  seats: { used: 4, total: 8 },
  recruiter: { name: "Andrés Park", email: "andres@northwind.cloud", role: "Head of Talent" },
};

export const teamMembers = [
  {
    id: "u1",
    name: "Andrés Park",
    email: "andres@northwind.cloud",
    role: "Owner",
    lastActive: "ahora",
  },
  {
    id: "u2",
    name: "María López",
    email: "maria@northwind.cloud",
    role: "Recruiter",
    lastActive: "hace 2h",
  },
  {
    id: "u3",
    name: "Carla Méndez",
    email: "carla@northwind.cloud",
    role: "Hiring Manager",
    lastActive: "hace 1 día",
  },
  {
    id: "u4",
    name: "Luis Quintero",
    email: "luis@northwind.cloud",
    role: "Recruiter",
    lastActive: "hace 4 días",
  },
];
