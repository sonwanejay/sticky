import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/lib/useThemeColors";

type ViewToggleProps = {
  mode: "list" | "grid";
  onToggle: () => void;
};

export default function ViewToggle({ mode, onToggle }: ViewToggleProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      hitSlop={8}
      className="w-9 h-9 items-center justify-center"
    >
      <Ionicons
        name={mode === "grid" ? "menu-outline" : "grid-outline"}
        size={24}
        color={colors.ink.secondary}
      />
    </Pressable>
  );
}
