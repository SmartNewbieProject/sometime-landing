"use client";

import Link from "next/link";
import { useState } from "react";
import {
  REPLY_GAP_QUESTIONS,
  scoreReplyGapCheck,
} from "../../_lib/reply-gap-check";

export function ReplyGapQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = REPLY_GAP_QUESTIONS.length;
  const isComplete = answeredCount === totalQuestions;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const result = isComplete
    ? scoreReplyGapCheck(REPLY_GAP_QUESTIONS.map((q) => answers[q.id] ?? 0))
    : null;

  const handleSelect = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setCopied(false);
  };

  const handleReset = () => {
    setAnswers({});
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `[소개팅 연락 텀 호감도 자가진단 결과]\n점수: ${result.total}/14점 — ${result.band.title}\n${result.band.summary}\nhttps://some-in-univ.com/dating-lab/reply-gap-check`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Progress bar */}
      <div className="rounded-2xl border border-[#E6E3DC] bg-[#FBF8F3] p-4">
        <div className="flex items-center justify-between text-sm font-bold text-[#191F28]">
          <span>진행률</span>
          <span>
            {answeredCount} / {totalQuestions} 문항 완료
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E8E4DC]">
          <div
            className="h-full rounded-full bg-[#7A4AE2] transition-all duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <ol className="space-y-4">
        {REPLY_GAP_QUESTIONS.map((q, index) => {
          const picked = answers[q.id];
          return (
            <li
              key={q.id}
              className="rounded-2xl border border-[#E6E3DC] bg-white p-5 shadow-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#191F28] text-xs font-extrabold text-white">
                  {index + 1}
                </span>
                <p className="text-[15.5px] font-bold leading-snug text-[#191F28]">
                  {q.prompt}
                </p>
              </div>
              <div className="mt-3.5 grid gap-2">
                {q.options.map((opt) => {
                  const selected = picked === opt.score;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelect(q.id, opt.score)}
                      aria-pressed={selected}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        selected
                          ? "border-[#7A4AE2] bg-[#7A4AE2] text-white"
                          : "border-[#E6E3DC] bg-[#FAF9F6] text-[#191F28] hover:border-[#C5C0B6]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Result Card */}
      {result ? (
        <section
          aria-live="polite"
          className="rounded-2xl border-2 border-[#191F28] bg-[#FBF8F3] p-6"
        >
          <span className="inline-block rounded-full bg-[#191F28] px-3 py-1 text-xs font-bold text-white">
            {result.band.badge} · 내 점수 {result.total}/14점
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#191F28]">
            {result.band.title}
          </h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-[#333D4B]">
            {result.band.summary}
          </p>
          <div className="mt-4 rounded-xl border border-[#E6E3DC] bg-white p-4">
            <p className="text-xs font-extrabold text-[#545C68]">지금 추천하는 다음 행동</p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-[#191F28]">
              {result.band.nextAction}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {result.band.links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-xl border border-[#D4D0C7] bg-white px-3.5 py-2 text-xs font-bold text-[#191F28] hover:bg-[#F3F1EC]"
              >
                {item.label} →
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-[#E6E3DC] pt-4">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#7A4AE2] px-5 text-sm font-bold text-white hover:bg-[#6738CE]"
            >
              {copied ? "결과 요약 복사됨" : "결과 요약 복사하기"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#D4D0C7] bg-white px-4 text-sm font-bold text-[#191F28] hover:bg-[#F3F1EC]"
            >
              다시 진단하기
            </button>
            <Link
              href="/download?utm_source=organic_web&utm_medium=seo&utm_campaign=dating_lab_tool&utm_content=reply_gap_check"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#191F28] bg-[#191F28] px-4 text-sm font-bold text-white hover:bg-[#2E3643]"
            >
              인증된 20대와 썸타임 시작하기
            </Link>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#D4D0C7] bg-[#FAF9F6] p-5 text-center text-sm font-semibold text-[#545C68]">
          7개 문항을 모두 선택하면 바로 아래에 호감도 진단 결과와 추천 행동이 표시됩니다.
        </div>
      )}
    </div>
  );
}
