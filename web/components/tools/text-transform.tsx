'use client';

import { useMemo, useState } from 'react';
import {
  changeCase,
  dedupeLines,
  normalizeWhitespace,
  quickCounts,
  removeEmptyLines,
  slugify,
  transliterate,
} from '@deepletter/shared';
import { CopyButton } from '@/components/copy-button';

const SAMPLE = 'Привет,   мир!\n\nПривет,   мир!\nЭто   пример    текста для Deepletter.';

type Operation = { label: string; run: (text: string) => string };

const OPERATIONS: Operation[] = [
  { label: 'ВЕРХНИЙ РЕГИСТР', run: (t) => changeCase(t, 'upper') },
  { label: 'нижний регистр', run: (t) => changeCase(t, 'lower') },
  { label: 'Каждое Слово С Заглавной', run: (t) => changeCase(t, 'title') },
  { label: 'Как в предложении', run: (t) => changeCase(t, 'sentence') },
  { label: 'Убрать лишние пробелы', run: normalizeWhitespace },
  { label: 'Удалить пустые строки', run: removeEmptyLines },
  { label: 'Удалить повторы строк', run: dedupeLines },
  { label: 'Транслит (lat)', run: transliterate },
  { label: 'В слаг', run: slugify },
];

export function TextTransformTool() {
  const [text, setText] = useState(SAMPLE);
  const counts = useMemo(() => quickCounts(text), [text]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {OPERATIONS.map((op) => (
          <button
            key={op.label}
            type="button"
            className="btn-ghost text-xs"
            onClick={() => setText((current) => op.run(current))}
          >
            {op.label}
          </button>
        ))}
      </div>

      <textarea
        className="input min-h-[16rem] font-mono"
        value={text}
        spellCheck={false}
        data-testid="text-transform-area"
        onChange={(e) => setText(e.target.value)}
        aria-label="Текст для преобразования"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span data-testid="counts">
          {counts.characters} символов · {counts.words} слов · {counts.lines} строк
        </span>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={() => setText(SAMPLE)}>
            Пример
          </button>
          <button type="button" className="btn-ghost" onClick={() => setText('')}>
            Очистить
          </button>
          <CopyButton value={text} label="Копировать результат" />
        </div>
      </div>
    </div>
  );
}
