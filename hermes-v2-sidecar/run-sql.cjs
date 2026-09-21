
const pg = require('pg');
const fs = require('fs');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    await client.query('DROP SCHEMA IF EXISTS fatos CASCADE; DROP SCHEMA IF EXISTS conhecimento CASCADE; DROP SCHEMA IF EXISTS conversa CASCADE; DROP TYPE IF EXISTS regime CASCADE; DROP TYPE IF EXISTS confianca CASCADE; DROP TYPE IF EXISTS saida CASCADE; DROP TYPE IF EXISTS promessa CASCADE; DROP TYPE IF EXISTS falha_tipo CASCADE;');
    await client.query(fs.readFileSync('schema.sql', 'utf8'));
    await client.query(fs.readFileSync('seed/00-ajustes-schema.sql', 'utf8'));
    await client.query(fs.readFileSync('seed/01-fatos.sql', 'utf8'));
    console.log('SQL base loaded');
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);

