import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

/**
 * يظهر النص كلمة كلمة بحركة "كشف" من تحت.
 * بنقسم على مستوى الكلمات (مش الحروف) عشان الحروف العربية متتفكش.
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
  const words = text.split(" ");
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, amount: 0.6 } }
    : { animate: "show" };

  return (
    <Tag className={`split ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span className="split-mask" key={`${w}-${i}`} aria-hidden="true">
          <motion.span
            className={`split-word ${wordClass}`}
            initial="hidden"
            variants={{
              hidden: { y: "120%", rotate: 3, opacity: 0 },
              show: { y: "0%", rotate: 0, opacity: 1 },
            }}
            transition={{ duration: 0.85, ease: EASE, delay: delay + i * stagger }}
            {...trigger}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
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
