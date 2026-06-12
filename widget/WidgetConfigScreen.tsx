import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
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

  function getNoteSecondaryColor(hex?: string): string {
    if (!hex) return colors.ink.secondary;
    const found = ALL_COLORS.find((c) => c.value === hex);
    return found ? found.textColor : colors.ink.secondary;
  }

  const left: WidgetNoteData[] = [];
  const right: WidgetNoteData[] = [];
  notes.forEach((item, i) => {
    if (i % 2 === 0) left.push(item);
    else right.push(item);
  });

  function renderCard(item: WidgetNoteData) {
    return (
      <Pressable key={item.noteId} onPress={() => selectNote(item)}>
        {({ pressed }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: getNoteBg(item.color),
                borderColor: item.color
                  ? `${getNoteTextColor(item.color)}18`
                  : colors.border.DEFAULT,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text
              style={[styles.cardTitle, { color: getNoteTextColor(item.color) }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {item.preview ? (
              <Text
                style={[
                  styles.cardPreview,
                  {
                    color: getNoteSecondaryColor(item.color),
                    opacity: item.color ? 0.7 : 0.85,
                  },
                ]}
                numberOfLines={6}
              >
                {item.preview}
              </Text>
            ) : null}
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.paper }]}>
      <View style={[styles.header, { borderBottomColor: colors.border.DEFAULT }]}>
        <Text style={[styles.title, { color: colors.ink.DEFAULT }]}>
          Choose a note
        </Text>
        <Pressable onPress={() => setResult("cancel")} hitSlop={12}>
          {({ pressed }) => (
            <View
              style={[
                styles.cancelBtn,
                {
                  backgroundColor: colors.card.muted,
                  borderColor: colors.border.DEFAULT,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.ink.secondary }]}>
                Cancel
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {notes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.ink.secondary }]}>
            No notes yet. Create a note first, then add a widget.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.columns}>
            <View style={styles.column}>
              {left.map(renderCard)}
            </View>
            <View style={styles.column}>
              {right.map(renderCard)}
            </View>
          </View>
        </ScrollView>
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
  grid: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  columns: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  column: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  cardPreview: {
    fontSize: 13,
    marginTop: 6,
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
