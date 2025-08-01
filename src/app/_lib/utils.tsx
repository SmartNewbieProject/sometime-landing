"use client";

export function deeplinkToApp(deepLinkValue: string) {
  let didRedirect = false;
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isMobile = isAndroid || isIOS;

  // const schemeUrl = `myapp://?deep_link_value=${deepLinkValue}`;
  const fallbackUrl = getFallbackUrl();

  if (!isMobile) {
    alert("모바일 기기에서만 실행 가능한 기능입니다. 모바일로 접속해주세요.");

    window.location.href =
      "https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889";
    return;
  }

  // 앱 이동 시도
  // window.location.href = schemeUrl;

  // 앱으로 이동했는지 감지
  window.onblur = () => {
    didRedirect = true;
  };

  window.onfocus = () => {
    if (!didRedirect) {
      window.location.href = fallbackUrl;
    }
  };

  if (isAndroid) {
    setTimeout(() => {
      if (!didRedirect) {
        window.location.href = fallbackUrl;
      }
    }, 100);
  }

  if (isIOS) {
    const interval = setInterval(() => {
      if (!didRedirect) {
        window.location.href = fallbackUrl;
        clearInterval(interval);
      }
    }, 2000);
    // Universal link가 실패할 경우 fallback (iOS는 최소 2~3초 필요)
    setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 3000);
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
