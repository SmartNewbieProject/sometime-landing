import Image from "next/image";

const DESKTOP_DOWNLOAD_QR_URL =
  "https://info.some-in-univ.com/download?surface=desktop_qr";

export function DesktopDownloadQrSection() {
  return (
    <section
      aria-labelledby="desktop-download-qr-heading"
      className="not-prose mt-6 hidden md:block"
    >
      <div className="overflow-hidden rounded-[28px] border border-[#E9E1F8] bg-white shadow-[0_18px_55px_rgba(61,33,118,0.08)]">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:px-8 lg:py-8">
          <div>
            <p className="text-[12px] font-bold tracking-[0.14em] text-[#6B6472]">
              DESKTOP QR
            </p>
            <h2
              id="desktop-download-qr-heading"
              className="mt-2 text-[24px] font-black leading-[1.35] text-[#201823]"
            >
              휴대폰으로 스캔해 썸타임 다운로드를 바로 이어가세요
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] font-medium leading-7 text-[#625A68]">
              데스크톱에서 보고 있다면 휴대폰 카메라로 QR 코드를 스캔해 썸타임 공식 다운로드 안내 페이지를 바로 열 수 있어요.
            </p>
            <p className="mt-4 text-[14px] font-medium leading-6 text-[#5F5567]">
              QR 사용이 어렵다면{" "}
              <a href={DESKTOP_DOWNLOAD_QR_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#7A4AE2] underline underline-offset-4">
                다운로드 안내 페이지를 직접 열기
              </a>
              로 같은 링크를 이용할 수 있습니다.
            </p>
            <p className="mt-3 break-all rounded-[18px] border border-[#EEE8FF] bg-[#FCFAFF] px-4 py-3 text-[12px] font-medium leading-5 text-[#6B6472]">
              {DESKTOP_DOWNLOAD_QR_URL}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[220px] rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-4 shadow-[0_12px_32px_rgba(122,74,226,0.12)]">
            <Image src="/images/download/desktop-download-qr.svg" alt="썸타임 다운로드 안내 페이지로 이동하는 QR 코드" width={188} height={188} className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
