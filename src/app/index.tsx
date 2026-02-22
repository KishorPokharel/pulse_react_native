import { Image, View } from "react-native";
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
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 200, height: 200 }}
        />
        {/* <Octicons name="pulse" size={36} color={theme.text} />
        <Text style={{ fontSize: 24, color: theme.text }}>Pulse</Text> */}
      </View>
    </View>
  );
}
