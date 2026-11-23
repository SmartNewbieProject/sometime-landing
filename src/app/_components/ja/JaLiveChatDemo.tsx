"use client";

import { useState } from "react";

type ChatMessage = {
  sender: "me" | "kr";
  ja: string;
  ko: string;
  time: string;
};

type ChatScenario = {
  id: string;
  label: string;
  partnerName: string;
  partnerMeta: string;
  messages: ChatMessage[];
};

const SCENARIOS: ChatScenario[] = [
  {
    id: "cafe",
    label: "カフェ・グルメ",
    partnerName: "ジウ (22)",
    partnerMeta: "ソウル・大学3年 · 本人確認済み",
    messages: [
      {
        sender: "kr",
        ko: "안녕하세요! 프로필에 카페 투어 좋아하신다고 적혀 있어서 반가웠어요.",
        ja: "こんにちは！プロフィールにカフェ巡りが好きと書いてあって嬉しかったです。",
        time: "21:14",
      },
      {
        sender: "me",
        ja: "はじめまして！今度ソウルに行ったら聖水（ソンス）のカフェに行ってみたいです。",
        ko: "처음 뵙겠습니다! 다음에 서울에 가면 성수동 카페에 가보고 싶어요.",
        time: "21:16",
      },
      {
        sender: "kr",
        ko: "성수동 자주 가요! 조용하고 디저트 맛있는 곳 몇 군데 추천해 드릴게요.",
        ja: "聖水よく行きますよ！静かでデザートが美味しいお店、いくつかおすすめしますね。",
        time: "21:17",
      },
    ],
  },
  {
    id: "kpop",
    label: "K-POP・音楽",
    partnerName: "ミンジュン (23)",
    partnerMeta: "釜山・大学4年 · 本人確認済み",
    messages: [
      {
        sender: "me",
        ja: "こんにちは！韓国のインディーズバンドやK-POPが好きで韓国語を勉強しています。",
        ko: "안녕하세요! 한국 인디밴드랑 K-POP을 좋아해서 한국어를 공부하고 있어요.",
        time: "22:03",
      },
      {
        sender: "kr",
        ko: "오, 저도 밴드 음악 정말 좋아해요! 요즘 제일 자주 듣는 노래가 뭐예요?",
        ja: "おお、僕もバンド音楽がすごく好きです！最近いちばんよく聴く曲は何ですか？",
        time: "22:05",
      },
      {
        sender: "me",
        ja: "歌詞の意味も知りたくて聴いています。おすすめの曲があれば教えてください！",
        ko: "가사 뜻도 알고 싶어서 듣고 있어요. 추천 곡이 있으면 알려주세요!",
        time: "22:06",
      },
    ],
  },
  {
    id: "travel",
    label: "日韓旅行",
    partnerName: "ソヨン (21)",
    partnerMeta: "ソウル・大学2年 · 本人確認済み",
    messages: [
      {
        sender: "kr",
        ko: "다음 달에 도쿄 여행 가는데, 현지 대학생들이 자주 가는 동네가 어디예요?",
        ja: "来月東京旅行に行くんですが、現地の大学生がよく行くエリアってどこですか？",
        time: "20:41",
      },
      {
        sender: "me",
        ja: "下北沢や中目黒が人気ですよ！カフェも古着屋さんも多くて歩きやすいです。",
        ko: "시모키타자와나 나카메구로가 인기 많아요! 카페랑 빈티지 숍도 많아서 걷기 좋아요.",
        time: "20:43",
      },
      {
        sender: "kr",
        ko: "메모했어요! 답장 고마워요. 서울 오실 때 꼭 말씀해 주세요.",
        ja: "メモしました！返信ありがとうございます。ソウルに来るときはぜひ教えてくださいね。",
        time: "20:44",
      },
    ],
  },
];

export function JaLiveChatDemo() {
  const [activeId, setActiveId] = useState<string>(SCENARIOS[0].id);
  const [showOriginal, setShowOriginal] = useState(true);

  const scenario = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  return (
    <div className="mx-auto w-full max-w-[390px]">
      {/* Topic switcher */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {SCENARIOS.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  active
                    ? "bg-[#191F28] text-white"
                    : "border border-[#E2DED6] bg-white text-[#545C68] hover:text-[#191F28]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowOriginal((v) => !v)}
          className="shrink-0 text-[11px] font-bold text-[#545C68] underline underline-offset-4 hover:text-[#191F28]"
        >
          {showOriginal ? "原文を隠す" : "原文を表示"}
        </button>
      </div>

      {/* Phone mockup frame */}
      <div className="overflow-hidden rounded-[28px] border border-[#E2DED6] bg-white shadow-[0_20px_50px_rgba(25,31,40,0.08)]">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-[#F0EEE9] bg-[#FBF8F3] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#191F28] text-xs font-black text-white">
              KR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-[#191F28]">{scenario.partnerName}</p>
                <span className="h-1.5 w-1.5 rounded-full bg-[#7A4AE2]" />
              </div>
              <p className="text-[11px] font-medium text-[#545C68]">{scenario.partnerMeta}</p>
            </div>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#191F28] ring-1 ring-[#E6E2DA]">
            自動翻訳 ON
          </span>
        </div>

        {/* Messages */}
        <div className="space-y-3 bg-[#FAF9F6] px-4 py-4">
          {scenario.messages.map((msg, idx) => {
            const isMe = msg.sender === "me";
            return (
              <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    isMe
                      ? "rounded-br-sm bg-[#191F28] text-white"
                      : "rounded-bl-sm border border-[#E6E2DA] bg-white text-[#191F28]"
                  }`}
                >
                  <p className="font-semibold">{msg.ja}</p>
                  {showOriginal ? (
                    <p
                      className={`mt-1.5 border-t pt-1.5 text-[11px] leading-snug ${
                        isMe
                          ? "border-white/15 text-white/75"
                          : "border-[#F0EEE9] text-[#6B7280]"
                      }`}
                    >
                      {isMe ? `韓国語に翻訳: ${msg.ko}` : `原文: ${msg.ko}`}
                    </p>
                  ) : null}
                </div>
                <span className="mt-1 px-1 text-[10px] font-medium text-[#828A96]">
                  {msg.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom input bar mock */}
        <div className="flex items-center justify-between border-t border-[#F0EEE9] bg-white px-4 py-3">
          <span className="text-xs text-[#828A96]">日本語のまま入力すると自動で韓国語に翻訳...</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#7A4AE2] text-white">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
