import { Router } from 'express';
import { query } from '../db.js';

const router = Router();
const validText = (value, max = 120) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
const clean = value => value.trim();
const isEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPositivePrice = value => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1000000;
const positiveId = value => /^[1-9]\d*$/.test(String(value)) && Number.isSafeInteger(Number(value));
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/categorias', asyncRoute(async (_req, res) => {
  const { rows } = await query('SELECT id, nome FROM categorias ORDER BY nome');
  res.json(rows);
}));

router.get('/profissionais', asyncRoute(async (req, res) => {
  const busca = typeof req.query.busca === 'string' ? req.query.busca.slice(0, 120) : '';
  const categoria = typeof req.query.categoria === 'string' ? req.query.categoria.slice(0, 120) : '';
  const { rows } = await query(`
    SELECT p.id, p.nome, p.especialidade, p.cidade, p.valor_hora,
           c.nome AS categoria
    FROM profissionais p
    JOIN categorias c ON c.id = p.categoria_id
    WHERE ($1 = '' OR p.nome ILIKE '%' || $1 || '%'
           OR p.especialidade ILIKE '%' || $1 || '%')
      AND ($2 = '' OR c.nome ILIKE $2)
    ORDER BY p.id DESC LIMIT 100
  `, [busca, categoria]);
  res.json(rows);
}));

router.get('/profissionais/:id', asyncRoute(async (req, res) => {
  if (!positiveId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  const { rows } = await query(`SELECT p.id, p.nome, p.especialidade, p.cidade,
    p.valor_hora, c.nome AS categoria FROM profissionais p
    JOIN categorias c ON c.id = p.categoria_id WHERE p.id = $1`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ erro: 'Profissional não encontrado' });
  res.json(rows[0]);
}));

router.post('/profissionais', asyncRoute(async (req, res) => {
  const { nome, especialidade, cidade, valor_hora, categoria_id } = req.body || {};
  if (![nome, especialidade, cidade].every(v => validText(v)) || !isPositivePrice(valor_hora) || !positiveId(categoria_id)) {
    return res.status(400).json({ erro: 'Informe nome, especialidade, cidade, valor_hora e categoria_id válidos' });
  }
  const { rows } = await query(`INSERT INTO profissionais
    (nome, especialidade, cidade, valor_hora, categoria_id)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [clean(nome), clean(especialidade), clean(cidade), Number(valor_hora), Number(categoria_id)]);
  res.status(201).json(rows[0]);
}));

router.get('/bicos', asyncRoute(async (req, res) => {
  const { rows } = await query(`SELECT b.id, b.titulo, b.descricao, b.cidade,
    b.orcamento, b.status, b.criado_em, c.nome AS categoria
    FROM bicos b JOIN categorias c ON c.id = b.categoria_id
    ORDER BY b.criado_em DESC LIMIT 100`);
  res.json(rows);
}));

router.post('/bicos', asyncRoute(async (req, res) => {
  const { titulo, descricao, cidade, orcamento, categoria_id } = req.body || {};
  if (!validText(titulo) || !validText(descricao, 2000) || !validText(cidade) || !isPositivePrice(orcamento) || !positiveId(categoria_id)) {
    return res.status(400).json({ erro: 'Informe título, descrição, cidade, orçamento e categoria_id válidos' });
  }
  const { rows } = await query(`INSERT INTO bicos
    (titulo, descricao, cidade, orcamento, categoria_id)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [clean(titulo), clean(descricao), clean(cidade), Number(orcamento), Number(categoria_id)]);
  res.status(201).json(rows[0]);
}));

router.post('/usuarios', asyncRoute(async (req, res) => {
  const { nome, email, tipo } = req.body || {};
  if (!validText(nome) || !isEmail(email) || !['cliente', 'prestador'].includes(tipo)) {
    return res.status(400).json({ erro: 'Informe nome, email e tipo (cliente ou prestador) válidos' });
  }
  const { rows } = await query(`INSERT INTO usuarios (nome, email, tipo)
    VALUES ($1,$2,$3) RETURNING id, nome, email, tipo, criado_em`,
    [clean(nome), clean(email).toLowerCase(), tipo]);
  res.status(201).json(rows[0]);
}));

export default router;
