'use strict';

const path = require('node:path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Client } = require('pg');

let TOOL_CATALOG;
try {
  ({ TOOL_CATALOG } = require('@deepletter/shared'));
} catch {
  console.error(
    'Не найден собранный пакет @deepletter/shared. Сначала выполните: npm run build:shared',
  );
  process.exit(1);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL не задан — сидирование невозможно');
    process.exit(1);
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    for (const tool of TOOL_CATALOG) {
      await client.query(
        `INSERT INTO tools (slug, title, summary, category, href, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           summary = EXCLUDED.summary,
           category = EXCLUDED.category,
           href = EXCLUDED.href,
           sort_order = EXCLUDED.sort_order`,
        [tool.slug, tool.title, tool.summary, tool.category, tool.href, tool.sortOrder],
      );
    }
    console.log(`Каталог инструментов обновлён: ${TOOL_CATALOG.length} записей`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
