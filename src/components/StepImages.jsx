import { useState } from "react";
import { motion } from "framer-motion";
import { resolveImage } from "../lib/assets.js";
import { cycle } from "../data/plan.js";
import { EASE } from "./AnimatedText.jsx";

function Figure({ item, index, onOpen }) {
  const file = typeof item === "string" ? item : item.file;
  const caption = typeof item === "string" ? "" : item.caption || "";
  const src = resolveImage(file);
  const [portrait, setPortrait] = useState(false);

  return (
    <motion.figure
      className="fig"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.12 }}
    >
      {src ? (
        <button
          type="button"
          className={`fig-btn${portrait ? " portrait" : ""}`}
          onClick={() => onOpen({ src, caption })}
          aria-label={caption || "تكبير الصورة"}
        >
          <img
            src={src}
            alt={caption}
            loading="lazy"
            onLoad={(e) =>
              setPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth * 1.1)
            }
          />
          <span className="fig-zoom" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </span>
        </button>
      ) : (
        <div className="fig-empty">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="m21 16-5-5-8 8" />
          </svg>
          <b>{cycle.imagePlaceholder}</b>
          <code>src/assets/images/{file}</code>
        </div>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  );
}

export default function StepImages({ images, onOpen }) {
  const layout = images.length === 1 ? "one" : images.length === 2 ? "two" : "many";
  return (
    <div className={`figs ${layout}`}>
      {images.map((im, i) => (
        <Figure
          key={typeof im === "string" ? im : im.file}
          item={im}
          index={i}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
