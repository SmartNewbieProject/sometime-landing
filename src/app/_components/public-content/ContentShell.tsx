import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "스토리" },
  { href: "/card-news", label: "카드뉴스" },
  { href: "/community", label: "커뮤니티" },
];

export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fff9fd] text-[#201823]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ff7ac8]/20 blur-3xl" />
        <div className="absolute right-[-10%] top-48 h-[28rem] w-[28rem] rounded-full bg-[#8d63ff]/15 blur-3xl" />
        <div className="absolute bottom-0 left-[-12%] h-[24rem] w-[24rem] rounded-full bg-[#ffd26f]/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            className="font-wantedSans text-xl font-black tracking-tight text-[#201823]"
          >
            썸타임
          </Link>
          <nav className="flex items-center gap-1 rounded-full border border-[#efe5f5] bg-white/70 p-1 text-sm font-bold text-[#5c5263]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-[#f8efff] hover:text-[#201823]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="https://some-in-univ.com"
            className="hidden rounded-full bg-[#201823] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#201823]/15 sm:inline-flex"
          >
            앱에서 이어보기
          </Link>
        </div>
      </header>

      {children}

      <footer className="border-t border-[#efe5f5] bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-[#756b7c] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-[#201823]">썸타임</p>
          <p>학교 인증을 기반으로 대학생의 자연스러운 시작을 돕습니다.</p>
        </div>
      </footer>
    </main>
  );
}

export function ContentHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-16 sm:pb-16 sm:pt-24">
      <div className="max-w-3xl">
        <p className="mb-4 inline-flex rounded-full border border-[#eadcf5] bg-white/70 px-4 py-2 text-sm font-black text-[#7a4bea] shadow-sm">
          {eyebrow}
        </p>
        <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f5567]">{description}</p>
      </div>
      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}
