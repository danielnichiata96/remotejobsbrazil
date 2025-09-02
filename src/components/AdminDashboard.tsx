'use client';

import { useState, useEffect } from 'react';
import { Job, JobStatus, JobSource } from '../lib/jobs.shared';

interface CrawlerStats {
  name: string;
  source: string;
  enabled: boolean;
  lastRun?: Date;
}

interface AdminDashboardProps {
  initialJobs: Job[];
}

export default function AdminDashboard({ initialJobs }: AdminDashboardProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [crawlers, setCrawlers] = useState<CrawlerStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCurated, setEditingCurated] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<{
    status?: JobStatus;
    source?: JobSource;
  minScore?: number;
  roleCategory?: string;
  }>({});
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCrawlers();
  }, []);

  const fetchCrawlers = async () => {
    try {
      const response = await fetch('/api/crawlers');
      const data = await response.json();
      if (data.success) {
        setCrawlers(data.crawlers);
      }
    } catch (error) {
      console.error('Failed to fetch crawlers:', error);
    }
  };

  const runAllCrawlers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/crawlers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_all' }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`✅ Crawling completed! ${data.sessionResult.finalJobs.length} new jobs collected.`);
        // Refresh jobs
        window.location.reload();
      } else {
        alert(`❌ Crawling failed: ${data.error}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCrawler = async (crawlerName: string, enabled: boolean) => {
    try {
      const action = enabled ? 'disable_crawler' : 'enable_crawler';
      const response = await fetch('/api/crawlers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, crawlerName }),
      });
      
      if (response.ok) {
        await fetchCrawlers();
      }
    } catch (error) {
      console.error('Failed to toggle crawler:', error);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: JobStatus) => {
    try {
      const response = await fetch('/api/jobs/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          jobIds: [jobId],
          status: newStatus,
        }),
      });
      
      if (response.ok) {
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        ));
      }
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  const bulkUpdateStatus = async (newStatus: JobStatus) => {
    if (selectedJobs.size === 0) return;
    
    try {
      const response = await fetch('/api/jobs/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          jobIds: Array.from(selectedJobs),
          status: newStatus,
        }),
      });
      
      if (response.ok) {
        setJobs(jobs.map(job => 
          selectedJobs.has(job.id) ? { ...job, status: newStatus } : job
        ));
        setSelectedJobs(new Set());
      }
    } catch (error) {
      console.error('Failed to bulk update jobs:', error);
    }
  };

  const saveCurated = async (jobId: string) => {
    const text = editingCurated[jobId] ?? '';
    try {
      const res = await fetch('/api/jobs/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_curated',
          jobId,
          curatedDescription: text.trim() || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const updated = jobs.map(j => j.id === jobId ? { ...j, curatedDescription: text.trim() || undefined } : j);
      setJobs(updated);
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar o resumo.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter.status && job.status !== filter.status) return false;
    if (filter.source && job.source !== filter.source) return false;
    if (filter.minScore && (job.score || 0) < filter.minScore) return false;
  if (filter.roleCategory && job.roleCategory !== filter.roleCategory) return false;
    return true;
  });

  const getScoreColor = (score: number = 0) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Curadoria de Vagas</h1>
        
        {/* Crawler Controls */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">🤖 Crawlers Automáticos</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={runAllCrawlers}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '⏳ Coletando...' : '🚀 Executar Todos os Crawlers'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crawlers.map((crawler) => (
              <div key={crawler.name} className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{crawler.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    crawler.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {crawler.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Fonte: {crawler.source}</p>
                <button
                  onClick={() => toggleCrawler(crawler.name, crawler.enabled)}
                  className={`px-3 py-1 rounded text-sm ${
                    crawler.enabled 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {crawler.enabled ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Job Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-3">🔍 Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({...filter, status: e.target.value as JobStatus || undefined})}
              className="border rounded px-3 py-2"
            >
              <option value="">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
              <option value="featured">Destaque</option>
            </select>
            
            <select
              value={filter.source || ''}
              onChange={(e) => setFilter({...filter, source: e.target.value as JobSource || undefined})}
              className="border rounded px-3 py-2"
            >
              <option value="">Todas as Fontes</option>
              <option value="manual">Manual</option>
              <option value="greenhouse">Greenhouse</option>
              <option value="lever">Lever</option>
              <option value="other">Outros</option>
            </select>
            
            <input
              type="number"
              placeholder="Score mínimo"
              value={filter.minScore || ''}
              onChange={(e) => setFilter({...filter, minScore: e.target.value ? parseInt(e.target.value) : undefined})}
              className="border rounded px-3 py-2"
              min="0"
              max="100"
            />
            <select
              value={filter.roleCategory || ''}
              onChange={(e) => setFilter({...filter, roleCategory: e.target.value || undefined})}
              className="border rounded px-3 py-2"
            >
              <option value="">Todas as Funções</option>
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
              <option value="qa">QA</option>
              <option value="data">Data</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="ops">Ops</option>
              <option value="other">Other</option>
            </select>
            
            <button
              onClick={() => setFilter({})}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedJobs.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedJobs.size} vaga(s) selecionada(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => bulkUpdateStatus('approved')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  ✅ Aprovar
                </button>
                <button
                  onClick={() => bulkUpdateStatus('rejected')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  ❌ Rejeitar
                </button>
                <button
                  onClick={() => bulkUpdateStatus('featured')}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  ⭐ Destacar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              📋 Vagas ({filteredJobs.length})
            </h3>
            <button
              onClick={() => {
                const allJobIds = new Set(filteredJobs.map(j => j.id));
                setSelectedJobs(selectedJobs.size === filteredJobs.length ? new Set() : allJobIds);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedJobs.size === filteredJobs.length ? 'Desmarcar Todos' : 'Marcar Todos'}
            </button>
          </div>
          
          {filteredJobs.map((job) => (
            <div key={job.id} className="border rounded p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedJobs.has(job.id)}
                  onChange={(e) => {
                    const newSelected = new Set(selectedJobs);
                    if (e.target.checked) {
                      newSelected.add(job.id);
                    } else {
                      newSelected.delete(job.id);
                    }
                    setSelectedJobs(newSelected);
                  }}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                      {job.roleCategory && (
                        <p className="text-xs text-gray-500 mt-0.5">Função: {job.roleCategory}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {job.score && (
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(job.score)}`}>
                          Score: {job.score}
                        </span>
                      )}
                      
                      <span className={`px-2 py-1 rounded text-xs ${
                        job.source === 'manual' ? 'bg-blue-100 text-blue-800' :
                        job.source === 'greenhouse' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.source}
                      </span>
                      
                      <span className={`px-2 py-1 rounded text-xs ${
                        job.status === 'approved' ? 'bg-green-100 text-green-800' :
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {job.status}
                      </span>
                      
                      {job.isFeatured && (
                        <span className="text-yellow-500">⭐</span>
                      )}
                    </div>
                  </div>
                  
                  {job.keywordsMatched && job.keywordsMatched.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Keywords: </span>
                      {job.keywordsMatched.map((keyword: string, i: number) => (
                        <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateJobStatus(job.id, 'approved')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                    >
                      ✅ Aprovar
                    </button>
                    <button
                      onClick={() => updateJobStatus(job.id, 'rejected')}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                    >
                      ❌ Rejeitar
                    </button>
                    <button
                      onClick={() => updateJobStatus(job.id, 'featured')}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
                    >
                      ⭐ Destacar
                    </button>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                    >
                      🔗 Ver Vaga
                    </a>
                  </div>

                  {/* Resumo PT-BR editor */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">📝 Resumo PT-BR</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Escreva um resumo curto e único em PT-BR para SEO (140-300 chars)."
                      value={editingCurated[job.id] ?? job.curatedDescription ?? ''}
                      onChange={(e) => setEditingCurated({ ...editingCurated, [job.id]: e.target.value })}
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => saveCurated(job.id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                      >
                        Salvar resumo
                      </button>
                      <span className="text-xs text-gray-500">
                        {((editingCurated[job.id] ?? job.curatedDescription ?? '').length)} caracteres
                      </span>
                    </div>
                    {(editingCurated[job.id] ?? job.curatedDescription) && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <span className="font-medium mr-1">Preview:</span>
                        <span className="whitespace-pre-wrap">{editingCurated[job.id] ?? job.curatedDescription}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
