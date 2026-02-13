import Octicons from "@expo/vector-icons/Octicons";
import { Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Screen() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          backgroundColor: theme.background,
        }}
      >
        <Octicons name="pulse" size={36} color={theme.text} />
        <Text style={{ fontSize: 24, color: theme.text }}>Pulse</Text>
      </View>
    </View>
  );
}
