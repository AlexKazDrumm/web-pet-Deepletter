import { getTools } from '@/lib/api';
import { ToolCard } from '@/components/tool-card';
import { Callout } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { tools, degraded } = await getTools();

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Инструменты для текста и документов
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Загрузите документ и получите статистику, приведите текст к нужному виду, переведите
          Markdown в HTML или сгенерируйте случайные данные. Всё работает в браузере и через лёгкий
          API; загруженные файлы обрабатываются в памяти и не сохраняются.
        </p>
      </section>

      {degraded && (
        <Callout tone="info" title="API недоступен">
          Показан встроенный каталог инструментов. Проверьте, что сервер запущен на нужном порту.
        </Callout>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>
    </div>
  );
}
