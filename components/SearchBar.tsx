import { TextInput, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/lib/useThemeColors";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search notes...",
}: SearchBarProps) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card.muted,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
      }}
      className="flex-row items-center rounded-xl px-4 py-3 mx-4 mt-2 mb-4"
    >
      <Ionicons name="search-outline" size={18} color={colors.ink.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.ink.muted}
        style={{ color: colors.ink.DEFAULT }}
        className="flex-1 ml-2.5 text-sm"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.ink.muted} />
        </Pressable>
      )}
    </View>
  );
}
