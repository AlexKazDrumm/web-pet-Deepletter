import Link from 'next/link';

export function ToolPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-12 max-w-[820px]">
        <Link
          href="/"
          className="text-sm font-semibold text-brand-600 underline underline-offset-4"
        >
          ← Все инструменты
        </Link>
        <h1 className="mt-7 font-display text-3xl leading-tight font-bold text-[#413434] sm:text-[42px]">
          {title}
        </h1>
        <p className="mt-5 max-w-[680px] text-base leading-[1.7] text-[#8e8e8e] sm:text-lg">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
