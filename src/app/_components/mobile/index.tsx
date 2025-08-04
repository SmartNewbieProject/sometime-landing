"use client";
import { Suspense } from "react";
import FloatingButton from "./FloatingButton";
import FullPageWrapper from "./FullPageWrapper";
import Section from "./Section";
import Fifth from "./section/Fifth";
import First from "./section/First";
import Second from "./section/Second";
import Seventh from "./section/Seventh";
import Sixth from "./section/Sixth";
import Third from "./section/Third";
import QueryParamHandler from "@/app/_components/QueryParamHandler";
import usePageViewTracking from "@/app/_hooks/usePageViewTracking";

export default function MobileIndex() {
  usePageViewTracking();
  return (
    <>
      <Suspense fallback={null}>
        <QueryParamHandler />
      </Suspense>
      <FullPageWrapper>
        {[First, Second, Third, Fifth, Sixth, Seventh].map((Item, index) => (
          <Section key={index}>
            <Item />
          </Section>
        ))}
      </FullPageWrapper>
      <FloatingButton />
    </>
  );
}
