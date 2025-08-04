"use client";
import ReactFullpage from "@fullpage/react-fullpage";
import { useEffect } from "react";

export default function FullPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      window?.fullpage_api?.moveSectionDown();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <ReactFullpage
      scrollingSpeed={700}
      licenseKey={process.env.NEXT_PUBLIC_FULLPAGE_LICENSE_KEY}
      credits={{
        enabled: false,
        label: "",
      }}
      anchors={["title", "area", "verify", "story", "landing", "info"]}
      render={() => {
        return (
          <div className="bg-white" id="fullpage-wrapper">
            {children}
          </div>
        );
      }}
    />
  );
}
