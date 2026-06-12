import { light } from "./theme";

export type ColorOption = {
  name: string;
  value: string;
  textColor: string;
};

export const PASTEL_COLORS: ColorOption[] = [
  { name: "Parchment", value: "#F5ECD7", textColor: "#5C4425" },
  { name: "Butter", value: "#FDF6B2", textColor: "#5C4A1B" },
  { name: "Peach", value: "#FDDCB5", textColor: "#6B3A1F" },
  { name: "Blush", value: "#F0D5CF", textColor: "#6B3530" },
  { name: "Lavender", value: "#DDD2EE", textColor: "#3E2A5C" },
  { name: "Fog", value: "#D5DBE5", textColor: "#2C3A48" },
  { name: "Mint", value: "#C9E8D8", textColor: "#1E4D35" },
  { name: "Sage", value: "#D8E4CF", textColor: "#304228" },
];

export const EARTH_COLORS: ColorOption[] = [
  { name: "Sand", value: "#C4A67A", textColor: "#FFFFFF" },
  { name: "Terracotta", value: "#C2784E", textColor: "#FFFFFF" },
  { name: "Rust", value: "#A85A42", textColor: "#FFFFFF" },
  { name: "Olive", value: "#6B7F4A", textColor: "#FFFFFF" },
  { name: "Forest", value: "#4D7C62", textColor: "#FFFFFF" },
  { name: "Dusk", value: "#7A6E63", textColor: "#FFFFFF" },
];

export const DEEP_COLORS: ColorOption[] = [
  { name: "Dusty Rose", value: "#B56576", textColor: "#FFFFFF" },
  { name: "Wine", value: "#8E5060", textColor: "#FFFFFF" },
  { name: "Plum", value: "#6D4B73", textColor: "#FFFFFF" },
  { name: "Teal", value: "#3D7D7C", textColor: "#FFFFFF" },
  { name: "Slate", value: "#526878", textColor: "#FFFFFF" },
  { name: "Charcoal", value: "#4A4543", textColor: "#FFFFFF" },
];

export const ALL_COLORS = [...PASTEL_COLORS, ...EARTH_COLORS, ...DEEP_COLORS];

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
