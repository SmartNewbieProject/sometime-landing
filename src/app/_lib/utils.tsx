"use client";

export function deeplinkToApp(deepLinkValue: string) {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isMobile = isAndroid || isIOS;

  const encodedValue = encodeURIComponent(deepLinkValue);
  const fallbackUrl = getFallbackUrl();

  if (!isMobile) {
    alert("모바일 기기에서만 실행 가능한 기능입니다. 모바일로 접속해주세요.");
    window.open(fallbackUrl, "_blank");
    return;
  }

  if (isIOS) {
    const universalLink = `https://sometime.page.link/?deep_link_value=${encodedValue}`;
    window.location.href = universalLink;

    // Universal link가 실패할 경우 fallback (iOS는 최소 2~3초 필요)
    setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 3000);
  } else if (isAndroid) {
    const intentUrl = `intent://open?deep_link_value=${encodedValue}#Intent;scheme=myapp;package=com.smartnewb.sometimes;end;`;
    window.location.href = intentUrl;

    // intent://는 자체 fallback을 지원하므로 별도 fallback 처리 필요 없음
  }
}

function getFallbackUrl() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/android/.test(userAgent)) {
    return "https://play.google.com/store/apps/details?id=com.smartnewb.sometimes";
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return "https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889";
  } else {
    alert("해당 기능은 스마트폰에서만 사용 가능합니다.");
    return "https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889";
  }
}
