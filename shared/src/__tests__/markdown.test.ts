import { describe, expect, it } from 'vitest';
import { markdownToHtml, markdownToInlineHtml } from '../text/markdown';

describe('markdownToHtml', () => {
  it('преобразует заголовки и списки', () => {
    const html = markdownToHtml('# Заголовок\n\n- один\n- два');
    expect(html).toContain('<h1>Заголовок</h1>');
    expect(html).toContain('<li>один</li>');
  });

  it('не пропускает сырой HTML из источника', () => {
    const html = markdownToHtml('обычный текст <script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('оформляет ссылки', () => {
    const html = markdownToHtml('[сайт](https://example.com)');
    expect(html).toContain('<a href="https://example.com">сайт</a>');
  });

  it('пустой ввод даёт пустую строку', () => {
    expect(markdownToHtml('')).toBe('');
  });

  it('markdownToInlineHtml не оборачивает в <p>', () => {
    expect(markdownToInlineHtml('**жирный**')).toBe('<strong>жирный</strong>');
  });
});
