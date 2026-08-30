import Link from 'next/link';
import type { Tool } from '@deepletter/shared';

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="card group flex flex-col gap-3 transition-shadow hover:shadow-md"
    >
      <span className="w-fit rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-700/20 dark:text-brand-300">
        {tool.category}
      </span>
      <h3 className="text-lg font-semibold">{tool.title}</h3>
      <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{tool.summary}</p>
      <span className="text-sm font-medium text-brand-600 group-hover:underline">Открыть →</span>
    </Link>
  );
}
