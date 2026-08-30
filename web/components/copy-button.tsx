'use client';

import { useState } from 'react';

export function CopyButton({ value, label = 'Копировать' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="btn-ghost" onClick={copy} disabled={value.length === 0}>
      {copied ? 'Скопировано' : label}
    </button>
  );
}
