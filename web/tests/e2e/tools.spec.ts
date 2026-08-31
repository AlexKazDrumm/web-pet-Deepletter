import { expect, test } from '@playwright/test';

test('преобразователь последовательно изменяет текст', async ({ page }) => {
  await page.goto('/tools/text-transform');
  const editor = page.getByTestId('text-transform-area');
  await editor.fill('  Привет,   мир!  ');
  await page.getByRole('button', { name: 'Убрать лишние пробелы' }).click();
  await expect(editor).toHaveValue('Привет, мир!');
  await page.getByRole('button', { name: 'ВЕРХНИЙ РЕГИСТР' }).click();
  await expect(editor).toHaveValue('ПРИВЕТ, МИР!');
});

test('Markdown обновляет безопасный предпросмотр', async ({ page }) => {
  await page.goto('/tools/markdown');
  await page
    .getByTestId('markdown-input')
    .fill('# Проверка\n\n<script>alert(1)</script>**Готово**');
  const preview = page.getByTestId('markdown-preview');
  await expect(preview.getByRole('heading', { name: 'Проверка' })).toBeVisible();
  await expect(preview.getByText('Готово')).toBeVisible();
  await expect(preview.locator('script')).toHaveCount(0);
});

test('одинаковый seed даёт воспроизводимый пароль', async ({ page }) => {
  await page.goto('/tools/randomizer');
  await page.getByTestId('mode').selectOption('password');
  await page.getByLabel('Seed').fill('42');
  await page.getByTestId('generate').click();
  const first = await page.getByTestId('random-result').textContent();
  expect(first).toBeTruthy();
  expect(first).not.toBe('—');

  await page.getByTestId('generate').click();
  await expect(page.getByTestId('random-result')).toHaveText(first!);
});
