import Image from "next/image";
import Link from "next/link";
import { ContentShell } from "../_components/public-content/ContentShell";
import { StoreInstallCta } from "../_components/public-content/StoreInstallCta";
import { PageHeader } from "../_components/public-content/PageHeader";
import { READING_BODY, READING_H2, READING_LINK, READING_SHELL } from "../_components/public-content/reading-styles";

export default function EventPage() {
  return (
    <ContentShell>
      <div className={READING_SHELL}>
        <PageHeader
          eyebrow="CAMPAIGN RECORD"
          title="11.11 선물 캠페인 안내"
          lead="누군가의 마음을 빼빼로 선물과 함께 전했던 썸타임 캠페인을 소개해요."
          className="mb-8"
        />
        <aside role="note" className="mb-8 border-l-4 border-[#625A68] bg-[#f7f7f7] p-4 text-[16px] leading-[1.7] text-[#201823]">
          현재 진행 여부와 일정은 이 페이지에서 확인할 수 없어요. 이 페이지에서는 선물을 신청하거나
          수령 정보를 입력할 수 없으며, 최신 소식은 공식 앱과 썸타임 안내를 확인해 주세요.
        </aside>
        <figure className="mb-8">
          <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-lg bg-[#FFF3F8] p-4">
            <Image
              src="/images/pepero.jpg"
              alt="빼빼로 선물 이미지"
              fill
              priority
              sizes="260px"
              className="object-contain p-4"
            />
          </div>
        </figure>

        <div className="mt-8 sm:mt-10">
          <StoreInstallCta
            surface="landing_event"
            heading="최신 썸타임 소식은 공식 앱에서 확인하세요"
            description="App Store 또는 Google Play에서 공식 앱을 설치할 수 있어요."
          />
        </div>

        <section className="mt-12" aria-labelledby="campaign-about">
          <h2 id="campaign-about" className={READING_H2}>
            어떤 캠페인이었나요?
          </h2>
          <p className={`mt-4 break-keep ${READING_BODY}`}>
            직접 마음을 전하기 어려운 대학생을 대신해 선물과 메시지를 전하는 11.11 시즌 캠페인이었어요.
            이 페이지는 캠페인의 취지를 설명하기 위해 남겨 두었어요.
          </p>
        </section>
        <section className="mt-12" aria-labelledby="campaign-sometime">
          <h2 id="campaign-sometime" className={READING_H2}>썸타임 알아보기</h2>
          <p className={`mt-4 break-keep ${READING_BODY}`}>
            썸타임은 학교 인증을 바탕으로 대학생의 만남을 돕는 서비스예요. 가입 대상과 인증 방법,
            안전 기능은 공개 안내에서 먼저 확인할 수 있어요.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5">
            <Link href="/about" className={`inline-flex min-h-11 items-center ${READING_LINK}`}>
              서비스 소개
            </Link>
            <Link href="/verification" className={`inline-flex min-h-11 items-center ${READING_LINK}`}>
              학교 인증 안내
            </Link>
          </div>
        </section>
      </div>
    </ContentShell>
  );
}
