import { useState } from "react";
import { Pressable, ScrollView, View, TextInput, Modal, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PASTEL_COLORS, BRIGHT_COLORS, EARTH_COLORS, DEEP_COLORS, ALL_COLORS } from "@/lib/colors";
import { useThemeColors } from "@/lib/useThemeColors";

type ColorPickerProps = {
  selectedColor?: string;
  onColorSelect: (color: string | undefined) => void;
};

const CUSTOM_PALETTE = [
  "#FF0000", "#FF4500", "#FF6347", "#FF8C00", "#FFD700",
  "#FFFF00", "#ADFF2F", "#00FF00", "#00CED1", "#00BFFF",
  "#1E90FF", "#0000FF", "#8A2BE2", "#FF00FF", "#FF1493",
  "#FFB6C1", "#FFFFFF", "#C0C0C0", "#808080", "#000000",
];

export default function ColorPicker({
  selectedColor,
  onColorSelect,
}: ColorPickerProps) {
  const colors = useThemeColors();
  const isNone = !selectedColor;
  const isCustom = selectedColor && !ALL_COLORS.find((c) => c.value === selectedColor);
  const [showCustom, setShowCustom] = useState(false);
  const [hexInput, setHexInput] = useState(selectedColor || "#");

  function select(color: string | undefined) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onColorSelect(color);
  }

  function openCustomPicker() {
    setHexInput(selectedColor || "#");
    setShowCustom(true);
  }

  function applyHex() {
    const hex = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      select(hex);
      setShowCustom(false);
    }
  }

  return (
    <>
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

        {BRIGHT_COLORS.map((color) => (
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

        <View style={{ backgroundColor: colors.border.DEFAULT }} className="w-px h-6 mx-1" />

        <Pressable onPress={openCustomPicker} className="items-center justify-center">
          {isCustom && (
            <View
              className="absolute w-11 h-11 rounded-full border-2"
              style={{ borderColor: colors.accent.DEFAULT }}
            />
          )}
          <View
            style={{
              backgroundColor: isCustom ? selectedColor : colors.card.muted,
              borderWidth: isCustom ? 0 : 1,
              borderColor: colors.border.DEFAULT,
            }}
            className="w-9 h-9 rounded-full items-center justify-center"
          >
            {isCustom ? (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            ) : (
              <Ionicons name="color-palette-outline" size={18} color={colors.ink.muted} />
            )}
          </View>
        </Pressable>
      </ScrollView>

      <Modal visible={showCustom} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
          onPress={() => setShowCustom(false)}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.card.DEFAULT,
              borderRadius: 16,
              padding: 20,
              width: 300,
            }}
          >
            <Text style={{ color: colors.ink.DEFAULT, fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
              Custom Color
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              {CUSTOM_PALETTE.map((hex) => (
                <Pressable
                  key={hex}
                  onPress={() => {
                    setHexInput(hex);
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: hex,
                    borderWidth: hexInput === hex ? 2 : 1,
                    borderColor: hexInput === hex ? colors.accent.DEFAULT : colors.border.DEFAULT,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {hexInput === hex && <Ionicons name="checkmark" size={16} color={hex === "#FFFFFF" || hex === "#FFFF00" || hex === "#FFD700" || hex === "#ADFF2F" ? "#000" : "#FFF"} />}
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(hexInput) ? hexInput : colors.card.muted,
                  borderWidth: 1,
                  borderColor: colors.border.DEFAULT,
                }}
              />
              <TextInput
                value={hexInput}
                onChangeText={(t) => {
                  const val = t.startsWith("#") ? t : `#${t}`;
                  if (val.length <= 7) setHexInput(val.toUpperCase());
                }}
                placeholder="#FF5733"
                placeholderTextColor={colors.ink.muted}
                autoCapitalize="characters"
                maxLength={7}
                style={{
                  flex: 1,
                  backgroundColor: colors.card.muted,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.ink.DEFAULT,
                  fontSize: 15,
                  fontFamily: "monospace",
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setShowCustom(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: colors.card.muted,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.ink.DEFAULT, fontWeight: "500" }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={applyHex}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: "#F59E0B",
                  alignItems: "center",
                  opacity: /^#[0-9A-Fa-f]{6}$/.test(hexInput) ? 1 : 0.4,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Apply</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
