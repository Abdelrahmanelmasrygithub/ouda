import { Fragment } from "react";
import { motion } from "framer-motion";
import { SplitWords, EASE } from "./AnimatedText.jsx";
import StepImages from "./StepImages.jsx";
import { cycle } from "../data/plan.js";
import { pad } from "../lib/format.js";

export default function StepCard({
  step,
  index,
  active,
  nextShort,
  isLast,
  innerRef,
  onNext,
  onOpenImage,
}) {
  const cls = ["step-card", active && "is-active", step.final && "is-final"]
    .filter(Boolean)
    .join(" ");

  return (
    <article ref={innerRef} className={cls} id={`step-${index + 1}`}>
      <header className="step-head">
        <span className="step-num" aria-hidden="true">
          {pad(index + 1)}
        </span>
        <div className="step-head-text">
          <div className="step-tags">
            <span className="step-chip">
              {cycle.stepLabel} {pad(index + 1)}
            </span>
            {step.tag && (
              <span className="step-tag" dir="ltr">
                {step.tag}
              </span>
            )}
            {step.final && <span className="step-final-badge">★ {cycle.finalBadge}</span>}
          </div>
          <SplitWords as="h3" className="step-title" text={step.title} stagger={0.05} inView />
        </div>
      </header>

      {step.final && <p className="final-note">{cycle.finalNote}</p>}

      {step.images?.length > 0 && <StepImages images={step.images} onOpen={onOpenImage} />}

      <ol className="points">
        {step.points.map((p, i) => (
          <motion.li
            key={p.head}
            className="point"
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <span className="point-idx">{i + 1}</span>
            <h4>{p.head}</h4>
            <p>{p.text}</p>
            {p.flow && (
              <div className="flow">
                {p.flow.map((f, k) => (
                  <Fragment key={f.value}>
                    {k > 0 && (
                      <span className="flow-arrow" aria-hidden="true">
                        ←
                      </span>
                    )}
                    <div className="flow-item">
                      <b>{f.value}</b>
                      <span>{f.label}</span>
                    </div>
                  </Fragment>
                ))}
                {p.flowNote && <small className="flow-note">{p.flowNote}</small>}
              </div>
            )}
          </motion.li>
        ))}
      </ol>

      {step.goal && (
        <motion.aside
          className="goal"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <b>◎ {cycle.goalLabel}</b>
          <p>{step.goal}</p>
        </motion.aside>
      )}

      {step.note && (
        <motion.aside
          className="note"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" />
            <path d="M12 11v5.5M12 7.5v.01" />
          </svg>
          <div>
            <b>{cycle.noteLabel}</b>
            <p>{step.note}</p>
          </div>
        </motion.aside>
      )}

      <footer className="step-foot">
        <span>{isLast ? cycle.loopLabel : cycle.nextLabel}</span>
        <button type="button" onClick={onNext}>
          {nextShort} <b>{isLast ? "↻" : "↓"}</b>
        </button>
      </footer>
    </article>
  );
}
