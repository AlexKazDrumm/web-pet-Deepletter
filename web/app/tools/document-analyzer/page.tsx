import type { Metadata } from 'next';
import { ToolPageShell } from '@/components/tool-page-shell';
import { DocumentAnalyzerTool } from '@/components/tools/document-analyzer';

export const metadata: Metadata = { title: 'Анализ документа' };

export default function DocumentAnalyzerPage() {
  return (
    <ToolPageShell
      title="Анализ документа"
      description="Загрузите .docx, .txt или .md. Сервер извлечёт текст в памяти и вернёт статистику: символы, слова, предложения, абзацы, уникальные слова, среднюю длину слова и оценку времени чтения."
    >
      <DocumentAnalyzerTool />
    </ToolPageShell>
  );
}
