import { motion } from "framer-motion";
import Logo from "./Logo.jsx";
import { SplitWords, FadeUp } from "./AnimatedText.jsx";
import { hero, steps } from "../data/plan.js";

function OrbitArt() {
  const chips = steps.slice(0, 3);
  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit-ring r1" style={{ "--d": "38s" }}>
        <i className="orbit-dot" style={{ left: "50%", top: 0 }} />
        <i className="orbit-dot sm" style={{ left: "92%", top: "75%" }} />
      </div>
      <div className="orbit-ring r2" style={{ "--d": "26s", animationDirection: "reverse" }}>
        <i className="orbit-dot acc" style={{ left: "8%", top: "70%" }} />
        <i className="orbit-dot sm" style={{ left: "50%", top: "100%" }} />
      </div>
      <div className="orbit-ring r3" style={{ "--d": "18s" }}>
        <i className="orbit-dot" style={{ left: "100%", top: "50%" }} />
      </div>

      <motion.div
        className="orbit-core"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120, damping: 14 }}
      >
        <Logo size={72} animate={false} showText={false} />
      </motion.div>

      {chips.map((s, i) => (
        <motion.span
          key={s.title}
          className={`orbit-chip c${i + 1}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + i * 0.2, type: "spring", stiffness: 140, damping: 13 }}
        >
          <b>{i + 1}</b>
          {s.title}
        </motion.span>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />

      <div className="hero-grid">
        <div className="hero-text">
          <FadeUp delay={0.1}>
            <span className="badge">
              <i /> {hero.badge}
            </span>
          </FadeUp>

          <h1 className="hero-title">
            <SplitWords text={hero.titleStart} delay={0.25} />{" "}
            <SplitWords text={hero.titleHighlight} wordClass="grad" delay={0.55} />
          </h1>

          <FadeUp delay={0.9} className="hero-sub-wrap">
            <p className="hero-sub">{hero.subtitle}</p>
          </FadeUp>

          <FadeUp delay={1.1} className="hero-actions">
            <a href="#plan" className="btn">
              {hero.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
            <div className="hero-stats">
              <span>
                <b>{steps.length}</b> {hero.statsSuffix}
              </span>
              <span className="sep" />
              <span>↻ {hero.statsLoop}</span>
            </div>
          </FadeUp>
        </div>

        <div className="hero-art">
          <OrbitArt />
        </div>
      </div>
    </section>
  );
}
