import { Job, ScoringFactors, RoleCategory } from './jobs.shared';

// Keywords prioritárias para desenvolvedores brasileiros remotos
export const RELEVANT_KEYWORDS = {
  // Engenharia
  frontend: ['react', 'javascript', 'typescript', 'vue', 'angular', 'next.js', 'tailwind', 'css', 'html'],
  backend: ['node.js', 'node', 'python', 'java', 'golang', 'go', 'rust', 'php', 'ruby', 'c#', 'scala'],
  fullstack: ['full-stack', 'fullstack', 'full stack', 'full-stack developer', 'fullstack engineer'],
  mobile: ['react-native', 'react native', 'flutter', 'ios', 'android', 'mobile', 'kotlin', 'swift'],
  devops: ['aws', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'azure', 'gcp', 'sre', 'devops'],
  data: ['data-science', 'data science', 'machine-learning', 'machine learning', 'ml', 'ai', 'analytics', 'python', 'sql', 'data engineer'],

  // Não-dev (ampliado)
  product: ['product manager', 'pm', 'product owner', 'technical program manager', 'tpm', 'product marketing', 'product lead'],
  design: ['product designer', 'ux', 'ui', 'ux/ui', 'design system', 'ux researcher', 'visual designer', 'graphic designer', 'ui/ux'],
  marketing: ['growth', 'performance marketing', 'seo', 'content marketing', 'demand generation', 'digital marketing', 'marketing manager', 'growth hacker'],
  sales: ['account executive', 'ae', 'sales engineer', 'solutions engineer', 'bd', 'business development', 'sales manager', 'account manager', 'sales rep'],
  support: ['customer support', 'customer success', 'technical support', 'success manager', 'customer care', 'client success', 'support specialist'],
  qa: ['qa', 'quality assurance', 'test automation', 'sdet', 'testing', 'qa engineer', 'test engineer'],
  
  // Papéis de liderança/gestão (adicionado)
  leadership: ['manager', 'lead', 'director', 'head', 'vp', 'chief', 'coordinator', 'specialist'],

  // Níveis de experiência (melhorados)
  levels: ['junior', 'jr', 'pleno', 'mid-level', 'senior', 'sr', 'staff', 'principal', 'lead', 'director', 'head', 'vp'],

  // Termos que indicam vaga remota internacional
  remote: [
    'remote', 'remoto', 'trabalho remoto', 'home office', 'distributed', 'anywhere',
    'worldwide', 'global', 'work from anywhere', '100% remote', 'fully remote'
  ],

  // Localização que aceita brasileiros/latam
  brazilFriendly: [
    'brazil', 'brasil', 'latin america', 'latam', 'south america', 'americas',
    'same time zone', 'americas time zone', 'utc-3', 'gmt-3', 'time zone: americas',
  ],
};

// Empresas conhecidas que contratam brasileiros remotos (expandida)
export const TRUSTED_COMPANIES = [
  // Empresas com histórico comprovado de contratar brasileiros
  'remote', 'remote.com', 'gitlab', 'automattic', 'shopify', 'stripe', 
  'buffer', 'zapier', 'doist', 'basecamp', 'ghost', 'hotjar', 'toggl',
  'toptal', 'x-team', 'turing', 'deel', 'workana', 'upwork',
  // Empresas brasileiras que operam globalmente
  'nubank', 'stone', 'ifood', 'mercadolivre', 'vtex', 'totvs',
  // Empresas americanas/europeias Brazil-friendly
  'spotify', 'uber', 'airbnb', 'netflix', 'microsoft', 'google',
  'amazon', 'facebook', 'meta', 'twitter', 'linkedin', 'github'
];

// Termos que indicam "sem restrição de localização" (worldwide/anywhere)
const WORLDWIDE_TERMS = [
  'worldwide',
  'anywhere',
  'work from anywhere',
  'no location restrictions',
  'no location restriction',
  'no location requirements',
  'no geographic restrictions',
  'global',
];

