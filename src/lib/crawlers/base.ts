import { Job, JobSource } from '../jobs.shared';
import { calculateJobScore } from '../scoring';

export interface CrawlerConfig {
  name: string;
  source: JobSource;
  baseUrl: string;
  enabled: boolean;
  rateLimit: number; // requests per minute
  timeout: number; // milliseconds
  maxPages?: number;
  searchTerms?: string[];
}

export interface CrawlResult {
  success: boolean;
  jobsFound: number;
  jobsProcessed: number;
  errors: string[];
  jobs: Partial<Job>[];
  nextCrawlAt?: Date;
}

export abstract class BaseCrawler {
  protected config: CrawlerConfig;
  
  constructor(config: CrawlerConfig) {
    this.config = config;
  }
  
  abstract crawl(): Promise<CrawlResult>;
  
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  protected getRateLimit(): number {
    return 60000 / this.config.rateLimit; // milliseconds between requests
  }
  
  protected processRawJob(rawJob: unknown): Partial<Job> | null {
    try {
      const processedJob: Partial<Job> = {
        id: this.generateJobId(),
        title: this.extractTitle(rawJob),
        company: this.extractCompany(rawJob),
        location: this.extractLocation(rawJob),
        type: this.extractType(rawJob),
        salary: this.extractSalary(rawJob),
        description: this.extractDescription(rawJob),
        applyUrl: this.extractApplyUrl(rawJob),
        originalUrl: this.extractOriginalUrl(rawJob),
        tags: this.extractTags(rawJob),
        source: this.config.source,
        crawledAt: new Date().toISOString(),
        createdAt: this.extractCreatedAt(rawJob) || new Date().toISOString(),
      };
      
      // Calcular score automático
      const scoring = calculateJobScore(processedJob);
      processedJob.score = scoring.score;
      processedJob.keywordsMatched = scoring.matchedKeywords;
      processedJob.scoringFactors = scoring.factors;
      
      // Só retorna se passou no score mínimo
      return scoring.score >= 30 ? processedJob : null;
      
    } catch (error) {
      console.error('Error processing job:', error);
      return null;
    }
  }
  
  protected generateJobId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    return `${this.config.source}-${timestamp}-${random}`;
  }
  
  // Métodos abstratos que devem ser implementados por cada crawler específico
  protected abstract extractTitle(rawJob: unknown): string;
  protected abstract extractCompany(rawJob: unknown): string;
  protected abstract extractLocation(rawJob: unknown): string;
  protected abstract extractType(rawJob: unknown): string | undefined;
  protected abstract extractSalary(rawJob: unknown): string | undefined;
  protected abstract extractDescription(rawJob: unknown): string | undefined;
  protected abstract extractApplyUrl(rawJob: unknown): string;
  protected abstract extractOriginalUrl(rawJob: unknown): string | undefined;
  protected abstract extractTags(rawJob: unknown): string[] | undefined;
  protected abstract extractCreatedAt(rawJob: unknown): string | undefined;
}

// Função utilitária para limpar texto
export function cleanText(text: string | undefined | null): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

// Função para validar URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Função para extrair domínio de email/site da empresa
export function extractDomain(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return undefined;
  }
}
