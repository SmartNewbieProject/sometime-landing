import FullPageWrapper from "@/app/_components/FullPageWrapper";
import Section from "@/app/_components/Section";
import First from "./_components/section/First";
import Second from "./_components/section/Second";
import Third from "./_components/section/Third";
import Fourth from "./_components/section/Fourth";
import Fifth from "./_components/section/Fifth";
import Sixth from "./_components/section/Sixth";
import Seventh from "./_components/section/Seventh";
import FloatingButton from "./_components/FloatingButton";

export default function Home() {
  return (
    <FullPageWrapper>
      {[First, Second, Third, Fourth, Fifth, Sixth, Seventh].map((Item, index) => (
        <Section key={index}>
          <Item />
        </Section>
      ))}
    </FullPageWrapper>
  );
}
