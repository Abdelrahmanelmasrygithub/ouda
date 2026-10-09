import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Logo from "./Logo.jsx";
import { SplitWords, EASE } from "./AnimatedText.jsx";
import { steps, cycle } from "../data/plan.js";

const C = 50; // مركز الحلقة (٪)
const R = 40; // نصف القطر (٪)

const fmt = (n) =>
  String(n)
    .padStart(2, "0")
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

export default function CycleSection() {
  const ref = useRef(null);
  const n = steps.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const draw = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.5 });
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((prev) => (prev === i ? prev : i));
  });

  // النقطة المضيئة اللي بتمشي على الحلقة
  const dotLeft = useTransform(draw, (v) => `${C + R * Math.cos(v * 2 * Math.PI - Math.PI / 2)}%`);
  const dotTop = useTransform(draw, (v) => `${C + R * Math.sin(v * 2 * Math.PI - Math.PI / 2)}%`);

  const goTo = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (total * (i + 0.5)) / n, behavior: "smooth" });
  };

  const step = steps[active];
  const isLast = active === n - 1;
  const next = steps[(active + 1) % n];

  return (
    <section id="plan" ref={ref} className="cycle" style={{ "--n": n }}>
      <div className="cycle-sticky">
        <div className="cycle-head">
          <span className="eyebrow">{cycle.eyebrow}</span>
          <h2>{cycle.title}</h2>
        </div>

        <div className="cycle-grid">
          {/* تفاصيل الخطوة */}
          <div className="detail-col">
            <AnimatePresence mode="wait">
              <motion.article
                key={active}
                className="detail"
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span className="detail-bg-num" aria-hidden="true">
                  {fmt(active + 1)}
                </span>

                <span className="step-chip">
                  {cycle.stepLabel} {fmt(active + 1)}
                </span>

                <SplitWords as="h3" className="detail-title" text={step.title} stagger={0.06} />

                <motion.p
                  className="detail-summary"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
                >
                  {step.summary}
                </motion.p>

                <ul className="detail-list">
                  {step.details.map((d, i) => (
                    <motion.li
                      key={d}
                      initial={{ opacity: 0, x: 22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.1, duration: 0.55, ease: EASE }}
                    >
                      <i />
                      {d}
                    </motion.li>
                  ))}
                </ul>

                {step.meta && (
                  <div className="detail-meta">
                    {step.meta.map((m) => (
                      <span key={m.label}>
                        <b>{m.label}:</b> {m.value}
                      </span>
                    ))}
                  </div>
                )}

                <div className="detail-next">
                  <span>{isLast ? cycle.loopLabel : cycle.nextLabel}</span>
                  <button onClick={() => goTo((active + 1) % n)}>
                    {next.title} <b>{isLast ? "↻" : "←"}</b>
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* الحلقة */}
          <div className="ring-col">
            <div className="ring">
              <svg viewBox="0 0 100 100" className="ring-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="var(--primary)" />
                    <stop offset="0.55" stopColor="var(--primary-2)" />
                    <stop offset="1" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
                <circle className="ring-outer" cx={C} cy={C} r="48.2" />
                <circle className="ring-track" cx={C} cy={C} r={R} />
                <g transform="rotate(-90 50 50)">
                  <motion.circle
                    className="ring-progress"
                    cx={C}
                    cy={C}
                    r={R}
                    style={{ pathLength: draw }}
                  />
                </g>
              </svg>

              <motion.span className="ring-dot" style={{ left: dotLeft, top: dotTop }} />

              {steps.map((s, i) => {
                const a = (i / n) * 2 * Math.PI - Math.PI / 2;
                const left = C + R * Math.cos(a);
                const top = C + R * Math.sin(a);
                const state = i < active ? "done" : i === active ? "current" : "todo";
                return (
                  <button
                    key={s.title}
                    className={`node ${state} ${top > 50 ? "tip-up" : "tip-down"}`}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onClick={() => goTo(i)}
                    aria-label={`${cycle.stepLabel} ${i + 1}: ${s.title}`}
                  >
                    <span>{fmt(i + 1)}</span>
                    <em className="tip">{s.title}</em>
                  </button>
                );
              })}

              <div className="ring-center">
                <div className="ring-center-logo">
                  <Logo size={30} showText={false} animate={false} />
                </div>
                <small>{cycle.stepLabel}</small>
                <AnimatePresence mode="popLayout">
                  <motion.strong
                    key={active}
                    className="ring-num"
                    initial={{ opacity: 0, y: 24, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {fmt(active + 1)}
                  </motion.strong>
                </AnimatePresence>
                <small>
                  {cycle.of} {fmt(n)}
                </small>
              </div>
            </div>
          </div>
        </div>

        <motion.div className="scroll-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
          <span className="mouse">
            <i />
          </span>
          {cycle.hint}
        </motion.div>
      </div>
    </section>
  );
}
