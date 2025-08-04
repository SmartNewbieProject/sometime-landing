"use client";
import { Suspense } from "react";
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
import QueryParamHandler from "@/app/_components/QueryParamHandler";
import usePageViewTracking from "@/app/_hooks/usePageViewTracking";

export default function DesktopIndex() {
  usePageViewTracking();
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
      <Suspense fallback={null}>
        <QueryParamHandler />
      </Suspense>
    </div>
  );
}
