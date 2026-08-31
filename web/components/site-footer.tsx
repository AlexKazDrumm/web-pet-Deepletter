import Link from 'next/link';
import Image from 'next/image';

const FOOTER_LINKS = [
  { href: '/tools/document-analyzer', label: 'Анализ документа' },
  { href: '/tools/text-transform', label: 'Преобразование текста' },
  { href: '/tools/markdown', label: 'Markdown → HTML' },
  { href: '/tools/randomizer', label: 'Генератор случайных данных' },
];

export function SiteFooter() {
  return (
    <footer className="mt-8 bg-white text-[#8e8e8e] before:block before:h-[84px] before:bg-gradient-to-b before:from-[rgba(82,113,255,0.13)] before:to-transparent">
      <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-12 sm:px-8 lg:px-12 lg:pt-12 lg:pb-20">
        <Image
          src="/brand/deepletter-logo-footer.png"
          width="177"
          height="40"
          alt="Deepletter"
          className="mb-10 h-auto w-[177px]"
        />

        <div className="grid gap-10 border-b border-[#eeeef6] pb-10 md:grid-cols-[1.2fr_1fr]">
          <nav aria-label="Инструменты в подвале" className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold leading-[1.55] hover:text-brand-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="max-w-xl text-sm leading-[1.7] md:justify-self-end">
            Файлы обрабатываются в памяти и не сохраняются на диск. В истории остаются только
            формат, размер и рассчитанная статистика.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-sm font-semibold">
          <Link href="/" className="hover:text-brand-600">
            Все инструменты
          </Link>
          <span>© 2026 Deepletter</span>
        </div>
      </div>
    </footer>
  );
}
