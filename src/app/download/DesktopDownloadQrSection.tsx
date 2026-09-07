import Image from "next/image";

const DESKTOP_DOWNLOAD_QR_URL =
  "https://some-in-univ.com/download?surface=desktop_qr";

export function DesktopDownloadQrSection() {
  return (
    <aside
      aria-labelledby="desktop-download-qr-heading"
      className="mt-8 hidden items-center gap-4 border-t border-[#EEE8FF] pt-6 lg:flex"
    >
      <a
        href={DESKTOP_DOWNLOAD_QR_URL}
        aria-label="QR 코드의 썸타임 다운로드 링크 열기"
        className="shrink-0 rounded-xl bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]"
      >
        <Image
          src="/images/download/desktop-download-qr.svg"
          alt="휴대폰에서 썸타임 다운로드 페이지를 여는 QR 코드"
          width={112}
          height={112}
          className="h-28 w-28 rounded-xl"
        />
      </a>
      <div className="font-pretendard">
        <h2 id="desktop-download-qr-heading" className="text-base font-bold text-[#201823]">
          휴대폰으로 이어서 시작하기
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#625A68]">
          카메라로 QR 코드를 스캔하면<br />
          이 다운로드 페이지가 열려요.
        </p>
      </div>
    </aside>
  );
}
