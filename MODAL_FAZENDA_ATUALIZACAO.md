# Atualização do Modal de Fazenda - Novos Metrics

## 📋 Resumo das Mudanças

O modal da página de Fazendas foi completamente redesenhado para exibir métricas de negócio mais relevantes.

## 🎨 Mudanças no Frontend

### 1. **Seção "Último Frete"** (linha 1165-1190)
**ANTES:**
```tsx
<Badge variant="outline" className="font-mono">{selectedProducao.ultimo_frete}</Badge>
```

**DEPOIS:**
Agora exibe informações formatadas em múltiplas linhas:
- Data formatada: `dd/MM/yyyy` (ex: 15/02/2025)
- Nome do motorista
- Placa do caminhão
- Rota de origem → destino

Exemplo visual:
```
Último Frete:
  15/02/2025
  João Silva (ABC-1234)
  São Paulo → Brasília
```

### 2. **Seção "Precificação"** (linha 1159)
**ANTES:** "Média Real/Saca: R$ XXX"  
**DEPOIS:** "Lucro Liquido/Saca: R$ XXX"

**Cálculo:**
```
Lucro Liquido/Saca = (faturamento_total - total_custos_operacionais) / total_sacas_carregadas
```

Fallback se `lucro_liquido` não estiver disponível:
```
Lucro Liquido/Saca = (faturamento_total - total_custos_operacionais) / total_sacas_carregadas
```

### 3. **Seção "Análise de Performance"** (linhas 1178-1205)
**ANTES:** 3 métricas estimadas
- Faturamento/Tonelada
- Fretes Estimados (cálculo: `Math.ceil(sacas / 1200)`)
- Peso Real Médio/Saca

**DEPOIS:** 3 métricas reais do banco de dados
1. **Fretes Realizados** (cor azul)
   - Campo: `total_fretes_realizados` 
   - Valor esperado: número inteiro (COUNT de fretes)

2. **Custos Operacionais** (cor vermelha)
   - Campo: `total_custos_operacionais`
   - Valor esperado: número decimal (SUM dos custos)
   - Formato: R$ (2 casas decimais)

3. **Receita Liquida** (cor verde ou vermelha conforme resultado)
   - Campo: `lucro_liquido` 
   - Valor esperado: número decimal
   - Cálculo (se não fornecido): `faturamento_total - total_custos_operacionais`
   - Cor positiva (verde): se >= 0
   - Cor negativa (vermelho): se < 0

## 📦 Estrutura de Dados Esperada do Backend

### GET `/fazendas/:id`

A resposta GET deve retornar a Fazenda com os seguintes campos:

```typescript
interface Fazenda {
  // Campos existentes
  id: string;
  fazenda: string;
  localizacao?: string | null;
  proprietario?: string | null;
  mercadoria: string;
  variedade?: string | null;
  safra?: string | null;
  preco_por_tonelada?: number | null;
  peso_medio_saca?: number | null;
  total_sacas_carregadas?: number | null;
  total_toneladas?: number | null;
  faturamento_total?: number | null;
  
  // 🆕 NOVOS CAMPOS NECESSÁRIOS
  // Para seção "Último Frete"
  ultimo_frete_data?: string | null;           // ISO date string (ex: "2025-02-15T10:30:00Z")
  ultimo_frete_motorista?: string | null;      // Nome do motorista
  ultimo_frete_placa?: string | null;          // Placa do caminhão (ex: "ABC-1234")
  ultimo_frete_origem?: string | null;         // Cidade/local de origem
  ultimo_frete_destino?: string | null;        // Cidade/local de destino
  
  // Para seção "Performance"
  total_fretes_realizados?: number | null;     // COUNT de fretes (inteiro)
  total_custos_operacionais?: number | null;   // SUM de custos (decimal)
  lucro_liquido?: number | null;               // Decimal: faturamento - custos
  
  created_at?: string;
  updated_at?: string;
}
```

## 🔧 Como Implementar no Backend

### Query para GET `/fazendas/:id`

Você deve fazer um JOIN com a tabela de Fretes para calcular:

