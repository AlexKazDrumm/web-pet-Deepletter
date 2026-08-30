'use client';

import { useEffect, useMemo, useState } from 'react';
import { markdownToHtml } from '@deepletter/shared';
import { CopyButton } from '@/components/copy-button';

const SAMPLE = [
  '# Deepletter',
  '',
  'Конвертер **Markdown → HTML** с предпросмотром.',
  '',
  '## Списки',
  '',
  '- первый пункт',
  '- второй пункт',
  '',
  '> Цитата для примера.',
  '',
  '[Ссылка](https://example.com)',
].join('\n');

export function MarkdownTool() {
  const [source, setSource] = useState(SAMPLE);
  const [view, setView] = useState<'preview' | 'html'>('preview');
  const [safeHtml, setSafeHtml] = useState('');

  const rawHtml = useMemo(() => markdownToHtml(source), [source]);

  useEffect(() => {
    let cancelled = false;
    void import('dompurify').then(({ default: DOMPurify }) => {
      if (!cancelled) {
        setSafeHtml(DOMPurify.sanitize(rawHtml));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [rawHtml]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Markdown</h2>
          <button type="button" className="btn-ghost text-xs" onClick={() => setSource(SAMPLE)}>
            Пример
          </button>
        </div>
        <textarea
          className="input min-h-[24rem] font-mono"
          value={source}
          spellCheck={false}
          data-testid="markdown-input"
          onChange={(e) => setSource(e.target.value)}
          aria-label="Исходный Markdown"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <button
              type="button"
              className={`btn-ghost text-xs ${view === 'preview' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
              onClick={() => setView('preview')}
            >
              Предпросмотр
            </button>
            <button
              type="button"
              className={`btn-ghost text-xs ${view === 'html' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
              onClick={() => setView('html')}
            >
              HTML
            </button>
          </div>
          <CopyButton value={rawHtml} label="Копировать HTML" />
        </div>

        {view === 'preview' ? (
          <div
            className="prose-preview card min-h-[24rem] overflow-auto"
            data-testid="markdown-preview"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        ) : (
          <pre className="card min-h-[24rem] overflow-auto whitespace-pre-wrap break-words font-mono text-xs">
            {rawHtml}
          </pre>
        )}
      </div>
    </div>
  );
}