// Termos/regiões que normalmente EXCLUEM Brasil (para penalização)
const NEGATIVE_REGION_TERMS = [
  'noram',
  'north america only',
  'north-america only',
  'north america',
  'north-america',
  'us only',
  'usa only',
  'u.s. only',
  'canada only',
  'us & canada',
  'must be in us',
  'must be in canada',
  // Portuguese/Spanish variants
  'apenas américa do norte',
  'somente américa do norte',
  'apenas eua',
  'somente eua',
  'somente estados unidos',
  'apenas estados unidos',
  'somente canadá',
  'apenas canadá',
  'solo norteamérica',
  'solo norteamérica',
  'solo ee.uu.',
  'solo estados unidos',
  'solo canadá',
];

// Países da LATAM (ex-Brasil) — se a vaga é específica para um destes, pode não servir ao nicho
const LATAM_COUNTRIES_NOT_BRAZIL = [
  'argentina', 'colombia', 'chile', 'peru', 'mexico', 'uruguay', 'paraguay',
  'ecuador', 'bolivia', 'venezuela', 'guatemala', 'costa rica', 'panama',
  'dominican republic', 'honduras', 'nicaragua', 'el salvador', 'puerto rico'
];

export interface ScoringConfig {
  keywordWeights: {
    frontend: number;
    backend: number;
    fullstack: number;
    mobile: number;
    devops: number;
    data: number;
    product: number;
    design: number;
    marketing: number;
    sales: number;
    support: number;
    qa: number;
    leadership: number;
    levels: number;
    remote: number;
    brazilFriendly: number;
  };
  companyMultiplier: number;
  salaryBonus: number;
  descriptionMinLength: number;
  hybridPenalty: number; // multiplicador p/ "hybrid"/"office"
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  keywordWeights: {
    // Todas as áreas têm peso igual - não discriminamos por área técnica
    frontend: 5,
    backend: 5,
    fullstack: 5,
    mobile: 5,
    devops: 5,
    data: 5,
    product: 5,
    design: 5,
    marketing: 5,
    sales: 5,
    support: 5,
    qa: 5,
    leadership: 5,
    levels: 2, // Peso baixo - seniority não define relevância para brasileiros
    
    // FOCO: Relevância para brasileiros remotos
    remote: 25, // CRÍTICO - deve ser verdadeiramente remoto
    brazilFriendly: 35, // MÁXIMO - aceitar brasileiros/LATAM é essencial
  },
  companyMultiplier: 1.3, // Empresas confiáveis são muito importantes
  salaryBonus: 15, // Transparência salarial é crucial para brasileiros
  descriptionMinLength: 200, // Empresas sérias fazem descrições detalhadas
  hybridPenalty: 0.1, // Penalidade severa para híbrido (não serve para o nicho)
};

