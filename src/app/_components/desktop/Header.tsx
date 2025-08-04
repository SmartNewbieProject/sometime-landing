"use client";
import Image from "next/image";
import HeaderButton from "./HeaderButton";
import { deeplinkToApp } from "@/app/_lib/utils";
import { useRouter } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";
import { track } from "@amplitude/analytics-browser";

export default function Header() {
  const router = useRouter();
  return (
    <header className="w-full h-[55px] bg-white flex items-center justify-center">
      <div className="w-full max-w-[850px] h-full bg-white  flex items-center justify-between">
        <Image
          src={"/images/info-logo.png"}
          width={216}
          height={30}
          alt="썸타임 헤더 로고"
        />

        <div className="flex items-center gap-[20px]">
          <HeaderButton
            text="앱으로 이동"
            onClick={() => {
              track("Click_App", {
                type: "Desktop",
              });
              sendGTMEvent({ event: "click_app" });

              deeplinkToApp("");
            }}
          />
          <HeaderButton
            text="로그인 및 회원가입"
            onClick={() => {
              track("Click_Login_Page", { type: "Desktop" });
              sendGTMEvent({ event: "click_login_page" });
              router.push("https://some-in-univ.com/auth/login");
            }}
          />
        </div>
      </div>
    </header>
  );
}