```sql
SELECT 
  f.*,
  -- Último frete
  (SELECT COALESCE(fr.data_frete, NULL) FROM fretes fr 
   WHERE fr.fazenda_id = f.id ORDER BY fr.data_frete DESC LIMIT 1) as ultimo_frete_data,
  (SELECT COALESCE(mo.nome, NULL) FROM fretes fr 
   JOIN motoristas mo ON fr.motorista_id = mo.id 
   WHERE fr.fazenda_id = f.id ORDER BY fr.data_frete DESC LIMIT 1) as ultimo_frete_motorista,
  (SELECT COALESCE(ca.placa, NULL) FROM fretes fr 
   JOIN caminhoes ca ON fr.caminhao_id = ca.id 
   WHERE fr.fazenda_id = f.id ORDER BY fr.data_frete DESC LIMIT 1) as ultimo_frete_placa,
  (SELECT COALESCE(fr.origem, NULL) FROM fretes fr 
   WHERE fr.fazenda_id = f.id ORDER BY fr.data_frete DESC LIMIT 1) as ultimo_frete_origem,
  (SELECT COALESCE(fr.destino, NULL) FROM fretes fr 
   WHERE fr.fazenda_id = f.id ORDER BY fr.data_frete DESC LIMIT 1) as ultimo_frete_destino,
  -- Performance metrics
  COUNT(DISTINCT fri.id) as total_fretes_realizados,
  COALESCE(SUM(cu.valor), 0) as total_custos_operacionais,
  (f.faturamento_total - COALESCE(SUM(cu.valor), 0)) as lucro_liquido
FROM fazendas f
LEFT JOIN fretes fri ON f.id = fri.fazenda_id
LEFT JOIN custos cu ON fri.id = cu.frete_id
WHERE f.id = :fazendaId
GROUP BY f.id
```

### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "id": "FAZ-123456",
    "fazenda": "Fazenda Santo Antônio",
    "localizacao": "São Paulo, SP",
    "proprietario": "João da Silva",
    "mercadoria": "Amendoim",
    "variedade": "Runner",
    "safra": "2025",
    "preco_por_tonelada": 5500.00,
    "peso_medio_saca": 30,
    "total_sacas_carregadas": 1000,
    "total_toneladas": 30,
    "faturamento_total": 165000.00,
    
    "ultimo_frete_data": "2025-02-15T10:30:00Z",
    "ultimo_frete_motorista": "João Silva",
    "ultimo_frete_placa": "ABC-1234",
    "ultimo_frete_origem": "São Paulo",
    "ultimo_frete_destino": "Brasília",
    
    "total_fretes_realizados": 2,
    "total_custos_operacionais": 8500.50,
    "lucro_liquido": 156499.50,
    
    "colheita_finalizada": false,
    "created_at": "2025-01-15T08:00:00Z",
    "updated_at": "2025-02-15T10:30:00Z"
  }
}
```

## ✅ Checklist para Implementação Backend

- [ ] Adicionar campos à tabela `fazendas` (ou criar VIEW para calcular)
  - [ ] `ultimo_frete_data`
  - [ ] `ultimo_frete_motorista`
  - [ ] `ultimo_frete_placa`
  - [ ] `ultimo_frete_origem`
  - [ ] `ultimo_frete_destino`
  - [ ] `total_fretes_realizados`
  - [ ] `total_custos_operacionais`
  - [ ] `lucro_liquido`

- [ ] Atualizar endpoint `GET /fazendas/:id` para retornar novos campos

- [ ] Atualizar endpoint `GET /fazendas` para retornar novos campos (lista)

- [ ] Implementar endpoint `POST /fazendas/:id/incrementar-volume` (atualmente retorna 404)
  - Deve aceitar: `{ toneladas: number }`
  - Deve atualizar: `total_toneladas += toneladas` e `updated_at = now()`

- [ ] Testar com curl/Postman:
  ```bash
  # GET
  curl http://localhost:3000/fazendas/FAZ-123456
  
  # POST incrementar volume
  curl -X POST http://localhost:3000/fazendas/FAZ-123456/incrementar-volume \
    -H "Content-Type: application/json" \
    -d '{"toneladas": 20}'
  ```

## 📝 Notas Importantes

1. **Data Formatting**: O frontend espera datas em ISO format (ex: "2025-02-15T10:30:00Z") e as formata como "dd/MM/yyyy" automaticamente

2. **Fallback Values**: Se o backend não retornar `lucro_liquido`, o frontend calcula como `faturamento_total - total_custos_operacionais`

3. **Numeric Coercion**: O frontend espera números (não strings) nos campos numéricos. Use `Number()` para conversão se necessário

4. **Null Handling**: Se `ultimo_frete_data` é null, exibe "-" no lugar de tentar formatar

5. **Color coding**: Receita Liquida muda de cor baseado no valor:
   - Verde se >= 0
   - Vermelho se < 0

## 🔗 Arquivos Modificados

- ✅ [src/pages/Fazendas.tsx](src/pages/Fazendas.tsx) - Modal redesenhado
- ✅ [src/types/index.ts](src/types/index.ts) - Interface Fazenda atualizada com novos campos
- ✅ Import adicionado: `import { format } from "date-fns"` e `import { ptBR } from "date-fns/locale"`

## 🎯 Status

Frontend: **PRONTO** ✅  
Backend: **A IMPLEMENTAR** ⏳

O frontend está pronto para exibir os novos dados assim que o backend retornar os campos necessários.
