import { BaseCrawler, CrawlerConfig, CrawlResult } from './base';
import { GreenhouseCrawler, GREENHOUSE_CONFIGS } from './greenhouse';
import { Job } from '../jobs.shared';
import { findDuplicateJobs, sortJobsByRelevance } from '../scoring';

export interface CrawlSessionResult {
  sessionId: string;
  startedAt: Date;
  completedAt: Date;
  totalCrawlers: number;
  successfulCrawlers: number;
  totalJobsFound: number;
  totalJobsProcessed: number;
  duplicatesRemoved: number;
  errors: string[];
  results: Array<{
    crawlerName: string;
    result: CrawlResult;
  }>;
  finalJobs: Partial<Job>[];
}

export class CrawlerManager {
  private crawlers: Map<string, BaseCrawler> = new Map();
  private configs: CrawlerConfig[] = [];
  
  constructor() {
    this.initializeCrawlers();
  }
  
  private initializeCrawlers() {
    // Adicionar configurações de todos os tipos de crawlers
    this.configs = [
      ...GREENHOUSE_CONFIGS,
      // Adicionar outras configurações quando implementados (Lever, Ashby, etc.)
    ];
    
    // Criar instâncias dos crawlers
    for (const config of this.configs) {
      if (!config.enabled) continue;
      
      let crawler: BaseCrawler;
      
      switch (config.source) {
        case 'greenhouse':
          crawler = new GreenhouseCrawler(config);
          break;
        // case 'lever':
        //   crawler = new LeverCrawler(config);
        //   break;
        default:
          console.warn(`Unknown crawler source: ${config.source}`);
          continue;
      }
      
      this.crawlers.set(config.name, crawler);
    }
  }
  
  async runAllCrawlers(): Promise<CrawlSessionResult> {
    const sessionId = `session-${Date.now()}`;
    const startedAt = new Date();
    
    const sessionResult: CrawlSessionResult = {
      sessionId,
      startedAt,
      completedAt: new Date(),
      totalCrawlers: this.crawlers.size,
      successfulCrawlers: 0,
      totalJobsFound: 0,
      totalJobsProcessed: 0,
      duplicatesRemoved: 0,
      errors: [],
      results: [],
      finalJobs: [],
    };
    
    console.log(`🚀 Starting crawl session ${sessionId} with ${this.crawlers.size} crawlers`);
    
    // Executar todos os crawlers
    for (const [crawlerName, crawler] of this.crawlers.entries()) {
      console.log(`🔍 Running crawler: ${crawlerName}`);
      
      try {
        const result = await crawler.crawl();
        
        sessionResult.results.push({
          crawlerName,
          result,
        });
        
        sessionResult.totalJobsFound += result.jobsFound;
        sessionResult.totalJobsProcessed += result.jobsProcessed;
        
        if (result.success) {
          sessionResult.successfulCrawlers++;
          sessionResult.finalJobs.push(...result.jobs);
        }
        
        sessionResult.errors.push(...result.errors.map(e => `${crawlerName}: ${e}`));
        
        console.log(`✅ ${crawlerName}: ${result.jobsFound} found, ${result.jobsProcessed} processed`);
        
      } catch (error) {
        const errorMsg = `Failed to run crawler ${crawlerName}: ${error}`;
        sessionResult.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
      
      // Delay entre crawlers para não sobrecarregar
      await this.delay(2000);
    }
    
    // Remover duplicatas
    sessionResult.finalJobs = this.removeDuplicates(sessionResult.finalJobs);
    sessionResult.duplicatesRemoved = sessionResult.totalJobsProcessed - sessionResult.finalJobs.length;
    
    // Ordenar por relevância
    sessionResult.finalJobs = sortJobsByRelevance(sessionResult.finalJobs as Job[]);
    
    sessionResult.completedAt = new Date();
    
    console.log(`🎉 Crawl session completed: ${sessionResult.finalJobs.length} unique jobs`);
    
    return sessionResult;
  }
  
  async runSpecificCrawler(crawlerName: string): Promise<CrawlResult | null> {
    const crawler = this.crawlers.get(crawlerName);
    if (!crawler) {
      return null;
    }
    
    console.log(`🔍 Running specific crawler: ${crawlerName}`);
    return await crawler.crawl();
  }
  
  private removeDuplicates(jobs: Partial<Job>[]): Partial<Job>[] {
    const duplicateGroups = findDuplicateJobs(jobs as Job[]);
    
    // Para cada grupo de duplicatas, manter apenas o com maior score
    const toRemove = new Set<string>();
    
    for (const group of duplicateGroups) {
      if (group.length > 1) {
        const jobsInGroup = jobs.filter(j => group.includes(j.id!));
        const bestJob = jobsInGroup.reduce((best, current) => 
          (current.score || 0) > (best.score || 0) ? current : best
        );
        
        // Marcar outros para remoção
        group.forEach(id => {
          if (id !== bestJob.id) {
            toRemove.add(id);
          }
        });
      }
    }
    
    return jobs.filter(job => !toRemove.has(job.id!));
  }
  
  getCrawlerStats(): Array<{
    name: string;
    source: string;
    enabled: boolean;
    lastRun?: Date;
  }> {
    return this.configs.map(config => ({
      name: config.name,
      source: config.source,
      enabled: config.enabled,
      // lastRun seria armazenado em cache/DB
    }));
  }
  
  enableCrawler(crawlerName: string): void {
    const config = this.configs.find(c => c.name === crawlerName);
    if (config) {
      config.enabled = true;
      this.initializeCrawlers(); // Re-initialize
    }
  }
  
  disableCrawler(crawlerName: string): void {
    const config = this.configs.find(c => c.name === crawlerName);
    if (config) {
      config.enabled = false;
      this.crawlers.delete(crawlerName);
    }
  }
  
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instância singleton para uso global
export const crawlerManager = new CrawlerManager();
