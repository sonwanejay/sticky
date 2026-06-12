import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import type { WidgetConfigurationScreenProps } from "react-native-android-widget";
import {
  listAllNotes,
  setWidgetNoteId,
  type WidgetNoteData,
} from "@/lib/widget-data";
import { StickyNoteWidget } from "./StickyNoteWidget";
import { ALL_COLORS } from "@/lib/colors";
import { light, dark } from "@/lib/theme";

export function WidgetConfigScreen({
  widgetInfo,
  renderWidget,
  setResult,
}: WidgetConfigurationScreenProps) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  const [notes, setNotes] = useState<WidgetNoteData[]>([]);

  useEffect(() => {
    listAllNotes().then(setNotes);
  }, []);

  async function selectNote(note: WidgetNoteData) {
    await setWidgetNoteId(widgetInfo.widgetId, note.noteId);
    renderWidget(
      StickyNoteWidget({
        noteId: note.noteId,
        title: note.title,
        preview: note.preview,
        color: note.color,
      })
    );
    setResult("ok");
  }

  function getNoteBg(hex?: string): string {
    if (!hex) return colors.card.muted;
    const found = ALL_COLORS.find((c) => c.value === hex);
    return found ? found.value : hex;
  }

  function getNoteTextColor(hex?: string): string {
    if (!hex) return colors.ink.DEFAULT;
    const found = ALL_COLORS.find((c) => c.value === hex);
    return found ? found.textColor : colors.ink.DEFAULT;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.paper }]}>
      <View style={[styles.header, { borderBottomColor: colors.border.DEFAULT }]}>
        <Text style={[styles.title, { color: colors.ink.DEFAULT }]}>
          Choose a note
        </Text>
        <Pressable onPress={() => setResult("cancel")} hitSlop={12}>
          <View style={[styles.cancelBtn, { backgroundColor: colors.card.muted, borderColor: colors.border.DEFAULT }]}>
            <Text style={[styles.cancelText, { color: colors.ink.secondary }]}>
              Cancel
            </Text>
          </View>
        </Pressable>
      </View>

      {notes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.ink.secondary }]}>
            No notes yet. Create a note first, then add a widget.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.noteId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => selectNote(item)}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.noteRow,
                    {
                      backgroundColor: getNoteBg(item.color),
                      borderColor: colors.border.DEFAULT,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.noteTitle,
                      { color: getNoteTextColor(item.color) },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  {item.preview ? (
                    <Text
                      style={[
                        styles.notePreview,
                        {
                          color: getNoteTextColor(item.color),
                          opacity: 0.7,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {item.preview}
                    </Text>
                  ) : null}
                </View>
              )}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  noteRow: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  notePreview: {
    fontSize: 13,
    marginTop: 5,
    lineHeight: 18,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
