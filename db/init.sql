CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('cliente','prestador')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS profissionais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  especialidade VARCHAR(120) NOT NULL,
  cidade VARCHAR(120) NOT NULL,
  valor_hora NUMERIC(10,2) NOT NULL CHECK (valor_hora >= 0),
  categoria_id INTEGER NOT NULL REFERENCES categorias(id)
);
CREATE TABLE IF NOT EXISTS bicos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  descricao TEXT NOT NULL,
  cidade VARCHAR(120) NOT NULL,
  orcamento NUMERIC(10,2) NOT NULL CHECK (orcamento >= 0),
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  status VARCHAR(20) NOT NULL DEFAULT 'aberto',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO categorias (nome) VALUES
('Limpeza'), ('Pintura'), ('Mudança & Frete'), ('Elétrica'), ('Jardinagem'), ('Montagem de Móveis')
ON CONFLICT (nome) DO NOTHING;
INSERT INTO profissionais (nome, especialidade, cidade, valor_hora, categoria_id)
SELECT d.nome, d.especialidade, 'Uberaba', d.valor_hora, c.id
FROM (VALUES
 ('Renato Silva', 'Pintor e Acabamentos', 45.00, 'Pintura'),
 ('Mariana Costa', 'Faxina Residencial', 35.00, 'Limpeza'),
 ('Carlos Eduardo', 'Eletricista', 60.00, 'Elétrica'),
 ('Aline Santos', 'Montadora de Móveis', 40.00, 'Montagem de Móveis')
) AS d(nome, especialidade, valor_hora, categoria)
JOIN categorias c ON c.nome = d.categoria
WHERE NOT EXISTS (SELECT 1 FROM profissionais);
