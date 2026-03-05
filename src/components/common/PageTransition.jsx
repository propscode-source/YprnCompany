import { motion } from "motion/react";
import { pageTransition } from "../../utils/animations";

/**
 * Wrapper component untuk page transition animation.
 * Membungkus setiap halaman agar transisi antar route smooth.
 */
const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
