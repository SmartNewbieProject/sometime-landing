import BackgroundSection from "./BackgroundSection";
import Header from "./Header";
import IntroduceSection from "./IntroduceSection";
import OverviewSection from "./OverviewSection";
import Title from "./Title";
import TopSection from "./TopSection";

export default function DesktopIndex() {
  return (
    <div className="overflow-auto">
      <Header />
      <TopSection />
      <Title />
      <OverviewSection />
      <BackgroundSection />
      <IntroduceSection />
    </div>
  );
}
