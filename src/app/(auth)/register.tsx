import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Screen() {
  const handleRegister = async () => {};

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
        <Input label="Name"></Input>
        <Input label="Email"></Input>
        <Input label="Password"></Input>
        <Input label="Confirm Password"></Input>
      </View>
      <View
        style={{
          marginBlockStart: 20,
        }}
      >
        <Button label="Register" disabled={true} onPress={handleRegister} />
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
