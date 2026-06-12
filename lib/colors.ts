import { light } from "./theme";

export type ColorOption = {
  name: string;
  value: string;
  textColor: string;
};

export const PASTEL_COLORS: ColorOption[] = [
  { name: "Parchment", value: "#F5ECD7", textColor: "#5C4425" },
  { name: "Blush", value: "#F0D5CF", textColor: "#6B3530" },
  { name: "Sage", value: "#D8E4CF", textColor: "#304228" },
  { name: "Fog", value: "#D5DBE5", textColor: "#2C3A48" },
  { name: "Mauve", value: "#DDD2E0", textColor: "#3E2D4A" },
  { name: "Sand", value: "#EAD9C0", textColor: "#5A3F1B" },
];

export const BOLD_COLORS: ColorOption[] = [
  { name: "Terracotta", value: "#C2784E", textColor: "#FFFFFF" },
  { name: "Olive", value: "#6B7F4A", textColor: "#FFFFFF" },
  { name: "Rust", value: "#A85A42", textColor: "#FFFFFF" },
  { name: "Dusk", value: "#7A6E63", textColor: "#FFFFFF" },
  { name: "Forest", value: "#4D7C62", textColor: "#FFFFFF" },
  { name: "Wine", value: "#8E5060", textColor: "#FFFFFF" },
];

export const ALL_COLORS = [...PASTEL_COLORS, ...BOLD_COLORS];

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

type ThemeColors = typeof light;

export function getColorConfig(
  hex: string | undefined,
  colors: ThemeColors = light
): {
  bg: string;
  textColor: string;
  secondaryTextColor: string;
  pinColor: string;
} {
  if (!hex)
    return {
      bg: colors.card.muted,
      textColor: colors.ink.DEFAULT,
      secondaryTextColor: colors.ink.secondary,
      pinColor: colors.ink.muted,
    };
  const found = ALL_COLORS.find((c) => c.value === hex);
  if (found)
    return {
      bg: found.value,
      textColor: found.textColor,
      secondaryTextColor: found.textColor,
      pinColor: found.textColor,
    };
  const isLight = isLightColor(hex);
  return {
    bg: hex,
    textColor: isLight ? colors.ink.DEFAULT : "#FFFFFF",
    secondaryTextColor: isLight ? colors.ink.secondary : "#FFFFFFCC",
    pinColor: isLight ? colors.ink.muted : "#FFFFFF99",
  };
}
