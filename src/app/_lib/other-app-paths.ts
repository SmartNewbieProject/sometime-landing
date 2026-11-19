// some-in-univ.com 에 rewrite 로 붙은 다른 Next 앱 경로. next/link 로 가면 이 앱 안에서 찾다 404 가 나므로 <a> 로 연다.
export const isOtherAppPath = (href: string) => /^\/(dating-app-ranking|rotation|sajuniv)(\/|$|\?)/.test(href);
