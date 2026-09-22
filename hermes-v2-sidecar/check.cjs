const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
Promise.all([
  pool.query('SELECT count(*) FROM conhecimento.nota WHERE embedding IS NOT NULL'),
  pool.query('SELECT count(*) FROM fatos.cartao WHERE embedding IS NOT NULL')
]).then(([res1, res2]) => {
  console.log('Notas com embedding:', res1.rows[0].count);
  console.log('Cartoes com embedding:', res2.rows[0].count);
  pool.end();
}).catch(console.error);
