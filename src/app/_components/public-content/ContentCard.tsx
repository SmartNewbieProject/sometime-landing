import Image from "next/image";
import Link from "next/link";

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
      className="group overflow-hidden rounded-[28px] border border-[#efe5f5] bg-white shadow-[0_20px_70px_rgba(76,47,100,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(111,72,154,0.16)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5edf8]">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 360px, 100vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#7a4bea] shadow-sm">
          {label}
        </span>
      </div>
      <div className="p-6">
        <h2 className="line-clamp-2 font-wantedSans text-xl font-black leading-snug text-[#201823]">
          {title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6c6273]">{description}</p>
        {meta ? <p className="mt-5 text-xs font-bold text-[#9a8fa2]">{meta}</p> : null}
      </div>
    </Link>
  );
}
