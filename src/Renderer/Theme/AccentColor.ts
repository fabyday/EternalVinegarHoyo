export const ACCENT_COLORS = ["rose", "sky", "emerald", "violet", "amber"] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];

export interface AccentColorMeta {
  id: AccentColor;
  swatch: string;
}

export const ACCENT_COLOR_ITEMS: AccentColorMeta[] = [
  { id: "rose", swatch: "rgb(244 63 94)" },
  { id: "sky", swatch: "rgb(14 165 233)" },
  { id: "emerald", swatch: "rgb(16 185 129)" },
  { id: "violet", swatch: "rgb(139 92 246)" },
  { id: "amber", swatch: "rgb(245 158 11)" },
];

const STORAGE_KEY = "bdih.accentColor";
const FALLBACK_ACCENT_COLOR: AccentColor = "rose";

export function is_accent_color(value?: string | null): value is AccentColor {
  return ACCENT_COLORS.includes(value as AccentColor);
}

export function resolve_initial_accent_color(): AccentColor {
  if (typeof window === "undefined") {
    return FALLBACK_ACCENT_COLOR;
  }

  const savedAccentColor = window.localStorage.getItem(STORAGE_KEY);

  if (is_accent_color(savedAccentColor)) {
    return savedAccentColor;
  }

  return FALLBACK_ACCENT_COLOR;
}

export function apply_renderer_accent_color(accentColor: AccentColor) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.accentColor = accentColor;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, accentColor);
  }
}
