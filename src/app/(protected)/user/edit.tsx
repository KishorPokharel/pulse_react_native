import Button from "@/src/components/button";
import Input from "@/src/components/input";
import TextArea from "@/src/components/textarea";
import { useAuth } from "@/src/hooks/useAuth";
import { apiUpdateProfile } from "@/src/http/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Must not be empty").trim(),
  bio: z.string().trim(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type FormErrors = Partial<Record<keyof ProfileFormData, string>>;

export default function Screen() {
  const { user } = useAuth();
  const authUser = user!;

  const [form, setForm] = useState({
    name: authUser.name,
    bio: authUser.bio,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = <K extends keyof ProfileFormData>(
    name: K,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const queryClient = useQueryClient();
  const router = useRouter();
  const updateProfileMutation = useMutation({
    mutationFn: apiUpdateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", authUser.id] });
      router.replace({
        pathname: "/user/[userId]",
        params: { userId: authUser.id },
      });
      Alert.alert("Profile Updated");
    },
    onError: () => {
      Alert.alert("Failed to update profile");
    },
  });

  const handleUpdate = () => {
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProfileFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    updateProfileMutation.mutate(form);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <View style={{ gap: 10 }}>
        <Input
          label="Name"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <TextArea
          label="Bio"
          value={form.bio}
          onChangeText={(text) => handleChange("bio", text)}
        />
        <Button label="Update" onPress={handleUpdate} />
      </View>
    </View>
  );
}
