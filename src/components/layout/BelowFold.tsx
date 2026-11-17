import { useState } from "react";
import About from "@/components/about/About";
import Experience from "@/components/about/Experience";
import Skills from "@/components/about/Skills";
import Contact from "@/components/contact/Contact";
import HowIBuild from "@/components/how-i-build/HowIBuild";
import Notes from "@/components/notes/Notes";
import Services from "@/components/services/Services";
import Testimonials from "@/components/testimonials/Testimonials";
import { buildRequest, SERVICES } from "@/config/services";
import { scrollToSection } from "@/lib/scroll";

interface RequestPrefill {
  /** Changes on every "Send request", so the form restarts with the new text. */
  version: number;
  subject: string;
  message: string;
}

/**
 * Everything after Selected Work. It is prerendered into the HTML like the rest, but its
 * script loads as a separate chunk so the first screen becomes interactive sooner.
 */
export default function BelowFold() {
  const [requestIds, setRequestIds] = useState<string[]>([]);
  const [prefill, setPrefill] = useState<RequestPrefill>({ version: 0, subject: "", message: "" });

  const toggleRequest = (id: string) =>
    setRequestIds((current) => (current.includes(id) ? current.filter((other) => other !== id) : [...current, id]));

  const sendRequest = () => {
    const chosen = SERVICES.filter((product) => requestIds.includes(product.id));
    setPrefill((current) => ({ version: current.version + 1, ...buildRequest(chosen) }));
    scrollToSection("contact");
  };

  return (
    <>
      <HowIBuild />
      <About />
      <Experience />
      <Skills />
      <Services selectedIds={requestIds} onToggle={toggleRequest} onSend={sendRequest} />
      <Testimonials />
      <Notes />
      <Contact key={prefill.version} initialSubject={prefill.subject} initialMessage={prefill.message} />
    </>
  );
}
