import { BaseCrawler, CrawlerConfig, CrawlResult, cleanText } from './base';

interface GreenhouseJob {
  id: string;
  title: string;
  updated_at: string;
  location: {
    name: string;
  };
  departments: Array<{
    name: string;
  }>;
  offices: Array<{
    name: string;
    location: {
      name: string;
    };
  }>;
  absolute_url: string;
  internal_job_id: number;
  content?: string;
  metadata?: Array<{
    name: string;
    value: string;
  }>;
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
  meta?: {
    total: number;
    next_page?: string;
  };
}

export class GreenhouseCrawler extends BaseCrawler {
  private apiUrl: string;
  private companySlug: string;
  
  constructor(config: CrawlerConfig & { apiToken?: string }) {
    super(config);
    // Extrai o slug da empresa do baseUrl, aceitando:
    // - https://boards.greenhouse.io/<slug>
    // - https://job-boards.greenhouse.io/<slug>
    // - https://boards-api.greenhouse.io/v1/boards/<slug>
    const url = new URL(config.baseUrl);
    const parts = url.pathname.split('/').filter(Boolean);
    this.companySlug = parts[parts.length - 1] || '';
    // Usa o endpoint oficial da API do Greenhouse
    this.apiUrl = `https://boards-api.greenhouse.io/v1/boards/${this.companySlug}/jobs`;
  }
  
  async crawl(): Promise<CrawlResult> {
    const result: CrawlResult = {
      success: false,
      jobsFound: 0,
      jobsProcessed: 0,
      errors: [],
      jobs: [],
    };
    
    try {
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore && currentPage <= (this.config.maxPages || 5)) {
        await this.delay(this.getRateLimit());
        
        const pageResult = await this.crawlPage(currentPage);
        
        if (!pageResult.success) {
          result.errors.push(...pageResult.errors);
          break;
        }
        
        result.jobsFound += pageResult.jobsFound;
        result.jobsProcessed += pageResult.jobsProcessed;
        result.jobs.push(...pageResult.jobs);
        
        hasMore = pageResult.hasMore || false;
        currentPage++;
      }
      
      result.success = result.errors.length === 0 || result.jobsProcessed > 0;
      result.nextCrawlAt = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 horas
      
    } catch (error) {
      result.errors.push(`Crawler failed: ${error}`);
    }
    
