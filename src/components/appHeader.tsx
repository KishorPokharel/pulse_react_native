import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import Avatar from "./avatar";

type AppHeaderProps = {
  user: {
    id: number;
    name: string;
  };
  onPressAvatar?: () => void;
};

export default function AppHeader({ user, onPressAvatar }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.background,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Octicons name="pulse" size={24} color={theme.text} />
        <Text style={{ fontWeight: "bold", fontSize: 16, color: theme.text }}>
          Pulse
        </Text>
      </View>
      <TouchableOpacity onPress={onPressAvatar}>
        <Avatar name={user.name} />
      </TouchableOpacity>
    </View>
  );
}
