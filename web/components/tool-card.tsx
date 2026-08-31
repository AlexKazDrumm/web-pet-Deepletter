import Link from 'next/link';
import type { Tool } from '@deepletter/shared';

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="group flex min-h-[220px] flex-col border-t-2 border-brand-100 pt-7 transition-colors hover:border-brand-600">
      <p className="mb-5 text-xs font-bold tracking-[0.14em] text-brand-600 uppercase">
        {tool.category}
      </p>
      <h3 className="max-w-[16rem] text-base leading-[1.4] font-semibold tracking-[0.04em] text-[#413434]">
        {tool.title}
      </h3>
      <p className="mt-5 flex-1 text-xs leading-[1.55] text-[#6f6a6a]">{tool.summary}</p>
      <Link
        href={tool.href}
        className="mt-6 w-fit text-sm font-semibold text-brand-600 underline decoration-1 underline-offset-4 group-hover:text-brand-700"
      >
        Попробовать бесплатно
        <span aria-hidden="true"> →</span>
      </Link>
    </article>
  );
}
