import { light } from "./theme";

export type ColorOption = {
  name: string;
  value: string;
  textColor: string;
};

export const PASTEL_COLORS: ColorOption[] = [
  { name: "Cream", value: "#FFF8E1", textColor: "#4E3B00" },
  { name: "Rose", value: "#FCE4EC", textColor: "#4A0E1C" },
  { name: "Sky", value: "#E3F2FD", textColor: "#0D2744" },
  { name: "Mint", value: "#E8F5E9", textColor: "#1B3A1D" },
  { name: "Lavender", value: "#F3E5F5", textColor: "#3A1047" },
  { name: "Peach", value: "#FFF3E0", textColor: "#4E2A00" },
];

export const BOLD_COLORS: ColorOption[] = [
  { name: "Coral", value: "#EF5350", textColor: "#FFFFFF" },
  { name: "Ocean", value: "#42A5F5", textColor: "#FFFFFF" },
  { name: "Sage", value: "#66BB6A", textColor: "#FFFFFF" },
  { name: "Amber", value: "#FFA726", textColor: "#FFFFFF" },
  { name: "Plum", value: "#AB47BC", textColor: "#FFFFFF" },
  { name: "Teal", value: "#26A69A", textColor: "#FFFFFF" },
];

export const ALL_COLORS = [...PASTEL_COLORS, ...BOLD_COLORS];

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
  return {
    bg: hex,
    textColor: colors.ink.DEFAULT,
    secondaryTextColor: colors.ink.secondary,
    pinColor: colors.ink.muted,
  };
}
