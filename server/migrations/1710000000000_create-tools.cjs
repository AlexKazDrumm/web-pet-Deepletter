/* eslint-disable */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('tools', {
    id: 'id',
    slug: { type: 'text', notNull: true, unique: true },
    title: { type: 'text', notNull: true },
    summary: { type: 'text', notNull: true },
    category: { type: 'text', notNull: true },
    href: { type: 'text', notNull: true },
    sort_order: { type: 'integer', notNull: true, default: 0 },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.createIndex('tools', ['sort_order', 'title']);
};

exports.down = (pgm) => {
  pgm.dropTable('tools');
};
