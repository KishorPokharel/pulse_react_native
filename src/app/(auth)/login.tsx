import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Screen() {
  const { login } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    setLoggingIn(true);
    // await sleep(2000);
    await login();
    setLoggingIn(false);
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text
        style={{
          marginBottom: 50,
          textAlign: "center",
          fontSize: 24,
        }}
      >
        Login to Pulse
      </Text>
      <Pressable
        style={{
          backgroundColor: "#333",
          paddingBlock: 12,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 12,
          opacity: loggingIn ? 0.5 : 1,
        }}
        disabled={loggingIn}
        onPress={handleLogin}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Login
        </Text>
      </Pressable>
    </View>
  );
}
