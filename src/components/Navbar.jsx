import { motion, useScroll, useSpring } from "framer-motion";
import Logo from "./Logo.jsx";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.header
      className="nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <a href="#top" className="nav-logo" aria-label="الرئيسية">
        <Logo size={34} animate={false} />
      </a>

      <nav className="nav-links">
        <a href="#top">الرئيسية</a>
        <a href="#plan">الخطة</a>
        <a href="#end">الختام</a>
      </nav>

      <motion.span className="nav-progress" style={{ scaleX }} />
    </motion.header>
  );
}