export function calculateJobScore(job: Partial<Job>, config: ScoringConfig = DEFAULT_SCORING_CONFIG): {
  score: number;
  factors: ScoringFactors;
  matchedKeywords: string[];
} {
  const text = `${job.title} ${job.company} ${job.location} ${job.description} ${job.tags?.join(' ')}`.toLowerCase();
  
  let score = 0;
  const matchedKeywords: string[] = [];
  
  // Verificar keywords por categoria
  let keywordScore = 0;
  for (const [category, keywords] of Object.entries(RELEVANT_KEYWORDS)) {
    const weight = config.keywordWeights[category as keyof typeof config.keywordWeights];
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        keywordScore += weight;
        matchedKeywords.push(keyword);
      }
    }
  }
  
  // Normalizar score de keywords (máximo 60 pontos)
  const normalizedKeywordScore = Math.min(keywordScore, 60);
  score += normalizedKeywordScore;
  
  // Verificar se é empresa confiável
  const companyRelevance = TRUSTED_COMPANIES.some(company => 
    text.includes(company.toLowerCase())
  ) ? 10 : 0;
  
  if (companyRelevance > 0) {
    score *= config.companyMultiplier;
  }
  
  // Bonus por salário informado
  const salaryPresent = Boolean(job.salary && job.salary.trim().length > 0);
  if (salaryPresent) {
    score += config.salaryBonus;
  }
  
  // Score de qualidade da descrição
  const descriptionLength = job.description?.length || 0;
  const descriptionQuality = Math.min(
    descriptionLength / config.descriptionMinLength * 10,
    10
  );
  score += descriptionQuality;
  
  // Verificação crítica: deve ser remoto E aceitar brasileiros/latam
  const hasRemoteKeywords = RELEVANT_KEYWORDS.remote.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  const hasBrazilFriendly = RELEVANT_KEYWORDS.brazilFriendly.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  const hasBrazilMention = text.includes('brazil') || text.includes('brasil');
  const isWorldwideLike = WORLDWIDE_TERMS.some(term => text.includes(term));
  
  // Se não é remoto OU não aceita brasileiros, score muito baixo
  if (!hasRemoteKeywords) {
    score *= 0.1; // Não é remoto: penalidade máxima
  } else if (!hasBrazilFriendly) {
    // Se é remoto mas não explicitamente Brazil-friendly
    // Caso especial: worldwide/anywhere -> penalidade mais leve
    score *= isWorldwideLike ? 0.6 : 0.1;
  }
  
  // LocationRelevance mais granular baseado na localização específica
  let locationRelevance = 0;
  if (job.location?.toLowerCase().includes('brazil') || job.location?.toLowerCase().includes('brasil')) {
    locationRelevance = 30; // MÁXIMO para Brazil explícito
  } else if (job.location?.toLowerCase().includes('latam') || 
             job.location?.toLowerCase().includes('latin america')) {
    locationRelevance = 25; // Muito alto para LATAM
  } else if (job.location?.toLowerCase().includes('south america') || 
             job.location?.toLowerCase().includes('americas')) {
    locationRelevance = 20; // Alto para Americas
  } else if (job.location?.toLowerCase().includes('remote') && 
             (text.includes('brazil') || text.includes('latam') || text.includes('time zone'))) {
    locationRelevance = 15; // Médio se remoto + menciona Brazil/LATAM na descrição
  } else if (hasBrazilFriendly) {
    locationRelevance = 10; // Baixo mas presente para outras localizações friendly
  } else if (job.location?.toLowerCase().includes('worldwide') || 
             job.location?.toLowerCase().includes('anywhere')) {
    locationRelevance = 8; // Mínimo para "anywhere" (pode aceitar, mas não específico)
  }
  
  // Bonus para vagas com informações completas e qualidade alta
  let qualityBonus = 0;
  
  // FOCO: Bonus para aspectos importantes para brasileiros remotos
  
  // Bonus máximo para salário com range específico (transparência)
  if (job.salary && (job.salary.includes('-') || job.salary.includes('to') || job.salary.includes('USD'))) {
    qualityBonus += 8; // Transparência salarial é crucial
  }
  
  // Bonus para menção explícita ao Brasil/LATAM (empresa realmente contrata lá)
  const explicitBrazilMention = ['brazil', 'brazilian', 'brasil', 'latam', 'latin america', 'south america'];
  if (explicitBrazilMention.some(term => text.includes(term))) {
    qualityBonus += 10; // Muito importante - menção explícita
  }
  
  // Bonus para indicadores de empresa internacional/global
  const globalCompanyTerms = ['global', 'international', 'worldwide', 'distributed team', 'remote-first'];
  if (globalCompanyTerms.some(term => text.includes(term))) {
    qualityBonus += 5; // Empresas globais geralmente contratam brasileiros
  }
  
  // Bonus para vagas que mencionam inglês (indica abertura internacional)
  if (text.includes('english') && !text.includes('english only')) {
    qualityBonus += 3; // Bom sinal, mas não excessivo
  }
  
  // Bonus para descrições detalhadas (empresas sérias)
  if (descriptionLength > 500) {
    qualityBonus += 5; // Empresas sérias fazem descrições completas
  }
  
  score += qualityBonus;
  
  // Penalidade mais forte para híbrido/presencial
  const hybridTerms = ['hybrid', 'híbrido', 'on-site', 'onsite', 'office-based', 'in office'];
  if (hybridTerms.some(term => text.includes(term))) {
    score *= config.hybridPenalty; // penalidade configurável
  }

  // Penalidades específicas solicitadas:
  // 1) "NORAM" e variações (North America) — geralmente exclui Brasil
  if (NEGATIVE_REGION_TERMS.some(term => text.includes(term))) {
    score *= 0.3; // penalidade forte
  }

  // 2) País LATAM específico diferente de Brasil (ex.: Remote-Argentina)
  const mentionsLatamNonBrazil = LATAM_COUNTRIES_NOT_BRAZIL.some(c =>
    job.location?.toLowerCase().includes(c) || text.includes(c)
  );
  if (mentionsLatamNonBrazil && !hasBrazilMention) {
    // Se menciona um país LATAM específico e não menciona Brasil, desprioriza
    score *= 0.5; // penalidade moderada
    // E reduz a relevância de localização reportada
    locationRelevance = Math.max(locationRelevance - 15, 0);
  }
  
  const factors: ScoringFactors = {
    keywordMatch: normalizedKeywordScore,
    locationRelevance: locationRelevance,
    companyRelevance,
    salaryPresent,
    descriptionQuality,
  };
  
  return {
    score: Math.round(Math.min(score, 100)), // Cap em 100
    factors,
    matchedKeywords,
  };
}

