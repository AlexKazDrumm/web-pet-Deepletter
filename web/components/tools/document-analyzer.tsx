'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnalysisHistoryItem, DocumentAnalysis } from '@deepletter/shared';
import { UPLOAD_FORMATS } from '@deepletter/shared';
import { analyzeDocument, ApiClientError, getRecentAnalyses } from '@/lib/api-client';
import { formatBytes, formatDateTime, formatDuration, formatNumber } from '@/lib/format';
import { Callout, Spinner, Stat } from '@/components/ui';

type Status = 'idle' | 'loading' | 'done' | 'error';

const ACCEPT = '.docx,.txt,.md,.markdown';
const MAX_HINT = '5 МБ';

export function DocumentAnalyzerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [recent, setRecent] = useState<AnalysisHistoryItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadRecent = useCallback(() => {
    getRecentAnalyses(5)
      .then((res) => setRecent(res.items))
      .catch(() => setRecent([]));
  }, []);

  useEffect(loadRecent, [loadRecent]);

  async function submit() {
    if (!file) {
      return;
    }
    setStatus('loading');
    setError(null);
    setAnalysis(null);
    try {
      const res = await analyzeDocument(file);
      setAnalysis(res.analysis);
      setStatus('done');
      loadRecent();
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : 'Не удалось связаться с сервером. Проверьте, что API запущен.';
      setError(message);
      setStatus('error');
    }
  }

  function pick(next: File | null) {
    setFile(next);
    setStatus('idle');
    setError(null);
    setAnalysis(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <div
          className={`card border-dashed ${dragOver ? 'border-brand-500 bg-brand-50/50' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            pick(e.dataTransfer.files?.[0] ?? null);
          }}
        >
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Перетащите файл сюда или выберите вручную. Поддерживаются форматы{' '}
              {UPLOAD_FORMATS.map((f) => `.${f}`).join(', ')}, до {MAX_HINT}.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              data-testid="file-input"
              onChange={(e) => pick(e.target.files?.[0] ?? null)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="btn-ghost" onClick={() => inputRef.current?.click()}>
                Выбрать файл
              </button>
              {file && (
                <span
                  className="text-sm text-slate-600 dark:text-slate-300"
                  data-testid="file-name"
                >
                  {file.name} · {formatBytes(file.size)}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="btn-primary"
                data-testid="analyze"
                disabled={!file || status === 'loading'}
                onClick={submit}
              >
                Проанализировать
              </button>
              {file && (
                <button type="button" className="btn-ghost" onClick={() => pick(null)}>
                  Очистить
                </button>
              )}
            </div>
          </div>
        </div>

        <div aria-live="polite" data-testid="status">
          {status === 'loading' && (
            <div className="card">
              <Spinner label="Анализируем документ…" />
            </div>
          )}
          {status === 'error' && error && (
            <Callout tone="error" title="Ошибка анализа">
              {error}
            </Callout>
          )}
          {status === 'idle' && !file && (
            <p className="text-sm text-slate-500">Результат появится здесь после загрузки файла.</p>
          )}
        </div>

        {status === 'done' && analysis && <AnalysisResult analysis={analysis} />}
      </div>

      <aside className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Недавние анализы
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-400">Пока пусто.</p>
        ) : (
          <ul className="space-y-2" data-testid="recent">
            {recent.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs uppercase dark:bg-slate-800">
                    {item.sourceFormat}
                  </span>
                  <span className="text-xs text-slate-400">{formatDateTime(item.createdAt)}</span>
                </div>
                <div className="mt-1 text-slate-600 dark:text-slate-300">
                  {formatNumber(item.wordCount)} слов · {formatBytes(item.sizeBytes)} ·{' '}
                  {formatDuration(item.readingTimeSeconds)} чтения
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: DocumentAnalysis }) {
  const s = analysis.statistics;
  const maxCount = s.topWords[0]?.count ?? 1;
  return (
    <div className="space-y-4" data-testid="result">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Символы" value={formatNumber(s.charCount)} />
        <Stat label="Без пробелов" value={formatNumber(s.charCountNoSpaces)} />
        <Stat label="Слова" value={formatNumber(s.wordCount)} />
        <Stat label="Уникальные слова" value={formatNumber(s.uniqueWordCount)} />
        <Stat label="Предложения" value={formatNumber(s.sentenceCount)} />
        <Stat label="Абзацы" value={formatNumber(s.paragraphCount)} />
        <Stat label="Ср. длина слова" value={`${s.averageWordLength}`} hint="символов" />
        <Stat
          label="Слов в предложении"
          value={`${s.averageSentenceLengthWords}`}
          hint="в среднем"
        />
        <Stat
          label="Время чтения"
          value={formatDuration(s.readingTimeSeconds)}
          hint="≈200 сл/мин"
        />
      </div>

      {s.longestWord && (
        <p className="text-sm text-slate-500">
          Самое длинное слово:{' '}
          <span className="font-medium text-slate-700 dark:text-slate-200">{s.longestWord}</span>
        </p>
      )}

      {s.topWords.length > 0 && (
        <div className="card">
          <h3 className="mb-3 text-sm font-semibold">Частые слова</h3>
          <ul className="space-y-1.5">
            {s.topWords.map((w) => (
              <li key={w.word} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 truncate">{w.word}</span>
                <span className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  <span
                    className="block h-2 rounded-full bg-brand-500"
                    style={{ width: `${Math.round((w.count / maxCount) * 100)}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right tabular-nums text-slate-500">
                  {w.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
