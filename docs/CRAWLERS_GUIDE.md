# 🤖 Sistema de Crawlers e Curadoria - Remote Jobs Brazil

## Visão Geral

Este sistema implementa uma estratégia híbrida para coletar e curar vagas remotas para desenvolvedores brasileiros, combinando automação inteligente com curadoria manual.

## ✨ Características Principais

### 1. **Crawlers Automatizados**
- **Fontes Suportadas**: Greenhouse, Lever, Ashby, Workable
- **Filtragem Inteligente**: Apenas vagas remotas que aceitam brasileiros
- **Sistema de Pontuação**: 0-100 baseado em relevância
- **Deduplicação Automática**: Remove vagas repetidas mantendo a de maior score
- **Rate Limiting**: Respeita limites de API das fontes

### 2. **Sistema de Pontuação**
```typescript
// Fatores de relevância (pesos configuráveis)
keywordWeights: {
  frontend: 8,      // React, JavaScript, TypeScript
  backend: 8,       // Node.js, Python, Java
  fullstack: 10,    // Full-stack positions (prioritário)
  mobile: 7,        // React Native, Flutter
  devops: 6,        // AWS, Docker, Kubernetes
  data: 7,          // Data Science, ML
  levels: 3,        // Junior, Senior, Staff
  remote: 15,       // CRÍTICO - deve ser remoto
  brazilFriendly: 20 // CRÍTICO - deve aceitar brasileiros
}
```

### 3. **Curadoria Manual**
- **Interface Admin**: Dashboard completo para revisão
- **Bulk Operations**: Aprovar/rejeitar múltiplas vagas
- **Sistema de Status**: pending, approved, rejected, featured
- **Jobs Destacados**: Promoção manual de oportunidades estratégicas
- **Notas do Curador**: Comentários internos para context

## 🚀 Como Iniciar

### Passo 1: Configuração Inicial

```bash
# Execute o script de setup
./setup-crawlers.sh

# Configure as variáveis de ambiente em .env.local
ADMIN_KEY=sua-chave-admin-secreta
CRAWLER_RATE_LIMIT=10
CRAWLER_TIMEOUT=10000
```

### Passo 2: Migrações do Banco (Supabase)

```sql
-- Execute a migração para adicionar campos de scoring
-- Arquivo: supabase/migrations/20250901120000_job-scoring-system.sql
```

### Passo 3: Acesso ao Admin

1. Acesse `/admin` para fazer login
2. Acesse `/admin/dashboard` para o dashboard completo
3. Configure crawlers e teste a coleta

## 📡 API Endpoints

### `/api/crawlers` (GET)
Lista status de todos os crawlers configurados.

### `/api/crawlers` (POST)
Controla execução dos crawlers:

```javascript
// Executar todos os crawlers
{
  "action": "run_all"
}

// Executar crawler específico
{
  "action": "run_specific",
  "crawlerName": "Stripe Greenhouse"
}

// Ativar/desativar crawler
{
  "action": "enable_crawler", // ou "disable_crawler"
  "crawlerName": "GitLab Greenhouse"
}
```

### `/api/jobs/bulk` (POST)
Operações em massa para curadoria:

```javascript
// Atualizar status de múltiplas vagas
{
  "action": "update_status",
  "jobIds": ["job-1", "job-2"],
  "status": "approved"
}
```

## 🔧 Configuração de Crawlers

### Greenhouse
```typescript
{
  name: 'Remote.com Greenhouse',
  source: 'greenhouse',
  baseUrl: 'https://job-boards.greenhouse.io/remotecom',
  enabled: true,
  rateLimit: 10, // requests per minute
  timeout: 10000,
  maxPages: 3,
}

{
  name: 'GitLab Greenhouse',
  source: 'greenhouse',
  baseUrl: 'https://job-boards.greenhouse.io/gitlab',
  enabled: true,
  rateLimit: 10, // requests per minute
  timeout: 10000,
  maxPages: 5,
}
```

Observação: O crawler aceita tanto URLs de board `https://boards.greenhouse.io/<slug>` quanto `https://job-boards.greenhouse.io/<slug>`; internamente ele usa a API `https://boards-api.greenhouse.io/v1/boards/<slug>/jobs`.

### Adicionando Novas Fontes

1. Crie um novo crawler em `src/lib/crawlers/`
2. Estenda a classe `BaseCrawler`
3. Implemente os métodos de extração específicos
4. Adicione à configuração no `manager.ts`

## 📈 Estratégia de Curadoria

### Fase 1: Coleta Automatizada
- Crawlers executam a cada 4 horas
- Filtram automaticamente por score > 30
- Removem duplicatas
- Status inicial: `pending`

### Fase 2: Revisão Manual
- Curador revisa vagas `pending`
- Aprova (`approved`) vagas relevantes
- Rejeita (`rejected`) vagas inadequadas
- Destaca (`featured`) oportunidades premium

### Fase 3: Publicação
- Apenas vagas `approved` e `featured` aparecem no site
- Jobs `featured` aparecem primeiro na listagem
- Ordenação por score + data de criação

## 🛠 Manutenção

### Script de Limpeza Automática
```bash
# Execute para remover duplicatas
node scripts/cleanup-duplicates.js
```

### Monitoramento via Logs
```bash
# Logs de execução dos crawlers
tail -f /var/log/crawler.log
```

### Cron Job Recomendado
```bash
# Executa crawlers a cada 4 horas
0 */4 * * * /path/to/project/scripts/run-crawlers.sh >> /var/log/crawler.log 2>&1

# Limpeza de duplicatas diária
0 2 * * * cd /path/to/project && node scripts/cleanup-duplicates.js
```

## 📊 Métricas e KPIs

### Dashboard Admin mostra:
- Total de crawlers ativos
- Jobs coletados por sessão
- Taxa de aprovação por fonte
- Score médio das vagas
- Duplicatas removidas
- Tempo desde última execução

### Otimizações Futuras:
- Machine Learning para scoring automático
- Feedback loop baseado em aplicações
- Analytics de performance por empresa
- Integração com mais fontes (AngelList, RemoteOK, etc.)

## 🔍 Troubleshooting

### Crawler Falha
1. Verifique logs no dashboard admin
2. Teste conectividade com a fonte
3. Verifique rate limits
4. Valide estrutura de resposta da API

### Duplicatas Persistentes
1. Execute script de limpeza manual
2. Ajuste algoritmo de detecção
3. Verifique normalização de texto

### Score Baixo Demais
1. Ajuste pesos no `scoring.ts`
2. Adicione keywords relevantes
3. Verifique critérios de localização

---

## 💡 Próximas Melhorias

1. **Integração com mais fontes**: AngelList, RemoteOK, We Work Remotely
2. **ML para scoring**: Usar histórico de aplicações para melhorar relevância
3. **Webhook notifications**: Alertas para novas vagas de alta qualidade
4. **API pública**: Permitir integrações externas
5. **Analytics avançado**: Métricas detalhadas de performance
