import { Fragment, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Logo from "./Logo.jsx";
import StepCard from "./StepCard.jsx";
import Lightbox from "./Lightbox.jsx";
import { EASE } from "./AnimatedText.jsx";
import { steps, cycle } from "../data/plan.js";
import { pad } from "../lib/format.js";

const C = 50; // مركز الحلقة (٪)
const R = 40; // نصف القطر (٪)
const NAV_H = 68;

export default function CycleSection() {
  const n = steps.length;
  const cardRefs = useRef([]);
  const ringColRef = useRef(null);

  const target = useMotionValue(0);
  const draw = useSpring(target, { stiffness: 140, damping: 32, mass: 0.5 });

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  /* الحلقة بتتحرك حسب مكان القراءة: خط وهمي في 45% من الشاشة،
     والخطوة اللي الخط ده جواها هي النشطة، وتقدّمها جواها بيرسم جزء الحلقة */
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const probe = window.innerHeight * 0.45;
      let idx = n - 1;
      let t = 1;
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (probe < r.bottom) {
          idx = i;
          t = Math.min(1, Math.max(0, (probe - r.top) / r.height));
          break;
        }
      }
      target.set((idx + t) / n);
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, target]);

  // النقطة المضيئة اللي بتمشي على الحلقة
  const dotLeft = useTransform(draw, (v) => `${C + R * Math.cos(v * 2 * Math.PI - Math.PI / 2)}%`);
  const dotTop = useTransform(draw, (v) => `${C + R * Math.sin(v * 2 * Math.PI - Math.PI / 2)}%`);

  const goTo = (i) => {
    const el = cardRefs.current[((i % n) + n) % n];
    if (!el) return;
    const mobile = window.innerWidth <= 900;
    const offset = mobile ? NAV_H + (ringColRef.current?.offsetHeight || 120) + 14 : NAV_H + 24;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  };

  return (
    <section id="plan" className="cycle">
      <div className="cycle-head">
        <span className="eyebrow">{cycle.eyebrow}</span>
        <h2>{cycle.title}</h2>
      </div>

      <div className="cycle-body">
        {/* الخطوات */}
        <div className="steps-col">
          {steps.map((s, i) => (
            <Fragment key={s.title}>
              <StepCard
                step={s}
                index={i}
                active={i === active}
                isLast={i === n - 1}
                nextShort={steps[(i + 1) % n].short || steps[(i + 1) % n].title}
                innerRef={(el) => (cardRefs.current[i] = el)}
                onNext={() => goTo(i + 1)}
                onOpenImage={setLightbox}
              />
              {i < n - 1 && (
                <div className="between" aria-hidden="true">
                  <span>↓</span>
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* الحلقة (ثابتة جنب الصفحة) */}
        <aside className="ring-col" ref={ringColRef}>
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
                  type="button"
                  className={`node ${state} ${top > 50 ? "tip-up" : "tip-down"}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onClick={() => goTo(i)}
                  aria-label={`${cycle.stepLabel} ${i + 1}: ${s.title}`}
                >
                  <span>{pad(i + 1)}</span>
                  <em className="tip">{s.short || s.title}</em>
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
                  {pad(active + 1)}
                </motion.strong>
              </AnimatePresence>
              <small>
                {cycle.of} {pad(n)}
              </small>
            </div>
          </div>

          <div className="ring-caption">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <small>
                  {cycle.stepLabel} {pad(active + 1)}
                </small>
                <strong>{steps[active].short || steps[active].title}</strong>
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
