import { useTheme } from "@/src/context/ThemeContext";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        // borderWidth: 1,
        paddingTop: insets.top + 8,
        paddingInline: 16,
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 24, color: theme.text }}>
        Settings
      </Text>
      <View>
        <View>
          <Text>My Profile</Text>
        </View>
        <View>
          <Text>Theme</Text>
        </View>
        <View>
          <Text>Logout</Text>
        </View>
      </View>
    </View>
  );
}
