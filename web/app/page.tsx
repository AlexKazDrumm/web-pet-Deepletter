import Link from 'next/link';
import { getTools } from '@/lib/api';
import { ToolCard } from '@/components/tool-card';
import { Callout } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { tools, degraded } = await getTools();

  return (
    <div>
      <section className="pb-24 lg:pb-[120px]">
        <p className="mb-5 text-sm font-bold tracking-[0.18em] text-brand-600 uppercase">
          Работа с текстом без лишнего
        </p>
        <h1 className="max-w-[820px] font-display text-[2.55rem] leading-[1.16] font-bold tracking-[0.015em] text-[#413434] sm:text-5xl lg:text-[55px]">
          Инструменты для текста и документов
        </h1>
        <p className="mt-8 max-w-[720px] text-lg leading-[1.7] text-[#8e8e8e] sm:text-xl">
          Анализируйте документы, приводите текст к нужному виду, переводите Markdown в HTML и
          генерируйте случайные данные. Загруженные файлы обрабатываются в памяти и не сохраняются.
        </p>
        <Link
          href="#tools"
          className="mt-9 inline-flex min-h-[62px] w-full max-w-[350px] items-center justify-center rounded-[15px] bg-brand-600 px-8 text-center text-sm font-bold tracking-[0.04em] text-white uppercase transition-colors hover:bg-brand-700"
        >
          Выбрать инструмент
        </Link>
      </section>

      {degraded && (
        <div className="mb-12">
          <Callout tone="info" title="API временно недоступен">
            Показан встроенный каталог инструментов. Клиентские инструменты продолжают работать;
            анализ документов станет доступен после запуска API.
          </Callout>
        </div>
      )}

      <section id="tools" aria-labelledby="tools-title" className="scroll-mt-8">
        <h2
          id="tools-title"
          className="font-display text-3xl leading-tight font-bold text-[#0a0a34] sm:text-[40px]"
        >
          Всё для работы с текстом
        </h2>
        <p className="mt-5 max-w-[580px] text-sm leading-[1.7] text-[#413434]">
          Четыре самостоятельных инструмента — от быстрой правки текста до подробной статистики по
          документу.
        </p>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
