import { useAuth } from "@/src/hooks/useAuth";
import { Pressable, Text, View } from "react-native";

export default function Screen() {
  const { user, logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <View
        style={{
          marginBottom: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            marginBlockEnd: 8,
          }}
        >
          Profile
        </Text>
        <Text style={{ fontSize: 18 }}>{user?.name}</Text>
        <Text>{user?.email}</Text>
        {user?.emailVerified ? (
          <Text
            style={{
              backgroundColor: "green",
              borderRadius: 12,
              color: "white",
              paddingInline: 8,
              paddingBlock: 4,
              marginBlockStart: 8,
            }}
          >
            Verified
          </Text>
        ) : null}
      </View>
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
