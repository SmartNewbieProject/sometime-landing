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

export default function MobileIndex() {
  return (
    <>
      <QueryParamHandler/>
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
