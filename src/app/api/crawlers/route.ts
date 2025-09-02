import { NextRequest, NextResponse } from "next/server";
import { crawlerManager } from "../../../lib/crawlers/manager";
import { writeJobs, readJobs } from "../../../lib/jobs";
import { isAdmin } from "../../../lib/auth";
import { Job } from "../../../lib/jobs.shared";

// GET /api/crawlers - Listar status dos crawlers
export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = crawlerManager.getCrawlerStats();
    
    return NextResponse.json({
      success: true,
      crawlers: stats,
      totalCrawlers: stats.length,
      enabledCrawlers: stats.filter(c => c.enabled).length,
    });
    
  } catch (error) {
    console.error("Failed to get crawler stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/crawlers - Executar crawlers
export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, crawlerName } = body;

    switch (action) {
      case "run_all": {
        const sessionResult = await crawlerManager.runAllCrawlers();
        
        // Integrar vagas coletadas com o sistema existente
        if (sessionResult.finalJobs.length > 0) {
          const existingJobs = await readJobs();
          // Ensure newly crawled jobs start as pending for manual review
          const normalizedNew = sessionResult.finalJobs.map(j => ({
            ...j,
            status: 'pending',
          }));
          const allJobs = [...(normalizedNew as Job[]), ...existingJobs];
          
          // Salvar no sistema (Supabase ou JSON)
          const saveResult = await writeJobs(allJobs as Job[]);
          
          if (!saveResult.ok) {
            console.error("Failed to save crawled jobs:", saveResult.error);
          }
        }
        
        return NextResponse.json({
          success: true,
          sessionResult,
          message: `Crawling completed. ${sessionResult.finalJobs.length} new jobs collected.`
        });
      }
      
      case "run_specific": {
        if (!crawlerName) {
          return NextResponse.json(
            { error: "crawlerName is required for run_specific action" },
            { status: 400 }
          );
        }
        
        const result = await crawlerManager.runSpecificCrawler(crawlerName);
        
        if (!result) {
          return NextResponse.json(
            { error: "Crawler not found" },
            { status: 404 }
          );
        }
        
        // Integrar vagas coletadas
        if (result.jobs.length > 0) {
          const existingJobs = await readJobs();
          const normalizedNew = result.jobs.map(j => ({
            ...j,
            status: 'pending',
          }));
          const allJobs = [...(normalizedNew as Job[]), ...existingJobs];
          await writeJobs(allJobs);
        }
        
        return NextResponse.json({
          success: true,
          result,
          message: `${result.jobsProcessed} jobs collected from ${crawlerName}`
        });
      }
      
      case "enable_crawler": {
        if (!crawlerName) {
          return NextResponse.json(
            { error: "crawlerName is required" },
            { status: 400 }
          );
        }
        
        crawlerManager.enableCrawler(crawlerName);
        
        return NextResponse.json({
          success: true,
          message: `Crawler ${crawlerName} enabled`
        });
      }
      
      case "disable_crawler": {
        if (!crawlerName) {
          return NextResponse.json(
            { error: "crawlerName is required" },
            { status: 400 }
          );
        }
        
        crawlerManager.disableCrawler(crawlerName);
        
        return NextResponse.json({
          success: true,
          message: `Crawler ${crawlerName} disabled`
        });
      }
      
      default: {
        return NextResponse.json(
          { error: "Invalid action. Use: run_all, run_specific, enable_crawler, disable_crawler" },
          { status: 400 }
        );
      }
    }
    
  } catch (error) {
    console.error("Crawler API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
