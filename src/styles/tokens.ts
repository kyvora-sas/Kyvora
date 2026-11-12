/**
 * KYVORA Design System — Authoritative Tokens (FASE 3)
 * Sincronizado con docs/BRAND_BOOK.md
 */

export const kyvoraColors = {
  obsidian: "#080B12",
  obsidianElevated: "#0D121D",
  obsidianSurface: "#141B2B",
  obsidianHover: "#182135",
  obsidianGlass: "rgba(13, 18, 29, 0.82)",

  electricBlue: "#1677FF",
  electricBlueBright: "#2B85FF",
  electricBlueHover: "#3B8EFF",
  electricBlueSubtle: "rgba(22, 119, 255, 0.14)",
  electricBlueGlow: "rgba(22, 119, 255, 0.28)",

  pureWhite: "#FFFFFF",
  iceBlue: "#AFC4E8",
  signalBlue: "#5CA8FF",
  slateMuted: "#8F9BB3",
  slateDim: "#68768F",

  blueGray: "#252D3A",
  borderSubtle: "rgba(175, 196, 232, 0.12)",
  borderStrong: "rgba(175, 196, 232, 0.24)",
  borderSignal: "rgba(22, 119, 255, 0.45)",

  semantic: {
    success: "#10B981",
    successBg: "rgba(16, 185, 129, 0.12)",
    successBorder: "rgba(16, 185, 129, 0.3)",
    warning: "#F59E0B",
    warningBg: "rgba(245, 158, 11, 0.12)",
    warningBorder: "rgba(245, 158, 11, 0.3)",
    danger: "#EF4444",
    dangerBg: "rgba(239, 68, 68, 0.12)",
    dangerBorder: "rgba(239, 68, 68, 0.3)",
    info: "#38BDF8",
    infoBg: "rgba(56, 189, 248, 0.12)",
    infoBorder: "rgba(56, 189, 248, 0.3)",
  },
} as const;

export const kyvoraTypography = {
  fonts: {
    display: "var(--font-space-grotesk), system-ui, -apple-system, sans-serif",
    body: "var(--font-inter), system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  scale: {
    display: { size: "clamp(2.5rem, 5vw, 4.25rem)", lineHeight: "1.06", tracking: "-0.03em" },
    h1: { size: "clamp(2rem, 3.6vw, 3rem)", lineHeight: "1.12", tracking: "-0.025em" },
    h2: { size: "clamp(1.625rem, 2.5vw, 2.25rem)", lineHeight: "1.18", tracking: "-0.02em" },
    h3: { size: "clamp(1.25rem, 1.5vw, 1.5rem)", lineHeight: "1.28", tracking: "-0.015em" },
    h4: { size: "1.125rem", lineHeight: "1.35", tracking: "-0.01em" },
    lead: { size: "1.125rem", lineHeight: "1.65", tracking: "0em" },
    body: { size: "1rem", lineHeight: "1.68", tracking: "0em" },
    bodySm: { size: "0.875rem", lineHeight: "1.6", tracking: "0em" },
    caption: { size: "0.75rem", lineHeight: "1.45", tracking: "0.01em" },
    overline: { size: "0.75rem", lineHeight: "1.3", tracking: "0.14em" },
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const kyvoraSpacing = {
  containerMaxWidth: "1280px",
  readingMaxWidth: "78ch",
  containerPaddingMobile: "1.25rem",
  containerPaddingDesktop: "2rem",
  sectionYMobile: "4.5rem",
  sectionYDesktop: "6.5rem",
  gutterMobile: "1rem",
  gutterDesktop: "1.5rem",
} as const;

export const kyvoraGrid = {
  columnsDesktop: 12,
  columnsTablet: 8,
  columnsMobile: 4,
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
} as const;

export const kyvoraRadii = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
} as const;

export const kyvoraShadows = {
  surface: "0 1px 0 rgba(175, 196, 232, 0.08), 0 12px 32px -16px rgba(0, 0, 0, 0.65)",
  elevated: "0 16px 44px -16px rgba(0, 0, 0, 0.78), 0 0 0 1px rgba(175, 196, 232, 0.14)",
  signal: "0 0 28px -6px rgba(22, 119, 255, 0.36)",
  focusRing: "0 0 0 2px #080B12, 0 0 0 4px #2B85FF",
} as const;

export const kyvoraZIndex = {
  base: 0,
  surface: 10,
  sticky: 30,
  header: 40,
  drawer: 50,
  modal: 60,
  toast: 70,
} as const;

export const kyvoraTransitions = {
  duration: {
    instant: "100ms",
    fast: "150ms",
    base: "220ms",
    slow: "360ms",
    reveal: "520ms",
  },
  easing: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    decelerate: "cubic-bezier(0.16, 1, 0.3, 1)",
    linear: "linear",
  },
} as const;

export const kyvoraTokens = {
  colors: kyvoraColors,
  typography: kyvoraTypography,
  spacing: kyvoraSpacing,
  grid: kyvoraGrid,
  radii: kyvoraRadii,
  shadows: kyvoraShadows,
  zIndex: kyvoraZIndex,
  transitions: kyvoraTransitions,
} as const;

export type KyvoraTokens = typeof kyvoraTokens;

