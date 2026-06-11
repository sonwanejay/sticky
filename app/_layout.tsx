import { Stack } from "expo-router";
import { useThemeColors } from "@/lib/useThemeColors";
import "@/global.css";

export default function RootLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.ink.DEFAULT,
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        contentStyle: { backgroundColor: colors.paper },
        headerShadowVisible: false,
      }}
    />
  );
}
