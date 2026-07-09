import type { Metadata } from "next";
import { SITE_URL } from "./public-content";

export const DEFAULT_OG_PATH = "/preview_title.png";
export const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_OG_PATH}`;

export const SITE_NAME = "썸타임";
export const SITE_TITLE =
  "썸타임 - 대학생 소개팅 앱 | 학교 인증 캠퍼스 매칭";
export const SITE_DESCRIPTION =
  "학교 인증을 기반으로 같은 지역, 인접 대학의 대학생을 연결하는 캠퍼스 소개팅 앱 썸타임. 안전한 대학생 소개팅, 캠퍼스 매칭, 매주 목/일 무료 매칭을 확인해보세요.";

export const DEFAULT_KEYWORDS = [
  "대학생 소개팅 앱",
  "대학생 소개팅 앱 추천",
  "학교 인증 소개팅",
  "캠퍼스 소개팅",
  "캠퍼스 매칭",
  "안전한 소개팅 앱",
  "대학생 연애",
  "AI 취향 분석 매칭",
  "썸타임",
];

/** 상대 경로 또는 절대 URL → 절대 URL */
export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

export function sitePath(...segments: string[]): string {
  const joined = segments
    .filter(Boolean)
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .join("/");
  return joined ? `${SITE_URL}/${joined}` : SITE_URL;
}

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  keywords?: string[];
  noIndex?: boolean;
  authors?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
  authors,
}: BuildPageMetadataInput): Metadata {
  const url = path.startsWith("http") ? path : absoluteUrl(path);
  const ogImage = absoluteUrl(image || DEFAULT_OG_PATH);
  const fullTitle = title.includes(SITE_NAME) ? title : undefined;

  return {
    title: fullTitle ? { absolute: fullTitle } : title,
    description,
    keywords,
    authors: authors?.map((name) => ({ name })),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type,
      publishedTime: publishedTime ?? undefined,
      modifiedTime: modifiedTime ?? undefined,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/info-logo.png"),
    sameAs: [
      "https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889",
      "https://play.google.com/store/apps/details?id=com.smartnewb.sometimes",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "notify@smartnewb.com",
      contactType: "customer support",
      availableLanguage: ["Korean"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android, Web",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  authorName,
  section,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authorName?: string | null;
  section?: string | null;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [absoluteUrl(image || DEFAULT_OG_PATH)],
    datePublished: publishedTime ?? undefined,
    dateModified: modifiedTime ?? publishedTime ?? undefined,
    author: {
      "@type": "Person",
      name: authorName || "썸타임 에디터",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/info-logo.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    },
    articleSection: section || undefined,
    keywords: keywords?.join(", "),
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
  };
}

export function collectionPageJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.slice(0, 24).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}
