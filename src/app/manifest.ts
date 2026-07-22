import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "./_lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - 대학생 소개팅 앱`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/download",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#7A4AE2",
    lang: "ko-KR",
    categories: ["social", "lifestyle"],
    icons: [
      { src: "/images/logo.png", sizes: "138x138", type: "image/png" },
      { src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
    ],
  };
}
