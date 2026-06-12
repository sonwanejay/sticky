import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PASTEL_COLORS, EARTH_COLORS, DEEP_COLORS } from "@/lib/colors";
import { useThemeColors } from "@/lib/useThemeColors";

type ColorPickerProps = {
  selectedColor?: string;
  onColorSelect: (color: string | undefined) => void;
};

export default function ColorPicker({
  selectedColor,
  onColorSelect,
}: ColorPickerProps) {
  const colors = useThemeColors();
  const isNone = !selectedColor;

  function select(color: string | undefined) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onColorSelect(color);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 12,
        alignItems: "center",
      }}
      className="py-4"
    >
      <Pressable
        onPress={() => select(undefined)}
        className="items-center justify-center"
      >
        <View
          style={{
            backgroundColor: colors.card.DEFAULT,
            borderWidth: isNone ? 2 : 1,
            borderColor: isNone ? colors.accent.DEFAULT : colors.border.DEFAULT,
          }}
          className="w-9 h-9 rounded-full items-center justify-center"
        >
          {isNone && <Ionicons name="checkmark" size={16} color={colors.accent.DEFAULT} />}
        </View>
      </Pressable>

      {PASTEL_COLORS.map((color) => (
        <Swatch
          key={color.value}
          hex={color.value}
          textColor={color.textColor}
          isSelected={selectedColor === color.value}
          accentColor={colors.accent.DEFAULT}
          onPress={() => select(color.value)}
        />
      ))}

      <View style={{ backgroundColor: colors.border.DEFAULT }} className="w-px h-6 mx-1" />

      {EARTH_COLORS.map((color) => (
        <Swatch
          key={color.value}
          hex={color.value}
          textColor={color.textColor}
          isSelected={selectedColor === color.value}
          accentColor={colors.accent.DEFAULT}
          onPress={() => select(color.value)}
        />
      ))}

      <View style={{ backgroundColor: colors.border.DEFAULT }} className="w-px h-6 mx-1" />

      {DEEP_COLORS.map((color) => (
        <Swatch
          key={color.value}
          hex={color.value}
          textColor={color.textColor}
          isSelected={selectedColor === color.value}
          accentColor={colors.accent.DEFAULT}
          onPress={() => select(color.value)}
        />
      ))}
    </ScrollView>
  );
}

function Swatch({
  hex,
  textColor,
  isSelected,
  accentColor,
  onPress,
}: {
  hex: string;
  textColor: string;
  isSelected: boolean;
  accentColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center justify-center">
      {isSelected && (
        <View
          className="absolute w-11 h-11 rounded-full border-2"
          style={{ borderColor: accentColor }}
        />
      )}
      <View
        style={{ backgroundColor: hex }}
        className="w-9 h-9 rounded-full items-center justify-center"
      >
        {isSelected && (
          <Ionicons name="checkmark" size={16} color={textColor} />
        )}
      </View>
    </Pressable>
  );
}
