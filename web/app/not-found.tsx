import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-5 py-12 text-center">
      <h1 className="font-display text-3xl font-bold text-[#413434]">Страница не найдена</h1>
      <p className="text-[#8e8e8e]">Возможно, ссылка устарела или инструмент был переименован.</p>
      <Link href="/" className="btn-primary inline-flex">
        На главную
      </Link>
    </div>
  );
}
