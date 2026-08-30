/* eslint-disable */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createExtension('pgcrypto', { ifNotExists: true });
  pgm.createTable('document_analyses', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    source_format: {
      type: 'text',
      notNull: true,
      check: "source_format IN ('docx', 'txt', 'md')",
    },
    size_bytes: { type: 'integer', notNull: true },
    char_count: { type: 'integer', notNull: true },
    char_count_no_spaces: { type: 'integer', notNull: true },
    word_count: { type: 'integer', notNull: true },
    sentence_count: { type: 'integer', notNull: true },
    paragraph_count: { type: 'integer', notNull: true },
    unique_word_count: { type: 'integer', notNull: true },
    average_word_length: { type: 'numeric(6,2)', notNull: true, default: 0 },
    average_sentence_length_words: { type: 'numeric(6,2)', notNull: true, default: 0 },
    reading_time_seconds: { type: 'integer', notNull: true },
    longest_word: { type: 'text', notNull: true, default: '' },
    top_words: { type: 'jsonb', notNull: true, default: '[]' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.createIndex('document_analyses', 'created_at');
};

exports.down = (pgm) => {
  pgm.dropTable('document_analyses');
};
