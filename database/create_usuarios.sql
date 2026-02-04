-- =============================================================================
-- Tabela: usuarios
-- Descrição: Gerenciamento de usuários do sistema
-- =============================================================================

CREATE TABLE IF NOT EXISTS usuarios (
  -- Identificação Principal
  id VARCHAR(255) PRIMARY KEY COMMENT 'ID único do usuário',
  nome VARCHAR(200) NOT NULL COMMENT 'Nome completo do usuário',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email para login (único)',
  senha_hash VARCHAR(255) NOT NULL COMMENT 'Hash da senha (bcrypt)',
  
  -- Controle de Acesso
  role ENUM('admin', 'contabilidade', 'operador') NOT NULL DEFAULT 'operador' COMMENT 'Nível de acesso do usuário',
  ativo BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Indica se o usuário está ativo no sistema',
  
  -- Informações Adicionais
  telefone VARCHAR(20) COMMENT 'Telefone de contato',
  cpf VARCHAR(14) UNIQUE COMMENT 'CPF do usuário (opcional)',
  
  -- Segurança e Auditoria
  ultimo_acesso TIMESTAMP NULL COMMENT 'Data/hora do último login',
  tentativas_login_falhas INT DEFAULT 0 COMMENT 'Contador de tentativas de login falhas (segurança)',
  bloqueado_ate TIMESTAMP NULL COMMENT 'Data/hora até quando o usuário está bloqueado',
  token_recuperacao VARCHAR(255) COMMENT 'Token para recuperação de senha',
  token_expiracao TIMESTAMP NULL COMMENT 'Data/hora de expiração do token',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação do usuário',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da última atualização',
  
  -- Índices para otimização
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gerenciamento de usuários do sistema';

-- =============================================================================
-- Usuário Inicial (Gestor Principal)
-- =============================================================================
-- IMPORTANTE: Altere a senha após o primeiro login!
-- Senha padrão: "Admin@2025" 
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMye1J5fQZHEKhQ7M5f9mNvTLtCkMLr6j.K

INSERT INTO usuarios (
  id, nome, email, senha_hash, role, ativo, created_at
) VALUES (
  'USR-001',
  'Matheus Ribeiro',
  'admin@rnlogistica.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye1J5fQZHEKhQ7M5f9mNvTLtCkMLr6j.K',
  'admin',
  TRUE,
  CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  role = VALUES(role),
  ativo = VALUES(ativo);

-- =============================================================================
-- Observações sobre a estrutura
-- =============================================================================
-- 1. Role 'admin': Acesso total ao sistema (gestor principal)
--    - Gerencia frota, fretes, motoristas, custos, pagamentos, relatórios
--    - Único usuário inicial com acesso completo
--
-- 2. Role 'contabilidade': Acesso futuro planejado
--    - Acesso restrito à área de pagamentos
--    - Visualização de relatórios financeiros
--    - Será implementado posteriormente
--
-- 3. Role 'operador': Reservado para expansão futura
--    - Acesso limitado a operações específicas
--    - Não utilizado no momento
--
-- 4. Campo 'ativo': Permite desativar usuários sem excluir registros
--
-- 5. Segurança:
--    - Senhas armazenadas com hash bcrypt (custo 10)
--    - Bloqueio automático após múltiplas tentativas falhas
--    - Token para recuperação de senha com expiração
--
-- 6. Auditoria:
--    - Registro de último acesso
--    - Controle de tentativas de login
--    - Timestamps de criação e atualização

-- =============================================================================
-- Queries de Exemplo
-- =============================================================================

-- Listar todos os usuários ativos
-- SELECT id, nome, email, role, ultimo_acesso, created_at
-- FROM usuarios
-- WHERE ativo = TRUE
-- ORDER BY created_at DESC;

-- Verificar usuário por email (para login)
-- SELECT id, nome, email, senha_hash, role, ativo, tentativas_login_falhas, bloqueado_ate
-- FROM usuarios
-- WHERE email = 'admin@rnlogistica.com' AND ativo = TRUE;

-- Atualizar último acesso (após login bem-sucedido)
-- UPDATE usuarios
-- SET ultimo_acesso = CURRENT_TIMESTAMP, tentativas_login_falhas = 0
-- WHERE id = 'USR-001';

-- Incrementar tentativas de login falhas
-- UPDATE usuarios
-- SET tentativas_login_falhas = tentativas_login_falhas + 1
-- WHERE email = 'admin@rnlogistica.com';

-- Bloquear usuário após 5 tentativas falhas (exemplo: bloquear por 30 minutos)
-- UPDATE usuarios
-- SET bloqueado_ate = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE)
-- WHERE email = 'admin@rnlogistica.com' AND tentativas_login_falhas >= 5;

-- Desbloquear usuário (manual ou após expiração automática)
-- UPDATE usuarios
-- SET bloqueado_ate = NULL, tentativas_login_falhas = 0
-- WHERE id = 'USR-001';

-- Criar token de recuperação de senha (válido por 1 hora)
-- UPDATE usuarios
-- SET token_recuperacao = 'token_gerado_aqui',
--     token_expiracao = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)
-- WHERE email = 'admin@rnlogistica.com';

-- Verificar token de recuperação
-- SELECT id, nome, email
-- FROM usuarios
-- WHERE token_recuperacao = 'token_fornecido'
--   AND token_expiracao > CURRENT_TIMESTAMP
--   AND ativo = TRUE;

-- Alterar senha (limpar token após uso)
-- UPDATE usuarios
-- SET senha_hash = 'novo_hash_bcrypt',
--     token_recuperacao = NULL,
--     token_expiracao = NULL,
--     updated_at = CURRENT_TIMESTAMP
-- WHERE id = 'USR-001';

-- =============================================================================
-- Expansão Futura - Usuário Contabilidade (Exemplo)
-- =============================================================================
-- INSERT INTO usuarios (
--   id, nome, email, senha_hash, role, ativo
-- ) VALUES (
--   'USR-002',
--   'Contador Sistema',
--   'contabilidade@rnlogistica.com',
--   '$2a$10$hash_aqui',
--   'contabilidade',
--   TRUE
-- );

-- =============================================================================
-- Manutenção e Segurança
-- =============================================================================

-- Desativar usuário (soft delete)
-- UPDATE usuarios SET ativo = FALSE WHERE id = 'USR-XXX';

-- Reativar usuário
-- UPDATE usuarios SET ativo = TRUE WHERE id = 'USR-XXX';

-- Resetar tentativas de login
-- UPDATE usuarios SET tentativas_login_falhas = 0, bloqueado_ate = NULL WHERE id = 'USR-XXX';

-- Forçar alteração de senha no próximo login (implementação futura)
-- ALTER TABLE usuarios ADD COLUMN deve_alterar_senha BOOLEAN DEFAULT FALSE;
-- UPDATE usuarios SET deve_alterar_senha = TRUE WHERE id = 'USR-XXX';
