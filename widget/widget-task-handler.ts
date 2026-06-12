import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { getWidgetNoteData, removeWidget } from "@/lib/widget-data";
import { StickyNoteWidget } from "./StickyNoteWidget";

export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
): Promise<void> {
  const { widgetAction, widgetInfo, renderWidget } = props;

  if (widgetAction === "WIDGET_DELETED") {
    await removeWidget(widgetInfo.widgetId);
    return;
  }

  if (widgetAction === "WIDGET_CLICK") {
    return;
  }

  const noteData = await getWidgetNoteData(widgetInfo.widgetId);

  if (!noteData) {
    renderWidget(
      StickyNoteWidget({
        noteId: "",
        title: "Tap to configure",
        preview: "Long-press this widget to select a note",
      })
    );
    return;
  }

  renderWidget(
    StickyNoteWidget({
      noteId: noteData.noteId,
      title: noteData.title,
      preview: noteData.preview,
      color: noteData.color,
    })
  );
}
