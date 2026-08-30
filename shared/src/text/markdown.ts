import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
  typographer: false,
});

export function markdownToHtml(markdown: string): string {
  return md.render(markdown ?? '').trim();
}

export function markdownToInlineHtml(markdown: string): string {
  return md.renderInline(markdown ?? '').trim();
}
