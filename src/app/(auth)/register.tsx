import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { apiRegisterUser } from "@/src/http/auth";
import Octicons from "@expo/vector-icons/Octicons";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: z
      .string()
      .trim()
      .min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function Screen() {
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = <K extends keyof RegisterFormData>(
    name: K,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const data = result.data;
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  const clearError = () => {
    setErrors({});
  };

  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: apiRegisterUser,
    onSuccess: () => {
      Alert.alert("Success", "Registered successfully!");
      clearError();
      clearForm();
      router.replace("/login");
    },
    onError: (e) => {
      Alert.alert("Could not register.");
    },
  });

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
        <Input
          label="Name"
          onChangeText={(text) => {
            handleChange("name", text);
          }}
          value={form.name}
          error={errors.name}
        />

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

        <Input
          label="Confirm Password"
          secureTextEntry
          onChangeText={(text) => handleChange("confirmPassword", text)}
          error={errors.confirmPassword}
          value={form.confirmPassword}
        />
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
        <Link href="/login" replace>
          Already registered? Login
        </Link>
      </View>
    </View>
  );
}
