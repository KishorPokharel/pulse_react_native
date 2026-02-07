import Octicons from "@expo/vector-icons/Octicons";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "./avatar";

type AppHeaderProps = {
  name: string;
};

export default function AppHeader({ name }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Octicons name="pulse" size={24} color="black" />
      </View>
      <Pressable onPress={() => {}}>
        <Avatar name={name} />
      </Pressable>
    </View>
  );
}
