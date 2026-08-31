import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://github.com/AlexKazDrumm/web-pet-Deepletter'),
  title: {
    default: 'Deepletter — инструменты для текста и документов',
    template: '%s — Deepletter',
  },
  description:
    'Deepletter: анализ документов DOCX/TXT/Markdown, преобразование текста, конвертер Markdown → HTML и генератор случайных данных.',
  applicationName: 'Deepletter',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Deepletter',
    title: 'Deepletter — инструменты для текста и документов',
    description:
      'Анализируйте документы, преобразуйте текст, переводите Markdown в HTML и генерируйте случайные данные.',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only z-50 rounded bg-white px-4 py-3 text-brand-700 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-10 sm:px-8 lg:px-12 lg:py-16"
        >
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
