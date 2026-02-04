-- =============================================================================
-- Tabela: Frota
-- Descrição: Gerenciamento completo da frota de veículos
-- =============================================================================

CREATE TABLE IF NOT EXISTS Frota (
  -- Identificação Principal
  id VARCHAR(255) PRIMARY KEY COMMENT 'ID único do veículo',
  placa VARCHAR(10) NOT NULL UNIQUE COMMENT 'Placa do caminhão trator (ex: ABC-1234)',
  placa_carreta VARCHAR(10) UNIQUE COMMENT 'Placa do reboque/carreta para bitrens/carretas',
  modelo VARCHAR(100) NOT NULL COMMENT 'Modelo completo do veículo incluindo marca (ex: Volvo FH 540)',
  ano_fabricacao INT NOT NULL COMMENT 'Ano de fabricação do veículo',
  
  -- Status e Operação
  status ENUM('disponivel', 'em_viagem', 'manutencao') NOT NULL DEFAULT 'disponivel' COMMENT 'Status operacional do veículo',
  motorista_fixo_id VARCHAR(255) COMMENT 'ID do motorista fixo associado (FK para tabela motoristas) - Motorista que opera este veículo regularmente',
  
  -- Especificações Técnicas
  capacidade_toneladas DECIMAL(10,2) NOT NULL COMMENT 'Capacidade de carga em toneladas',
  km_atual INT NOT NULL DEFAULT 0 COMMENT 'Quilometragem atual do veículo',
  tipo_combustivel ENUM('DIESEL', 'S10', 'ARLA', 'OUTRO') DEFAULT 'S10' COMMENT 'Tipo de combustível utilizado',
  tipo_veiculo ENUM('TRUCADO', 'TOCO', 'CARRETA', 'BITREM', 'RODOTREM') NOT NULL COMMENT 'Classificação do tipo de veículo',
  
  -- Documentação e Fiscal (Essencial para Logística Real)
  renavam VARCHAR(20) UNIQUE COMMENT 'RENAVAM do caminhão trator',
  renavam_carreta VARCHAR(20) UNIQUE COMMENT 'RENAVAM do reboque/carreta',
  chassi VARCHAR(30) UNIQUE COMMENT 'Número do chassi do veículo',
  registro_antt VARCHAR(20) COMMENT 'Registro na Agência Nacional de Transportes Terrestres',
  validade_seguro DATE COMMENT 'Data de vencimento do seguro do veículo',
  validade_licenciamento DATE COMMENT 'Data de vencimento do licenciamento (CRLV)',
  
  -- Gestão e Manutenção
  proprietario_tipo ENUM('PROPRIO', 'TERCEIRO', 'AGREGADO') DEFAULT 'PROPRIO' COMMENT 'Tipo de proprietário (próprio, terceirizado ou agregado)',
  ultima_manutencao_data DATE COMMENT 'Data da última manutenção realizada',
  proxima_manutencao_km INT COMMENT 'Quilometragem prevista para próxima revisão',
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação do registro',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da última atualização',

  -- Relacionamento com a tabela de motoristas
  FOREIGN KEY (motorista_fixo_id) REFERENCES motoristas(id) ON DELETE SET NULL,
  
  -- Índices para otimização de consultas
  INDEX idx_placa (placa),
  INDEX idx_status (status),
  INDEX idx_motorista_fixo (motorista_fixo_id),
  INDEX idx_tipo_veiculo (tipo_veiculo),
  INDEX idx_validade_seguro (validade_seguro),
  INDEX idx_validade_licenciamento (validade_licenciamento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gestão completa da frota de veículos';

-- =============================================================================
-- Dados de Exemplo
-- =============================================================================

INSERT INTO Frota (
  id, placa, placa_carreta, modelo, ano_fabricacao, status, motorista_fixo_id,
  capacidade_toneladas, km_atual, tipo_combustivel, tipo_veiculo, renavam, renavam_carreta,
  chassi, registro_antt, validade_seguro, validade_licenciamento, proprietario_tipo,
  ultima_manutencao_data, proxima_manutencao_km
) VALUES
  (
    '1', 'ABC-1234', 'CRT-5678', 'Volvo FH 540', 2020, 'em_viagem', 'MOT-001',
    40.00, 245000, 'S10', 'CARRETA', '12345678901', '98765432109',
    '9BWHE21JX24060831', 'ANTT-2020-001', '2025-12-15', '2025-03-31', 'PROPRIO',
    '2025-01-15', 250000
  ),
  (
    '2', 'DEF-5678', 'BTR-9012', 'Scania R450', 2019, 'disponivel', 'MOT-002',
    35.00, 180000, 'DIESEL', 'BITREM', '23456789012', '87654321098',
    '9BSE4X2BXCR123456', 'ANTT-2019-002', '2025-11-20', '2025-02-28', 'TERCEIRO',
    '2025-01-10', 200000
  ),
  (
    '3', 'GHI-9012', NULL, 'Mercedes Actros', 2018, 'manutencao', NULL,
    38.00, 320000, 'S10', 'TRUCADO', '34567890123', NULL,
    'WDB9340231K123789', 'ANTT-2018-003', '2025-10-10', '2025-01-15', 'PROPRIO',
    '2025-01-25', 350000
  ),
  (
    '4', 'JKL-3456', 'DAF-7890', 'DAF XF', 2021, 'disponivel', 'MOT-003',
    42.00, 95000, 'S10', 'CARRETA', '45678901234', '76543210987',
    'XLRTE47MS0E654321', 'ANTT-2021-004', '2026-06-30', '2025-04-15', 'AGREGADO',
    '2025-01-05', 150000
  ),
  (
    '5', 'MNO-7890', 'RDT-1234', 'Volvo FH 500', 2020, 'em_viagem', 'MOT-004',
    40.00, 210000, 'DIESEL', 'RODOTREM', '56789012345', '65432109876',
    'YV2A22C60GA456789', 'ANTT-2020-005', '2025-08-18', '2025-05-22', 'PROPRIO',
    '2025-01-12', 240000
  )
ON DUPLICATE KEY UPDATE
  placa = VALUES(placa),
  modelo = VALUES(modelo),
  status = VALUES(status);

-- =============================================================================
-- Observações sobre a estrutura
-- =============================================================================
-- 1. Campos ENUM garantem valores padronizados e evitam inconsistências
-- 2. Datas separadas para documentação facilitam alertas de vencimento
-- 3. Relacionamento com motoristas permite rastrear motorista fixo do veículo
--    - ON DELETE SET NULL: Se motorista for excluído, veículo fica sem motorista fixo
--    - Permite reatribuir motorista facilmente através da tela de gestão
-- 4. Índices melhoram performance em consultas frequentes
-- 5. Campos de auditoria (created_at/updated_at) rastreiam mudanças
-- 6. UNIQUE em placas/RENAVAM/chassi evita duplicatas
-- 7. Campo placa_carreta opcional suporta tanto carretas quanto caminhões simples
-- 8. Campo modelo agora contém marca + modelo para identificação completa

-- =============================================================================
-- Queries de Exemplo - Relacionamento Frota x Motoristas
-- =============================================================================

-- Listar todos os veículos com seus motoristas
-- SELECT f.placa, f.modelo, m.nome as motorista, m.tipo as tipo_motorista
-- FROM Frota f
-- LEFT JOIN motoristas m ON f.motorista_fixo_id = m.id;

-- Veículos disponíveis sem motorista fixo
-- SELECT placa, modelo, status 
-- FROM Frota 
-- WHERE motorista_fixo_id IS NULL AND status = 'disponivel';

-- Veículos por motorista
-- SELECT m.nome, COUNT(f.id) as total_veiculos, 
--        GROUP_CONCAT(f.placa SEPARATOR ', ') as placas
-- FROM motoristas m
-- LEFT JOIN Frota f ON m.id = f.motorista_fixo_id
-- GROUP BY m.id, m.nome;

-- Veículos com documentação próxima do vencimento (30 dias)
-- SELECT placa, modelo, validade_seguro, validade_licenciamento
-- FROM Frota
-- WHERE validade_seguro <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
--    OR validade_licenciamento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY);
