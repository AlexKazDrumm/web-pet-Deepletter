export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence';

const WORD_BOUNDARY_RE = /([\p{L}\p{N}]+)/gu;

export function changeCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text
        .toLowerCase()
        .replace(WORD_BOUNDARY_RE, (word) => word.charAt(0).toUpperCase() + word.slice(1));
    case 'sentence': {
      const lowered = text.toLowerCase();
      return lowered.replace(
        /(^\s*|[.!?…]\s+)(\p{L})/gu,
        (_match, prefix: string, letter: string) => {
          return prefix + letter.toUpperCase();
        },
      );
    }
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
  }
}

/** Схлопывает повторяющиеся пробелы, убирает хвостовые пробелы строк и лишние переводы строк. */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n?/gu, '\n')
    .replace(/[ \t\f\v]+/gu, ' ')
    .replace(/ *\n/gu, '\n')
    .replace(/\n{3,}/gu, '\n\n')
    .replace(/[ \t]+$/gmu, '')
    .trim();
}

export function removeEmptyLines(text: string): string {
  return text
    .replace(/\r\n?/gu, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

/** Удаляет повторяющиеся строки, сохраняя порядок первого появления. */
export function dedupeLines(text: string): string {
  const seen = new Set<string>();
  return text
    .replace(/\r\n?/gu, '\n')
    .split('\n')
    .filter((line) => {
      const key = line.trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .join('\n');
}

const TRANSLIT_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

/** Транслитерация кириллицы в латиницу (упрощённая схема, близкая к ГОСТ 7.79 «Б»). */
export function transliterate(text: string): string {
  let result = '';
  for (const ch of text) {
    const lower = ch.toLowerCase();
    const mapped = TRANSLIT_MAP[lower];
    if (mapped === undefined) {
      result += ch;
      continue;
    }
    if (ch === lower || mapped === '') {
      result += mapped;
    } else {
      result += mapped.charAt(0).toUpperCase() + mapped.slice(1);
    }
  }
  return result;
}

export function slugify(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 96);
}

export interface QuickCounts {
  characters: number;
  words: number;
  lines: number;
}

export function quickCounts(text: string): QuickCounts {
  const trimmed = text.trim();
  return {
    characters: Array.from(text).length,
    words: trimmed.length === 0 ? 0 : (trimmed.match(/[\p{L}\p{N}]+/gu) ?? []).length,
    lines: text.length === 0 ? 0 : text.replace(/\r\n?/gu, '\n').split('\n').length,
  };
}
