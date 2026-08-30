import type { Tool } from './contracts';

export const TOOL_CATALOG: readonly Tool[] = [
  {
    slug: 'document-analyzer',
    title: 'Анализ документа',
    summary:
      'Загрузите .docx, .txt или .md — сервис извлечёт текст и посчитает символы, слова, предложения, абзацы, уникальные слова и время чтения.',
    category: 'Документы',
    href: '/tools/document-analyzer',
    sortOrder: 10,
  },
  {
    slug: 'text-transform',
    title: 'Преобразование текста',
    summary:
      'Смена регистра, нормализация пробелов, удаление пустых и повторяющихся строк, транслитерация кириллицы в латиницу.',
    category: 'Текст',
    href: '/tools/text-transform',
    sortOrder: 20,
  },
  {
    slug: 'markdown',
    title: 'Markdown → HTML',
    summary: 'Конвертация Markdown в чистый HTML с предпросмотром и копированием результата.',
    category: 'Текст',
    href: '/tools/markdown',
    sortOrder: 30,
  },
  {
    slug: 'randomizer',
    title: 'Генератор случайных данных',
    summary:
      'Случайные числа, даты и пароли с настраиваемым набором символов и воспроизводимым режимом seed.',
    category: 'Утилиты',
    href: '/tools/randomizer',
    sortOrder: 40,
  },
];
