import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Intro from "./components/Intro.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import CycleSection from "./components/CycleSection.jsx";
import Outro from "./components/Outro.jsx";

export default function App() {
  const [ready, setReady] = useState(false);

  // قفل السكرول أثناء الشاشة الافتتاحية
  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <>
      <AnimatePresence>
        {!ready && <Intro onDone={() => setReady(true)} />}
      </AnimatePresence>

      {ready && (
        <>
          <Navbar />
          <main id="top">
            <Hero />
            <CycleSection />
            <Outro />
          </main>
        </>
      )}
    </>
  );
}
