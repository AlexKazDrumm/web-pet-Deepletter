import Link from 'next/link';

const NAV = [
  { href: '/tools/document-analyzer', label: 'Анализ документа' },
  { href: '/tools/text-transform', label: 'Текст' },
  { href: '/tools/markdown', label: 'Markdown' },
  { href: '/tools/randomizer', label: 'Рандомайзер' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            D
          </span>
          <span>Deepletter</span>
        </Link>
        <nav className="hidden gap-1 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
