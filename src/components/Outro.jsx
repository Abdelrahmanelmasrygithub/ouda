import { motion } from "framer-motion";
import Logo from "./Logo.jsx";
import { SplitWords, FadeUp } from "./AnimatedText.jsx";
import { outro, company } from "../data/plan.js";

export default function Outro() {
  return (
    <>
      <section id="end" className="outro">
        <div className="blob blob-a" />
        <div className="blob blob-b" />

        <motion.div
          className="loop-icon"
          initial={{ opacity: 0, scale: 0.6, rotate: -120 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 64 64" fill="none" stroke="url(#outroGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="outroGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--primary)" />
                <stop offset="0.55" stopColor="var(--primary-2)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <g className="loop-spin">
              <path d="M52 32a20 20 0 1 1-6-14.2" />
              <path d="M52 8v12H40" />
            </g>
          </svg>
        </motion.div>

        <SplitWords as="h2" className="outro-title" text={outro.title} inView />

        <FadeUp inView delay={0.3} className="outro-text-wrap">
          <p className="outro-text">{outro.text}</p>
        </FadeUp>

        <FadeUp inView delay={0.5}>
          <button
            className="btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {outro.button}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </FadeUp>
      </section>

      <footer className="footer">
        <Logo size={30} animate={false} />
        <span>
          © {new Date().getFullYear()} {company.name} — {outro.footer}
        </span>
      </footer>
    </>
  );
}
