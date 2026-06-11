import { Platform, NativeModules } from "react-native";

const { WidgetBridge } = NativeModules;

export function updateWidget() {
  if (Platform.OS === "android" && WidgetBridge) {
    WidgetBridge.updateWidget();
  }
}
