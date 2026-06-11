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
      style={{
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.card.muted,
      }}
      className="w-9 h-9 rounded-lg items-center justify-center"
    >
      <Ionicons
        name={mode === "grid" ? "list-outline" : "grid-outline"}
        size={18}
        color={colors.ink.secondary}
      />
    </Pressable>
  );
}
