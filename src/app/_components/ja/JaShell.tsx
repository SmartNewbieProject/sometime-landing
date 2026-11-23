import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { JA_APP_STORE_URL, JA_GOOGLE_PLAY_URL } from "../../_lib/ja-content";

const JA_NAV = [
  { href: "/ja", label: "ホーム" },
  { href: "/ja/korean-language-exchange", label: "言語交換" },
  { href: "/ja/safety", label: "安全・身バレ対策" },
];

export function JaShell({
  children,
  activePath = "/ja",
}: {
  children: ReactNode;
  activePath?: string;
}) {
  return (
    <div
      lang="ja"
      className="min-h-screen w-full bg-[#FAF9F6] text-[#191F28] antialiased"
      style={{
        fontFamily:
          '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", var(--font-pretendard), sans-serif',
      }}
    >
      <header className="sticky top-0 z-20 border-b border-[#E8E5DE] bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-[960px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/ja"
            aria-label="Sometime（サムタイム）日本語トップ"
            className="inline-flex min-h-11 shrink-0 items-center gap-2.5"
          >
            <Image src="/images/info-logo.png" width={104} height={15} alt="Sometime" priority />
            <span className="rounded-full bg-[#F2F0EC] px-2 py-0.5 text-[11px] font-bold text-[#545C68]">
              JP
            </span>
          </Link>

          <nav aria-label="日本語メニュー" className="hidden items-center gap-1 sm:flex">
            {JA_NAV.map((item) => {
              const active = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3.5 py-2 text-sm font-bold transition-colors ${
                    active
                      ? "bg-[#191F28] text-white"
                      : "text-[#545C68] hover:bg-[#F2F0EC] hover:text-[#191F28]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a
            href={JA_APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#7A4AE2] px-4 text-xs font-bold text-white transition-colors hover:bg-[#6738CE] sm:text-sm"
          >
            無料で始める
          </a>
        </div>

        <nav
          aria-label="モバイルメニュー"
          className="mx-auto grid w-full max-w-[960px] grid-cols-3 gap-1 border-t border-[#F0EEE9] px-4 py-2 sm:hidden"
        >
          {JA_NAV.map((item) => {
            const active = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg py-2 text-center text-xs font-bold ${
                  active ? "bg-[#191F28] text-white" : "text-[#545C68]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[960px] px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>

      <footer className="border-t border-[#E8E5DE] bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-[960px]">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-extrabold text-[#191F28]">Sometime（サムタイム）</p>
              <p className="mt-2 text-xs leading-relaxed text-[#545C68]">
                韓国の大学生・20代と、文化や韓国語の交流から自然につながる日韓交流アプリ。
              </p>
            </div>

            <div>
              <p className="text-xs font-extrabold text-[#828A96]">ガイド</p>
              <ul className="mt-2.5 space-y-2 text-sm font-semibold text-[#191F28]">
                {JA_NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/" className="text-[#545C68] hover:underline">
                    한국어 페이지 (KR)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-extrabold text-[#828A96]">アプリダウンロード</p>
              <div className="mt-2.5 flex flex-col gap-2">
                <a
                  href={JA_APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[#7A4AE2] px-4 text-xs font-bold text-white hover:bg-[#6738CE]"
                >
                  App Store (iOS)
                </a>
                <a
                  href={JA_GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#D4D0C7] bg-white px-4 text-xs font-bold text-[#191F28] hover:bg-[#F5F4F0]"
                >
                  Google Play (Android)
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#EFECE6] pt-5 text-xs leading-relaxed text-[#6B7280]">
            <p>運営会社: SmartNewbie（スマートニュービー） · お問い合わせ: notify@smartnewb.com</p>
            <p className="mt-1">
              無料で始められます（一部機能は有料）。18歳未満の方はご利用いただけません。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function JaStoreCtaBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mt-12 rounded-2xl border border-[#E5E1D8] bg-[#FBF8F3] p-6 sm:p-8">
      <h2 className="text-xl font-black tracking-tight text-[#191F28] sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#545C68]">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={JA_APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#7A4AE2] px-5 text-sm font-bold text-white hover:bg-[#6738CE]"
        >
          App Storeでダウンロード
        </a>
        <a
          href={JA_GOOGLE_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#191F28] bg-white px-5 text-sm font-bold text-[#191F28] hover:bg-[#F2F0EC]"
        >
          Google Playでダウンロード
        </a>
      </div>
    </section>
  );
}
