import { useId, useState } from "react";
import { motion } from "framer-motion";
import { company } from "../data/plan.js";
import { EASE } from "./AnimatedText.jsx";
import { logoUrl } from "../lib/assets.js";

/* لوجو مؤقت (بيظهر بس لو ملف اللوجو الحقيقي مش موجود) */
function FallbackMark({ size, animate }) {
  const gid = "lg" + useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={company.name}
      className="logo-mark"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="0.55" stopColor="var(--primary-2)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <g transform="rotate(-70 32 32)">
        <motion.circle
          cx="32"
          cy="32"
          r="24"
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="6"
          strokeLinecap="round"
          initial={animate ? { pathLength: 0 } : { pathLength: 0.82 }}
          animate={{ pathLength: 0.82 }}
          transition={{ duration: 1.3, ease: EASE }}
        />
      </g>
      <motion.path
        d="M32 21 L34.6 29.4 L43 32 L34.6 34.6 L32 43 L29.4 34.6 L21 32 L29.4 29.4 Z"
        fill="var(--accent)"
        style={{ transformOrigin: "32px 32px", transformBox: "fill-box" }}
        initial={animate ? { scale: 0, rotate: -90 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: animate ? 0.9 : 0, type: "spring", stiffness: 180, damping: 12 }}
      />
    </svg>
  );
}

export default function Logo({ size = 44, showText = true, animate = true }) {
  const [failed, setFailed] = useState(false);
  const withText = showText && (failed || company.showNameWithLogo);

  return (
    <div className="logo">
      {failed ? (
        <FallbackMark size={size} animate={animate} />
      ) : (
        <motion.img
          className="logo-img"
          src={logoUrl || company.logoSrc}
          alt={company.name}
          style={{ height: size }}
          onError={() => setFailed(true)}
          initial={animate ? { scale: 0.6, opacity: 0, rotate: -8 } : false}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 13 }}
        />
      )}
      {withText && (
        <motion.span
          className="logo-text"
          style={{ fontSize: size * 0.62 }}
          initial={animate ? { opacity: 0, x: 14 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: animate ? 0.6 : 0, duration: 0.7, ease: EASE }}
        >
          {company.name}
        </motion.span>
      )}
    </div>
  );
}
