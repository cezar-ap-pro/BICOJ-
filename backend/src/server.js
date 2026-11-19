import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/products.js';
import { pool } from './db.js';

const app = express();
const port = Number(process.env.PORT || 3001);
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', projeto: 'BicoJá', banco: 'conectado' });
  } catch (error) { next(error); }
});
app.use('/api', apiRoutes);
app.use((_req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use((error, _req, res, _next) => {
  if (error.code === '23505') return res.status(409).json({ erro: 'Registro já existe' });
  if (error.code === '23503') return res.status(400).json({ erro: 'Categoria não encontrada' });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  console.error('Erro na API:', error);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});
app.listen(port, '0.0.0.0', () => console.log(`API BicoJá na porta ${port}`));
