import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./AnimatedText.jsx";

/** عرض الصورة مكبّرة (اضغط في أي مكان أو Esc للإغلاق) */
export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.img
            src={item.src}
            alt={item.caption || ""}
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          />
          {item.caption && <p onClick={(e) => e.stopPropagation()}>{item.caption}</p>}
          <button className="lightbox-close" onClick={onClose} aria-label="إغلاق">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
