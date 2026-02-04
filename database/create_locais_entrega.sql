-- Tabela de Locais de Entrega (opções fixas)
CREATE TABLE locais_entrega (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cidade VARCHAR(80) NOT NULL,
  estado CHAR(2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_locais_entrega_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seeds (opções fixas iniciais)
INSERT INTO locais_entrega (id, nome, cidade, estado) VALUES
  (UUID(), 'Matriz, Tupã', 'Tupã', 'SP'),
  (UUID(), 'Filial 1, Tupã', 'Tupã', 'SP'),
  (UUID(), 'Filial 2, Tupã', 'Tupã', 'SP'),
  (UUID(), 'Filial 3 - Mato Grosso', 'Nova Andradina', 'MT'),
  (UUID(), 'Filial 4, Tupã', 'Tupã', 'SP');
