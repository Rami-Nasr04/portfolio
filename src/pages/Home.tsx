import Hero from "@/components/hero/Hero";
import MonogramIntro from "@/components/layout/MonogramIntro";
import Nav from "@/components/layout/Nav";
import SelectedWork from "@/components/work/SelectedWork";
import { SITE } from "@/config/site";

export function meta() {
  return [
    { title: `${SITE.name} | ${SITE.title}` },
    { name: "description", content: SITE.valueLine },
  ];
}

export default function Home() {
  return (
    <>
      <MonogramIntro />
      <div id="page">
        <Nav />
        <main>
          <Hero />
          <SelectedWork />
        </main>
      </div>
    </>
  );
}
