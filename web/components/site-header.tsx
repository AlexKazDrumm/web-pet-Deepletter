import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { href: '/tools/document-analyzer', label: 'Анализ документа' },
  { href: '/tools/text-transform', label: 'Текст' },
  { href: '/tools/markdown', label: 'Markdown' },
  { href: '/tools/randomizer', label: 'Рандомайзер' },
];

export function SiteHeader() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex min-h-24 max-w-[1400px] flex-wrap items-center justify-between gap-x-10 gap-y-4 px-5 py-5 sm:px-8 lg:min-h-[147px] lg:px-12">
        <Link href="/" aria-label="Deepletter — на главную" className="shrink-0">
          <Image
            src="/brand/deepletter-logo.png"
            width="267"
            height="60"
            alt="Deepletter"
            className="h-auto w-[214px] sm:w-[267px]"
          />
        </Link>
        <nav
          aria-label="Основная навигация"
          className="order-3 flex w-full flex-wrap gap-1 sm:order-2 sm:w-auto"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-[#8e8e8e] transition-colors hover:bg-brand-50 hover:text-brand-700 lg:px-4 lg:text-base"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
