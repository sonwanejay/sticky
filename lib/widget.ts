import { Platform } from "react-native";
import { requestWidgetUpdate } from "react-native-android-widget";
import { getWidgetNoteData } from "./widget-data";
import { StickyNoteWidget } from "@/widget/StickyNoteWidget";

export function updateWidget() {
  if (Platform.OS !== "android") return;

  requestWidgetUpdate({
    widgetName: "StickyNoteWidget",
    renderWidget: async (widgetInfo) => {
      const noteData = await getWidgetNoteData(widgetInfo.widgetId);

      if (!noteData) {
        return StickyNoteWidget({
          noteId: "",
          title: "Note deleted",
          preview: "Long-press to pick a new note",
        });
      }

      return StickyNoteWidget({
        noteId: noteData.noteId,
        title: noteData.title,
        preview: noteData.preview,
        color: noteData.color,
      });
    },
    widgetNotFound: () => {},
  }).catch(() => {});
}
