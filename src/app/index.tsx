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
          source={require("../../assets/images/splash-icon.png")}
          style={{ width: 160, height: 160 }}
        />
      </View>
    </View>
  );
}
