import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center">
      <h1 className="text-3xl font-bold">Страница не найдена</h1>
      <p className="text-slate-600 dark:text-slate-300">
        Возможно, ссылка устарела или инструмент был переименован.
      </p>
      <Link href="/" className="btn-primary inline-flex">
        На главную
      </Link>
    </div>
  );
}
