import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { apiRegisterUser } from "@/src/http/auth";
import Octicons from "@expo/vector-icons/Octicons";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

export default function Screen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: apiRegisterUser,
    onSuccess: () => {
      Alert.alert("Success.", "Please Login.");
      clearForm();
      router.replace("/login");
    },
    onError: (e) => {
      Alert.alert("Could not register.");
    },
  });

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleRegister = async () => {
    if (password != confirmPassword) {
      Alert.alert("Invalid fields");
      return;
    }
    if (name === "" || email === "" || password === "") {
      Alert.alert("Invalid fields");
      return;
    }
    registerMutation.mutate({ name, email, password });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <Octicons name="pulse" size={24} color="black" />
      </View>
      <Text
        style={{
          marginBottom: 20,
          textAlign: "center",
          fontSize: 18,
        }}
      >
        Register to Pulse
      </Text>
      <View style={{ gap: 8 }}>
        <Input label="Name" onChangeText={setName} value={name}></Input>
        <Input label="Email" onChangeText={setEmail} value={email}></Input>
        <Input
          label="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        ></Input>
        <Input
          label="Confirm Password"
          secureTextEntry
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
          disabled={registerMutation.isPending}
          loading={registerMutation.isPending}
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
