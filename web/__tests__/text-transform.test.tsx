import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TextTransformTool } from '@/components/tools/text-transform';

describe('<TextTransformTool>', () => {
  it('применяет операции последовательно к тексту', async () => {
    const user = userEvent.setup();
    render(<TextTransformTool />);

    const area = screen.getByTestId('text-transform-area') as HTMLTextAreaElement;
    await user.clear(area);
    await user.type(area, 'привет   мир{Enter}привет   мир');

    await user.click(screen.getByRole('button', { name: 'Убрать лишние пробелы' }));
    expect(area.value).toBe('привет мир\nпривет мир');

    await user.click(screen.getByRole('button', { name: 'Удалить повторы строк' }));
    expect(area.value).toBe('привет мир');

    await user.click(screen.getByRole('button', { name: 'ВЕРХНИЙ РЕГИСТР' }));
    expect(area.value).toBe('ПРИВЕТ МИР');
  });
});