// Heurística simples para classificar roleCategory
export function inferRoleCategory(job: Partial<Job>): RoleCategory {
  const t = `${job.title} ${job.description} ${job.tags?.join(' ')}`.toLowerCase();
  const includesAny = (arr: string[]) => arr.some(k => t.includes(k));
  if (includesAny(RELEVANT_KEYWORDS.product)) return 'product';
  if (includesAny(RELEVANT_KEYWORDS.design)) return 'design';
  if (includesAny(RELEVANT_KEYWORDS.qa)) return 'qa';
  if (includesAny(RELEVANT_KEYWORDS.data)) return 'data';
  if (includesAny(RELEVANT_KEYWORDS.marketing)) return 'marketing';
  if (includesAny(RELEVANT_KEYWORDS.sales)) return 'sales';
  if (includesAny(RELEVANT_KEYWORDS.support)) return 'support';
  if (
    includesAny(RELEVANT_KEYWORDS.frontend) ||
    includesAny(RELEVANT_KEYWORDS.backend) ||
    includesAny(RELEVANT_KEYWORDS.fullstack) ||
    includesAny(RELEVANT_KEYWORDS.mobile) ||
    includesAny(RELEVANT_KEYWORDS.devops)
  ) return 'engineering';
  return 'other';
}

// Função para filtrar vagas por score mínimo
export function filterJobsByScore(jobs: Job[], minScore: number = 30): Job[] {
  return jobs.filter(job => (job.score || 0) >= minScore);
}

// Função para ordenar vagas por relevância
export function sortJobsByRelevance(jobs: Job[]): Job[] {
  return jobs.sort((a, b) => {
    // Featured jobs first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    
    // Then by score
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    
    // Finally by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// Função para detectar duplicatas
export function findDuplicateJobs(jobs: Job[]): string[][] {
  const duplicates: string[][] = [];
  const seen = new Map<string, string>();
  
  for (const job of jobs) {
    // Criar uma chave única baseada em título e empresa (normalizada)
    const key = `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
    
    if (seen.has(key)) {
      const existingId = seen.get(key)!;
      // Verificar se já foi adicionado aos duplicados
      let group = duplicates.find(g => g.includes(existingId));
      if (!group) {
        group = [existingId];
        duplicates.push(group);
      }
      group.push(job.id);
    } else {
      seen.set(key, job.id);
    }
  }
  
  return duplicates;
}
