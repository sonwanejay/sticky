import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";
import { ALL_COLORS } from "@/lib/colors";
import { light, dark } from "@/lib/theme";

interface StickyNoteWidgetProps {
  noteId: string;
  title: string;
  preview?: string;
  color?: string;
}

function resolveColors(hex: string | undefined, isDark: boolean) {
  const themeColors = isDark ? dark : light;

  if (!hex) {
    return {
      bg: themeColors.card.muted as `#${string}`,
      text: themeColors.ink.DEFAULT as `#${string}`,
      secondary: themeColors.ink.secondary as `#${string}`,
      muted: themeColors.ink.muted as `#${string}`,
    };
  }

  const found = ALL_COLORS.find((c) => c.value === hex);
  if (found) {
    return {
      bg: found.value as `#${string}`,
      text: found.textColor as `#${string}`,
      secondary: `${found.textColor}B3` as `#${string}`,
      muted: `${found.textColor}80` as `#${string}`,
    };
  }

  return {
    bg: hex as `#${string}`,
    text: themeColors.ink.DEFAULT as `#${string}`,
    secondary: themeColors.ink.secondary as `#${string}`,
    muted: themeColors.ink.muted as `#${string}`,
  };
}

// Not a React component — called as a plain function to avoid
// React Compiler injecting hooks (crashes in headless tasks)
function buildNoteWidget(
  noteId: string,
  title: string,
  preview: string | undefined,
  color: string | undefined,
  isDark: boolean
) {
  const colors = resolveColors(color, isDark);
  const hasNote = noteId !== "";

  return (
    <FlexWidget
      style={{
        height: "wrap_content",
        width: "match_parent",
        backgroundColor: colors.bg,
        borderRadius: 16,
        padding: 16,
        flexDirection: "column",
      }}
      clickAction={hasNote ? "OPEN_URI" : "OPEN_APP"}
      clickActionData={hasNote ? { uri: `sticky://note/${noteId}` } : {}}
    >
      <TextWidget
        text={title}
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: colors.text,
        }}
        maxLines={2}
        truncate="END"
      />
      {preview ? (
        <TextWidget
          text={preview}
          style={{
            fontSize: 13,
            color: colors.secondary,
            marginTop: 6,
          }}
          maxLines={5}
          truncate="END"
        />
      ) : null}
    </FlexWidget>
  );
}

export function StickyNoteWidget(
  props: StickyNoteWidgetProps
): { light: React.JSX.Element; dark: React.JSX.Element } {
  return {
    light: buildNoteWidget(props.noteId, props.title, props.preview, props.color, false),
    dark: buildNoteWidget(props.noteId, props.title, props.preview, props.color, true),
  };
}
