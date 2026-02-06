import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { useAuth } from "@/src/hooks/useAuth";
import { sleep } from "@/src/utils/sleep";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Screen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("kishor@1234");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    setLoggingIn(true);
    await sleep(2000);
    await login({ email, password });
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
      <View style={{ gap: 10 }}>
        <Input label="Email" onChangeText={setEmail} value={email}></Input>
        <Input
          label="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        ></Input>
      </View>
      <View
        style={{
          marginBlockStart: 20,
        }}
      >
        <Button
          label="Login"
          loading={loggingIn}
          disabled={loggingIn}
          onPress={handleLogin}
        />
      </View>

      <View
        style={{
          marginBlockStart: 18,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href="/register" replace>
          Not registered yet? Register
        </Link>
      </View>
    </View>
  );
}
