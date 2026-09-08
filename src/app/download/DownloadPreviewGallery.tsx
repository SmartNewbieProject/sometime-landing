import Image from "next/image";

const previews = [
  { name: "02-profile-interests", label: "프로필과 취향", alt: "사진 너머, 취향까지 궁금해. 카페·독서·영화 관심사를 담은 가상 프로필 예시", disclosure: "가상 프로필·대화 예시 · 인물은 AI 생성 이미지입니다." },
  { name: "03-privacy-settings", label: "매칭 제외 설정", alt: "아는 사이는 설정으로 제외. 같은 학과·학교 매칭 제외와 연락처 차단 설정 예시", disclosure: "화면의 설정 상태는 이해를 돕기 위한 예시입니다." },
  { name: "04-university-verification", label: "대학 인증", alt: "대학생인지 먼저 확인해요. 학생증·재학증명서 또는 학교 이메일 인증 방법 선택 구성 예시", disclosure: "앱 소스에 기반한 인증 방법 선택 화면의 구성 예시입니다." },
  { name: "05-matching-reason", label: "매칭된 이유", alt: "우리, 어떤 점이 잘 맞을까요? 카페·독서·영화 취향을 바탕으로 한 가상의 매칭 이유와 편지 예시", disclosure: "프로필·대화·매칭 이유·키워드는 예시이며, 인물은 AI 생성 이미지입니다." },
  { name: "06-conversation", label: "관심에서 대화로", alt: "마음이 통하면, 대화로 이어져요. 독서와 카페에 관한 가상 대화 예시", disclosure: "가상 프로필·대화 예시 · 인물은 AI 생성 이미지입니다." },
] as const;

export function DownloadPreviewGallery() {
  return (
    <section aria-labelledby="download-preview-title" className="mx-auto w-full min-w-0 max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <h2 id="download-preview-title" className="text-[28px] font-extrabold leading-[1.3] tracking-[-0.04em] break-keep text-[#201823] sm:text-[40px]">
        썸타임에서 만나는 순간들
      </h2>
      <p id="download-preview-help" className="mt-4 max-w-2xl font-pretendard text-sm leading-6 break-keep text-[#625A68]">
        기능을 소개하는 홍보용 예시 이미지로, 현재 앱 화면과 다를 수 있어요.
        옆으로 넘기거나 아래 항목을 선택해 보세요. 이미지를 누르면 크게 볼 수 있어요.
      </p>
      <nav aria-label="홍보 이미지 선택" className="mt-5 flex flex-wrap gap-2">
        {previews.map((preview) => (
          <a key={preview.name} href={`#download-preview-${preview.name}`} className="inline-flex min-h-11 items-center rounded-full border border-[#EEE8FF] px-4 font-pretendard text-sm font-semibold text-[#5B35B5] hover:bg-[#F4F0FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]">
            {preview.label}
          </a>
        ))}
      </nav>
      <div role="region" aria-label="썸타임 홍보 이미지 갤러리" aria-describedby="download-preview-help" tabIndex={0} className="mt-6 overflow-x-auto overscroll-x-contain rounded-lg pb-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2] snap-x snap-mandatory sm:scroll-pe-[calc(100%-360px)]">
        <ul className="flex items-start gap-5">
          {previews.map((preview) => (
            <li key={preview.name} id={`download-preview-${preview.name}`} className="w-full shrink-0 scroll-mt-24 snap-start sm:w-[360px]">
              <figure>
                <a href={`/images/download/${preview.name}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`${preview.label} 예시 이미지 크게 보기 (새 탭)`} className="block rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]">
                  <Image src={`/images/download/${preview.name}.webp`} alt={preview.alt} width={990} height={2151} sizes="(min-width: 640px) 360px, calc(100vw - 40px)" className="h-auto w-full rounded-[24px]" />
                </a>
                <figcaption className="mt-4 px-1 font-pretendard text-xs leading-5 break-keep text-[#625A68]">
                  <span className="mb-1 block text-sm font-semibold text-[#201823]">{preview.label}</span>
                  {preview.disclosure}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
