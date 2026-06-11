import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type NoteMeta } from "@/lib/storage";
import { getColorConfig } from "@/lib/colors";
import { useThemeColors } from "@/lib/useThemeColors";

type NoteCardProps = {
  note: NoteMeta;
  onPress: () => void;
  onLongPress?: () => void;
  compact?: boolean;
};

export default function NoteCard({
  note,
  onPress,
  onLongPress,
  compact,
}: NoteCardProps) {
  const colors = useThemeColors();
  const { bg, textColor, secondaryTextColor, pinColor } = getColorConfig(
    note.color,
    colors
  );

  const borderColor = note.color ? `${textColor}18` : colors.border.DEFAULT;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: bg,
            borderWidth: 1,
            borderColor,
            borderRadius: 12,
            padding: compact ? 14 : 16,
            marginBottom: 10,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {note.pinned && (
            <View style={{ position: "absolute", top: 12, right: 12 }}>
              <Ionicons
                name="pin"
                size={12}
                color={pinColor}
                style={{ opacity: 0.6 }}
              />
            </View>
          )}
          <Text
            style={{ color: textColor }}
            className={`${compact ? "text-[15px]" : "text-base"} font-semibold tracking-tight`}
            numberOfLines={compact ? 2 : 1}
          >
            {note.title}
          </Text>
          {note.preview ? (
            <Text
              style={{
                color: secondaryTextColor,
                opacity: note.color ? 0.7 : 0.85,
              }}
              className="text-[13px] mt-1.5 leading-[18px]"
              numberOfLines={compact ? 4 : 3}
            >
              {note.preview}
            </Text>
          ) : null}
          <Text
            style={{
              color: secondaryTextColor,
              opacity: note.color ? 0.5 : 0.6,
            }}
            className="text-[11px] mt-2 font-medium"
          >
            {formatRelativeTime(note.updatedAt)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
