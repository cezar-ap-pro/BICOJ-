import pg from 'pg';

const { Pool } = pg;
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'bicoja',
  password: process.env.DB_PASSWORD || 'bicoja_dev_local',
  database: process.env.DB_NAME || 'bicoja_db',
});

export const query = (sql, params = []) => pool.query(sql, params);
