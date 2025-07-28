import BackgroundSection from "./BackgroundSection";
import DownloadSection from "./DownloadSection";
import Footer from "./Footer";
import GradientScrollSection from "./GradiantScrollSection";
import Header from "./Header";
import IntroduceSection from "./IntroduceSection";
import OverviewSection from "./OverviewSection";
import ScreenListSection from "./ScreenListSection";
import Title from "./Title";
import TopSection from "./TopSection";

export default function DesktopIndex() {
  return (
    <div className="overflow-auto max-w-screen overflow-x-hidden">
      <Header />
      <TopSection />
      <Title />
      <OverviewSection />
      <BackgroundSection />
      <IntroduceSection />
      <GradientScrollSection />
      <ScreenListSection />
      <DownloadSection />
      <Footer />
    </div>
  );
}
