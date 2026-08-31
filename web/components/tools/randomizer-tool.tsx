'use client';

import { useState } from 'react';
import {
  buildAlphabet,
  generatePassword,
  randomDateBetween,
  randomInt,
  randomString,
  seededRandom,
  type RandomSource,
} from '@deepletter/shared';
import { CopyButton } from '@/components/copy-button';
import { Callout, Field } from '@/components/ui';

type Mode = 'number' | 'date' | 'password';

function todayIso(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function RandomizerTool() {
  const [mode, setMode] = useState<Mode>('number');
  const [seed, setSeed] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [start, setStart] = useState(todayIso());
  const [end, setEnd] = useState(todayIso(30));
  const [length, setLength] = useState('16');
  const [groups, setGroups] = useState({ upper: true, lower: true, digits: true, symbols: false });
  const [custom, setCustom] = useState('');

  function rng(): RandomSource {
    const trimmed = seed.trim();
    if (trimmed === '') {
      return Math.random;
    }
    const numeric = Number(trimmed);
    const base = Number.isFinite(numeric)
      ? numeric
      : [...trimmed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return seededRandom(Math.floor(base));
  }

  function generate() {
    setError(null);
    try {
      const source = rng();
      if (mode === 'number') {
        setResult(String(randomInt(Number(min), Number(max), source)));
      } else if (mode === 'date') {
        const date = randomDateBetween(start, end, source);
        setResult(new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' }).format(date));
      } else {
        const len = Number(length);
        const value = custom.trim()
          ? randomString(len, buildAlphabet({ custom: custom.trim() }), source)
          : generatePassword({ length: len, alphabet: groups }, source);
        setResult(value);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сгенерировать значение');
      setResult('');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="card space-y-4">
        <Field label="Что генерируем">
          <select
            className="input"
            value={mode}
            data-testid="mode"
            onChange={(e) => {
              setMode(e.target.value as Mode);
              setResult('');
              setError(null);
            }}
          >
            <option value="number">Случайное число</option>
            <option value="date">Случайная дата</option>
            <option value="password">Пароль / строка</option>
          </select>
        </Field>

        {mode === 'number' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="От">
              <input
                className="input"
                value={min}
                inputMode="numeric"
                onChange={(e) => setMin(e.target.value)}
              />
            </Field>
            <Field label="До">
              <input
                className="input"
                value={max}
                inputMode="numeric"
                onChange={(e) => setMax(e.target.value)}
              />
            </Field>
          </div>
        )}

        {mode === 'date' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Начало">
              <input
                type="date"
                className="input"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Field>
            <Field label="Конец">
              <input
                type="date"
                className="input"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Field>
          </div>
        )}

        {mode === 'password' && (
          <div className="space-y-3">
            <Field label="Длина">
              <input
                className="input"
                value={length}
                inputMode="numeric"
                onChange={(e) => setLength(e.target.value)}
              />
            </Field>
            <fieldset className="space-y-1 text-sm">
              <legend className="font-medium text-[#413434]">Наборы символов</legend>
              {(
                [
                  ['upper', 'A–Z'],
                  ['lower', 'a–z'],
                  ['digits', '0–9'],
                  ['symbols', 'символы'],
                ] as const
              ).map(([key, title]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={groups[key]}
                    onChange={(e) => setGroups((g) => ({ ...g, [key]: e.target.checked }))}
                  />
                  {title}
                </label>
              ))}
            </fieldset>
            <Field label="Свой набор" hint="если заполнено — используется вместо наборов выше">
              <input className="input" value={custom} onChange={(e) => setCustom(e.target.value)} />
            </Field>
          </div>
        )}

        <Field label="Seed" hint="необязательно; одинаковый seed даёт одинаковый результат">
          <input
            className="input"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="напр. 42"
          />
        </Field>

        <button
          type="button"
          className="btn-primary w-full"
          data-testid="generate"
          onClick={generate}
        >
          Сгенерировать
        </button>
      </div>

      <div className="space-y-3">
        {error && (
          <Callout tone="error" title="Некорректные параметры">
            {error}
          </Callout>
        )}
        <div className="card min-h-[8rem]">
          <div className="text-xs tracking-wide text-[#8e8e8e] uppercase">Результат</div>
          <div
            className="mt-2 break-words font-mono text-lg"
            data-testid="random-result"
            aria-live="polite"
          >
            {result || '—'}
          </div>
          {result && (
            <div className="mt-3">
              <CopyButton value={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
