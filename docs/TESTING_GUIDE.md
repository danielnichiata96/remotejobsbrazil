# 🧪 Testando o Sistema de Crawlers

## Como testar localmente

### 1. Configure o ambiente

```bash
# Execute o setup
./setup-crawlers.sh

# Configure o .env.local
echo "ADMIN_KEY=test-admin-key-123" >> .env.local
```

### 2. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 3. Faça login como admin

1. Acesse http://localhost:3000/admin
2. Use a senha definida em ADMIN_KEY
3. Você será redirecionado para o dashboard

### 4. Teste os crawlers via API

```bash
# Listar crawlers disponíveis (exemplo com Remote.com e GitLab)
curl http://localhost:3000/api/crawlers

# As fontes configuradas para teste são:
# - Remote.com: https://job-boards.greenhouse.io/remotecom
# - GitLab: https://job-boards.greenhouse.io/gitlab

# Executar todos os crawlers (precisa estar logado como admin)
curl -X POST http://localhost:3000/api/crawlers \
  -H "Content-Type: application/json" \
  -H "Cookie: rjb_admin=seu-token-aqui" \
  -d '{"action":"run_all"}'

# Executar um crawler específico
curl -X POST http://localhost:3000/api/crawlers \
  -H "Content-Type: application/json" \
  -H "Cookie: rjb_admin=seu-token-aqui" \
  -d '{"action":"run_specific","crawlerName":"Remote.com Greenhouse"}'

# ou
curl -X POST http://localhost:3000/api/crawlers \
  -H "Content-Type: application/json" \
  -H "Cookie: rjb_admin=seu-token-aqui" \
  -d '{"action":"run_specific","crawlerName":"GitLab Greenhouse"}'
```

### 5. Teste a curadoria manual

1. Acesse http://localhost:3000/admin/dashboard
2. Veja as vagas coletadas automaticamente
3. Use os filtros para ver apenas vagas `pending`
4. Aprove/rejeite vagas individualmente ou em lote
5. Destaque vagas importantes

### 6. Verifique os resultados

1. Acesse http://localhost:3000 para ver as vagas aprovadas
2. Vagas `featured` aparecem primeiro
3. Apenas vagas `approved` e `featured` são públicas

## Exemplo de resposta do crawler

```json
{
  "success": true,
  "sessionResult": {
    "sessionId": "session-1725192000000",
    "totalJobsFound": 45,
    "totalJobsProcessed": 12,
    "duplicatesRemoved": 3,
    "finalJobs": [
      {
        "id": "greenhouse-1725192000000-abc123",
        "title": "Senior Full-Stack Engineer",
        "company": "GitLab",
        "location": "Remote, Brazil",
        "score": 85,
        "source": "greenhouse",
        "status": "pending",
        "keywordsMatched": ["remote", "brazil", "full-stack", "react", "node.js"],
        "applyUrl": "https://boards.greenhouse.io/gitlab/jobs/123456"
      }
    ]
  }
}
```

## Troubleshooting

### Crawler retorna 0 vagas
- Verifique se a empresa ainda usa Greenhouse
- Confirme se há vagas remotas disponíveis
- Ajuste os pesos de scoring em `scoring.ts`

### Score muito baixo
- Vagas precisam ter keywords de "remote" E "brazil-friendly"
- Ajuste os pesos em `DEFAULT_SCORING_CONFIG`
- Adicione mais keywords relevantes
 - Observação: Vagas com "NORAM"/"North America only"/"US or Canada only" são penalizadas fortemente
 - Observação: Vagas com países LATAM específicos (ex.: Argentina/Colombia/Chile/México etc.) sem mencionar Brasil também são despriorizadas

### Erro de autenticação
- Verifique se ADMIN_KEY está configurado
- Confirme se o cookie de admin está sendo enviado
- Teste fazendo login via /admin primeiro
