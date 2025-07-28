import Image from "next/image";
import Link from "next/link";
import React from "react";

const footerList = [
  {
    text: "서비스 이용약관",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba1805dbafbc9426a0aaa80",
  },
  {
    text: "개인정보처리방침",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba180a3a4bbdf9301683145",
  },

  {
    text: "개인정보 수집 및 이용동의",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba180a3a4bbdf9301683145?pvs=7",
  },
];

export default function Footer() {
  return (
    <footer className="w-full font-wantedSans bg-white flex items-center justify-center">
      <div className="w-full max-w-[850px] h-full bg-white ">
        <div className="mt-[120px] flex justify-between items-start">
          <div className="text-[#7A4AE2] font-medium underline underline-offset-auto text-[16px] leading-[29px]">
            {footerList.map(({ text, href }) => (
              <Link key={text} className="block" href={href} target="_blank">
                {text}
              </Link>
            ))}
          </div>
          <Link href="https://www.instagram.com/sometime.in.univ?igsh=MTdxMWJjYmFrdGc3Ng==" target="_blank">
            <Image src={"/images/instagram.png"} width={42} height={42} alt="인스타그램 링크" />
          </Link>
        </div>

        <div className="text-[#7A4AE2] mb-[120px] font-medium text-[16px] leading-[29px] mt-[100px]">
          상호명 ㅣ 스마트뉴비
          <br /> 사업자 등록 번호 ㅣ 498-05-02914 <br />
          사업장 소재지 ㅣ 대전광역시 서구 갈마중로 7번길 42, 4동 1407호
          <br /> 대표 ㅣ 전준영
          <br /> 문의 메일 ㅣ notify@smartnewb.com <br />
          통신판매업신고 ㅣ 제 2025-대전유성-0530호
        </div>
      </div>
    </footer>
  );
}
