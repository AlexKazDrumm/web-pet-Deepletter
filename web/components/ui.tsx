import clsx from 'clsx';

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[#8e8e8e]" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
      {label ?? 'Загрузка…'}
    </span>
  );
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
}) {
  const tones = {
    info: 'border-brand-100 bg-brand-50 text-[#413434]',
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  } as const;

  return (
    <div className={clsx('rounded-[15px] border px-5 py-4 text-sm', tones[tone])} role="alert">
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? 'mt-1' : undefined}>{children}</div>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[15px] border border-[#e5e7f2] bg-white p-4">
      <div className="text-xs font-semibold tracking-wide text-[#8e8e8e] uppercase">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-[#413434] tabular-nums">
        {value}
      </div>
      {hint && <div className="mt-0.5 text-xs text-[#8e8e8e]">{hint}</div>}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1">
      <span className="text-sm font-semibold text-[#413434]">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[#8e8e8e]">{hint}</span>}
    </label>
  );
}
