import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import { Text, View } from "react-native";

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
          marginBottom: 20,
          textAlign: "center",
          fontSize: 24,
        }}
      >
        Login to Pulse
      </Text>
      <View style={{ gap: 8 }}>
        <Input label="Email"></Input>
        <Input label="Password"></Input>
      </View>
      <View
        style={{
          marginBlockStart: 16,
        }}
      >
        <Button label="Login" disabled={loggingIn} onPress={handleLogin} />
      </View>
    </View>
  );
}
