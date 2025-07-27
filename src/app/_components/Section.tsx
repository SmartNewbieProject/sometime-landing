import FloatingButton from "./FloatingButton";

export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="section flex font-pretendard justify-center max-w-[440px] mx-auto items-center w-full min-h-screen bg-white section">
      <div className="w-full h-screen ">{children}</div>
    </div>
  );
}
