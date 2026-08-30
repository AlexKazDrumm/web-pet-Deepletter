function clean(url: string): string {
  return url.replace(/\/+$/, '');
}

export const apiBaseUrl = clean(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3030');

export const serverApiBaseUrl = clean(
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3030',
);
