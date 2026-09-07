import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentShell } from "../_components/public-content/ContentShell";
import { StoreBadge } from "../_components/public-content/StoreInstallCta";
import { JsonLd } from "../_components/public-content/JsonLd";
import { DOWNLOAD_PAGE as PAGE } from "../_lib/public-info-pages";
import { getAppStoreRating } from "../_lib/app-store-rating";
import { DesktopDownloadQrSection } from "./DesktopDownloadQrSection";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  SITE_NAME,
  softwareApplicationJsonLd,
} from "../_lib/seo";

const PATH = "/download";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE.metaTitle,
  description: PAGE.description,
  path: PATH,
  keywords: PAGE.keywords,
});

export default async function DownloadPage() {
  const appStoreRating = await getAppStoreRating();

  return (
    <ContentShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: PAGE.metaTitle,
            description: PAGE.description,
            url: absoluteUrl(PATH),
            inLanguage: "ko-KR",
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: absoluteUrl("/"),
            },
          },
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: PAGE.breadcrumbLabel, path: PATH },
          ]),
          softwareApplicationJsonLd(
            appStoreRating
              ? {
                  ratingValue: appStoreRating.ratingValue,
                  ratingCount: appStoreRating.ratingCount,
                }
              : undefined,
          ),
        ]}
      />

      <section
        id="download-start"
        aria-labelledby="download-title"
        className="relative isolate overflow-hidden bg-[#F4F0FF]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_45%,rgba(173,145,234,0.28),transparent_65%)]" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-12 pt-10 sm:gap-12 sm:px-8 sm:pb-16 sm:pt-16 lg:grid-cols-2 lg:gap-8 lg:py-20">
          <div className="relative z-10">
            <p className="font-pretendard text-sm font-semibold text-[#5B35B5]">
              학교 인증으로 만나는 대학생 소개팅
            </p>
            <h1
              id="download-title"
              className="mt-4 text-[36px] font-black leading-[1.25] tracking-[-0.04em] break-keep text-[#201823] sm:text-[48px] lg:text-[56px]"
            >
              새로운 인연,<br />
              <span className="text-[#7A4AE2]">썸타임</span>에서<br />
              시작하세요
            </h1>
            <p className="mt-5 max-w-sm font-pretendard text-base leading-[1.7] break-keep text-[#625A68] sm:text-lg">
              같은 지역의 대학생과, 나다운 취향으로.<br />
              익숙한 하루에 새로운 설렘을 더해보세요.
            </p>

            <div className="mt-8 grid max-w-[408px] grid-cols-2 gap-3 [&_a]:min-w-0 [&_a]:w-full [&_img]:w-full">
              <StoreBadge store="ios" surface="landing_download_hub" />
              <StoreBadge store="android" surface="landing_download_hub" />
            </div>
            <p className="mt-3 font-pretendard text-xs leading-5 text-[#625A68]">
              iPhone · Android 공식 앱 다운로드
            </p>
            {appStoreRating ? (
              <p className="mt-5 font-pretendard text-sm font-medium leading-6 text-[#625A68]">
                App Store <span className="font-bold text-[#5B35B5]">{appStoreRating.ratingValue.toFixed(1)} / 5</span>
                <span className="mx-2" aria-hidden="true">·</span>
                평가 {appStoreRating.ratingCount.toLocaleString("ko-KR")}개
              </p>
            ) : null}
            <DesktopDownloadQrSection />
          </div>

          <figure className="mx-auto w-full max-w-[480px]">
            <div className="relative isolate aspect-[1/1.15]">
              <Image
                src="/images/5.png"
                alt="썸타임의 환영 문구와 대학 로고가 보이는 가입 화면 홍보 이미지"
                width={1021}
                height={2200}
                sizes="(min-width: 1024px) 230px, (min-width: 640px) 230px, 44vw"
                className="absolute top-[8%] left-[4%] h-auto w-[48%] -rotate-[8deg] drop-shadow-[0_24px_32px_rgba(61,33,118,0.14)]"
              />
              <Image
                src="/images/7.png"
                alt="카페와 독서 등 관심사를 선택하는 썸타임 앱 화면 홍보 이미지"
                width={1021}
                height={2200}
                sizes="(min-width: 1024px) 250px, (min-width: 640px) 250px, 48vw"
                priority
                className="absolute top-0 right-[5%] z-10 h-auto w-[52%] rotate-[6deg] drop-shadow-[0_24px_32px_rgba(61,33,118,0.14)]"
              />
              <Image
                src="/images/heart-balloon.png"
                alt=""
                width={95}
                height={91}
                className="absolute top-[2%] left-[5%] z-10 h-auto w-16 sm:w-20"
              />
            </div>
            <figcaption className="mt-6 text-center font-pretendard text-xs leading-5 text-[#625A68]">
              썸타임 앱 홍보 화면 · 현재 앱 화면과 다를 수 있어요
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="download-features" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="font-pretendard text-sm font-semibold text-[#7A4AE2]">설렘의 시작은, 안심부터</p>
          <h2 id="download-features" className="mt-4 text-[28px] font-extrabold leading-[1.3] tracking-[-0.04em] break-keep text-[#201823] sm:text-[40px]">
            새로운 사람에게<br />
            조금 더 편하게
          </h2>
          <Image
            src="/images/big-univ-verify.png"
            alt="대학 건물과 인증 표시가 있는 썸타임 캐릭터 일러스트"
            width={1192}
            height={931}
            sizes="(min-width: 1024px) 430px, (min-width: 640px) 360px, 80vw"
            className="mx-auto mt-8 h-auto w-full max-w-[360px] lg:max-w-none"
          />
        </div>
        <div className="divide-y divide-[#EEE8FF] border-y border-[#EEE8FF]">
          <article className="py-8">
            <p className="font-pretendard text-xs font-semibold tracking-[0.08em] text-[#7A4AE2]">01 / 학교 인증</p>
            <h3 className="mt-3 text-2xl font-bold leading-[1.4] break-keep text-[#201823]">대학생이라는 공통점부터</h3>
            <p className="mt-3 max-w-md font-pretendard text-base leading-[1.7] break-keep text-[#625A68]">
              프로필에서 대학 인증 완료 여부를 확인할 수 있어요.
              캠퍼스의 일상을 이해하는 사람과 시작해보세요.
            </p>
            <Link href="/verification" className="mt-4 inline-flex min-h-11 items-center font-pretendard text-sm font-semibold text-[#7A4AE2] underline underline-offset-4 hover:text-[#5B35B5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]">
              학교 인증 알아보기 <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </article>
          <article className="py-8">
            <p className="font-pretendard text-xs font-semibold tracking-[0.08em] text-[#7A4AE2]">02 / 연락처 지인 차단</p>
            <h3 className="mt-3 text-2xl font-bold leading-[1.4] break-keep text-[#201823]">아는 사람은 부담스러우니까</h3>
            <p className="mt-3 max-w-md font-pretendard text-base leading-[1.7] break-keep text-[#625A68]">
              연락처에 있는 지인을 매칭에서 제외하도록 설정할 수 있어요.
              같은 학과·학교 제외 설정도 앱에서 선택하세요.
            </p>
            <Link href="/safety" className="mt-4 inline-flex min-h-11 items-center font-pretendard text-sm font-semibold text-[#7A4AE2] underline underline-offset-4 hover:text-[#5B35B5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]">
              안전한 이용 알아보기 <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>

      <section aria-labelledby="download-faq" className="mx-auto grid w-full max-w-6xl gap-8 border-t border-[#F1ECFA] px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <h2 id="download-faq" className="text-[28px] font-extrabold leading-[1.3] tracking-[-0.04em] text-[#201823]">시작 전, 궁금한 점</h2>
          <Link href="/faq" className="mt-4 inline-flex min-h-11 items-center font-pretendard text-sm font-semibold text-[#7A4AE2] underline underline-offset-4 hover:text-[#5B35B5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]">
            자주 묻는 질문 모두 보기 <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
        <dl className="space-y-8 font-pretendard">
          <div>
            <dt className="text-lg font-bold text-[#201823]">설치한 다음에는 어떻게 하나요?</dt>
            <dd className="mt-2 text-base leading-[1.7] break-keep text-[#625A68]">앱에서 회원가입 후 안내에 따라 프로필을 준비해요. 대학 인증 여부와 관심사를 확인하며 새로운 인연을 만나보세요.</dd>
          </div>
          <div>
            <dt className="text-lg font-bold text-[#201823]">iPhone과 Android 모두 사용할 수 있나요?</dt>
            <dd className="mt-2 text-base leading-[1.7] break-keep text-[#625A68]">네. App Store 또는 Google Play에서 설치할 수 있어요. 기기별 지원 정보는 각 스토어에서 확인해 주세요.</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="download-final-title" className="bg-[#F4F0FF] px-5 py-16 text-center sm:px-8 sm:py-20">
        <Image src="/images/heart-balloon.png" alt="" width={95} height={91} className="mx-auto h-auto w-16" />
        <h2 id="download-final-title" className="mt-5 text-[28px] font-extrabold leading-[1.3] tracking-[-0.04em] break-keep text-[#201823] sm:text-[40px]">
          다음 설렘은, 썸타임에서
        </h2>
        <p className="mt-4 font-pretendard text-base leading-[1.7] text-[#625A68]">지금 앱에서 새로운 인연을 시작하세요.</p>
        <div className="mx-auto mt-8 grid max-w-[408px] grid-cols-2 gap-3 [&_a]:min-w-0 [&_a]:w-full [&_img]:w-full">
          <StoreBadge store="ios" surface="landing_download_final" />
          <StoreBadge store="android" surface="landing_download_final" />
        </div>
        <p className="mt-4 font-pretendard text-xs leading-5 text-[#625A68]">스마트뉴비가 운영하는 썸타임 공식 앱</p>
      </section>
    </ContentShell>
  );
}
