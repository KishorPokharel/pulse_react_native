import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function FullscreenLoader() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
