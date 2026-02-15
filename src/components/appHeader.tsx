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
        gap: 16,
        backgroundColor: theme.background,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Octicons name="pulse" size={24} color={theme.text} />
        {/* <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.text }}>
          Pulse
        </Text> */}
      </View>
      <TouchableOpacity
        onPress={() => router.push("/search")}
        style={{
          flex: 1,
          backgroundColor: "#f1f5f9",
          paddingBlock: 8,
          paddingInline: 10,
          borderRadius: 100,
        }}
      >
        <Text style={{ color: "#94a3b8" }}>Search...</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressAvatar}>
        <Avatar id={user.id} name={user.name} />
      </TouchableOpacity>
    </View>
  );
}
