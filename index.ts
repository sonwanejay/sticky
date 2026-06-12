import { registerWidgetTaskHandler } from "react-native-android-widget";
import { registerWidgetConfigurationScreen } from "react-native-android-widget";
import { widgetTaskHandler } from "./widget/widget-task-handler";
import { WidgetConfigScreen } from "./widget/WidgetConfigScreen";

registerWidgetTaskHandler(widgetTaskHandler);
registerWidgetConfigurationScreen(WidgetConfigScreen);

import "expo-router/entry";
