import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { sleep } from "@/src/utils";
import Octicons from "@expo/vector-icons/Octicons";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Must not be empty").trim(),
});

type LoginFormData = z.infer<typeof loginSchema>;

type FormErrors = Partial<Record<keyof LoginFormData, string>>;

export default function Screen() {
  const { login } = useAuth();

  const { theme } = useTheme();

  const [form, setForm] = useState({
    // email: "john@example.com",
    // password: "kishor@1234",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loggingIn, setLoggingIn] = useState(false);

  const handleChange = <K extends keyof LoginFormData>(
    name: K,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearError = () => {
    setErrors({});
  };

  const clearForm = () => {
    setForm({
      email: "",
      password: "",
    });
  };

  const handleSubmit = async () => {
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoggingIn(true);
    try {
      await sleep(2000);
      await login(form);
    } catch (e) {
      alert("Invalid credentials");
    }
    setLoggingIn(false);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: theme.background,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <Octicons name="pulse" size={24} color={theme.text} />
      </View>
      <Text
        style={{
          marginBottom: 20,
          textAlign: "center",
          fontSize: 18,
          color: theme.text,
        }}
      >
        Login to Pulse
      </Text>
      <View style={{ gap: 10 }}>
        <Input
          label="Email"
          onChangeText={(text) => handleChange("email", text)}
          value={form.email}
          error={errors.email}
        />

        <Input
          label="Password"
          secureTextEntry
          onChangeText={(text) => handleChange("password", text)}
          value={form.password}
          error={errors.password}
        />
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
          onPress={handleSubmit}
        />
      </View>

      <View
        style={{
          marginBlockStart: 18,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link style={{ color: theme.text }} href="/register" replace>
          Not registered yet? Register
        </Link>
      </View>
    </View>
  );
}
