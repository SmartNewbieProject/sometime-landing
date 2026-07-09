"use client";

import Link from "next/link";
import { track } from "@amplitude/analytics-browser";
import { sendGTMEvent } from "@next/third-parties/google";
import {
  buildSomemateTrialUrl,
  type TrialContentType,
  type TrialPlacement,
} from "@/app/_lib/acquisition";

type TrialChatCtaProps = {
  contentType: TrialContentType;
  contentId?: string;
  placement?: TrialPlacement;
  /** 본문 톤에 맞춘 보조 카피 */
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
};

/**
 * info 콘텐츠 → 비로그인 썸메이트 체험 유도.
 * 실제 매칭이 아닌 체험용 대화임을 명시.
 */
export function TrialChatCta({
  contentType,
  contentId,
  placement = "detail_bottom",
  eyebrow = "가입 전 30초 체험",
  title = "읽은 그 설렘, 말로 이어보면 어때요?",
  description = "앱 설치·가입 전에, 가상의 인연과 가벼운 대화를 먼저 느껴볼 수 있어요. 체험용 AI 대화이며 실제 유저 매칭은 아닙니다.",
  className = "",
}: TrialChatCtaProps) {
  const href = buildSomemateTrialUrl({ contentType, contentId, placement });

  const handleClick = () => {
    try {
      track("Click_Somemate_Trial", {
        content_type: contentType,
        content_id: contentId ?? "hub",
        placement,
        destination: href,
      });
      sendGTMEvent({
        event: "click_somemate_trial",
        content_type: contentType,
        content_id: contentId ?? "hub",
        placement,
      });
    } catch {
      // analytics optional
    }
  };

  return (
    <aside
      className={`overflow-hidden rounded-[28px] border border-[#EEE8FF] bg-gradient-to-br from-[#FCFAFF] via-white to-[#F4F0FF] p-6 sm:p-8 ${className}`}
      aria-labelledby="trial-chat-cta-title"
    >
      <p className="text-[13px] font-semibold tracking-wide text-[#7A4AE2]">{eyebrow}</p>
      <h2
        id="trial-chat-cta-title"
        className="mt-2 font-wantedSans text-[22px] font-bold leading-[30px] text-black sm:text-[24px] sm:leading-[32px]"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-[520px] text-[15px] font-medium leading-[25px] text-[#666]">
        {description}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={href}
          onClick={handleClick}
          className="inline-flex items-center justify-center rounded-[30px] bg-[#7A4AE2] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(122,74,226,0.28)] transition hover:-translate-y-0.5 hover:bg-[#6B3FD0]"
        >
          가상 인연과 먼저 대화해보기
        </Link>
        <p className="text-[12px] font-medium leading-[18px] text-[#9B8EBD]">
          체험용 · 로그인 없이 시작 · 쿼터 내에서 메시지 가능
        </p>
      </div>
    </aside>
  );
}
