"use client";

interface HeaderButtonProps {
  text: string;
  onClick: () => void;
}

export default function HeaderButton({ text, onClick }: HeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#7A4AE2] py-[5px] px-[15px] text-white text-[13px] font-semibold leading-[20px] font-wantedSans rounded-[30px]"
    >
      {text}
    </button>
  );
}
