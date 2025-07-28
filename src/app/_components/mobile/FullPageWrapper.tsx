"use client";
import ReactFullpage from "@fullpage/react-fullpage";

export default function FullPageWrapper({ children }: { children: React.ReactNode }) {
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
