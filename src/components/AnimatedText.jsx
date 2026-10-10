import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

/**
 * يظهر النص كلمة كلمة بحركة "كشف" من تحت.
 * بنقسم على مستوى الكلمات (مش الحروف) عشان الحروف العربية متتفكش.
 * (inView: يبدأ الأنيميشن لما العنوان يظهر في الشاشة)
 */
export function SplitWords({
  text,
  as: Tag = "span",
  className = "",
  wordClass = "",
  delay = 0,
  stagger = 0.07,
  inView = false,
}) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  const show = inView ? seen : true;
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="split-mask" aria-hidden="true">
            <motion.span
              className={`split-word ${wordClass}`}
              initial="hidden"
              animate={show ? "show" : "hidden"}
              variants={{
                hidden: { y: "120%", rotate: 3, opacity: 0 },
                show: { y: "0%", rotate: 0, opacity: 1 },
              }}
              transition={{ duration: 0.85, ease: EASE, delay: delay + i * stagger }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** ظهور ناعم من تحت لفوق */
export function FadeUp({
  children,
  delay = 0,
  y = 26,
  className = "",
  inView = false,
  as = "div",
}) {
  const M = motion[as];
  const trigger = inView
    ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.4 } }
    : { animate: { opacity: 1, y: 0 } };

  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...trigger}
    >
      {children}
    </M>
  );
}
