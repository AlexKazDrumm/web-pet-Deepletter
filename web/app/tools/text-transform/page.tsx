import type { Metadata } from 'next';
import { ToolPageShell } from '@/components/tool-page-shell';
import { TextTransformTool } from '@/components/tools/text-transform';

export const metadata: Metadata = { title: 'Преобразование текста' };

export default function TextTransformPage() {
  return (
    <ToolPageShell
      title="Преобразование текста"
      description="Операции применяются последовательно к тексту в поле ниже: смена регистра, нормализация пробелов, удаление пустых и повторяющихся строк, транслитерация кириллицы и построение слага. Всё выполняется в браузере."
    >
      <TextTransformTool />
    </ToolPageShell>
  );
}
