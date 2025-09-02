#!/bin/bash

echo "🚀 Configurando sistema de crawlers e curadoria..."

# Instalar dependências adicionais se necessário
echo "📦 Verificando dependências..."

# Criar diretórios necessários
mkdir -p scripts
mkdir -p src/lib/crawlers
mkdir -p data/crawl-logs

# Criar arquivo de configuração de ambiente
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cat > .env.local << EOF
# Admin configuration
ADMIN_KEY=your-secret-admin-key-here

# Crawler configuration
CRAWLER_RATE_LIMIT=10
CRAWLER_TIMEOUT=10000

# Optional: API keys for specific crawlers
# GREENHOUSE_API_KEY=your-greenhouse-key
# LEVER_API_KEY=your-lever-key
EOF
    echo "⚠️  Configure as variáveis em .env.local"
fi

# Criar script de cronjob para execução automática
cat > scripts/run-crawlers.sh << 'EOF'
#!/bin/bash

echo "Starting crawler job at $(date)"

# Execute crawlers via API
curl -X POST http://localhost:3000/api/crawlers \
  -H "Content-Type: application/json" \
  -d '{"action":"run_all"}' \
  -H "Cookie: rjb_admin=your-admin-token"

echo "Crawler job completed at $(date)"
EOF

chmod +x scripts/run-crawlers.sh

# Criar script de limpeza de duplicatas
cat > scripts/cleanup-duplicates.js << 'EOF'
const { readJobs, writeJobs } = require('../src/lib/jobs');
const { findDuplicateJobs } = require('../src/lib/scoring');

async function cleanupDuplicates() {
  console.log('🧹 Iniciando limpeza de duplicatas...');
  
  const jobs = await readJobs();
  const duplicates = findDuplicateJobs(jobs);
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhuma duplicata encontrada');
    return;
  }
  
  console.log(`🔍 Encontradas ${duplicates.length} grupos de duplicatas`);
  
  // Remover duplicatas mantendo o job com maior score
  const toRemove = new Set();
  
  for (const group of duplicates) {
    if (group.length > 1) {
      const jobsInGroup = jobs.filter(j => group.includes(j.id));
      const bestJob = jobsInGroup.reduce((best, current) => 
        (current.score || 0) > (best.score || 0) ? current : best
      );
      
      group.forEach(id => {
        if (id !== bestJob.id) {
          toRemove.add(id);
        }
      });
    }
  }
  
  const cleanJobs = jobs.filter(job => !toRemove.has(job.id));
  
  await writeJobs(cleanJobs);
  
  console.log(`✅ Removidas ${toRemove.size} duplicatas. ${cleanJobs.length} vagas restantes.`);
}

cleanupDuplicates().catch(console.error);
EOF

echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis em .env.local"
echo "2. Execute as migrações do Supabase (se usando)"
echo "3. Acesse /admin/dashboard para testar a interface"
echo "4. Configure um cron job para executar scripts/run-crawlers.sh"
echo ""
echo "🔗 Exemplo de cron job (executa a cada 4 horas):"
echo "0 */4 * * * /path/to/your/project/scripts/run-crawlers.sh >> /var/log/crawler.log 2>&1"
echo ""
echo "🧪 Para testar os crawlers manualmente:"
echo "curl -X POST http://localhost:3000/api/crawlers -H 'Content-Type: application/json' -d '{\"action\":\"run_all\"}'"
