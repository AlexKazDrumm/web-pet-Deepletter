'use strict';

const path = require('node:path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

async function run() {
  const direction = process.argv[2] === 'down' ? 'down' : 'up';

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL не задан — миграции невозможны');
    process.exit(1);
  }

  const mod = await import('node-pg-migrate');
  const migrate = mod.default || mod.runner || mod;

  await migrate({
    databaseUrl: process.env.DATABASE_URL,
    dir: path.resolve(__dirname, '../migrations'),
    direction,
    count: direction === 'down' ? 1 : Infinity,
    migrationsTable: 'pgmigrations',
    verbose: true,
  });
}

run()
  .then(() => {
    console.log('Миграции выполнены');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
