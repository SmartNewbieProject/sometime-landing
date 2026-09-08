import Image from "next/image";
import Link from "next/link";
import { ContentShell } from "../_components/public-content/ContentShell";
import { StoreInstallCta } from "../_components/public-content/StoreInstallCta";

export default function EventPage() {
  return (
    <ContentShell>
      <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <header className="grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="text-[13px] font-bold tracking-[0.12em] text-[#C43B78]">CAMPAIGN RECORD</p>
            <h1 className="mt-3 break-keep text-[34px] font-black leading-[1.3] text-[#201823] sm:text-[44px]">
              11.11 선물 캠페인 안내
            </h1>
            <p className="mt-4 break-keep text-[17px] leading-7 text-[#625A68]">
              누군가의 마음을 빼빼로 선물과 함께 전했던 썸타임 캠페인을 소개해요.
            </p>
            <div className="mt-5 rounded-2xl border border-[#F0D9E5] bg-[#FFF7FB] p-4 text-[15px] leading-6 text-[#6D3A52]">
              현재 진행 여부와 일정은 이 페이지에서 확인할 수 없어요. 이 페이지에서는 선물을 신청하거나
              수령 정보를 입력할 수 없으며, 최신 소식은 공식 앱과 썸타임 안내를 확인해 주세요.
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-[28px] bg-[#FFF3F8] p-4">
            <Image
              src="/images/pepero.jpg"
              alt="빼빼로 선물 이미지"
              fill
              priority
              sizes="(max-width: 640px) 260px, 280px"
              className="object-contain p-4"
            />
          </div>
        </header>

        <div className="mt-8 sm:mt-10">
          <StoreInstallCta
            surface="landing_event"
            heading="최신 썸타임 소식은 공식 앱에서 확인하세요"
            description="App Store 또는 Google Play에서 공식 앱을 설치할 수 있어요."
          />
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-2" aria-labelledby="campaign-about">
          <div className="rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-5 sm:p-6">
            <h2 id="campaign-about" className="text-[21px] font-bold text-[#201823]">
              어떤 캠페인이었나요?
            </h2>
            <p className="mt-3 break-keep text-[16px] leading-7 text-[#625A68]">
              직접 마음을 전하기 어려운 대학생을 대신해 선물과 메시지를 전하는 11.11 시즌 캠페인이었어요.
              이 페이지는 캠페인의 취지를 설명하기 위해 남겨 두었어요.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#EEE8FF] bg-white p-5 sm:p-6">
            <h2 className="text-[21px] font-bold text-[#201823]">썸타임 알아보기</h2>
            <p className="mt-3 break-keep text-[16px] leading-7 text-[#625A68]">
              썸타임은 학교 인증을 바탕으로 대학생의 만남을 돕는 서비스예요. 가입 대상과 인증 방법,
              안전 기능은 공개 안내에서 먼저 확인할 수 있어요.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5">
              <Link href="/about" className="inline-flex min-h-11 items-center font-semibold text-[#5B35B5] underline underline-offset-4">
                서비스 소개
              </Link>
              <Link href="/verification" className="inline-flex min-h-11 items-center font-semibold text-[#5B35B5] underline underline-offset-4">
                학교 인증 안내
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ContentShell>
  );
}
