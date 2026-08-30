import type { Metadata } from 'next';
import { ToolPageShell } from '@/components/tool-page-shell';
import { MarkdownTool } from '@/components/tools/markdown-tool';

export const metadata: Metadata = { title: 'Markdown → HTML' };

export default function MarkdownPage() {
  return (
    <ToolPageShell
      title="Markdown → HTML"
      description="Разметка Markdown преобразуется в HTML. Сырой HTML из источника не пропускается, а предпросмотр дополнительно очищается через DOMPurify перед вставкой в страницу."
    >
      <MarkdownTool />
    </ToolPageShell>
  );
}