    return result;
  }
  
  private async crawlPage(page: number): Promise<CrawlResult & { hasMore?: boolean }> {
    const result: CrawlResult & { hasMore?: boolean } = {
      success: false,
      jobsFound: 0,
      jobsProcessed: 0,
      errors: [],
      jobs: [],
      hasMore: false,
    };
    
    try {
      // Construir query para buscar apenas vagas remotas para brasileiros
      const searchParams = new URLSearchParams({
        content: 'true',
        page: page.toString(),
        limit: '100',
      });
      
      const response = await fetch(`${this.apiUrl}?${searchParams}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'RemoteJobsBrazil/1.0',
        },
        signal: AbortSignal.timeout(this.config.timeout),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
  const data: GreenhouseResponse = await response.json();
      result.jobsFound = data.jobs?.length || 0;
      
      if (data.jobs) {
        for (const rawJob of data.jobs) {
          const processedJob = this.processRawJob(rawJob);
          if (processedJob) {
            result.jobs.push(processedJob);
            result.jobsProcessed++;
          }
        }
      }
      
  // Greenhouse não fornece next_page; continua se atingiu o limite da página
  result.hasMore = result.jobsFound >= 100;
      result.success = true;
      
    } catch (error) {
      result.errors.push(`Page ${page} failed: ${error}`);
    }
    
    return result;
  }
  
  protected extractTitle(rawJob: GreenhouseJob): string {
    return cleanText(rawJob.title);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected extractCompany(_: GreenhouseJob): string {
    // Greenhouse não retorna o nome da empresa diretamente
    // Usa o slug da empresa como fallback legível
    if (this.companySlug) {
      const slug = this.companySlug.toLowerCase();
      const map: Record<string, string> = {
        remotecom: 'Remote',
        gitlab: 'GitLab',
      };
      if (map[slug]) return map[slug];
      return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
    return 'Company';
  }
  
  protected extractLocation(rawJob: GreenhouseJob): string {
    let location = rawJob.location?.name || '';
    
    // Priorizar offices remotos
    if (rawJob.offices && rawJob.offices.length > 0) {
      const remoteOffice = rawJob.offices.find(office => 
        office.name.toLowerCase().includes('remote') ||
        office.location?.name.toLowerCase().includes('remote')
      );
      
      if (remoteOffice) {
        location = remoteOffice.location?.name || remoteOffice.name;
      } else {
        location = rawJob.offices[0].location?.name || rawJob.offices[0].name;
      }
    }
    
    return cleanText(location) || 'Remote';
  }
  
  protected extractType(rawJob: GreenhouseJob): string | undefined {
    // Greenhouse não tem campo específico, tentar extrair do metadata
    if (rawJob.metadata) {
      const typeField = rawJob.metadata.find(m => 
        m.name.toLowerCase().includes('type') || 
        m.name.toLowerCase().includes('employment')
      );
      if (typeField) {
        return cleanText(typeField.value);
      }
    }
    
    return 'Full-time'; // default
  }
  
  protected extractSalary(rawJob: GreenhouseJob): string | undefined {
    // Tentar extrair salário do conteúdo ou metadata
    if (rawJob.content) {
      const salaryRegex = /(\$[\d,]+\s*-\s*\$[\d,]+|\$[\d,]+k?\+?|R\$[\d,]+\s*-\s*R\$[\d,]+)/i;
      const match = rawJob.content.match(salaryRegex);
      if (match) {
        return cleanText(match[0]);
      }
    }
    
    if (rawJob.metadata) {
      const salaryField = rawJob.metadata.find(m => 
        m.name.toLowerCase().includes('salary') || 
        m.name.toLowerCase().includes('compensation')
      );
      if (salaryField) {
        return cleanText(salaryField.value);
      }
    }
    
    return undefined;
  }
  
  protected extractDescription(rawJob: GreenhouseJob): string | undefined {
    return rawJob.content ? cleanText(rawJob.content) : undefined;
  }
  
  protected extractApplyUrl(rawJob: GreenhouseJob): string {
    return rawJob.absolute_url;
  }
  
  protected extractOriginalUrl(rawJob: GreenhouseJob): string | undefined {
    return rawJob.absolute_url;
  }
  
  protected extractTags(rawJob: GreenhouseJob): string[] | undefined {
    const tags: string[] = [];
    
    // Adicionar departamentos como tags
    if (rawJob.departments) {
      tags.push(...rawJob.departments.map(dept => dept.name.toLowerCase()));
    }
    
    // Extrair tags do título e descrição
    const text = `${rawJob.title} ${rawJob.content || ''}`.toLowerCase();
    
    const techKeywords = [
      'react', 'javascript', 'typescript', 'node.js', 'python', 'java',
      'golang', 'rust', 'vue', 'angular', 'full-stack', 'frontend', 'backend'
    ];
    
    for (const keyword of techKeywords) {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    }
    
    return tags.length > 0 ? Array.from(new Set(tags)) : undefined;
  }
  
  protected extractCreatedAt(rawJob: GreenhouseJob): string | undefined {
    return rawJob.updated_at;
  }
}

// Configurações específicas para empresas que usam Greenhouse
export const GREENHOUSE_CONFIGS: CrawlerConfig[] = [
  {
  name: 'Remote.com Greenhouse',
    source: 'greenhouse',
  baseUrl: 'https://job-boards.greenhouse.io/remotecom',
    enabled: true,
    rateLimit: 10, // 10 requests per minute
    timeout: 10000,
    maxPages: 3,
  searchTerms: ['remote', 'latam', 'brazil'],
  },
  {
    name: 'GitLab Greenhouse',
    source: 'greenhouse',
  baseUrl: 'https://job-boards.greenhouse.io/gitlab',
    enabled: true,
    rateLimit: 10,
    timeout: 10000,
    maxPages: 5,
  searchTerms: ['engineering', 'developer', 'remote', 'latam'],
  },
  // Adicionar mais empresas conforme necessário
];
