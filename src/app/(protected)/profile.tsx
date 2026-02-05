import { useAuth } from "@/src/hooks/useAuth";
import { Pressable, Text, View } from "react-native";

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
        Profile
      </Text>
      <Pressable
        style={{
          backgroundColor: "#333",
          paddingBlock: 12,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 12,
        }}
        onPress={() => {
          logout();
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}
