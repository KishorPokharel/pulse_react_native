import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Screen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password != confirmPassword) {
      return;
    }
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
        Register to Pulse
      </Text>
      <View style={{ gap: 8 }}>
        <Input label="Name" onChangeText={setName} value={name}></Input>
        <Input label="Email" onChangeText={setEmail} value={email}></Input>
        <Input
          label="Password"
          onChangeText={setPassword}
          value={password}
        ></Input>
        <Input
          label="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        ></Input>
      </View>
      <View
        style={{
          marginBlockStart: 20,
        }}
      >
        <Button
          label="Register"
          disabled={loading}
          loading={loading}
          onPress={handleRegister}
        />
      </View>
      <View
        style={{
          marginBlockStart: 18,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href="/login" replace>
          Already registered? Login
        </Link>
      </View>
    </View>
  );
}
