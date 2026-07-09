import Link from "next/link";
import { ContentMedia } from "./ContentMedia";
import { getBannerAlt } from "@/app/_lib/banner-a11y";

export function ContentCard({
  href,
  image,
  label,
  title,
  description,
  meta,
}: {
  href: string;
  image: string;
  label: string;
  title: string;
  description: string;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EEE8FF] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(122,74,226,0.10)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5edf8]">
        <ContentMedia
          src={image}
          alt={getBannerAlt(title)}
          seed={href}
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-[14px] bg-white px-3 py-1 text-xs font-semibold text-[#7A4AE2] shadow-sm">
          {label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="line-clamp-2 font-wantedSans text-[18px] font-bold leading-[26px] text-black sm:text-[19px] sm:leading-[28px]">
          {title}
        </h2>
        <p className="mt-2 line-clamp-2 text-[14px] font-medium leading-[22px] text-[#666] sm:mt-3 sm:line-clamp-3 sm:leading-[24px]">
          {description}
        </p>
        {meta ? (
          <p className="mt-auto pt-4 text-xs font-semibold text-[#9B8EBD]">{meta}</p>
        ) : null}
      </div>
    </Link>
  );
}
