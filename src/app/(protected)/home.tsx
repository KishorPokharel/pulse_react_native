import { useAuth } from "@/src/hooks/useAuth";
import { Text, View } from "react-native";

export default function Screen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text
        style={{
          marginBottom: 102,
          textAlign: "center",
          fontSize: 24,
        }}
      >
        Home
      </Text>
    </View>
  );
}
