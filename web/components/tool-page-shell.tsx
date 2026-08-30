import Link from 'next/link';

export function ToolPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link href="/" className="text-sm text-brand-600 hover:underline">
          ← Все инструменты
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      {children}
    </div>
  );
}
