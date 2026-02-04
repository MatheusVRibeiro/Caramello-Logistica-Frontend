-- =============================================================================
-- Tabela: fazendas
-- Descrição: Cadastro de fazendas produtoras e controle de produção
-- =============================================================================

CREATE TABLE IF NOT EXISTS fazendas (
  -- Identificação Principal
  id VARCHAR(255) PRIMARY KEY COMMENT 'ID único da fazenda',
  fazenda VARCHAR(200) NOT NULL COMMENT 'Nome da fazenda',
  localizacao VARCHAR(255) NOT NULL COMMENT 'Cidade/Estado da fazenda',
  proprietario VARCHAR(200) NOT NULL COMMENT 'Nome do proprietário',
  
  -- Produção
  mercadoria VARCHAR(100) NOT NULL COMMENT 'Tipo de mercadoria produzida (ex: Amendoim em Casca)',
  variedade VARCHAR(100) COMMENT 'Variedade/tipo específico (ex: Verde, Vermelho, Runner)',
  safra VARCHAR(20) NOT NULL COMMENT 'Safra atual (ex: 2024/2025)',
  
  -- Especificações
  preco_por_tonelada DECIMAL(10,2) NOT NULL COMMENT 'Preço base por tonelada',
  peso_medio_saca DECIMAL(10,2) DEFAULT 25.00 COMMENT 'Peso médio da saca em kg',
  
  -- Totalizadores (Atualizados por Fretes)
  total_sacas_carregadas INT DEFAULT 0 COMMENT 'Total de sacas já carregadas nesta safra',
  total_toneladas DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Total de toneladas já carregadas nesta safra',
  faturamento_total DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Faturamento total gerado nesta safra',
  
  -- Controle
  ultimo_frete DATE COMMENT 'Data do último frete realizado',
  colheita_finalizada BOOLEAN DEFAULT FALSE COMMENT 'Indica se a colheita da safra foi finalizada',
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação do registro',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da última atualização',
  
  -- Índices para otimização
  INDEX idx_fazenda (fazenda),
  INDEX idx_localizacao (localizacao),
  INDEX idx_safra (safra),
  INDEX idx_proprietario (proprietario),
  INDEX idx_colheita_finalizada (colheita_finalizada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cadastro de fazendas e controle de produção';

-- =============================================================================
-- Dados de Exemplo
-- =============================================================================

INSERT INTO fazendas (
  id, fazenda, localizacao, proprietario, mercadoria, variedade, safra,
  preco_por_tonelada, peso_medio_saca, total_sacas_carregadas, total_toneladas,
  faturamento_total, ultimo_frete, colheita_finalizada
) VALUES
  (
    '1', 'Fazenda Santa Esperança', 'Marília, SP', 'João Silva',
    'Amendoim em Casca', 'Verde', '2024/2025',
    600.00, 25.00, 0, 0.00, 0.00, NULL, FALSE
  ),
  (
    '2', 'Fazenda Boa Vista', 'Tupã, SP', 'Maria Santos',
    'Amendoim em Casca', 'Vermelho', '2024/2025',
    720.00, 25.00, 0, 0.00, 0.00, NULL, FALSE
  ),
  (
    '3', 'Fazenda São João', 'Jaboticabal, SP', 'Pedro Costa',
    'Amendoim Premium', 'Selecionado', '2024/2025',
    1000.00, 25.00, 0, 0.00, 0.00, NULL, FALSE
  ),
  (
    '4', 'Fazenda Vale Verde', 'Ribeirão Preto, SP', 'Lucas Oliveira',
    'Amendoim Descascado', 'Tipo 1', '2024/2025',
    800.00, 25.00, 0, 0.00, 0.00, NULL, FALSE
  ),
  (
    '5', 'Fazenda Recanto', 'Barretos, SP', 'André Ribeiro',
    'Amendoim em Casca', 'Runner', '2024/2025',
    640.00, 25.00, 0, 0.00, 0.00, NULL, FALSE
  )
ON DUPLICATE KEY UPDATE
  fazenda = VALUES(fazenda),
  localizacao = VALUES(localizacao),
  preco_por_tonelada = VALUES(preco_por_tonelada);

-- =============================================================================
-- Observações sobre a estrutura
-- =============================================================================
-- 1. Totalizadores (sacas, toneladas, faturamento) começam em 0
-- 2. São atualizados automaticamente quando fretes são registrados
-- 3. Campo 'ultimo_frete' ajuda no controle de entregas
-- 4. 'colheita_finalizada' marca o fim da safra (não permite mais fretes)
-- 5. Peso médio da saca padrão: 25kg (padrão do setor de amendoim)
-- 6. Preço por tonelada define o valor base para cálculos de frete
-- 7. Safra no formato 'AAAA/AAAA' (ex: 2024/2025)
-- 8. Localizacao armazena cidade e estado para referência de rotas

-- =============================================================================
-- Queries de Exemplo
-- =============================================================================

-- Listar todas as fazendas ativas (colheita não finalizada)
-- SELECT id, fazenda, localizacao, proprietario, mercadoria, variedade,
--        total_sacas_carregadas, total_toneladas, FORMAT(faturamento_total, 2, 'pt_BR') as faturamento
-- FROM fazendas
-- WHERE colheita_finalizada = FALSE
-- ORDER BY fazenda;

-- Buscar fazenda por nome
-- SELECT * FROM fazendas
-- WHERE fazenda LIKE '%Santa%'
-- ORDER BY fazenda;

-- Ranking de fazendas por faturamento
-- SELECT fazenda, localizacao, proprietario,
--        FORMAT(faturamento_total, 2, 'pt_BR') as faturamento,
--        total_toneladas, total_sacas_carregadas
-- FROM fazendas
-- WHERE safra = '2024/2025'
-- ORDER BY faturamento_total DESC;

-- Fazendas por safra
-- SELECT safra, COUNT(*) as total_fazendas,
--        SUM(total_toneladas) as total_toneladas,
--        SUM(faturamento_total) as faturamento_total
-- FROM fazendas
-- GROUP BY safra
-- ORDER BY safra DESC;

-- Fazendas que ainda não tiveram nenhum frete
-- SELECT fazenda, localizacao, proprietario, mercadoria
-- FROM fazendas
-- WHERE total_sacas_carregadas = 0
--   AND colheita_finalizada = FALSE
-- ORDER BY fazenda;

-- Atualizar totalizadores após registrar frete (normalmente feito pelo backend)
-- UPDATE fazendas
-- SET total_sacas_carregadas = total_sacas_carregadas + 1000,
--     total_toneladas = total_toneladas + 25.00,
--     faturamento_total = faturamento_total + 15000.00,
--     ultimo_frete = CURDATE(),
--     updated_at = CURRENT_TIMESTAMP
-- WHERE id = '1';

-- Finalizar colheita de uma fazenda (bloqueia novos fretes)
-- UPDATE fazendas
-- SET colheita_finalizada = TRUE,
--     updated_at = CURRENT_TIMESTAMP
-- WHERE id = '1';

-- Reabrir colheita (desfazer finalização)
-- UPDATE fazendas
-- SET colheita_finalizada = FALSE
-- WHERE id = '1';

-- Resetar totalizadores para nova safra
-- UPDATE fazendas
-- SET total_sacas_carregadas = 0,
--     total_toneladas = 0,
--     faturamento_total = 0,
--     ultimo_frete = NULL,
--     colheita_finalizada = FALSE,
--     safra = '2025/2026'
-- WHERE id = '1';

-- Buscar fazendas por região (cidade)
-- SELECT fazenda, localizacao, proprietario, mercadoria
-- FROM fazendas
-- WHERE localizacao LIKE '%Marília%'
-- ORDER BY fazenda;

-- Listar fazendas por tipo de mercadoria
-- SELECT mercadoria, COUNT(*) as total_fazendas,
--        SUM(total_toneladas) as total_toneladas
-- FROM fazendas
-- WHERE safra = '2024/2025'
-- GROUP BY mercadoria
-- ORDER BY total_toneladas DESC;

-- Média de preço por tonelada por tipo de mercadoria
-- SELECT mercadoria, 
--        AVG(preco_por_tonelada) as preco_medio,
--        MIN(preco_por_tonelada) as preco_min,
--        MAX(preco_por_tonelada) as preco_max
-- FROM fazendas
-- WHERE colheita_finalizada = FALSE
-- GROUP BY mercadoria;

-- Fazendas com maior volume de produção (top 10)
-- SELECT fazenda, localizacao, total_toneladas, total_sacas_carregadas,
--        FORMAT(faturamento_total, 2, 'pt_BR') as faturamento
-- FROM fazendas
-- WHERE safra = '2024/2025'
-- ORDER BY total_toneladas DESC
-- LIMIT 10;

-- =============================================================================
-- Triggers Sugeridos (Implementar no backend)
-- =============================================================================

-- Trigger para calcular faturamento baseado em toneladas e preço
-- DELIMITER $$
-- CREATE TRIGGER trg_calcula_faturamento
-- BEFORE UPDATE ON fazendas
-- FOR EACH ROW
-- BEGIN
--   -- Recalcula faturamento quando toneladas mudam
--   IF NEW.total_toneladas != OLD.total_toneladas THEN
--     SET NEW.faturamento_total = NEW.total_toneladas * NEW.preco_por_tonelada;
--   END IF;
-- END$$
-- DELIMITER ;

-- Trigger para validar peso médio saca (deve ser > 0)
-- DELIMITER $$
-- CREATE TRIGGER trg_valida_peso_saca
-- BEFORE INSERT ON fazendas
-- FOR EACH ROW
-- BEGIN
--   IF NEW.peso_medio_saca <= 0 THEN
--     SIGNAL SQLSTATE '45000'
--     SET MESSAGE_TEXT = 'Peso médio da saca deve ser maior que zero';
--   END IF;
-- END$$
-- DELIMITER ;

-- =============================================================================
-- Integrações Futuras
-- =============================================================================

-- Relacionamento com Fretes (implementar quando criar tabela fretes)
-- ALTER TABLE fretes ADD COLUMN fazenda_origem_id VARCHAR(255);
-- ALTER TABLE fretes ADD CONSTRAINT fk_fretes_fazenda 
--   FOREIGN KEY (fazenda_origem_id) REFERENCES fazendas(id) ON DELETE RESTRICT;

-- View para resumo de produção por fazenda
-- CREATE OR REPLACE VIEW vw_resumo_fazendas AS
-- SELECT 
--   f.id, f.fazenda, f.localizacao, f.proprietario, f.mercadoria,
--   f.total_sacas_carregadas, f.total_toneladas, f.faturamento_total,
--   COUNT(fr.id) as total_fretes,
--   MAX(fr.data_saida) as ultimo_frete_data
-- FROM fazendas f
-- LEFT JOIN fretes fr ON f.id = fr.fazenda_origem_id
-- WHERE f.safra = '2024/2025'
-- GROUP BY f.id;

-- =============================================================================
-- Manutenção
-- =============================================================================

-- Atualizar preço por tonelada
-- UPDATE fazendas 
-- SET preco_por_tonelada = 750.00 
-- WHERE id = '1';

-- Corrigir dados de produção manualmente
-- UPDATE fazendas
-- SET total_sacas_carregadas = 5000,
--     total_toneladas = 125.00,
--     faturamento_total = 75000.00
-- WHERE id = '1';

-- Migrar fazenda para nova safra
-- UPDATE fazendas
-- SET safra = '2025/2026',
--     total_sacas_carregadas = 0,
--     total_toneladas = 0,
--     faturamento_total = 0,
--     ultimo_frete = NULL,
--     colheita_finalizada = FALSE
-- WHERE id = '1';
