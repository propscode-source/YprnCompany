/**
 * Reusable Framer Motion variants & helpers
 * Digunakan di seluruh halaman untuk konsistensi animasi
 */

// ─── Viewport config default (scroll-triggered) ─────────────────────────
export const defaultViewport = { once: true, margin: "-80px" };

// ─── Fade In Up ──────────────────────────────────────────────────────────
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Fade In Down ────────────────────────────────────────────────────────
export const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Fade In Left ────────────────────────────────────────────────────────
export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 }, // Sebelumnya -60, ubah ke -20 agar tidak terlalu keluar layar
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Fade In Right ───────────────────────────────────────────────────────
export const fadeInRight = {
  hidden: { opacity: 0, x: 20 }, // Sebelumnya 60, ubah ke 20
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}; 

// ─── Scale In (zoom pop) ─────────────────────────────────────────────────
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Stagger Container ──────────────────────────────────────────────────
export const staggerContainer = {
  hidden: { opacity: 1 },
  visible: (staggerDelay = 0.15) => ({
    opacity: 1,
    transition: { staggerChildren: staggerDelay },
  }),
};

// ─── Child item untuk stagger ────────────────────────────────────────────
export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Page transition variant ─────────────────────────────────────────────
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Modal / Overlay variants ────────────────────────────────────────────
export const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ─── Mobile menu slide ───────────────────────────────────────────────────
export const mobileMenuVariant = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Dropdown variant ────────────────────────────────────────────────────
export const dropdownVariant = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};
