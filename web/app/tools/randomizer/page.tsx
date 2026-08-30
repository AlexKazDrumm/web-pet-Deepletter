import type { Metadata } from 'next';
import { ToolPageShell } from '@/components/tool-page-shell';
import { RandomizerTool } from '@/components/tools/randomizer-tool';

export const metadata: Metadata = { title: 'Генератор случайных данных' };

export default function RandomizerPage() {
  return (
    <ToolPageShell
      title="Генератор случайных данных"
      description="Случайные числа в диапазоне, даты между двумя границами и пароли из выбранного набора символов. Поле seed включает воспроизводимый режим: одинаковый seed всегда даёт одинаковый результат."
    >
      <RandomizerTool />
    </ToolPageShell>
  );
}
