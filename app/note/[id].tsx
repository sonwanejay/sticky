import { useEffect, useRef, useState } from "react";
import {
  TextInput,
  View,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { readNote, saveNote, getNoteMeta, deleteNote, updateNoteMeta } from "@/lib/storage";
import { getColorConfig } from "@/lib/colors";
import { useThemeColors } from "@/lib/useThemeColors";
import ColorPicker from "@/components/ColorPicker";
import { Ionicons } from "@expo/vector-icons";

export default function NoteEditor() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<string | undefined>(undefined);
  const [pinned, setPinned] = useState(false);
  const loaded = useRef(false);
  const titleRef = useRef<TextInput>(null);
  const latestTitle = useRef("");
  const latestContent = useRef("");

  latestTitle.current = title;
  latestContent.current = content;

  useEffect(() => {
    readNote(id).then((text) => {
      if (text) {
        const lines = text.split("\n");
        const firstLine = lines[0]?.replace(/^#\s*/, "") ?? "";
        const rest = lines.slice(1).join("\n").trimStart();
        setTitle(firstLine);
        setContent(rest);
      } else {
        setTimeout(() => titleRef.current?.focus(), 100);
      }
      loaded.current = true;
    });
    getNoteMeta(id).then((meta) => {
      if (meta) {
        setColor(meta.color);
        setPinned(meta.pinned ?? false);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!loaded.current) return;
    const timeout = setTimeout(() => {
      if (!title.trim() && !content.trim()) return;
      const fullContent = `# ${title}\n\n${content}`;
      saveNote(id, title || "Untitled", fullContent, { color, pinned });
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, content, id, color, pinned]);

  useEffect(() => {
    return () => {
      if (!latestTitle.current.trim() && !latestContent.current.trim()) {
        deleteNote(id).catch(() => {});
      }
    };
  }, [id]);

  const { bg: colorBg, textColor, pinColor } = getColorConfig(color, colors);
  const bg = color ? colorBg : colors.card.DEFAULT;
  const editorTextColor = color ? textColor : colors.ink.DEFAULT;
  const placeholderColor = color ? `${textColor}66` : colors.ink.muted;
  const editorPinColor = color ? pinColor : colors.ink.muted;

  function handleDelete() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Delete note", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteNote(id);
          router.back();
        },
      },
    ]);
  }

  function togglePin() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPinned = !pinned;
    setPinned(newPinned);
    updateNoteMeta(id, { pinned: newPinned });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerStyle: { backgroundColor: bg },
          headerTintColor: editorTextColor,
          headerRight: () => (
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={togglePin}
                hitSlop={8}
                className="w-9 h-9 rounded-lg items-center justify-center"
                style={{
                  backgroundColor: pinned ? colors.accent.soft : "transparent",
                }}
              >
                <Ionicons
                  name={pinned ? "pin" : "pin-outline"}
                  size={20}
                  color={pinned ? colors.accent.DEFAULT : editorPinColor}
                />
              </Pressable>
              <Pressable
                onPress={handleDelete}
                hitSlop={8}
                className="w-9 h-9 rounded-lg items-center justify-center"
              >
                <Ionicons name="trash-outline" size={20} color={editorPinColor} />
              </Pressable>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-2" style={{ backgroundColor: bg }}>
          <TextInput
            ref={titleRef}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={placeholderColor}
            style={{ color: editorTextColor }}
            className="text-[26px] font-bold mb-4 tracking-tight"
            returnKeyType="next"
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Start writing..."
            placeholderTextColor={placeholderColor}
            multiline
            textAlignVertical="top"
            style={{ color: editorTextColor, paddingBottom: 40 }}
            className="flex-1 text-[16px] leading-7"
          />
        </View>
        <View
          style={{ backgroundColor: bg, borderTopWidth: 1, borderTopColor: colors.border.DEFAULT }}
        >
          <ColorPicker selectedColor={color} onColorSelect={setColor} />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
