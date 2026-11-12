import type { Transition, Variants } from "framer-motion";

/**
 * KYVORA Motion System — Foundations (FASE 3 / FASE 5 Ready)
 * Principios: Preciso, modular, contenido y respetuoso de `prefers-reduced-motion`.
 */

export const KYVORA_EASE = {
  /** Curva arquitectónica principal: arranque decidido, asentamiento sin rebote. */
  standard: [0.22, 1, 0.36, 1] as const,
  /** Curva rápida para respuestas táctiles e interacciones de botones/tarjetas. */
  tactile: [0.16, 1, 0.3, 1] as const,
  /** Curva limpia de salida para menús, banners y overlays. */
  exit: [0.4, 0, 1, 1] as const,
};

export const KYVORA_DURATION = {
  fast: 0.16,
  base: 0.26,
  reveal: 0.48,
  hero: 0.56,
} as const;

export const KYVORA_VIEWPORT = {
  once: true,
  amount: 0.18,
} as const;

export const kyvoraBaseTransition: Transition = {
  duration: KYVORA_DURATION.reveal,
  ease: KYVORA_EASE.standard,
};

/**
 * 1. KYVORA Reveal — Aparición sobria y ordenada por bloques y tarjetas.
 */
export const kyvoraRevealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: KYVORA_DURATION.reveal,
      delay: customDelay,
      ease: KYVORA_EASE.standard,
    },
  }),
};

/**
 * 2. Stagger Container — Orquestación escalonada y predecible de grids modulares.
 */
export const kyvoraStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

/**
 * 3. Signal System — Estados de enfoque, indicadores y bordes activos.
 */
export const kyvoraSignalVariants: Variants = {
  rest: {
    borderColor: "rgba(175, 196, 232, 0.12)",
    boxShadow: "0 0 0 0 rgba(22, 119, 255, 0)",
  },
  active: {
    borderColor: "rgba(22, 119, 255, 0.52)",
    boxShadow: "0 0 28px -8px rgba(22, 119, 255, 0.35)",
    transition: {
      duration: KYVORA_DURATION.base,
      ease: KYVORA_EASE.tactile,
    },
  },
};

/**
 * 4. Kinetic Typography — Entrada contenida para titulares de secciones.
 */
export const kyvoraKineticHeadingVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: KYVORA_DURATION.hero,
      ease: KYVORA_EASE.standard,
    },
  },
};

/**
 * 5. Product Motion — Contenedores de producto y capturas de Kyvora Lab.
 */
export const kyvoraProductFrameVariants: Variants = {
  hidden: { opacity: 0, scale: 0.985, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: KYVORA_DURATION.reveal,
      ease: KYVORA_EASE.standard,
    },
  },
};

/**
 * Fallback neutro cuando el usuario activa reducción de movimiento o en renderizado estático.
 */
export const kyvoraReducedVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

/**
 * 6. Modular K Segment Construction — Desplazamiento direccional a 45° para el isotipo KYVORA.
 */
export const kyvoraKSegmentVariants: Variants = {
  hidden: (offset: { x?: number; y?: number } = {}) => ({
    opacity: 0,
    x: offset.x ?? 0,
    y: offset.y ?? 8,
  }),
  visible: (offset: { delay?: number } = {}) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: KYVORA_DURATION.hero,
      delay: offset.delay ?? 0,
      ease: KYVORA_EASE.standard,
    },
  }),
};

/**
 * 7. Signal Path — Trazado vectorial progresivo para conectores del Process y System Signal.
 */
export const kyvoraSignalPathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.72, ease: KYVORA_EASE.standard },
      opacity: { duration: 0.25, ease: KYVORA_EASE.standard },
    },
  },
};

/**
 * 8. Blueprint Line Expand — Líneas divisorias de 1px con escala GPU horizontal.
 */
export const kyvoraLineExpandVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0.3 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: KYVORA_DURATION.reveal,
      ease: KYVORA_EASE.standard,
    },
  },
};

/**
 * 9. Card Hover Lift — Respuesta táctil sobria mediante transform puro.
 */
export const kyvoraHoverCardVariants: Variants = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: {
      duration: KYVORA_DURATION.fast,
      ease: KYVORA_EASE.tactile,
    },
  },
};

