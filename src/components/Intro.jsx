import { useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo.jsx";
import { SplitWords } from "./AnimatedText.jsx";
import { hero } from "../data/plan.js";

const DURATION = 3200;

export default function Intro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, DURATION);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="intro"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <div className="intro-inner">
        <motion.div
          className="intro-logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
        >
          <Logo size={104} />
        </motion.div>

        <SplitWords
          as="h1"
          className="intro-title"
          text={hero.introText}
          delay={1}
          stagger={0.12}
        />

        <div className="intro-bar" aria-hidden="true">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: (DURATION - 500) / 1000, ease: "easeInOut" }}
          />
        </div>
      </div>

      <button className="intro-skip" onClick={onDone}>
        تخطي
      </button>
    </motion.div>
  );
}
